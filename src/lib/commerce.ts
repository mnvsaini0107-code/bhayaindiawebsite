// BHAYA INDIA Commerce Mode Configuration
// Manages standalone vs Shopify mode seamlessly without breaking either integration.

export type CommerceMode = "standalone" | "shopify";

export function getCommerceMode(): CommerceMode {
  // Always default to standalone mode for the new standalone system
  const envMode = (
    process.env.COMMERCE_MODE ||
    process.env.NEXT_PUBLIC_COMMERCE_MODE ||
    "standalone"
  ).toLowerCase().trim();

  if (envMode === "shopify") {
    return "shopify";
  }
  return "standalone";
}

export function isStandaloneMode(): boolean {
  return getCommerceMode() === "standalone";
}

export function isShopifyMode(): boolean {
  return getCommerceMode() === "shopify";
}
