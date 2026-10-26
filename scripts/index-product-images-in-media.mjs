import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");
const productsDir = path.join(process.cwd(), "public", "assets", "products");

const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
if (!db.media) db.media = [];

const existingUrls = new Set(db.media.map((m) => m.url));

const files = fs.readdirSync(productsDir);
let addedCount = 0;

for (const file of files) {
  if (file.endsWith(".webp")) continue; // Index primarily JPG/PNG for clean media listing
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const url = `/assets/products/${file}`;
  if (existingUrls.has(url)) continue;

  const stat = fs.statSync(path.join(productsDir, file));
  const baseName = path.basename(file, ext);
  const cleanTitle = baseName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  db.media.push({
    id: `media-prod-${baseName}`,
    filename: file,
    originalName: cleanTitle,
    fileType: ext === ".png" ? "image/png" : "image/jpeg",
    dimensions: "1200 × 1200 px",
    fileSize: stat.size,
    url,
    altEn: `${cleanTitle} — BHAYA INDIA Authentic Handicraft`,
    altHi: `${cleanTitle} — भाया इंडिया प्रामाणिक उत्पाद`,
    title: cleanTitle,
    caption: `Authentic verified catalogue product photo for ${cleanTitle}.`,
    usage: "Product Catalogue & Gallery",
    uploadedAt: new Date().toISOString(),
  });

  existingUrls.add(url);
  addedCount++;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
console.log(`Indexed ${addedCount} authentic product images into Media Library. Total media assets: ${db.media.length}`);
