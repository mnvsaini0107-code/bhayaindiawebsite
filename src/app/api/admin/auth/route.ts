import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "bhaya@2026";

    if (username === validUsername && password === validPassword) {
      const response = NextResponse.json({ success: true, message: "Logged in successfully" });
      
      // Set secure session cookie
      response.cookies.set({
        name: "bhaya_admin_session",
        value: "authenticated_true_session",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("POST /api/admin/auth error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("bhaya_admin_session");
  return response;
}
