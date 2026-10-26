import { NextResponse } from "next/server";
import { getPageContent, updatePageContent } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const content = getPageContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const updated = updatePageContent(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("PUT /api/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 });
  }
}
