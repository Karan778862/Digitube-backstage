import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { findUserByEmail } from '@/lib/authStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('digitube_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    let userEmail: string | null = null;
    let userRole: string = 'ARTIST';

    if (sessionToken.includes('::')) {
      userEmail = sessionToken.split('::')[0];
    }

    // 1. Try checking MongoDB Atlas session collection
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500)),
      ]);

      if (db) {
        const session = await db.collection('sessions').findOne({
          sessionToken,
          expiresAt: { $gt: new Date() },
        });

        if (session) {
          userEmail = session.email;
          userRole = session.role || 'ARTIST';
        }
      }
    } catch (dbErr) {
      // Ignore DB timeout, proceed with local check
    }

    // 2. If session token exists, resolve user by email if found
    if (userEmail) {
      const user = await findUserByEmail(userEmail);
      if (user) {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            stageName: user.stageName || user.fullName,
            mobile: user.mobile || '',
            role: user.role || userRole,
            verificationStatus: user.verificationStatus || 'ACTIVE',
            avatarUrl: user.avatarUrl,
            isDemo: false,
          },
        });
      }
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch (error: any) {
    console.error('Error in me route:', error);
    return NextResponse.json({ authenticated: false, user: null, error: error.message });
  }
}
