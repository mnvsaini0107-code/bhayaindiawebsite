import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[match[1].trim()] = val;
    }
  }
}

const shop = (process.env.SHOPIFY_SHOP || "a3g0h2-ss").replace(/^https?:\/\//, "").replace(/\.myshopify\.com\/?$/, "");
const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-07";

async function main() {
  const tokenUrl = `https://${shop}.myshopify.com/admin/oauth/access_token`;
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;
  console.log("Token acquired, scopes:", tokenData.scope);

  const themesRes = await fetch(`https://${shop}.myshopify.com/admin/api/${apiVersion}/themes.json`, {
    headers: { "X-Shopify-Access-Token": token }
  });
  const themesData = await themesRes.json();
  console.log("Themes on shop:", JSON.stringify(themesData, null, 2));
}

main().catch(console.error);
