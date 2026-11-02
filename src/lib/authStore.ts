import fs from 'fs';
import path from 'path';
import { getDatabase } from './mongodb';

export interface InMemoryOtp {
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  purpose: string;
}

export type StoredUserRole =
  | 'ARTIST'
  | 'RECORD_LABEL'
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'RELEASE_MANAGER'
  | 'CATALOG_STAFF'
  | 'ACCOUNTS_STAFF'
  | 'SUPPORT_STAFF';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  stageName: string;
  mobile?: string;
  role: StoredUserRole;
  country?: string;
  countryCode?: string;
  verificationStatus?: string;
  mfaEnabled?: boolean;
  avatarUrl?: string;
  assignedScope?: string;
  permissions?: string[];
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');
const TMP_USERS_FILE_PATH = path.join('/tmp', 'digitube_users.json');

declare global {
  // eslint-disable-next-line no-var
  var _digitube_users_cache: StoredUser[] | undefined;
  // eslint-disable-next-line no-var
  var _inMemoryOtpStore: Map<string, InMemoryOtp> | undefined;
}

const otpStore: Map<string, InMemoryOtp> =
  global._inMemoryOtpStore || (global._inMemoryOtpStore = new Map());

export function loadLocalUsers(): StoredUser[] {
  // 1. In-memory cache first
  if (globalThis._digitube_users_cache && globalThis._digitube_users_cache.length > 0) {
    return globalThis._digitube_users_cache;
  }

  let users: StoredUser[] = [];
  const emailMap = new Map<string, StoredUser>();

  // 2. Read bundled static users.json
  try {
    if (fs.existsSync(LOCAL_USERS_FILE_PATH)) {
      const data = fs.readFileSync(LOCAL_USERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        for (const u of parsed) {
          if (u.email) emailMap.set(u.email.toLowerCase().trim(), u);
        }
      }
    }
  } catch (err) {
    console.warn('[AuthStore] Notice reading bundled users.json:', err);
  }

  // 3. Read writable /tmp/digitube_users.json (preserves registrations on Vercel)
  try {
    if (fs.existsSync(TMP_USERS_FILE_PATH)) {
      const data = fs.readFileSync(TMP_USERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        for (const u of parsed) {
          if (u.email) emailMap.set(u.email.toLowerCase().trim(), u);
        }
      }
    }
  } catch (err) {
    console.warn('[AuthStore] Notice reading /tmp users:', err);
  }

  users = Array.from(emailMap.values());
  globalThis._digitube_users_cache = users;
  return users;
}

export function saveLocalUsers(users: StoredUser[]): void {
  globalThis._digitube_users_cache = users;

  // 1. Write to /tmp (always writable on Vercel and local machine)
  try {
    fs.writeFileSync(TMP_USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AuthStore] Could not write to /tmp users:', err);
  }

  // 2. Try writing to local project path if writable
  try {
    const dir = path.dirname(LOCAL_USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch {
    // Expected on Vercel serverless read-only filesystem
  }
}

// Find user by email (checks in-memory, /tmp, local file, and MongoDB Atlas)
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check local & /tmp persistent store
  const localUsers = loadLocalUsers();
  const localMatch = localUsers.find((u) => u.email.toLowerCase().trim() === cleanEmail);
  if (localMatch) {
    return localMatch;
  }

  // 2. Check MongoDB Atlas if available
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000)),
    ]);

    if (db) {
      const mongoUser = await db.collection('users').findOne({ email: cleanEmail });
      if (mongoUser) {
        const mappedUser: StoredUser = {
          id: mongoUser.id || mongoUser._id?.toString(),
          email: mongoUser.email,
          passwordHash: mongoUser.passwordHash,
          fullName: mongoUser.fullName,
          stageName: mongoUser.stageName || mongoUser.fullName,
          mobile: mongoUser.mobile,
          role: mongoUser.role || 'ARTIST',
          country: mongoUser.country,
          countryCode: mongoUser.countryCode,
          verificationStatus: mongoUser.verificationStatus,
          mfaEnabled: mongoUser.mfaEnabled,
          avatarUrl: mongoUser.avatarUrl,
          isDemo: false,
          createdAt: mongoUser.createdAt?.toString() || new Date().toISOString(),
          updatedAt: mongoUser.updatedAt?.toString() || new Date().toISOString(),
        };

        // Cache into local store
        const existing = loadLocalUsers();
        const updated = [mappedUser, ...existing.filter((u) => u.email.toLowerCase().trim() !== cleanEmail)];
        saveLocalUsers(updated);
        return mappedUser;
      }
    }
  } catch (err: any) {
    console.warn('[AuthStore] Notice connecting to MongoDB Atlas:', err?.message);
  }

  return null;
}

// Save newly created user
export async function saveUser(userData: StoredUser): Promise<void> {
  const cleanEmail = userData.email.toLowerCase().trim();

  // 1. Save to in-memory + /tmp persistent file
  const localUsers = loadLocalUsers();
  const filtered = localUsers.filter((u) => u.email.toLowerCase().trim() !== cleanEmail);
  filtered.unshift(userData);
  saveLocalUsers(filtered);

  // 2. Persist to MongoDB Atlas if reachable
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 5000)),
    ]);

    if (db) {
      await db.collection('users').updateOne(
        { email: cleanEmail },
        { $set: userData },
        { upsert: true }
      );
    }
  } catch (err: any) {
    console.warn('[AuthStore] Notice persisting user to MongoDB Atlas:', err?.message);
  }
}

export async function storeOtp(email: string, otp: string, purpose = 'SIGNUP'): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

  // Always keep in memory for instant validation
  otpStore.set(cleanEmail, {
    email: cleanEmail,
    otp,
    expiresAt,
    verified: false,
    purpose,
  });

  // Attempt to persist to MongoDB Atlas if available
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB Atlas timeout')), 1500)
      ),
    ]);

    if (db) {
      await db.collection('otps').deleteMany({ email: cleanEmail });
      await db.collection('otps').insertOne({
        email: cleanEmail,
        otp,
        purpose,
        expiresAt,
        verified: false,
        createdAt: new Date(),
      });
    }
  } catch (err: any) {
    // Stored in memory
  }
}

export async function verifyStoredOtp(email: string, otp: string): Promise<boolean> {
  if (!email || !otp) return false;
  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = otp.toString().trim();

  // 1. Check in-memory store
  const memRecord = otpStore.get(cleanEmail);
  if (memRecord && memRecord.otp === cleanOtp && memRecord.expiresAt > new Date()) {
    memRecord.verified = true;
    return true;
  }

  // 2. Fallback to MongoDB Atlas
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB Atlas timeout')), 1500)
      ),
    ]);

    if (db) {
      const record = await db.collection('otps').findOne({
        email: cleanEmail,
        otp: cleanOtp,
        expiresAt: { $gt: new Date() },
      });

      if (record) {
        await db.collection('otps').updateOne(
          { _id: record._id },
          { $set: { verified: true, verifiedAt: new Date() } }
        );
        return true;
      }
    }
  } catch (err) {
    // Return memory result
  }

  return false;
}

export async function deleteUser(email: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const localUsers = loadLocalUsers();
  const filtered = localUsers.filter((u) => u.email.toLowerCase().trim() !== cleanEmail);
  if (filtered.length !== localUsers.length) {
    saveLocalUsers(filtered);
  }

  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1500)),
    ]);
    if (db) {
      await db.collection('users').deleteOne({ email: cleanEmail });
    }
  } catch {}

  return true;
}
