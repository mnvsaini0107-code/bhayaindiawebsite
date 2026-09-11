import { NextResponse } from "next/server";
import { updateTestimonial, deleteTestimonial } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateTestimonial(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("PUT /api/testimonials/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ok = deleteTestimonial(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete testimonial" }, { status: 500 });
  }
}
