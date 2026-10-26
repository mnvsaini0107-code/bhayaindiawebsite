import { NextResponse } from "next/server";
import { lookupOrder } from "@/lib/db";
import { checkRateLimit, recordRateLimitAttempt } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for") || "local";
    const clientIp = forwardedFor.split(",")[0].trim();

    // 1. Rate limiting against automated brute-force order scanning
    const rateCheck = checkRateLimit(`track:${clientIp}`, 10, 5 * 60 * 1000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { success: false, error: `Too many lookup attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }
    recordRateLimitAttempt(`track:${clientIp}`, 10, 5 * 60 * 1000);

    const { orderId, phone } = await request.json();

    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, error: "Both Order ID and registered Phone number are required." },
        { status: 400 }
      );
    }

    const order = lookupOrder(String(orderId), String(phone));

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No order found matching this Order ID and registered phone number. Please verify your details or contact customer care.",
        },
        { status: 404 }
      );
    }

    // Mask phone number for privacy
    const rawPhone = String(order.phone || "").trim();
    const maskedPhone =
      rawPhone.length > 4
        ? `${rawPhone.slice(0, 3)}•••••${rawPhone.slice(-4)}`
        : rawPhone;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        createdAt: order.createdAt,
        customerName: order.customerName,
        phone: maskedPhone,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        carrier: order.carrier || null,
        trackingNumber: order.trackingNumber || null,
        trackingUrl: order.trackingUrl || null,
        history: order.history || [],
        items: order.items,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("POST /api/orders/track error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to look up order status." },
      { status: 500 }
    );
  }
}
