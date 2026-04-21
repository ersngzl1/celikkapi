import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB, contentQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await request.json();
    const { page, section, data } = body;

    if (!page || !section || data === undefined) {
      return NextResponse.json({ error: "page, section, data required" }, { status: 400 });
    }

    await contentQueries.save(page, section, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
