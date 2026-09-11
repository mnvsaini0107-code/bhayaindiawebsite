import { NextResponse } from "next/server";
import { getPageContent, updatePageContent } from "@/lib/db";

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
  try {
    const body = await request.json();
    const updated = updatePageContent(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("PUT /api/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 });
  }
}
