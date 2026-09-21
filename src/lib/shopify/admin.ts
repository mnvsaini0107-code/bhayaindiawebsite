// Server-Side Shopify Admin API Authentication & Operations
// Uses Shopify Client Credentials Grant (OAuth 2.0) with server-side token caching.
// NEVER import or run this in client-side React components!

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp (ms)
  scope?: string;
}

let tokenCache: TokenCache | null = null;

/**
 * Returns the normalized Shopify shop subdomain (without .myshopify.com)
 */
export function getShopifyShop(): string {
  const shop = process.env.SHOPIFY_SHOP || process.env.SHOPIFY_STORE_DOMAIN || "";
  return shop
    .replace(/^https?:\/\//, "")
    .replace(/\.myshopify\.com\/?$/, "")
    .trim();
}

/**
 * Returns the full Shopify myshopify.com domain
 */
export function getShopifyDomain(): string {
  const shop = getShopifyShop();
  if (shop) return `${shop}.myshopify.com`;
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .trim();
}

/**
 * Returns the configured Shopify API Version
 */
export function getShopifyApiVersion(): string {
  return process.env.SHOPIFY_API_VERSION || "2026-07";
}

/**
 * Checks if Admin API credentials are configured in the environment
 */
export function isShopifyAdminConfigured(): boolean {
  const shop = getShopifyShop();
  const hasClientCredentials = Boolean(
    process.env.SHOPIFY_CLIENT_ID?.trim() &&
    process.env.SHOPIFY_CLIENT_SECRET?.trim()
  );
  const hasLegacyToken = Boolean(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim());
  return Boolean(shop && (hasClientCredentials || hasLegacyToken));
}

/**
 * Securely obtains an Admin API access token using Shopify's Client Credentials Grant.
 * Caches the token in-memory and automatically refreshes it before expiration.
 */
export async function getAdminAccessToken(forceRefresh = false): Promise<string> {
  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
  const shop = getShopifyShop();

  // Support legacy static token fallback if client credentials are not configured
  if (!clientId || !clientSecret) {
    const legacyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
    if (legacyToken) return legacyToken;
    throw new Error(
      "Shopify Admin API credentials missing. Please configure SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET in .env.local"
    );
  }

  if (!shop) {
    throw new Error(
      "Shopify shop name missing. Please set SHOPIFY_SHOP in .env.local (e.g. SHOPIFY_SHOP=bhaya-india)"
    );
  }

  const now = Date.now();
  // Reuse cached token if it has more than 60 seconds of validity remaining
  if (!forceRefresh && tokenCache && tokenCache.expiresAt > now + 60 * 1000) {
    return tokenCache.accessToken;
  }

  const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;

  const bodyParams = new URLSearchParams();
  bodyParams.append("grant_type", "client_credentials");
  bodyParams.append("client_id", clientId);
  bodyParams.append("client_secret", clientSecret);

  let response: Response;
  try {
    response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: bodyParams.toString(),
      cache: "no-store",
    });
  } catch (netErr: unknown) {
    const msg = netErr instanceof Error ? netErr.message : String(netErr);
    throw new Error(`Failed to reach Shopify OAuth endpoint at ${tokenUrl}: ${msg}`);
  }

  const rawText = await response.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Shopify OAuth endpoint returned non-JSON (HTTP ${response.status}): ${rawText.slice(0, 300)}`
    );
  }

  if (!response.ok || data.error) {
    const err = String(data.error || `HTTP_${response.status}`);
    const desc = String(data.error_description || data.message || rawText);
    throw new Error(`Shopify OAuth error [${err}]: ${desc}`);
  }

  const token = data.access_token;
  if (!token || typeof token !== "string") {
    throw new Error(`Shopify OAuth response missing access_token: ${rawText}`);
  }

  const expiresIn = typeof data.expires_in === "number" ? data.expires_in : 86400;
  tokenCache = {
    accessToken: token,
    expiresAt: now + expiresIn * 1000,
    scope: typeof data.scope === "string" ? data.scope : undefined,
  };

  return tokenCache.accessToken;
}

/**
 * Executes a server-side Shopify Admin GraphQL query or mutation.
 */
export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ status: number; body: T }> {
  const shop = getShopifyShop();
  const apiVersion = getShopifyApiVersion();
  const token = await getAdminAccessToken();

  const endpoint = `https://${shop}.myshopify.com/admin/api/${apiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const body = await response.json();

  if (body.errors && body.errors.length > 0) {
    const errorMsg = body.errors.map((e: { message: string }) => e.message).join("; ");
    throw new Error(`Shopify Admin GraphQL error: ${errorMsg}`);
  }

  return {
    status: response.status,
    body,
  };
}

/**
 * Diagnostic interface for testing connection
 */
