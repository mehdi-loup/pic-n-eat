import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('authors');

  if (!ids) {
    return NextResponse.json({ error: 'User id is required' }, { status: 400 });
  }

  try {
    const likes = await prisma.like.findMany({
      where: {
        author: { in: ids.split(',') },
      },
    });
    return NextResponse.json(likes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}
