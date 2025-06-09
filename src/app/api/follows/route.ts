import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const followerId = searchParams.get('followerId');
  const followeeId = searchParams.get('followeeId');

  if (!followerId) {
    return NextResponse.json({ error: 'Follower id is required' }, { status: 400 });
  }

  try {
    const where = followeeId
      ? {
          followingProfileEmail: followerId,
          followedProfileId: followeeId,
        }
      : {
          followingProfileEmail: followerId,
        };

    const follows = await prisma.follower.findMany({
      where,
    });
    return NextResponse.json(follows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 });
  }
}
