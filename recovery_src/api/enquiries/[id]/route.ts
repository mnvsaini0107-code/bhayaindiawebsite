import { NextResponse } from "next/server";
import { updateEnquiryStatus } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateEnquiryStatus(id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("PUT /api/enquiries/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update enquiry status" }, { status: 500 });
  }
}
