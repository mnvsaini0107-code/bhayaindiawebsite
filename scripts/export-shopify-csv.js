const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");
const OUTPUT_CSV_PATH = path.join(__dirname, "..", "data", "shopify_products_import.csv");

function escapeCsv(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function runExport() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("data/db.json not found!");
    process.exit(1);
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const db = JSON.parse(raw);
  const products = db.products || [];

  const headers = [
    "Handle",
    "Title",
    "Body (HTML)",
    "Vendor",
    "Product Category",
    "Type",
    "Tags",
    "Published",
    "Option1 Name",
    "Option1 Value",
    "Variant SKU",
    "Variant Grams",
    "Variant Inventory Tracker",
    "Variant Inventory Qty",
    "Variant Inventory Policy",
    "Variant Fulfillment Service",
    "Variant Price",
    "Variant Requires Shipping",
    "Variant Taxable",
    "Image Src",
    "Image Position",
    "SEO Title",
    "SEO Description",
    "Status"
  ];

  const rows = [headers.map(escapeCsv).join(",")];

  for (const p of products) {
    const handle = p.slug;
    const title = p.name;
    const vendor = "BHAYA INDIA";
    const type = p.category;
    
    // Construct rich HTML body with tagline, description, features and specifications
    let bodyHtml = `<p><strong>${p.tagline || ""}</strong></p>\n<p>${p.description || ""}</p>`;
    if (p.features && p.features.length > 0) {
      bodyHtml += `\n<h3>Key Features</h3>\n<ul>\n${p.features.map(f => `  <li>${f}</li>`).join("\n")}\n</ul>`;
    }
    if (p.specs && p.specs.length > 0) {
      bodyHtml += `\n<h3>Specifications</h3>\n<table>\n${p.specs.map(s => `  <tr><td><strong>${s.label}</strong></td><td>${s.value}</td></tr>`).join("\n")}\n</table>`;
    }

    const tagsList = [
      p.categorySlug,
      p.subcategory ? p.subcategory.toLowerCase().replace(/\s+/g, "-") : "",
      p.isFeatured ? "featured" : "",
      p.isNew ? "new" : "",
      "bhaya-india"
    ].filter(Boolean).join(", ");

    const published = "true";
    const option1Name = "Title";
    const option1Value = "Default Title";
    const sku = p.sku || `BI-${p.id}`;
    const grams = "500";
    const tracker = "shopify";
    const qty = p.inStock ? "50" : "0";
    const policy = "deny";
    const fulfillment = "manual";
    const price = p.price !== null ? p.price.toString() : "0";
    const requiresShipping = "true";
    const taxable = "true";
    const imageSrc = (p.images && p.images[0]) ? p.images[0] : "";
    const imagePos = "1";
    const seoTitle = p.seoTitle || `${p.name} — Bhaya India`;
    const seoDesc = p.seoDescription || p.description;
    const status = "active";

    const row = [
      handle,
      title,
      bodyHtml,
      vendor,
      type,
      type,
      tagsList,
      published,
      option1Name,
      option1Value,
      sku,
      grams,
      tracker,
      qty,
      policy,
      fulfillment,
      price,
      requiresShipping,
      taxable,
      imageSrc,
      imagePos,
      seoTitle,
      seoDesc,
      status
    ];

    rows.push(row.map(escapeCsv).join(","));
  }

  fs.writeFileSync(OUTPUT_CSV_PATH, rows.join("\n"), "utf-8");
  console.log(`Successfully generated Shopify Import CSV with ${products.length} products at: ${OUTPUT_CSV_PATH}`);
}

runExport();
