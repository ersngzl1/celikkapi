import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB, productQueries, generateSlug, imageQueries } from "@/lib/db-vercel";
import { sql } from "@vercel/postgres";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "products array required" }, { status: 400 });
    }

    // Get next available ID
    const maxIdResult = await sql`SELECT COALESCE(MAX(id), 0) as maxid FROM products`;
    let nextId = Number(maxIdResult.rows[0].maxid) + 1;

    const results: { name: string; status: string; id?: number; error?: string }[] = [];

    for (const p of products) {
      try {
        // If product has imageBase64, save to images table first
        let imageUrl = p.image || "";
        if (p.imageBase64) {
          const buffer = Buffer.from(p.imageBase64, "base64");
          const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 20);
          const mime = p.imageMime || "image/png";
          await imageQueries.save(hash, p.imageBase64, mime);
          imageUrl = `/api/images/${hash}`;
        }

        // Check if product with same name already exists
        const existing = await sql`SELECT id FROM products WHERE name = ${p.name}`;
        if (existing.rows.length > 0) {
          results.push({ name: p.name, status: "skipped", id: existing.rows[0].id });
          continue;
        }

        const product = {
          id: nextId,
          name: p.name,
          slug: generateSlug(p.name),
          series: p.series || "Gold İkizler",
          category: p.category || "Eko Laminoks",
          color: p.color || "",
          colorHex: p.colorHex || "#3C3C3C",
          thickness: p.thickness || "1.2 mm",
          material: p.material || "Laminoks Çelik",
          lockSystem: p.lockSystem || "Çoklu Kilit Sistemi",
          dimensions: p.dimensions || "2050 x 960 mm",
          weight: p.weight || "75 kg",
          insulation: p.insulation || "Poliüretan Dolgulu",
          warranty: p.warranty || "2 Yıl",
          description: p.description || "",
          features: p.features || [],
          image: imageUrl,
          inStock: 1,
        };

        await productQueries.create(product);

        // Ensure category exists
        const catValue = generateSlug(p.category || "Eko Laminoks");
        const catLabel = p.category || "Eko Laminoks";
        try {
          await sql`
            INSERT INTO categories (value, label) VALUES (${catValue}, ${catLabel})
            ON CONFLICT (value) DO NOTHING
          `;
        } catch {}

        results.push({ name: p.name, status: "created", id: nextId });
        nextId++;
      } catch (err: any) {
        results.push({ name: p.name, status: "error", error: err.message });
      }
    }

    const created = results.filter(r => r.status === "created").length;
    const skipped = results.filter(r => r.status === "skipped").length;
    const errors = results.filter(r => r.status === "error").length;

    return NextResponse.json({
      success: true,
      summary: { total: products.length, created, skipped, errors },
      results,
    });
  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
