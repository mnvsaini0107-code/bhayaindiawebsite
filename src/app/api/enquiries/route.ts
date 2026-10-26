import { NextResponse } from "next/server";
import { getEnquiries, createEnquiry } from "@/lib/db";
import { verifyAdminRequest, checkRateLimit, recordRateLimitAttempt } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

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
    const forwardedFor = request.headers.get("x-forwarded-for") || "local";
    const clientIp = forwardedFor.split(",")[0].trim();

    // Rate limit enquiries to 10 submissions per 10 minutes per IP
    const rateCheck = checkRateLimit(`enquiry:${clientIp}`, 10, 10 * 60 * 1000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { success: false, error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.` },
        { status: 429 }
      );
    }
    recordRateLimitAttempt(`enquiry:${clientIp}`, 10, 10 * 60 * 1000);

    const body = await request.json();
    const name = String(body.name || body.fullName || "").trim().slice(0, 100);
    const mobile = String(body.mobile || body.phone || "").trim().slice(0, 25);
    const email = String(body.email || "").trim().slice(0, 120);
    const businessName = String(body.businessName || "").trim().slice(0, 150);
    const message = String(body.message || body.requirement || body.notes || "").trim().slice(0, 1500);
    const enquiryType = String(body.type || "general").slice(0, 50);

    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, error: "Name and contact phone number are required." },
        { status: 400 }
      );
    }

    // 1. Reliably save enquiry record
    const enquiry = createEnquiry({
      name,
      mobile,
      email,
      productName: body.productName || (businessName ? `Business: ${businessName}` : "General Lead"),
      productId: body.productId || "",
      quantity: body.quantity ? Number(body.quantity) : undefined,
      message: `[${enquiryType.toUpperCase()}] ${message}${businessName ? ` | Business: ${businessName}` : ""}${body.location ? ` | Location: ${body.location}` : ""}`,
    });

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit enquiry" }, { status: 500 });
  }
}
