import fs from "fs";

const db = JSON.parse(fs.readFileSync("data/db.json", "utf-8"));
const report = [];

report.push(`Total Products: ${db.products.length}`);
db.products.forEach((p, idx) => {
  report.push(`${idx + 1}. ID: ${p.id} | SKU: ${p.sku}`);
  report.push(`   Name: ${p.name}`);
  report.push(`   Category: ${p.category} (${p.categorySlug}) | Subcategory: ${p.subcategory}`);
  report.push(`   Images: ${JSON.stringify(p.images)}`);
  report.push(`   Price: ${p.price} | Stock: ${p.stockQuantity ?? p.inStock} | Status: ${p.status ?? (p.isPublished ? 'published' : 'draft')}`);
  report.push(`---`);
});

fs.writeFileSync("scripts/product_inventory.txt", report.join("\n"), "utf-8");
console.log("Wrote scripts/product_inventory.txt");
