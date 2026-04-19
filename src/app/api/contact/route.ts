import { NextRequest, NextResponse } from "next/server";
import { initDB, contactQueries } from "@/lib/db-vercel";

const CONTACTS_FILE = ""; // No longer used

// Simple rate limit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 }); // 1 hour window
    return true;
  }
  if (entry.count >= 10) return false; // Max 10 per hour
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Cok fazla mesaj gonderdiniz. Lutfen daha sonra tekrar deneyin." }, { status: 429 });
  }

  try {
    await initDB();
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Gecerli bir ad soyad girin" }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json({ error: "Gecerli bir telefon numarasi girin" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Mesajiniz cok kisa" }, { status: 400 });
    }

    // Sanitize and save to database
    const contact = {
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      email: (email || "").trim().slice(0, 100),
      product: (subject || "").trim().slice(0, 50),
      message: message.trim().slice(0, 2000),
    };

    await contactQueries.create(contact);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}
