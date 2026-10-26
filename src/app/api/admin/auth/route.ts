import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  isLoginRateLimited,
  recordFailedLogin,
  resetLoginAttempts,
  revokeSessionToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for") || "local";
    const clientIp = forwardedFor.split(",")[0].trim();

    // Check rate limit
    const rateCheck = isLoginRateLimited(clientIp);
    if (rateCheck.limited) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "bhaya@2026";

    if (username === validUsername && password === validPassword) {
      resetLoginAttempts(clientIp);
      const token = await createAdminSessionToken();

      const response = NextResponse.json({
        success: true,
        message: "Logged in successfully",
      });

      // Set cryptographically signed HTTP-only cookie (12 hours)
      response.cookies.set({
        name: "bhaya_admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
        sameSite: "lax",
      });

      return response;
    }

    recordFailedLogin(clientIp);
    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("POST /api/admin/auth error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)bhaya_admin_session=([^;]+)/);
    if (match && match[1]) {
      revokeSessionToken(decodeURIComponent(match[1].trim()));
    }
  } catch (err) {
    console.warn("Could not revoke session token on logout:", err);
  }

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("bhaya_admin_session");
  return response;
}

