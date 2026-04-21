import { NextResponse } from "next/server";
import { initDB, galleryQueries } from "@/lib/db-vercel";

export async function GET() {
  try {
    await initDB();
    const gallery = await galleryQueries.getAll();
    return NextResponse.json(gallery, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
