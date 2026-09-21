import { NextResponse } from "next/server";
import {
  testShopifyAdminConnection,
  createTestProduct,
  deleteTestProduct,
  getShopifyShop,
  getShopifyDomain,
  isShopifyAdminConfigured,
  isShopifyConfigured,
} from "@/lib/shopify";

// GET /api/shopify/test
// Performs read-only diagnostics for Shopify Admin API and Storefront API
export async function GET() {
  const shop = getShopifyShop();
  const domain = getShopifyDomain();
  const isAdminConfigured = isShopifyAdminConfigured();
  const isStorefrontConfigured = isShopifyConfigured();

  if (!isAdminConfigured) {
    return NextResponse.json({
      success: false,
      message: "Shopify Admin API is not fully configured.",
      configured: {
        shop: Boolean(shop),
        shopName: shop || "Not set",
        domain: domain || "Not set",
        clientIdConfigured: Boolean(process.env.SHOPIFY_CLIENT_ID),
        clientSecretConfigured: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
        storefrontConfigured: isStorefrontConfigured,
      },
      diagnostic: {
        adminAuth: "FAIL",
        accessTokenObtained: "FAIL",
        shopQuery: "FAIL",
        productsQuery: "FAIL",
        collectionsQuery: "FAIL",
        error: "Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET in .env.local",
      },
    });
  }

  // Run the read-only diagnostic
  const diagnostic = await testShopifyAdminConnection();

  return NextResponse.json({
    success: diagnostic.adminAuth === "PASS" && diagnostic.shopQuery === "PASS",
    configured: {
      shop,
      domain,
      isAdminConfigured,
      isStorefrontConfigured,
    },
    diagnostic,
  });
}

// POST /api/shopify/test
// Allows running write tests (e.g. temporary draft test product create/delete)
export async function POST(req: Request) {
  try {
    const { action, productId } = await req.json().catch(() => ({ action: "create_test_product" }));

    if (action === "create_test_product") {
      const result = await createTestProduct();
      return NextResponse.json(result);
    }

    if (action === "delete_test_product" && productId) {
      const result = await deleteTestProduct(productId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
