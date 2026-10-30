import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { findUserByEmail } from '@/lib/authStore';
import bcrypt from 'bcryptjs';

// In-Memory Brute-Force Rate Limiting Guard
interface AttemptRecord {
  count: number;
  lockUntil: number;
  lastAttempt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var _loginAttemptStore: Map<string, AttemptRecord> | undefined;
}

const loginAttemptStore: Map<string, AttemptRecord> =
  global._loginAttemptStore || (global._loginAttemptStore = new Map());

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const body = await req.json();
    const { email, password } = body;

    // Strict input type validation against injection
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email and password strings are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const rateLimitKey = `${ip}::${cleanEmail}`;
    const now = Date.now();

    // Check if account/IP is currently locked
    const attemptInfo = loginAttemptStore.get(rateLimitKey);
    if (attemptInfo && attemptInfo.lockUntil > now) {
      const remainingMinutes = Math.ceil((attemptInfo.lockUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Security Lockout Active: Too many failed password attempts. This target is protected against brute-force attacks. Please retry in ${remainingMinutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    // Find user via authStore (checks local storage & MongoDB Atlas)
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      // Record failed attempt
      const current = attemptInfo?.lockUntil && attemptInfo.lockUntil <= now ? 0 : attemptInfo?.count || 0;
      const newCount = current + 1;
      const isLocking = newCount >= MAX_FAILED_ATTEMPTS;

      loginAttemptStore.set(rateLimitKey, {
        count: newCount,
        lockUntil: isLocking ? now + LOCKOUT_DURATION_MS : 0,
        lastAttempt: now,
      });

      return NextResponse.json(
        {
          success: false,
          error: isLocking
            ? 'Account locked for 15 minutes due to multiple failed attempts.'
            : 'No account registered with this email address. Please create an account.',
        },
        { status: isLocking ? 429 : 401 }
      );
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const current = attemptInfo?.lockUntil && attemptInfo.lockUntil <= now ? 0 : attemptInfo?.count || 0;
      const newCount = current + 1;
      const isLocking = newCount >= MAX_FAILED_ATTEMPTS;

      loginAttemptStore.set(rateLimitKey, {
        count: newCount,
        lockUntil: isLocking ? now + LOCKOUT_DURATION_MS : 0,
        lastAttempt: now,
      });

      if (isLocking) {
        return NextResponse.json(
          {
            success: false,
            error: 'Security Lockout Activated: 5 consecutive invalid passwords detected. Locked for 15 minutes to safeguard the account.',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials. (${MAX_FAILED_ATTEMPTS - newCount} attempts remaining before temporary security lock)`,
        },
        { status: 401 }
      );
    }

    // Password is valid -> clear failed attempt counter
    loginAttemptStore.delete(rateLimitKey);

    // Create session token with email prefix for instant local fallback
    const sessionToken = `${cleanEmail}::sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
      if (db) {
        await db.collection('sessions').insertOne({
          sessionToken,
          userId: user.id,
          email: cleanEmail,
          role: user.role,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }
    } catch {}

    const userSafe = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      stageName: user.stageName || user.fullName,
      mobile: user.mobile || '',
      role: user.role || 'ARTIST',
      verificationStatus: user.verificationStatus || 'ACTIVE',
      avatarUrl: user.avatarUrl,
      isDemo: false,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      user: userSafe,
    });

    response.cookies.set('digitube_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Error in login route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed.' },
      { status: 500 }
    );
  }
}
