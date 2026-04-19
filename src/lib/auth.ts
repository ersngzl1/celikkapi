import { NextRequest } from "next/server";
import crypto from "crypto";

const ADMIN_USER = "admin";
const ADMIN_PASS = "best2026";

// Token: HMAC of username + a secret derived from password
const SECRET = crypto.createHash("sha256").update(ADMIN_PASS + "bestkapi-secret-salt").digest("hex");

export function generateToken(): string {
  const payload = `${ADMIN_USER}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return false;
    const hmac = parts.pop()!;
    const payload = parts.join(":");
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAuthenticated(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  if (!match) return false;
  return verifyToken(decodeURIComponent(match[1]));
}
