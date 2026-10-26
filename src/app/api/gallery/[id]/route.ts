import { NextResponse } from "next/server";
import { deleteGalleryItem } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const ok = deleteGalleryItem(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete gallery item" }, { status: 500 });
  }
}
