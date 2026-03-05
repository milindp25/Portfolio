import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    // Validate session — must match the token format
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      // No admin secret set — block access
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const expectedToken = Buffer.from(
      `portfolio-admin:${adminSecret}`,
    ).toString("base64");

    if (sessionCookie !== expectedToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect admin API routes (except login endpoint)
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expectedToken = Buffer.from(
      `portfolio-admin:${adminSecret}`,
    ).toString("base64");

    if (sessionCookie !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
