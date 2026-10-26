import { NextResponse } from "next/server";
import { getOrders, createOrder, getProducts } from "@/lib/db";
import { verifyAdminRequest, checkRateLimit, recordRateLimitAttempt } from "@/lib/auth";
import type { OrderItem } from "@/lib/types";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

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
    const forwardedFor = request.headers.get("x-forwarded-for") || "local";
    const clientIp = forwardedFor.split(",")[0].trim();

    // 1. Rate limiting against checkout spam / DoS
    const rateCheck = checkRateLimit(`order:${clientIp}`, 20, 10 * 60 * 1000);
    if (rateCheck.limited) {
      return NextResponse.json(
        { success: false, error: `Too many order requests. Please wait ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }
    recordRateLimitAttempt(`order:${clientIp}`, 20, 10 * 60 * 1000);

    const body = await request.json();
    if (!body.customerName || !body.phone || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name, phone, and valid items are required." },
        { status: 400 }
      );
    }

    const isAdmin = await verifyAdminRequest(request);

    // 2. Server-side product price lookup and recalculation
    const allProducts = getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));
    for (const p of allProducts) {
      if (p.slug) productMap.set(p.slug, p);
    }

    let calculatedTotal = 0;
    const verifiedItems: OrderItem[] = [];

    for (const rawItem of body.items) {
      const prodId = String(rawItem.productId || rawItem.id || "");
      const dbProduct = productMap.get(prodId);
      const qty = Math.max(1, Math.min(1000, parseInt(rawItem.quantity, 10) || 1));

      let unitPrice = 0;
      let itemName = String(rawItem.name || "").trim().slice(0, 200);
      let itemImage = String(rawItem.image || "").trim().slice(0, 500);

      if (dbProduct) {
        unitPrice = dbProduct.price !== null && dbProduct.price > 0 ? Number(dbProduct.price) : 0;
        itemName = dbProduct.name;
        if (dbProduct.images && dbProduct.images.length > 0) {
          itemImage = dbProduct.images[0];
        }
      } else if (isAdmin && rawItem.price && Number(rawItem.price) > 0) {
        unitPrice = Number(rawItem.price);
      }

      calculatedTotal += unitPrice * qty;
      verifiedItems.push({
        productId: prodId || (dbProduct ? dbProduct.id : `item-${Date.now()}`),
        name: itemName || "Catalogue Product",
        price: unitPrice,
        quantity: qty,
        image: itemImage || undefined,
      });
    }

    // 3. Payment and Order status enforcement
    // Public orders always start as "Pending" payment status and "Order Placed"
    const finalPaymentStatus = isAdmin && body.paymentStatus === "Paid" ? "Paid" : "Pending";
    const finalOrderStatus = isAdmin && body.orderStatus ? body.orderStatus : "Order Placed";
    const validPaymentMethods = ["UPI", "Card", "NetBanking", "COD"];
    const paymentMethod = validPaymentMethods.includes(body.paymentMethod) ? body.paymentMethod : "COD";

    const order = createOrder({
      customerName: String(body.customerName).trim().slice(0, 150),
      email: String(body.email || "").trim().slice(0, 150),
      phone: String(body.phone).trim().slice(0, 30),
      address: String(body.address || "").trim().slice(0, 500),
      city: String(body.city || "").trim().slice(0, 100),
      state: String(body.state || "").trim().slice(0, 100),
      pincode: String(body.pincode || "").trim().slice(0, 20),
      items: verifiedItems,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: finalOrderStatus,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
