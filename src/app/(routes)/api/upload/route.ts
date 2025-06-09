import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/config"

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.public.file(file, {
      groupId: '231eb6d0-377e-4252-bb13-25ee42e5f51a', // Insta-clone

    });
    const fileUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/files/${uploadData.cid}`;
    return NextResponse.json(fileUrl, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}