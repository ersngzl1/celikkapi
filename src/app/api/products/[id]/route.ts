import { NextRequest, NextResponse } from "next/server";
import { initDB, productQueries } from "@/lib/db-vercel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idOrSlug } = await params;
    await initDB();

    // Try numeric ID first, then slug
    const numId = parseInt(idOrSlug);
    const product = !isNaN(numId)
      ? await productQueries.getById(numId)
      : await productQueries.getBySlug(idOrSlug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
