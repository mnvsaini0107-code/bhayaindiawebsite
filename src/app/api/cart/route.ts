import { NextResponse } from "next/server";
import {
  createShopifyCart,
  getShopifyCart,
  addLinesToShopifyCart,
  updateShopifyCartLines,
  removeShopifyCartLines,
  isShopifyConfigured,
} from "@/lib/shopify";

// Handles Shopify Cart operations securely server-side
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, cartId, lines, lineIds } = body;

    if (!isShopifyConfigured()) {
      return NextResponse.json({
        success: true,
        isShopify: false,
        message: "Shopify not configured; operating in local mode.",
      });
    }

    switch (action) {
      case "create": {
        const cart = await createShopifyCart(lines);
        return NextResponse.json({ success: true, isShopify: true, cart });
      }

      case "get": {
        if (!cartId) {
          return NextResponse.json({ success: false, error: "cartId required" }, { status: 400 });
        }
        const cart = await getShopifyCart(cartId);
        return NextResponse.json({ success: true, isShopify: true, cart });
      }

      case "add": {
        if (!cartId) {
          const cart = await createShopifyCart(lines);
          return NextResponse.json({ success: true, isShopify: true, cart });
        }
        const cart = await addLinesToShopifyCart(cartId, lines);
        return NextResponse.json({ success: true, isShopify: true, cart });
      }

      case "update": {
        if (!cartId || !lines) {
          return NextResponse.json({ success: false, error: "cartId and lines required" }, { status: 400 });
        }
        const cart = await updateShopifyCartLines(cartId, lines);
        return NextResponse.json({ success: true, isShopify: true, cart });
      }

      case "remove": {
        if (!cartId || !lineIds) {
          return NextResponse.json({ success: false, error: "cartId and lineIds required" }, { status: 400 });
        }
        const cart = await removeShopifyCartLines(cartId, lineIds);
        return NextResponse.json({ success: true, isShopify: true, cart });
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Cart operation failed" },
      { status: 500 }
    );
  }
}
