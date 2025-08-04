import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://apinigeria.vercel.app/api/checkemail?email=${encodeURIComponent(email)}`
    );
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch email data' }, { status: 500 });
  }
}
