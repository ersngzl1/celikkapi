import { NextRequest, NextResponse } from "next/server";
import { initDB, productQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const products = await productQueries.getAll();
    if (featured === "1") {
      return NextResponse.json(products.filter((p: any) => p.featured));
    }
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
