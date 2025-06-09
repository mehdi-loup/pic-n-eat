import { prisma } from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json({ error: 'Profile IDs are required' }, { status: 400 });
  }

  try {
    const profileIds = ids.split(',');
    const profiles = await prisma.profile.findMany({
      where: {
        id: { in: profileIds },
      },
    });
    return NextResponse.json(profiles);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
} 