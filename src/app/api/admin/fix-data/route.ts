import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { initDB } from "@/lib/db-vercel";

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const results: string[] = [];

    // 1. Delete old demo products (IDs 1-12 from doors.ts seed data)
    const deleted = await sql`DELETE FROM products WHERE id < 1000 RETURNING id, name`;
    results.push(`Deleted ${deleted.rows.length} demo products`);

    // 2. Update series "Gold İkizler" → "Eko Gold" for all products
    const updated = await sql`UPDATE products SET series = 'Eko Gold' WHERE series = 'Gold İkizler' RETURNING id`;
    results.push(`Updated series for ${updated.rows.length} products`);

    // 3. Ensure categories exist in categories table
    const cats = [
      { value: "Eko Laminoks", label: "Eko Laminoks" },
      { value: "Eko Ultralam", label: "Eko Ultralam" },
    ];
    for (const cat of cats) {
      await sql`
        INSERT INTO categories (value, label) VALUES (${cat.value}, ${cat.label})
        ON CONFLICT (value) DO NOTHING
      `;
    }
    results.push(`Ensured categories: ${cats.map(c => c.value).join(", ")}`);

    // 4. Delete old hardcoded categories that don't match real products
    const oldCats = await sql`DELETE FROM categories WHERE value IN ('premium', 'luks', 'modern', 'klasik', 'oda') RETURNING value`;
    results.push(`Removed ${oldCats.rows.length} old categories`);

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
