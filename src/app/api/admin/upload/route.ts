import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink, readFile, writeFile as writeFileAsync } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";

const ALLOWED_TYPES = new Set(["logo", "favicon"]);
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "svg", "ico"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await req.json();
    const { type, ext, file: base64Data } = body;

    if (!type || !base64Data) {
      return NextResponse.json({ error: "Dosya veya tip eksik" }, { status: 400 });
    }

    // Validate type to prevent path traversal
    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: "Gecersiz dosya tipi" }, { status: 400 });
    }

    // Validate extension
    const safeExt = (ext || "png").toLowerCase().replace(/[^a-z]/g, "");
    if (!ALLOWED_EXTENSIONS.has(safeExt)) {
      return NextResponse.json({ error: "Gecersiz dosya uzantisi" }, { status: 400 });
    }

    // Extract and validate base64
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Clean, "base64");

    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Dosya 5MB'dan buyuk olamaz" }, { status: 400 });
    }

    const fileName = `${type}.${safeExt}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Clean old files of same type
    try {
      const files = await readdir(uploadDir);
      for (const f of files) {
        if (f.startsWith(type + ".")) {
          await unlink(join(uploadDir, f));
        }
      }
    } catch {}

    await writeFile(join(uploadDir, fileName), buffer);

    // Update settings
    const settingsPath = join(process.cwd(), "settings.json");
    let settings: Record<string, unknown> = {};
    try {
      const raw = await readFile(settingsPath, "utf-8");
      settings = JSON.parse(raw);
    } catch {}

    settings[type] = `/uploads/${fileName}`;
    await writeFileAsync(settingsPath, JSON.stringify(settings, null, 2), "utf-8");

    return NextResponse.json({ success: true, path: `/uploads/${fileName}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
