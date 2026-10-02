import { NextResponse } from "next/server";
import { getRedirects, saveRedirect, deleteRedirect } from "@/lib/db";

export async function GET() {
  try {
    const redirects = getRedirects();
    return NextResponse.json({ success: true, redirects });
  } catch (error) {
    console.error("GET /api/redirects error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch redirects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.source || !body.destination) {
      return NextResponse.json({ success: false, error: "Source and destination URLs are required" }, { status: 400 });
    }

    if (body.source.trim() === body.destination.trim()) {
      return NextResponse.json({ success: false, error: "Source and destination cannot be identical (prevents redirect loop)" }, { status: 400 });
    }

    const redirect = saveRedirect(body);
    return NextResponse.json({ success: true, redirect }, { status: 201 });
  } catch (error) {
    console.error("POST /api/redirects error:", error);
    return NextResponse.json({ success: false, error: "Failed to save redirect" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Redirect ID required" }, { status: 400 });
    }

    const deleted = deleteRedirect(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/redirects error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete redirect" }, { status: 500 });
  }
}
