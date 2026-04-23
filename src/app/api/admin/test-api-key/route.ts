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
    const result = await sql`SELECT value FROM settings WHERE key = 'replicateApiKey'`;
    const rawValue = result.rows?.[0]?.value;

    if (!rawValue) {
      return NextResponse.json({
        valid: false,
        error: "API anahtarı veritabanında bulunamadı",
      });
    }

    // Clean the key the same way generate-image does
    let apiKey: string;
    try {
      apiKey = JSON.parse(rawValue);
    } catch {
      apiKey = rawValue;
    }
    apiKey = String(apiKey).trim().replace(/^["']+|["']+$/g, "");

    // Test with a simple Replicate API call (list models - lightweight)
    const res = await fetch("https://api.replicate.com/v1/account", {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({
        valid: true,
        username: data.username,
        keyPreview: apiKey.slice(0, 6) + "..." + apiKey.slice(-4),
        keyLength: apiKey.length,
      });
    }

    return NextResponse.json({
      valid: false,
      error: data.detail || "Geçersiz anahtar",
      keyPreview: apiKey.slice(0, 6) + "..." + apiKey.slice(-4),
      keyLength: apiKey.length,
      rawValuePreview: rawValue.slice(0, 8) + "...",
      rawValueLength: rawValue.length,
    });
  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    }, { status: 500 });
  }
}