export interface ShopifyAdminDiagnostic {
  adminAuth: "PASS" | "FAIL";
  accessTokenObtained: "PASS" | "FAIL";
  shopQuery: "PASS" | "FAIL";
  productsQuery: "PASS" | "FAIL";
  collectionsQuery: "PASS" | "FAIL";
  shopInfo?: {
    id: string;
    name: string;
    email: string;
    myshopifyDomain: string;
    currencyCode: string;
    plan?: string;
  };
  productsCount?: number;
  collectionsCount?: number;
  sampleProducts?: Array<{
    id: string;
    title: string;
    handle: string;
    status: string;
    variantsCount: number;
    inventory: number;
  }>;
  sampleCollections?: Array<{
    id: string;
    title: string;
    handle: string;
  }>;
  scope?: string;
  error?: string;
}

/**
 * Read-only server-side diagnostic testing of Admin API connection.
 */
export async function testShopifyAdminConnection(): Promise<ShopifyAdminDiagnostic> {
  const result: ShopifyAdminDiagnostic = {
    adminAuth: "FAIL",
    accessTokenObtained: "FAIL",
    shopQuery: "FAIL",
    productsQuery: "FAIL",
    collectionsQuery: "FAIL",
  };

  try {
    // 1. Authenticate & Obtain token
    const token = await getAdminAccessToken();
    if (token) {
      result.adminAuth = "PASS";
      result.accessTokenObtained = "PASS";
      result.scope = tokenCache?.scope;
    }

    // 2. Query Shop details
    const shopQuery = `
      query getAdminShopDetails {
        shop {
          id
          name
          email
          myshopifyDomain
          currencyCode
          plan {
            displayName
            partnerDevelopment
          }
        }
      }
    `;

    const shopRes = await shopifyAdminFetch<{
      data: {
        shop: {
          id: string;
          name: string;
          email: string;
          myshopifyDomain: string;
          currencyCode: string;
          plan?: { displayName: string };
        };
      };
    }>({ query: shopQuery });

    if (shopRes.body.data?.shop) {
      result.shopQuery = "PASS";
      const s = shopRes.body.data.shop;
      result.shopInfo = {
        id: s.id,
        name: s.name,
        email: s.email,
        myshopifyDomain: s.myshopifyDomain,
        currencyCode: s.currencyCode,
        plan: s.plan?.displayName,
      };
    }

    // 3. Query Products (read test)
    const productsQuery = `
      query getAdminProducts {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              status
              totalInventory
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    sku
                  }
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const productsRes = await shopifyAdminFetch<{
      data: {
        products: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              status: string;
              totalInventory: number;
              variants: { edges: Array<unknown> };
            };
          }>;
        };
      };
    }>({ query: productsQuery });

    if (productsRes.body.data?.products) {
      result.productsQuery = "PASS";
      const edges = productsRes.body.data.products.edges;
      result.productsCount = edges.length;
      result.sampleProducts = edges.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
        status: e.node.status,
        variantsCount: e.node.variants?.edges?.length || 0,
        inventory: e.node.totalInventory || 0,
      }));
    }

    // 4. Query Collections (read test)
    const collectionsQuery = `
      query getAdminCollections {
        collections(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    const collectionsRes = await shopifyAdminFetch<{
      data: {
        collections: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
            };
          }>;
        };
      };
    }>({ query: collectionsQuery });

    if (collectionsRes.body.data?.collections) {
      result.collectionsQuery = "PASS";
      const edges = collectionsRes.body.data.collections.edges;
      result.collectionsCount = edges.length;
      result.sampleCollections = edges.map((e) => ({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
      }));
    }

    return result;
  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : String(err);
    return result;
  }
}

/**
 * Creates or updates a clearly identified test product via the Admin API.
 */
export async function createTestProduct(): Promise<{
  success: boolean;
  product?: { id: string; title: string; handle: string };
  error?: string;
}> {
  const mutation = `
    mutation createTestProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
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
          product: { id: string; title: string; handle: string; status: string } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: mutation,
      variables: {
        input: {
          title: "BHAYA INDIA — Verification Test Item (Temporary)",
          handle: "bhaya-india-verification-test-item",
          descriptionHtml: "<p>Automated connection verification item created by BHAYA INDIA backend.</p>",
          vendor: "BHAYA INDIA",
          productType: "Test Item",
          status: "DRAFT",
          tags: ["test-verification", "bhaya-india-test"],
        },
      },
    });

    if (body.data?.productCreate?.product) {
      return {
        success: true,
        product: body.data.productCreate.product,
      };
    }

    const errorMsg =
      body.data?.productCreate?.userErrors?.[0]?.message || "Failed to create test product";
    return { success: false, error: errorMsg };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Deletes a test product by ID
 */
export async function deleteTestProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const mutation = `
    mutation deleteProduct($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
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
        productDelete: {
          deletedProductId: string | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: mutation,
      variables: {
        input: { id },
      },
    });

    if (body.data?.productDelete?.deletedProductId) {
      return { success: true };
    }
    return {
      success: false,
      error: body.data?.productDelete?.userErrors?.[0]?.message || "Failed to delete test product",
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
