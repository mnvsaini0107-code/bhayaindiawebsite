import { NextResponse } from "next/server";
import { getEnquiries, createEnquiry } from "@/lib/db";

export async function GET() {
  try {
    const enquiries = getEnquiries();
    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.mobile || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name, mobile number, and message are required." },
        { status: 400 }
      );
    }

    const enquiry = createEnquiry({
      name: body.name,
      mobile: body.mobile,
      email: body.email || "",
      productName: body.productName || "General Enquiry",
      productId: body.productId || "",
      quantity: body.quantity ? Number(body.quantity) : undefined,
      message: body.message,
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit enquiry" }, { status: 500 });
  }
}
