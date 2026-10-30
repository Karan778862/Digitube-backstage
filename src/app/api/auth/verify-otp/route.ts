import { NextRequest, NextResponse } from 'next/server';
import { verifyStoredOtp } from '@/lib/authStore';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP code are required.' }, { status: 400 });
    }

    const isValid = await verifyStoredOtp(email, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code. Please request a new OTP.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error: any) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
