// Shopify API Client for BHAYA INDIA Storefront & Admin APIs
import {
  getShopifyDomain,
  getShopifyShop,
  getShopifyApiVersion,
  isShopifyAdminConfigured,
  shopifyAdminFetch,
  getAdminAccessToken,
} from "./admin";

export {
  getShopifyDomain,
  getShopifyShop,
  getShopifyApiVersion,
  isShopifyAdminConfigured,
  shopifyAdminFetch,
  getAdminAccessToken,
};

function getDomain(): string {
  const adminDomain = getShopifyDomain();
  if (adminDomain) return adminDomain;
  return (
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    ""
  );
}

const storefrontAccessToken =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  "";

export function isShopifyConfigured(): boolean {
  const domain = getDomain();
  const privateToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  return Boolean(domain && (privateToken || publicToken));
}

export function getShopifyStoreDomain(): string {
  return getDomain();
}

/**
 * Customer-facing Storefront GraphQL API fetch.
 * Uses private Storefront token on server-side or public token where appropriate.
 */
export async function shopifyFetch<T>({
  query,
  variables,
  cache = "no-store",
  revalidate = 0,
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  if (!isShopifyConfigured()) {
    throw new Error(
      "Shopify Storefront credentials not configured (SHOPIFY_SHOP / SHOPIFY_STOREFRONT_ACCESS_TOKEN)"
    );
  }

  const domain = getDomain();
  const apiVersion = getShopifyApiVersion();
  const endpoint = `https://${domain.replace(/^https?:\/\//, "")}/api/${apiVersion}/graphql.json`;

  const privateToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (privateToken) {
    if (privateToken.startsWith("shpat_")) {
      headers["Shopify-Storefront-Private-Token"] = privateToken;
    } else {
      headers["X-Shopify-Storefront-Access-Token"] = privateToken;
    }
  } else if (publicToken) {
    headers["X-Shopify-Storefront-Access-Token"] = publicToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: cache === "no-store" ? "no-store" : undefined,
      next: cache !== "no-store" ? { revalidate, tags } : undefined,
    });

    const body = await response.json();

    if (body.errors) {
      console.error("Shopify Storefront GraphQL errors:", body.errors);
      throw new Error(body.errors[0]?.message || "Shopify Storefront GraphQL request failed");
    }

    return {
      status: response.status,
      body,
    };
  } catch (error) {
    console.error("Shopify Storefront API fetch error:", error);
    throw error;
  }
}
