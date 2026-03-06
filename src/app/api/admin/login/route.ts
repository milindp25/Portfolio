import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminPassword,
  getSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });

    // Set session cookie (httpOnly, 7-day expiry)
    response.cookies.set(SESSION_COOKIE_NAME, getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
