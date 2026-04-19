import { NextRequest, NextResponse } from "next/server";
import { initDB, productQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  try {
    await initDB();
    const products = await productQueries.getAll();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
