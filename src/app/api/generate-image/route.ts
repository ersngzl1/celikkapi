import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { initDB } from "@/lib/db-vercel";

const SETTINGS_FILE = join(process.cwd(), "settings.json");

function getSettings() {
  try {
    if (existsSync(SETTINGS_FILE)) {
      return JSON.parse(readFileSync(SETTINGS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

// Kapi gorselini public klasorunden oku ve data URI yap
function getDoorImageDataURI(doorImagePath: string): string {
  const cleanPath = doorImagePath.replace(/^https?:\/\/[^/]+/, "");

  // Path traversal koruması - sadece /doors/ altına izin ver
  const normalized = cleanPath.replace(/\\/g, "/");
  if (!normalized.startsWith("/doors/") || normalized.includes("..")) {
    throw new Error("Gecersiz gorsel yolu");
  }

  const filePath = join(process.cwd(), "public", normalized);
  // Resolved path'in public/ içinde olduğunu doğrula
  const publicDir = join(process.cwd(), "public");
  const resolved = require("path").resolve(filePath);
  if (!resolved.startsWith(require("path").resolve(publicDir))) {
    throw new Error("Gecersiz gorsel yolu");
  }

  if (!existsSync(filePath)) {
    throw new Error(`Kapi gorseli bulunamadi: ${normalized}`);
  }

  const buffer = readFileSync(filePath);
  const ext = normalized.split(".").pop()?.toLowerCase() || "jpg";
  const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

// Simple in-memory rate limit: max 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Cok fazla istek. Lutfen bir dakika bekleyin." }, { status: 429 });
  }

  let body;
  try {
    await initDB();
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek" }, { status: 400 });
  }

  const { doorImage, userImage, doorName } = body;

  const settings = getSettings();
  const apiKey = settings.replicateApiKey;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API anahtari ayarlanmamis. Admin panelinden Replicate API anahtarinizi girin." },
      { status: 400 }
    );
  }

  if (!userImage || typeof userImage !== "string") {
    return NextResponse.json({ error: "Kullanici gorseli eksik" }, { status: 400 });
  }

  if (!doorImage || typeof doorImage !== "string") {
    return NextResponse.json({ error: "Kapi gorseli eksik" }, { status: 400 });
  }

  // User image size check (base64 ~1.37x original, limit ~15MB base64 = ~11MB image)
  if (userImage.length > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "Gorsel cok buyuk (max 10MB)" }, { status: 400 });
  }

  const prompt = (settings.imagePrompt || "Take the steel door from the FIRST image and install it into the doorway of the SECOND image. Keep proportions and perspective accurate. Make it look realistic.")
    .replace("{model_name}", doorName || "steel door");

  try {
    // Kapi gorselini dosyadan oku - data URI olarak
    const doorDataURI = getDoorImageDataURI(doorImage);

    console.log(`[generate-image] Door: ${doorImage} (dataURI len: ${doorDataURI.length})`);
    console.log(`[generate-image] User image dataURI len: ${userImage.length}`);
    console.log(`[generate-image] Prompt: ${prompt.substring(0, 100)}...`);

    // Replicate API - openai/gpt-image-1.5
    // input_images: data URI olarak gonder
    const res = await fetch("https://api.replicate.com/v1/models/openai/gpt-image-1.5/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Prefer": "wait=60",
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          input_images: [doorDataURI, userImage],
          input_fidelity: "high",
          quality: "high",
          output_format: "webp",
          number_of_images: 1,
        },
      }),
    });

    const data = await res.json();
    console.log(`[generate-image] Response status: ${res.status}, prediction status: ${data.status}`);

    if (!res.ok) {
      const errMsg = data.detail || data.error || JSON.stringify(data);
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    // Sonuc geldiyse
    if (data.status === "succeeded" && data.output) {
      return NextResponse.json({ output: extractOutput(data) });
    }

    // Polling gerekli
    if (data.urls?.get && (data.status === "starting" || data.status === "processing")) {
      const result = await pollPrediction(data.urls.get, apiKey);
      return NextResponse.json({ output: result });
    }

    if (data.output) {
      return NextResponse.json({ output: extractOutput(data) });
    }

    return NextResponse.json(
      { error: "Beklenmeyen API yaniti: " + JSON.stringify(data).slice(0, 300) },
      { status: 500 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error(`[generate-image] Hata: ${message}`);
    return NextResponse.json({ error: `Hata: ${message}` }, { status: 500 });
  }
}

async function pollPrediction(url: string, apiKey: string, maxAttempts = 60): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    const data = await res.json();

    if (data.status === "succeeded") {
      return extractOutput(data);
    }
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(data.error || "Gorsel uretimi basarisiz oldu");
    }
  }
  throw new Error("Zaman asimi - gorsel uretimi cok uzun surdu");
}

function extractOutput(data: Record<string, unknown>): string {
  const output = data.output;
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length > 0) return output[0];
  if (output && typeof output === "object" && "image" in output) return (output as Record<string, string>).image;
  return String(output || "");
}
