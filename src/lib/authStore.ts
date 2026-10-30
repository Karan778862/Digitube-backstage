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

const USERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'users.json');

export function loadLocalUsers(): StoredUser[] {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[AuthStore] Error reading users.json:', err);
  }
  return [];
}

export function saveLocalUsers(users: StoredUser[]): void {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AuthStore] Error writing users.json:', err);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _inMemoryOtpStore: Map<string, InMemoryOtp> | undefined;
}

const otpStore: Map<string, InMemoryOtp> =
  global._inMemoryOtpStore || (global._inMemoryOtpStore = new Map());

// Find user by email (checks local file store & MongoDB Atlas)
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check local persistent store
  const localUsers = loadLocalUsers();
  const localMatch = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (localMatch) {
    return localMatch;
  }

  // 2. Check MongoDB Atlas if available
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
    ]);

    if (db) {
      const mongoUser = await db.collection('users').findOne({ email: cleanEmail });
      if (mongoUser) {
        return {
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
      }
    }
  } catch (err) {
    // Ignore DB timeout, local was already checked
  }

  return null;
}

// Save newly created user
export async function saveUser(userData: StoredUser): Promise<void> {
  const cleanEmail = userData.email.toLowerCase().trim();

  // 1. Save to local persistent file
  const localUsers = loadLocalUsers();
  const filtered = localUsers.filter((u) => u.email.toLowerCase() !== cleanEmail);
  filtered.push(userData);
  saveLocalUsers(filtered);

  // 2. Persist to MongoDB Atlas
  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000)),
    ]);

    if (db) {
      await db.collection('users').updateOne(
        { email: cleanEmail },
        { $set: userData },
        { upsert: true }
      );
    }
  } catch (err) {
    console.warn('[AuthStore] MongoDB sync pending IP access or connection reset.');
  }
}

export async function storeOtp(email: string, otp: string, purpose = 'SIGNUP'): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
        setTimeout(() => reject(new Error('MongoDB Atlas timeout')), 2500)
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
        setTimeout(() => reject(new Error('MongoDB Atlas timeout')), 2500)
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
  const filtered = localUsers.filter((u) => u.email.toLowerCase() !== cleanEmail);
  if (filtered.length !== localUsers.length) {
    saveLocalUsers(filtered);
  }

  try {
    const db = await Promise.race([
      getDatabase(),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
    ]);
    if (db) {
      await db.collection('users').deleteOne({ email: cleanEmail });
    }
  } catch {}

  return true;
}
