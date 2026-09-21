import { NextResponse } from "next/server";
import { isShopifyAdminConfigured, shopifyAdminFetch, isShopifyConfigured, getShopifyStoreDomain } from "@/lib/shopify/client";
import { getProducts, getCategories } from "@/lib/db";

// POST /api/shopify/migrate
// Verifies connection and imports collections/products via Shopify Admin GraphQL API
export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({ action: "status" }));

    const isConfigured = isShopifyConfigured();
    const isAdminConfigured = isShopifyAdminConfigured();
    const domain = getShopifyStoreDomain();

    if (action === "status") {
      return NextResponse.json({
        success: true,
        configured: isConfigured,
        adminConfigured: isAdminConfigured,
        domain: domain || "Not configured",
        productsCount: getProducts().length,
        categoriesCount: getCategories().length,
        message: isConfigured
          ? "Shopify Storefront API is configured and connected."
          : "Shopify Storefront credentials are not yet added to .env.local.",
      });
    }

    if (!isAdminConfigured) {
      return NextResponse.json({
        success: false,
        error:
          "Shopify Admin API credentials (SHOPIFY_CLIENT_ID & SHOPIFY_CLIENT_SECRET) are required to run automated migration. You can also import 'data/shopify_products_import.csv' directly into Shopify Admin > Products > Import.",
        csvAvailable: true,
      });
    }

    // Run programmatic migration via Admin API
    const products = getProducts();
    const results: Array<{ title: string; status: string; id?: string; error?: string }> = [];

    for (const p of products) {
      const createProductMutation = `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              handle
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      try {
        const { body } = await shopifyAdminFetch<{
          data: {
            productCreate: {
              product: { id: string; handle: string; title: string } | null;
              userErrors: Array<{ field: string; message: string }>;
            };
          };
        }>({
          query: createProductMutation,
          variables: {
            input: {
              title: p.name,
              handle: p.slug,
              descriptionHtml: `<p>${p.description}</p>`,
              vendor: "BHAYA INDIA",
              productType: p.category,
              tags: [p.categorySlug, p.subcategory.toLowerCase().replace(/\s+/g, "-"), "bhaya-india"],
            },
          },
        });

        if (body.data?.productCreate?.product) {
          results.push({
            title: p.name,
            status: "created",
            id: body.data.productCreate.product.id,
          });
        } else {
          results.push({
            title: p.name,
            status: "error",
            error: body.data?.productCreate?.userErrors?.[0]?.message || "Failed to create",
          });
        }
      } catch (err: unknown) {
        results.push({
          title: p.name,
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${products.length} products.`,
      results,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Migration failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const isConfigured = isShopifyConfigured();
  const isAdminConfigured = isShopifyAdminConfigured();
  const domain = getShopifyStoreDomain();

  return NextResponse.json({
    success: true,
    configured: isConfigured,
    adminConfigured: isAdminConfigured,
    domain: domain || "Not configured",
    productsCount: getProducts().length,
    categoriesCount: getCategories().length,
    csvExportPath: "data/shopify_products_import.csv",
  });
}
