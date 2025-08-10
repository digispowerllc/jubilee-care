import { NextResponse } from 'next/server';
import { getUserByNin } from '@/lib/user-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nin = searchParams.get('nin');

    if (!nin || !/^\d{11}$/.test(nin)) {
      return NextResponse.json(
        { error: 'Invalid NIN format' },
        { status: 400 }
      );
    }

    // Check user in database
    const user = await getUserByNin(nin);
    
    if (!user) {
      return NextResponse.json(
        { status: 'not_found' },
        { status: 200 }
      );
    }

    if (user.verified) {
      return NextResponse.json({
        status: 'verified',
        verificationDate: user.verificationDate
      });
    }

    return NextResponse.json({
      status: 'pending'
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}