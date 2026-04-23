import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
  }

  try {
    await initDB();

    let apiKey: string | null = null;
    let source = "db";

    // Check if a key was sent in the body (direct set mode)
    try {
      const body = await req.json();
      if (body.apiKey && typeof body.apiKey === "string" && !body.apiKey.includes("...")) {
        apiKey = body.apiKey.trim();
        source = "body";
        // Save directly to DB
        await sql`
          INSERT INTO settings (key, value) VALUES ('replicateApiKey', ${apiKey})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()
        `;
      }
    } catch {
      // No body or invalid JSON — read from DB
    }

    // If no key from body, read from DB
    if (!apiKey) {
      const result = await sql`SELECT value FROM settings WHERE key = 'replicateApiKey'`;
      const rawValue = result.rows?.[0]?.value;

      if (!rawValue) {
        return NextResponse.json({
          valid: false,
          error: "API anahtarı veritabanında bulunamadı",
        });
      }

      try {
        apiKey = JSON.parse(rawValue);
      } catch {
        apiKey = rawValue;
      }
      apiKey = String(apiKey).trim().replace(/^["']+|["']+$/g, "");
    }

    // Test with Replicate API
    const res = await fetch("https://api.replicate.com/v1/account", {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({
        valid: true,
        username: data.username,
        keyPreview: apiKey!.slice(0, 6) + "..." + apiKey!.slice(-4),
        keyLength: apiKey!.length,
        source,
      });
    }

    return NextResponse.json({
      valid: false,
      error: data.detail || "Geçersiz anahtar",
      keyPreview: apiKey!.slice(0, 6) + "..." + apiKey!.slice(-4),
      keyLength: apiKey!.length,
      source,
    });
  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    }, { status: 500 });
  }
}
