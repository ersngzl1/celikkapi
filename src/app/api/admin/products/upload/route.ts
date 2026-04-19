import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB, imageQueries } from "@/lib/db-vercel";
import { createHash } from "crypto";

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_SIZE = 3 * 1024 * 1024; // 3MB

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi" }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    const ext = filename.split(".").pop();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: `Geçerli formatlar: ${ALLOWED_EXTENSIONS.join(", ")}` }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Dosya ${MAX_SIZE / 1024 / 1024}MB'dan büyük olamaz` }, { status: 400 });
    }

    // Convert to base64 and create hash
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);
    const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
    const base64 = bytes.toString("base64");

    // Save to database
    await initDB();
    await imageQueries.save(hash, base64, file.type);

    // Return URL path (not the base64 itself)
    const imageUrl = `/api/images/${hash}`;
    const preview = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ success: true, url: imageUrl, preview });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: `Upload hatası: ${error.message}` }, { status: 500 });
  }
}
