import { NextResponse } from "next/server";
import { initDB } from "@/lib/db-vercel";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    await initDB();
    const result = await sql`SELECT value FROM settings WHERE key = 'favicon'`;
    const base64 = result.rows?.[0]?.value;

    if (!base64 || typeof base64 !== "string" || !base64.startsWith("data:image/")) {
      // Fallback: redirect to static favicon
      return NextResponse.redirect(new URL("/uploads/favicon.png", "https://bestkapi.com"));
    }

    // Parse base64 data URI
    const match = base64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.redirect(new URL("/uploads/favicon.png", "https://bestkapi.com"));
    }

    const mimeType = match[1] === "svg+xml" ? "image/svg+xml" : `image/${match[1]}`;
    const buffer = Buffer.from(match[2], "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/uploads/favicon.png", "https://bestkapi.com"));
  }
}
