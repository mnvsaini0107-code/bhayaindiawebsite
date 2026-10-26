import { NextResponse } from "next/server";
import { getMedia, saveMedia, deleteMedia, getMediaTotalSize } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();
    const type = searchParams.get("type");

    let assets = getMedia();

    if (query) {
      assets = assets.filter(
        (a) =>
          a.filename.toLowerCase().includes(query) ||
          a.altEn.toLowerCase().includes(query) ||
          a.altHi.includes(query) ||
          (a.title && a.title.toLowerCase().includes(query)) ||
          (a.caption && a.caption.toLowerCase().includes(query))
      );
    }

    if (type && type !== "all") {
      assets = assets.filter((a) => a.fileType.toLowerCase().includes(type.toLowerCase()));
    }

    const totalBytes = getMediaTotalSize();
    const formattedSize =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(totalBytes / 1024).toFixed(1)} KB`;

    return NextResponse.json({
      success: true,
      assets,
      totalCount: assets.length,
      totalBytes,
      formattedSize,
    });
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.url && !body.filename) {
      return NextResponse.json({ success: false, error: "Filename or URL required" }, { status: 400 });
    }

    const asset = saveMedia(body);
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ success: false, error: "Failed to save media asset" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Media ID required" }, { status: 400 });
    }

    const deleted = deleteMedia(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/media error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete media asset" }, { status: 500 });
  }
}
