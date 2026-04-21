import { NextRequest, NextResponse } from "next/server";
import { initDB, contentQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (!page) {
      return NextResponse.json({ error: "page parameter required" }, { status: 400 });
    }

    const content = await contentQueries.getByPage(page);
    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
