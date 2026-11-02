import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('digitube_session')?.value;
    if (sessionToken) {
      try {
        const db = await Promise.race([
          getDatabase(),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000)),
        ]);
        if (db) {
          await db.collection('sessions').deleteMany({ sessionToken });
        }
      } catch (err) {
        console.warn('DB session cleanup notice during logout:', err);
      }
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete('digitube_session');
    response.cookies.set('digitube_session', '', {
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  } catch (error: any) {
    console.error('Logout error fallback:', error);
    const response = NextResponse.json({ success: true, message: 'Logged out.' });
    response.cookies.delete('digitube_session');
    response.cookies.set('digitube_session', '', {
      path: '/',
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
    });
    return response;
  }
}
