import { NextRequest, NextResponse } from "next/server";
import { initDB, productQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const products = await productQueries.getAll();
    const headers = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };
    if (featured === "1") {
      return NextResponse.json(products.filter((p: any) => p.featured), { headers });
    }
    return NextResponse.json(products, { headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
