import fs from "fs";

const db = JSON.parse(fs.readFileSync("data/db.json", "utf-8"));

console.log("=== ALL PRODUCTS IN DB (Total: " + db.products.length + ") ===");
for (let i = 0; i < db.products.length; i++) {
  const p = db.products[i];
  console.log((i + 1) + ". [" + p.id + "] " + p.name);
  console.log("   Category: " + p.category + " | Slug: " + p.categorySlug + " | Sub: " + p.subcategory);
  console.log("   Price: " + p.price + " | SKU: " + p.sku + " | Status: " + p.status);
  console.log("   Images: " + JSON.stringify(p.images));
}

console.log("\n=== CATEGORIES AUDIT ===");
db.categories.forEach((c, idx) => {
  const publishedCount = db.products.filter(p => p.categorySlug === c.slug && (p.isPublished !== false && p.status !== "draft" && p.status !== "archived")).length;
  const totalCount = db.products.filter(p => p.categorySlug === c.slug).length;
  console.log(`${idx + 1}. [${c.id}] ${c.name} (slug: ${c.slug})`);
  console.log(`   Image: ${c.image}`);
  console.log(`   Stored productCount: ${c.productCount} | Actual in DB: ${totalCount} (Published: ${publishedCount})`);
  console.log(`   Subcategories: ${JSON.stringify(c.subcategories)}`);
});
