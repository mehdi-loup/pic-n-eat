import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const privyIds = searchParams.get('authors');

  if (!privyIds) {
    return NextResponse.json({ error: 'Author parameter is required' }, { status: 400 });
  }

  const posts = await prisma.post.findMany({
    where: { author: { in: privyIds.split(',') } },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(posts);
}
