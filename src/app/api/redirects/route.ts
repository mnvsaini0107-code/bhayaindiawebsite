import { NextResponse } from "next/server";
import { getRedirects, saveRedirect, deleteRedirect } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

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
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const source = String(body.source || "").trim();
    const destination = String(body.destination || "").trim();

    if (!source || !destination) {
      return NextResponse.json({ success: false, error: "Source and destination URLs are required" }, { status: 400 });
    }

    if (source === destination) {
      return NextResponse.json({ success: false, error: "Source and destination cannot be identical (prevents redirect loop)" }, { status: 400 });
    }

    if (!source.startsWith("/")) {
      return NextResponse.json({ success: false, error: "Source must be an internal relative path starting with '/'" }, { status: 400 });
    }

    // Check dangerous protocols
    const lowerDest = destination.toLowerCase();
    if (lowerDest.startsWith("javascript:") || lowerDest.startsWith("data:") || lowerDest.startsWith("vbscript:")) {
      return NextResponse.json({ success: false, error: "Invalid destination schema." }, { status: 400 });
    }

    // Must be relative starting with / (and not //) OR an explicit https/http URL
    const isValidRelative = destination.startsWith("/") && !destination.startsWith("//") && !destination.startsWith("/\\");
    const isValidAbsolute = destination.startsWith("https://") || destination.startsWith("http://");

    if (!isValidRelative && !isValidAbsolute) {
      return NextResponse.json({ success: false, error: "Destination must be a relative path (/path) or full HTTPS URL" }, { status: 400 });
    }

    const redirect = saveRedirect({
      ...body,
      source,
      destination,
      statusCode: body.statusCode === 302 ? 302 : 301,
    });
    return NextResponse.json({ success: true, redirect }, { status: 201 });
  } catch (error) {
    console.error("POST /api/redirects error:", error);
    return NextResponse.json({ success: false, error: "Failed to save redirect" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

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
