// scripts/correct-images-and-categories.mjs
// Corrects product images, assigns authentic photos to real categories,
// adds review workflow statuses, updates category cover images, and computes true product counts.

import fs from "fs";
import path from "path";

const dbPath = path.resolve("data", "db.json");
const bakPath = path.resolve("data", "db.json.pre-image-fix.bak");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// 1. Create a safe backup before modifications
fs.writeFileSync(bakPath, JSON.stringify(db, null, 2), "utf-8");
console.log(`Created backup at: ${bakPath}`);

// 2. Verified authentic products mapped to real photos in /public/assets/products/
const authenticNewProducts = [
  {
    id: "prod-ps-001",
    name: "Artisanal Puja Kalash & Thali Ritual Ensemble",
    nameHi: "प्रामाणिक पूजा कलश एवं थाली सेट",
    slug: "artisanal-puja-kalash-thali-ensemble",
    category: "Puja Samagri",
    categoryHi: "पूजा सामग्री",
    categorySlug: "puja-samagri",
    subcategory: "Brassware & Diyas",
    subcategoryHi: "पीतल बर्तन एवं दीये",
    tagline: "Hand-embossed auspicious brass kalash with ceremonial ritual thali",
    taglineHi: "पूजा एवं अनुष्ठान हेतु पवित्र हस्तनिर्मित कलश व थाली सेट",
    description: "Handcrafted traditional ceremonial puja ensemble comprising an ornate brass kalash with coconut-and-leaf motif, decorated ritual thali, brass incense holder, and sacred kumkum bowls. Built for daily worship, temple ceremonies, and Griha Pravesh rituals.",
    descriptionHi: "पारंपरिक पूजा कलश एवं थाली का संपूर्ण सेट। नित्य पूजा, गृह प्रवेश एवं अनुष्ठान हेतु शुद्ध धातु से निर्मित।",
    images: ["/assets/products/puja-kalash-and-thali-ensemble.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 25,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: true,
    isPublished: true,
    inStock: true,
    sku: "BI-PS-001",
    specs: [
      { label: "Material", value: "Pure Brass & Bell Metal" },
      { label: "Set Components", value: "Kalash, Puja Thali, Diya, Bell, Bowls" },
      { label: "Usage", value: "Mandir Worship, Festivals, Griha Pravesh" },
    ],
    features: [
      "Traditional hammer-beaten metalwork",
      "Corrosion-resistant protective coating",
      "Balanced wide rim for mango leaves placement",
    ],
    benefits: [
      "Authentic spiritual presence in your home mandir",
      "Durable heirloom craftsmanship",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-ps-002",
    name: "Royal Puja Thali & Chowki Set",
    nameHi: "रॉयल पूजा थाली एवं चौकी सेट",
    slug: "royal-puja-thali-chowki-set",
    category: "Puja Samagri",
    categoryHi: "पूजा सामग्री",
    categorySlug: "puja-samagri",
    subcategory: "Brassware & Diyas",
    subcategoryHi: "पीतल बर्तन एवं दीये",
    tagline: "Elaborately engraved brass thali set with devotional chowki stand",
    taglineHi: "भव्य नक्काशीदार पूजा थाली एवं देव चौकी",
    description: "Ornate ritual worship plate with intricate floral rim engravings, accompanied by traditional brass cups and oil lamp. Sourced directly from hereditary brass metalworkers.",
    descriptionHi: "बारीक नक्काशी से सुसज्जित पीतल पूजा थाली। सुंदर डिज़ाइन एवं पूजा सामग्री रखने के लिए आदर्श।",
    images: ["/assets/products/royal-puja-thali-chowki.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 30,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: false,
    isPublished: true,
    inStock: true,
    sku: "BI-PS-002",
    specs: [
      { label: "Material", value: "Engraved Brass" },
      { label: "Diameter", value: "11 Inches" },
    ],
    features: ["Floral laser filigree edge", "Sturdy elevated base"],
    benefits: ["Elevates mandir aesthetic", "Easy to clean and maintain"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-ps-003",
    name: "Handcrafted Emerald Green Moti Kalash",
    nameHi: "हस्तनिर्मित हरा मोती पूजा कलश",
    slug: "handcrafted-emerald-green-moti-kalash",
    category: "Puja Samagri",
    categoryHi: "पूजा सामग्री",
    categorySlug: "puja-samagri",
    subcategory: "Brassware & Diyas",
    subcategoryHi: "पीतल बर्तन एवं दीये",
    tagline: "Lustrous emerald green beaded sacred kalash with golden accents",
    taglineHi: "सुंदर हरे मोती एवं सुनहरी सजावट वाला पूजा कलश",
    description: "Auspicious ceremonial kalash hand-wrapped with high-lustre emerald green beads, pearl strings, and golden filigree rims. Ideal for festive mandap placement and sacred offerings.",
    descriptionHi: "हरे मोतियों एवं सुनहरे काम से सुसज्जित पवित्र कलश। मंदिर एवं मांगलिक आयोजनों के लिए।",
    images: ["/assets/products/handcrafted-green-moti-kalash.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 40,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: false,
    isPublished: true,
    inStock: true,
    sku: "BI-PS-003",
    specs: [{ label: "Material", value: "Brass with Glass Moti Inlay" }],
    features: ["Handcrafted bead detailing", "Auspicious colourway"],
    benefits: ["Eye-catching altar centerpiece"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-wm-001",
    name: "Heritage Vivah Soop Ceremonial Collection",
    nameHi: "विरासती विवाह सूप संग्रह",
    slug: "heritage-vivah-soop-ceremonial-collection",
    category: "Wedding & Marriage Items",
    categoryHi: "विवाह एवं मांगलिक सामग्री",
    categorySlug: "wedding-marriage-items",
    subcategory: "Ritual Essentials",
    subcategoryHi: "मांगलिक रस्म सामग्री",
    tagline: "Authentic hand-decorated bamboo vivah soop set for wedding rituals",
    taglineHi: "पारंपरिक विवाह रस्मों हेतु हस्तसज्जित विवाह सूप",
    description: "Set of traditional ceremonial marriage soop woven from mature bamboo, embellished with auspicious red and gold brocade lace, handcrafted gota-patti motifs, and auspicious Shubh Vivah calligraphy. Essential for Indian bridal and groom ritual ceremonies.",
    descriptionHi: "बांस से निर्मित एवं गोटा-पत्ती, लेस और शुभ विवाह श्लोकों से सजा विवाह सूप। भारतीय शादी की रस्मों हेतु अनिवार्य।",
    images: [
      "/assets/products/traditional-vivah-soop-collection.jpg",
      "/assets/products/traditional-vivah-soop-ensemble.jpg",
      "/assets/products/wedding-soop-decoration.jpg"
    ],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 50,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: true,
    isPublished: true,
    inStock: true,
    sku: "BI-WM-001",
    specs: [
      { label: "Material", value: "Natural Bamboo & Embroidered Fabric" },
      { label: "Set", value: "Set of 2 Ceremonial Trays" },
      { label: "Occasion", value: "Indian Weddings, Shagun, Rasm" },
    ],
    features: ["Authentic hereditary craftsmanship", "Vibrant festive borders"],
    benefits: ["Cherished keepsake from traditional wedding rituals"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-wm-002",
    name: "Traditional Shubh Vivah Soop & Okhali Wedding Set",
    nameHi: "पारंपरिक शुभ विवाह सूप एवं ओखली सेट",
    slug: "shubh-vivah-soop-okhali-wedding-set",
    category: "Wedding & Marriage Items",
    categoryHi: "विवाह एवं मांगलिक सामग्री",
    categorySlug: "wedding-marriage-items",
    subcategory: "Ritual Essentials",
    subcategoryHi: "मांगलिक रस्म सामग्री",
    tagline: "Complete ceremonial marriage set with handpainted okhali & matching soop",
    taglineHi: "विवाह की हल्दी-मटकोड़ रस्म हेतु सूप व ओखली का सुंदर सेट",
    description: "Complete marriage ritual set including decorated vivah soop, handpainted ceremonial wooden okhali, and matching musal bat. Handcrafted by master artisans for Haldi and Vivah rites.",
    descriptionHi: "शादी की रस्मों हेतु विशेष सूप एवं नक्काशीदार लकड़ी की ओखली।",
    images: [
      "/assets/products/shubh-vivah-soop-okhali-set.jpg",
      "/assets/products/shubh-vivah-soop-tray.jpg"
    ],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 35,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: true,
    isPublished: true,
    inStock: true,
    sku: "BI-WM-002",
    specs: [{ label: "Craft", value: "Handpainted Wood & Decorated Bamboo" }],
    features: ["Complete wedding ceremonial pair", "Festive red-yellow palette"],
    benefits: ["All-in-one authentic wedding ritual package"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-wm-003",
    name: "Swastika Tassel Vivah Soop",
    nameHi: "स्वस्तिक लटकन विवाह सूप",
    slug: "swastika-tassel-vivah-soop",
    category: "Wedding & Marriage Items",
    categoryHi: "विवाह एवं मांगलिक सामग्री",
    categorySlug: "wedding-marriage-items",
    subcategory: "Ritual Essentials",
    subcategoryHi: "मांगलिक रस्म सामग्री",
    tagline: "Ceremonial wedding bamboo tray with auspicious Swastika symbol and fringe",
    taglineHi: "शुभ स्वस्तिक एवं सुनहरी लटकन से सजी शादी की छाज",
    description: "Handcrafted wedding bamboo tray featuring central sacred Swastika artwork, surrounded by gold zari trim and red silk pom-pom tassels.",
    descriptionHi: "स्वस्तिक चिह्न और सुनहरी लेस से सुसज्जित विवाह सूप।",
    images: ["/assets/products/swastika-tassel-vivah-soop.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 40,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: false,
    isPublished: true,
    inStock: true,
    sku: "BI-WM-003",
    specs: [{ label: "Symbol", value: "Sacred Vedic Swastika" }],
    features: ["Handcrafted fringe tassels", "Lightweight natural bamboo"],
    benefits: ["Auspicious blessings for new beginnings"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-hc-001",
    name: "Handpainted Wooden Vivah Okhali & Musal",
    nameHi: "हस्तचित्रित काष्ठ विवाह ओखली",
    slug: "handpainted-wooden-vivah-okhali",
    category: "Handicraft",
    categoryHi: "हस्तशिल्प",
    categorySlug: "handicraft",
    subcategory: "Wood Crafts",
    subcategoryHi: "काष्ठ शिल्प",
    tagline: "Artisan-turned solid wood miniature okhali with ceremonial folk painting",
    taglineHi: "कारीगरों द्वारा निर्मित नक्काशीदार लकड़ी की ओखली",
    description: "Solid hardwood miniature mortar and pestle (okhali-musal) hand-lathed and painted with traditional Indian ceremonial wedding motifs in bright turmeric yellow, vermillion red, and emerald green.",
    descriptionHi: "पारंपरिक लकड़ी की ओखली, जिस पर भारतीय लोककला के सुंदर रंगों से चित्रकारी की गई है।",
    images: ["/assets/products/handpainted-wooden-okhali.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 45,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: true,
    isPublished: true,
    inStock: true,
    sku: "BI-HC-001",
    specs: [{ label: "Wood", value: "Seasoned Mango Wood" }],
    features: ["Lead-free organic colours", "Smooth lacquered finish"],
    benefits: ["Traditional folk art artifact"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-hd-001",
    name: "Auspicious Beaded Moti Kalash Showpiece",
    nameHi: "सजावटी मोती कलश शोपीस",
    slug: "auspicious-beaded-moti-kalash-showpiece",
    category: "Home Decoration",
    categoryHi: "घर की सजावट",
    categorySlug: "home-decoration",
    subcategory: "Brass Showpieces",
    subcategoryHi: "पीतल शोपीस",
    tagline: "Opulent home decor accent hand-beaded with lustrous glass pearls",
    taglineHi: "घर की सजावट हेतु आकर्षक मोतियों वाला कलश शोपीस",
    description: "Magnificent decorative vessel handcrafted with tiered golden and white glass pearl beadwork, topped with a ceremonial finial. Designed as an opulent interior showpiece for living rooms, entrances, and prayer spaces.",
    descriptionHi: "मोतियों की सुंदर कलाकृति से सुसज्जित सजावटी कलश। बैठक कक्ष एवं पूजा घर की शोभा बढ़ाने हेतु।",
    images: ["/assets/products/auspicious-moti-kalash.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 30,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: true,
    isPublished: true,
    inStock: true,
    sku: "BI-HD-001",
    specs: [{ label: "Material", value: "Metal Base with Beaded Mesh" }],
    features: ["Intricate hand-woven beads", "Weighted stable base"],
    benefits: ["Luxurious cultural accent for modern homes"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-gi-001",
    name: "Heart Rose Floral Presentation Frame",
    nameHi: "गुलाब फूल हार्ट फ्रेम उपहार",
    slug: "heart-rose-floral-presentation-frame",
    category: "Gift Items",
    categoryHi: "उपहार सामग्री",
    categorySlug: "gift-items",
    subcategory: "Festival Hampers",
    subcategoryHi: "त्योहार हैम्पर्स",
    tagline: "Romantic velvet rose floral garland wreath framed in heart silhouette",
    taglineHi: "गुलाब के सुंदर फूलों से निर्मित हार्ट उपहार फ्रेम",
    description: "Curated floral gift presentation crafted with velvety crimson roses and golden wire accents in a distinct heart wreath design. Suitable for weddings, anniversaries, and festive gifting.",
    descriptionHi: "गुलाब के सुंदर फूलों और सुनहरी तारों से सजा हार्ट फ्रेम। विवाह एवं उत्सव उपहार हेतु उपयुक्त।",
    images: ["/assets/products/heart-rose-floral-frame.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 40,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: false,
    isPublished: true,
    inStock: true,
    sku: "BI-GI-001",
    specs: [{ label: "Design", value: "Heart Floral Silhouette" }],
    features: ["Velvet-touch artificial blooms", "Lightweight suspension ring"],
    benefits: ["Timeless memorable gift item"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-hp-001",
    name: "Traditional Natural Bamboo Vivah Soop",
    nameHi: "प्राकृतिक बांस सूप (छाज)",
    slug: "traditional-natural-bamboo-vivah-soop",
    category: "Household Products",
    categoryHi: "घरेलू उत्पाद",
    categorySlug: "household-products",
    subcategory: "Kitchen Essentials",
    subcategoryHi: "रसोई उपयोगी वस्तुएं",
    tagline: "Hand-woven natural bamboo grain cleaning and ritual household soop",
    taglineHi: "शुद्ध बांस से बुना हुआ पारंपरिक सूप",
    description: "Authentic untreated natural bamboo soop (grain winnowing tray) woven by rural village artisans. Used for traditional culinary grain sorting as well as auspicious Chhath and marriage rituals.",
    descriptionHi: "प्राकृतिक बांस से निर्मित मजबूत एवं टिकाऊ सूप। अनाज साफ करने एवं छठ व विवाह पूजा हेतु उपयुक्त।",
    images: ["/assets/products/natural-bamboo-soop.jpg"],
    price: null,
    priceNote: "Price on Enquiry",
    stockQuantity: 60,
    status: "published",
    reviewStatus: "Approved",
    isFeatured: false,
    isPublished: true,
    inStock: true,
    sku: "BI-HP-001",
    specs: [{ label: "Material", value: "100% Biodegradable Bamboo" }],
    features: ["Tight artisan weave", "Splinter-free polished edges"],
    benefits: ["Eco-friendly and multi-functional household utility"],
    createdAt: new Date().toISOString(),
  },
];

// 3. Update existing 16 Garland products: ensure reviewStatus = "Approved" & status = "published"
const existingProducts = db.products || [];
for (const p of existingProducts) {
  p.status = p.status || "published";
  p.reviewStatus = p.reviewStatus || "Approved";
  p.isPublished = p.status === "published" || p.status === "approved";
}

// 4. Restore the 6 seed products (if missing), but set their status to "needs_review" and image to coming soon
const bakDb = fs.existsSync("data/db.json.bak")
  ? JSON.parse(fs.readFileSync("data/db.json.bak", "utf-8"))
  : null;

if (bakDb && bakDb.products) {
  const seedIds = ["prod-001", "prod-002", "prod-003", "prod-004", "prod-005", "prod-006"];
  for (const sId of seedIds) {
    const existing = existingProducts.find((p) => p.id === sId);
    if (!existing) {
      const fromBak = bakDb.products.find((p) => p.id === sId);
      if (fromBak) {
        // Correct placeholder image: use neutral "Image Coming Soon" placeholder instead of generic banners!
        fromBak.images = ["/assets/image-coming-soon.svg"];
        fromBak.status = "needs_review";
        fromBak.reviewStatus = "Needs Review";
        fromBak.isPublished = false; // Hidden from public storefront until reviewed with authentic photo
        fromBak.priceNote = "Pending Authentic Product Photo Review";
        existingProducts.push(fromBak);
      }
    } else {
      // If it exists but has generic banner, update to coming soon
      if (existing.images.some((img) => img.includes("category-") || img.includes("hero-editorial"))) {
        existing.images = ["/assets/image-coming-soon.svg"];
        existing.status = "needs_review";
        existing.reviewStatus = "Needs Review";
        existing.isPublished = false;
      }
    }
  }
}

// 5. Merge in the new authentic products (without duplicating)
for (const np of authenticNewProducts) {
  const idx = existingProducts.findIndex((p) => p.id === np.id || p.slug === np.slug);
  if (idx >= 0) {
    existingProducts[idx] = { ...existingProducts[idx], ...np };
  } else {
    existingProducts.push(np);
  }
}

db.products = existingProducts;

// 6. Fix Category cover images and calculate accurate dynamic product counts
const categoryImageMap = {
  "puja-samagri": "/assets/products/puja-kalash-and-thali-ensemble.jpg",
  "wedding-marriage-items": "/assets/products/traditional-vivah-soop-collection.jpg",
  "festival-decoration": "/assets/products/large-flower-garland-grand-tiered-festive.jpg",
  "handicraft": "/assets/products/handpainted-wooden-okhali.jpg",
  "home-decoration": "/assets/products/auspicious-moti-kalash.jpg",
  "gift-items": "/assets/products/heart-rose-floral-frame.jpg",
  "household-products": "/assets/products/natural-bamboo-soop.jpg",
  "puja-mala": "/assets/products/puja-mala-rose-yellow-pink.jpg",
  "bhagwan-jaymala": "/assets/products/bhagwan-jaymala-royal-blue-pearl.jpg",
  "large-flower-garlands": "/assets/products/large-flower-garland-grand-multicolour.jpg",
  "moti-mala": "/assets/products/moti-mala-emerald-green-crystal-pearl.jpg",
  "sherwani-mala": "/assets/products/sherwani-mala-peacock-brooch-detail.jpg",
  "groom-garland": "/assets/products/dulha-haar-kundan-floral-brooch.jpg",
};

const publishedCatalog = db.products.filter(
  (p) => p.isPublished !== false && p.status !== "draft" && p.status !== "archived" && p.status !== "needs_review" && p.status !== "unpublished"
);

for (const cat of db.categories) {
  if (categoryImageMap[cat.slug]) {
    cat.image = categoryImageMap[cat.slug];
  }
  // Calculate true published count
  const realCount = publishedCatalog.filter((p) => p.categorySlug === cat.slug).length;
  cat.productCount = realCount;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
console.log(`Successfully updated database:`);
console.log(`- Total products in db: ${db.products.length}`);
console.log(`- Publicly visible/approved products: ${publishedCatalog.length}`);
console.log(`- Categories updated with authentic cover images & real counts: ${db.categories.length}`);
