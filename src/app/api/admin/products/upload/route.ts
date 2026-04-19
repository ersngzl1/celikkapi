import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB (Vercel serverless limit'i düşün)

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

    // Validate extension
    const filename = file.name.toLowerCase();
    const ext = filename.split(".").pop();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Geçerli formatlar: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Dosya boyutu ${MAX_SIZE / 1024 / 1024}MB'dan küçük olmalıdır` }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ success: true, image: dataUri });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: `Upload hatası: ${error.message}` }, { status: 500 });
  }
}
