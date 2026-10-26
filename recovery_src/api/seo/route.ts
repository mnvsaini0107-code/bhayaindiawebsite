import { NextResponse } from "next/server";
import {
  getGlobalSeoSettings,
  updateGlobalSeoSettings,
  getAllPageSeo,
  getPageSeo,
  savePageSeo,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (path) {
      const pageSeo = getPageSeo(path);
      return NextResponse.json({ success: true, page: pageSeo || null });
    }

    const globalSeo = getGlobalSeoSettings();
    const pagesSeo = getAllPageSeo();

    return NextResponse.json({
      success: true,
      global: globalSeo,
      pages: pagesSeo,
      totalPages: Object.keys(pagesSeo).length,
    });
  } catch (error) {
    console.error("GET /api/seo error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch SEO configuration" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "global") {
      const updated = updateGlobalSeoSettings(body.settings);
      return NextResponse.json({ success: true, global: updated });
    }

    if (body.type === "page") {
      if (!body.path) {
        return NextResponse.json({ success: false, error: "Page path required" }, { status: 400 });
      }
      const updated = savePageSeo(body.path, body.seo);
      return NextResponse.json({ success: true, page: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid SEO update type" }, { status: 400 });
  } catch (error) {
    console.error("PUT /api/seo error:", error);
    return NextResponse.json({ success: false, error: "Failed to update SEO configuration" }, { status: 500 });
  }
}
