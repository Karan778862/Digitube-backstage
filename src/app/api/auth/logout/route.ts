import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('digitube_session')?.value;
    if (sessionToken) {
      const db = await getDatabase();
      await db.collection('sessions').deleteMany({ sessionToken });
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete('digitube_session');
    return response;
  } catch (error: any) {
    console.error('Error in logout route:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
