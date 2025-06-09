import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const follows = await prisma.follower.findMany({
      where: {
        followingProfileEmail: email,
      },
    });
    return NextResponse.json(follows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 });
  }
}
