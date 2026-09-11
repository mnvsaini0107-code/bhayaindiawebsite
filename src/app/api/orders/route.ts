import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.phone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name, phone, and items are required." },
        { status: 400 }
      );
    }

    const order = createOrder({
      customerName: body.customerName,
      email: body.email || "",
      phone: body.phone,
      address: body.address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.pincode || "",
      items: body.items,
      totalAmount: Number(body.totalAmount) || 0,
      paymentMethod: body.paymentMethod || "UPI",
      paymentStatus: body.paymentStatus || "Pending",
      orderStatus: "New",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
