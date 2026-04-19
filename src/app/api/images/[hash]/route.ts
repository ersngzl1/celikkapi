import { NextRequest, NextResponse } from "next/server";
import { initDB, imageQueries } from "@/lib/db-vercel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    if (!hash || !/^[a-f0-9]{20}$/.test(hash)) {
      return new NextResponse("Not found", { status: 404 });
    }

    await initDB();
    const image = await imageQueries.get(hash);

    if (!image) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = Buffer.from(image.data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Image serve error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
