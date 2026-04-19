import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";

const ADMIN_USER = "admin";
const ADMIN_PASS = "best2026";

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Kullanici adi ve sifre gerekli" }, { status: 400 });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      // Brute-force'u yavaşlat
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ error: "Kullanici adi veya sifre hatali" }, { status: 401 });
    }

    const token = generateToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Gecersiz istek" }, { status: 400 });
  }
}
