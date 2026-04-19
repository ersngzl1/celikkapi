import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "doors");
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await request.json();
    const { image, filename } = body; // image: base64, filename: "door-123.jpg"

    if (!image || !filename) {
      return NextResponse.json({ error: "Missing image or filename" }, { status: 400 });
    }

    // Validate extension
    const ext = filename.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate size
    const base64Data = image.split(",")[1] || image;
    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB` }, { status: 400 });
    }

    // Ensure directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Write file
    const safeFilename = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, safeFilename);
    await fs.writeFile(filepath, buffer);

    const publicPath = `/uploads/doors/${safeFilename}`;
    return NextResponse.json({ success: true, path: publicPath });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
