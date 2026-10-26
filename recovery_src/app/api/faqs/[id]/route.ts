import { NextResponse } from "next/server";
import { updateFaq, deleteFaq } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateFaq(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("PUT /api/faqs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update faq" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = deleteFaq(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("DELETE /api/faqs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete faq" }, { status: 500 });
  }
}
