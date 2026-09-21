import { NextRequest, NextResponse } from "next/server";
import { getShopifyStoreDomain, isShopifyConfigured } from "@/lib/shopify";

// Redirects user to their official Shopify Customer Account portal
export async function GET(request: NextRequest) {
  const domain = getShopifyStoreDomain();

  if (!isShopifyConfigured() || !domain) {
    // If domain not yet configured, redirect back to /account with informative parameter
    return NextResponse.redirect(new URL("/account?shopify=unconfigured", request.url));
  }


  const cleanDomain = domain.replace(/^https?:\/\//, "");
  const shopifyAccountUrl = `https://${cleanDomain}/account`;

  return NextResponse.redirect(shopifyAccountUrl);
}
