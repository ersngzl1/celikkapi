import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { initDB, imageQueries } from "@/lib/db-vercel";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();

    // Ensure installedimage column exists
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS installedimage TEXT`;
    } catch {}

    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items array required" }, { status: 400 });
    }

    const results: { name: string; status: string; error?: string }[] = [];

    for (const item of items) {
      try {
        // Find product by name pattern (e.g. "Eko Gold 001")
        const productName = item.productName;
        const existing = await sql`SELECT id, name FROM products WHERE name = ${productName}`;

        if (existing.rows.length === 0) {
          results.push({ name: productName, status: "not_found" });
          continue;
        }

        const productId = existing.rows[0].id;

        // Save image
        if (item.imageBase64) {
          const buffer = Buffer.from(item.imageBase64, "base64");
          const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 20);
          const mime = item.imageMime || "image/png";
          await imageQueries.save(hash, item.imageBase64, mime);
          const imageUrl = `/api/images/${hash}`;

          // Update product
          await sql`UPDATE products SET installedimage = ${imageUrl} WHERE id = ${productId}`;
          results.push({ name: productName, status: "updated" });
        } else {
          results.push({ name: productName, status: "no_image" });
        }
      } catch (err: any) {
        results.push({ name: item.productName, status: "error", error: err.message });
      }
    }

    const updated = results.filter(r => r.status === "updated").length;
    return NextResponse.json({
      success: true,
      summary: { total: items.length, updated, notFound: results.filter(r => r.status === "not_found").length },
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
