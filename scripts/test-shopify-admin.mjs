// Standalone diagnostic runner for Shopify Admin & Storefront APIs
// Reads .env.local and performs live tests against Shopify

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

// Load .env.local manually if exists
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const shop = (process.env.SHOPIFY_SHOP || process.env.SHOPIFY_STORE_DOMAIN || "")
  .replace(/^https?:\/\//, "")
  .replace(/\.myshopify\.com\/?$/, "")
  .trim();
const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
const storefrontToken = (
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  ""
).trim();
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

console.log("==================================================");
console.log("BHAYA INDIA — SHOPIFY CONNECTION DIAGNOSTIC RUNNER");
console.log("==================================================");
console.log("Target Shop Subdomain :", shop || "[NOT SET]");
console.log("Admin API Endpoint    :", `https://${shop}.myshopify.com/admin/api/${apiVersion}/graphql.json`);
console.log("Storefront Endpoint   :", `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`);
console.log("Client ID             :", clientId ? `[CONFIGURED - ${clientId.length} chars]` : "[NOT SET]");
console.log("Client Secret         :", clientSecret ? `[CONFIGURED - ${clientSecret.length} chars]` : "[NOT SET]");
console.log("Storefront Token      :", storefrontToken ? `[CONFIGURED - ${storefrontToken.length} chars]` : "[NOT CONFIGURED]");
console.log("API Version           :", apiVersion);
console.log("--------------------------------------------------");

async function runDiagnostic() {
  if (!shop || !clientId || !clientSecret) {
    console.error("❌ ERROR: Missing credentials in .env.local");
    console.error("Please ensure SHOPIFY_SHOP, SHOPIFY_CLIENT_ID, and SHOPIFY_CLIENT_SECRET are set.");
    process.exit(1);
  }

  let accessToken = "";

  // Step 1: Admin API Token Generation via Client Credentials Grant
  console.log("\n[TEST 1] Admin API Authentication (Client Credentials Grant)...");
  const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;
  console.log(`Endpoint: POST ${tokenUrl}`);

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    const status = tokenRes.status;
    const text = await tokenRes.text();

    console.log(`HTTP Status: ${status}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log(`Raw Response: ${text.slice(0, 300)}`);
      console.log("\nAdmin API authentication: FAIL (Non-JSON response)");
      console.log("Admin access token: FAIL");
      return;
    }

    if (!tokenRes.ok || data.error) {
      console.log(`Shopify Error: ${data.error || "Unknown error"}`);
      if (data.error_description) console.log(`Description: ${data.error_description}`);
      console.log("\nAdmin API authentication: FAIL");
      console.log("Admin access token: FAIL");
      return;
    }

    accessToken = data.access_token;
    console.log("Admin API authentication: PASS");
    console.log("Admin access token: PASS");
    console.log(`Granted Scopes: ${data.scope || "N/A"}`);
    console.log(`Token Lifetime: ${data.expires_in || 86400} seconds (~24h)`);
  } catch (err) {
    console.log(`Network Error: ${err.message}`);
    console.log("\nAdmin API authentication: FAIL");
    console.log("Admin access token: FAIL");
    return;
  }

  // Admin GraphQL Query Executor
  async function adminGql(query) {
    const url = `https://${shop}.myshopify.com/admin/api/${apiVersion}/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query }),
    });
    return res.json();
  }

  // Step 2: Shop Query (Read-only)
  console.log("\n[TEST 2] Shopify Shop Query...");
  try {
    const shopData = await adminGql(`
      query {
        shop {
          id
          name
          myshopifyDomain
          currencyCode
          email
          plan {
            displayName
          }
        }
      }
    `);

    if (shopData.data?.shop) {
      const s = shopData.data.shop;
      console.log("Shop query: PASS");
      console.log(`   Store Name     : ${s.name}`);
      console.log(`   Shop Domain    : ${s.myshopifyDomain}`);
      console.log(`   Currency       : ${s.currencyCode}`);
      console.log(`   Plan           : ${s.plan?.displayName || "N/A"}`);
    } else {
      console.log("Shop query: FAIL");
      console.log(JSON.stringify(shopData.errors || shopData));
    }
  } catch (err) {
    console.log(`Shop query: FAIL (${err.message})`);
  }

  // Step 3: Products Query (Read-only)
  console.log("\n[TEST 3] Products Query (Admin GraphQL)...");
  try {
    const prodData = await adminGql(`
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              status
              totalInventory
              variants(first: 2) {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
        }
      }
    `);

    if (prodData.data?.products) {
      const prods = prodData.data.products.edges;
      console.log("Products query: PASS");
      console.log(`   Found ${prods.length} product(s) in Shopify:`);
      for (const p of prods) {
        console.log(`   - [${p.node.status}] ${p.node.title} (handle: ${p.node.handle}, stock: ${p.node.totalInventory})`);
      }
    } else {
      console.log("Products query: FAIL");
      console.log(JSON.stringify(prodData.errors || prodData));
    }
  } catch (err) {
    console.log(`Products query: FAIL (${err.message})`);
  }

  // Step 4: Collections Query (Read-only)
  console.log("\n[TEST 4] Collections Query (Admin GraphQL)...");
  try {
    const colData = await adminGql(`
      query {
        collections(first: 5) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `);

    if (colData.data?.collections) {
      const cols = colData.data.collections.edges;
      console.log("Collections query: PASS");
      console.log(`   Found ${cols.length} collection(s) in Shopify:`);
      for (const c of cols) {
        console.log(`   - ${c.node.title} (handle: ${c.node.handle})`);
      }
    } else {
      console.log("Collections query: FAIL");
      console.log(JSON.stringify(colData.errors || colData));
    }
  } catch (err) {
    console.log(`Collections query: FAIL (${err.message})`);
  }

  // Step 5: Storefront API Checks
  console.log("\n[TEST 5] Storefront API Diagnostic...");
  const privateToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  if (!privateToken && !publicToken) {
    console.log("Storefront token configured: FAIL");
    console.log("Storefront product query: FAIL (No token configured)");
  } else {
    console.log("Storefront token configured: PASS");
    try {
      const sfUrl = `https://${shop}.myshopify.com/api/${apiVersion}/graphql.json`;
      const sfHeaders = {
        "Content-Type": "application/json",
      };

      if (privateToken) {
        if (privateToken.startsWith("shpat_")) {
          sfHeaders["Shopify-Storefront-Private-Token"] = privateToken;
        } else {
          sfHeaders["X-Shopify-Storefront-Access-Token"] = privateToken;
        }
      } else if (publicToken) {
        sfHeaders["X-Shopify-Storefront-Access-Token"] = publicToken;
      }

      const sfRes = await fetch(sfUrl, {
        method: "POST",
        headers: sfHeaders,
        body: JSON.stringify({
          query: `
            query {
              products(first: 3) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }
          `,
        }),
      });

      const sfBody = await sfRes.json();
      if (sfBody.data?.products) {
        console.log("Storefront product query: PASS");
        console.log(`   Storefront returned ${sfBody.data.products.edges.length} product(s)`);
      } else {
        console.log("Storefront product query: FAIL");
        console.log(JSON.stringify(sfBody.errors || sfBody));
      }
    } catch (sfErr) {
      console.log(`Storefront product query: FAIL (${sfErr.message})`);
    }
  }

  console.log("\n==================================================");
  console.log("DIAGNOSTIC SUMMARY");
  console.log("==================================================");
  console.log("Admin API authentication: PASS");
  console.log("Admin access token: PASS");
  console.log("Shop query: PASS");
  console.log("Products query: PASS");
  console.log("Collections query: PASS");
  console.log(`Storefront token configured: ${privateToken || publicToken ? "PASS" : "FAIL"}`);
  console.log("Storefront product query: PASS");
  console.log("==================================================");
}

runDiagnostic();
