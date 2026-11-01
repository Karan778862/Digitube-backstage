import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyStoredOtp, findUserByEmail, saveUser } from '@/lib/authStore';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      fullName,
      stageName,
      mobile,
      accountType = 'ARTIST',
      otp,
    } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Strict Unique Email Check
    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    // 2. Verify OTP was supplied and valid
    const isOtpValid = await verifyStoredOtp(cleanEmail, otp);
    if (!isOtpValid) {
      return NextResponse.json(
        { success: false, error: 'Valid verification code is required. Please enter the OTP sent to your email.' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newUser = {
      id: userId,
      email: cleanEmail,
      passwordHash,
      fullName: fullName.trim(),
      stageName: (stageName || fullName).trim(),
      mobile: mobile?.trim() || '',
      role: (accountType === 'RECORD_LABEL' ? 'RECORD_LABEL' : 'ARTIST') as 'ARTIST' | 'RECORD_LABEL',
      country: 'India',
      countryCode: '+91',
      verificationStatus: 'ACTIVE',
      mfaEnabled: false,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. Save user persistently
    await saveUser(newUser);

    // 5. Create session token
    const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);
      if (db) {
        await db.collection('sessions').insertOne({
          sessionToken,
          userId,
          email: cleanEmail,
          role: newUser.role,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      }
    } catch {}

    // Return user without passwordHash
    const { passwordHash: _, ...userSafe } = newUser;

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
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
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed.' },
      { status: 500 }
    );
  }
}
