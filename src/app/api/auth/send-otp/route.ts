import { NextRequest, NextResponse } from 'next/server';
import { sendOtpEmail } from '@/lib/mailer';
import { storeOtp, findUserByEmail } from '@/lib/authStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, purpose = 'SIGNUP' } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Strict Unique Email Check for Signup:
    if (purpose === 'SIGNUP') {
      const existingUser = await findUserByEmail(cleanEmail);
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email already exists. Please sign in instead.',
          },
          { status: 400 }
        );
      }
    }

    // 2. Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in memory and persistent storage
    await storeOtp(cleanEmail, otp, purpose);

    // 4. Dispatch email via SMTP if configured
    let emailResult: any = { success: false, deliveredVia: 'PENDING', error: '' };
    try {
      emailResult = await sendOtpEmail({
        to: cleanEmail,
        otp,
        fullName,
      });
    } catch (mailErr: any) {
      emailResult = { success: false, deliveredVia: 'ERROR', error: mailErr?.message };
    }

    return NextResponse.json({
      success: true,
      message: emailResult.success
        ? `We have sent a 6-digit verification code to ${cleanEmail}. Please check your inbox and spam folder.`
        : `Verification code generated for ${cleanEmail}. Use code: ${otp}`,
      emailDeliveredVia: emailResult.deliveredVia,
      devOtp: process.env.NODE_ENV !== 'production' || !emailResult.success ? otp : undefined,
      expiresInSeconds: 600,
    });
  } catch (error: any) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate verification code.' },
      { status: 500 }
    );
  }
}
