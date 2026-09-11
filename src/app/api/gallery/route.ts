import { NextResponse } from "next/server";
import { getGallery, createGalleryItem } from "@/lib/db";

export async function GET() {
  try {
    const items = getGallery();
    return NextResponse.json({ success: true, gallery: items });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.url) {
      return NextResponse.json({ success: false, error: "Title and URL are required" }, { status: 400 });
    }

    const item = createGalleryItem({
      title: body.title,
      url: body.url,
      category: body.category || "Products",
      caption: body.caption || "",
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ success: false, error: "Failed to create gallery item" }, { status: 500 });
  }
}
