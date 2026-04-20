import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";
import { sql } from "@vercel/postgres";

async function getSettings() {
  try {
    const result = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, unknown> = {};
    result.rows?.forEach((row: any) => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });
    return settings;
  } catch {
    return {};
  }
}

async function saveSettings(data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      await sql`
        INSERT INTO settings (key, value) VALUES (${key}, ${stringValue})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updatedAt = NOW()
      `;
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
    }
  }
}

// Allowed setting keys to prevent arbitrary data injection
const ALLOWED_KEYS = new Set([
  "replicateApiKey", "imagePrompt", "logo", "favicon", "logoLight", "logoDark",
  "whatsappNumber", "whatsappMessage",
  "metaTitle", "metaDescription", "metaKeywords",
  "ogTitle", "ogDescription", "ogImage",
  "headerCode", "footerCode",
  "companyName", "slogan", "phone", "phone2", "whatsapp", "email", "address", "city",
  "workingHours", "workingDays", "googleMapsUrl", "instagramUrl", "facebookUrl", "youtubeUrl",
]);

export async function HEAD(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return new NextResponse(null, { status: 401 });
  }
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  await initDB();
  const settings = await getSettings();

  // Public fields that the frontend needs (logo, whatsapp)
  const isAdmin = isAuthenticated(req);

  if (!isAdmin) {
    // Return all public-safe fields (no API keys)
    return NextResponse.json({
      companyName: settings.companyName || "",
      slogan: settings.slogan || "",
      phone: settings.phone || "",
      phone2: settings.phone2 || "",
      whatsapp: settings.whatsapp || "",
      whatsappMessage: settings.whatsappMessage || "",
      email: settings.email || "",
      address: settings.address || "",
      city: settings.city || "",
      workingHours: settings.workingHours || "",
      workingDays: settings.workingDays || "",
      googleMapsUrl: settings.googleMapsUrl || "",
      instagramUrl: settings.instagramUrl || "",
      facebookUrl: settings.facebookUrl || "",
      youtubeUrl: settings.youtubeUrl || "",
      logoLight: settings.logoLight || "",
      logoDark: settings.logoDark || "",
    });
  }

  // Admin: return all, but mask API key
  const masked = { ...settings };
  if (masked.replicateApiKey) {
    const key = String(masked.replicateApiKey);
    masked.replicateApiKey = key.slice(0, 6) + "..." + key.slice(-4);
    masked.hasApiKey = true;
  } else {
    masked.hasApiKey = false;
  }
  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await req.json();
    const current = await getSettings();

    // Only allow known keys
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_KEYS.has(key) && typeof value === "string") {
        // Logo base64 images can be larger, others have 10000 limit
        const maxLen = (key === "logoLight" || key === "logoDark") ? 1500000 : 10000;
        sanitized[key] = value.slice(0, maxLen);
      } else if (ALLOWED_KEYS.has(key) && typeof value === "boolean") {
        sanitized[key] = value; // Allow booleans for checkboxes
      }
    }

    // If masked key sent, keep the old one
    if (sanitized.replicateApiKey && String(sanitized.replicateApiKey).includes("...")) {
      sanitized.replicateApiKey = current.replicateApiKey;
    }

    const updated = { ...current, ...sanitized };
    await saveSettings(updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Gecersiz istek" }, { status: 400 });
  }
}
