import { NextResponse } from "next/server";
import { getTestimonials, createTestimonial } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = getTestimonials();
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch testimonials" }, { status: 500 });
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
    if (!body.customerName || !body.review) {
      return NextResponse.json({ success: false, error: "Name and review are required" }, { status: 400 });
    }

    const item = createTestimonial({
      customerName: body.customerName,
      role: body.role || "",
      company: body.company || "",
      review: body.review,
      rating: Number(body.rating) || 5,
      photo: body.photo || "",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    });

    return NextResponse.json({ success: true, testimonial: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error:", error);
    return NextResponse.json({ success: false, error: "Failed to create testimonial" }, { status: 500 });
  }
}
