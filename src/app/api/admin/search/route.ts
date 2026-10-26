import { NextResponse } from "next/server";
import { adminGlobalSearch } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

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
