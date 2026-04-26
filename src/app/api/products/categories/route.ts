import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { initDB } from "@/lib/db-vercel";

export async function GET() {
  try {
    await initDB();
    // Get categories that actually have products
    const result = await sql`
      SELECT DISTINCT category as value, category as label
      FROM products
      ORDER BY category ASC
    `;
    const cats = [
      { value: "all", label: "Tümü" },
      ...(result.rows || []).map((r: any) => ({ value: r.value, label: r.label })),
    ];
    return NextResponse.json(cats, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error: any) {
    return NextResponse.json([{ value: "all", label: "Tümü" }], { status: 500 });
  }
}
