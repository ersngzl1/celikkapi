import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB, productQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const products = await productQueries.getAll() as any[];
    return NextResponse.json(
      products.map((p) => ({
        ...p,
        features: typeof p.features === "string" ? JSON.parse(p.features) : p.features,
      }))
    );
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

    if (!body.id || !body.name || !body.series) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await productQueries.create(body);
    return NextResponse.json({ success: true, id: body.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
