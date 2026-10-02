import { NextResponse } from "next/server";
import { adminGlobalSearch } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const results = adminGlobalSearch(q);
    return NextResponse.json({ success: true, results, count: results.length });
  } catch (error) {
    console.error("GET /api/admin/search error:", error);
    return NextResponse.json({ success: false, error: "Admin search failed" }, { status: 500 });
  }
}
