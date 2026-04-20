import { NextResponse } from "next/server";
import { initDB, galleryQueries } from "@/lib/db-vercel";

export async function GET() {
  try {
    await initDB();
    const gallery = await galleryQueries.getAll();
    return NextResponse.json(gallery);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
