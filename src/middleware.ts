import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Login sayfasına erişime izin ver
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Admin sayfaları için kontrol - token var mı sadece kontrol et
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
