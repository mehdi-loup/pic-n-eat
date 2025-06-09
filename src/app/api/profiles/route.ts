import { prisma } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  try {
    const where = ids
      ? {
          id: { in: ids.split(',') },
        }
      : undefined;
    const profiles = await prisma.profile.findMany({
      where,
    });
    return NextResponse.json(profiles);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}
