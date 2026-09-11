import fs from "fs";
import path from "path";

export * from "./types";
export * from "./site-config";
import type {
  Product,
  Category,
  Enquiry,
  Order,
  Testimonial,
  FAQ,
  GalleryItem,
  SiteSettings,
  PageContent,
} from "./types";

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  enquiries: Enquiry[];
  orders: Order[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  gallery: GalleryItem[];
  settings: SiteSettings;
  content: PageContent;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Default initial data
const initialData: DatabaseSchema = {
  settings: {
    businessName: "BHAYA INDIA",
    tagline: "जहाँ भाया, वहाँ भरोसा",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "contact@bhayaindia.com",
    address: "Bhaya India Commercial Tower, Main Market Road, New Delhi, 110001, India",
    businessHours: "Monday – Saturday: 9:30 AM – 7:00 PM IST",
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    },
    mapsEmbedUrl: "https://maps.google.com",
  },
  content: {
    hero: {
      eyebrow: "TRADITION MEETS EXCELLENCE",
      headline: "Quality Products. Uncompromising Trust.",
      subheadline:
        "Bhaya India delivers certified textiles, premium stationery, bespoke gift hampers and bulk goods with heritage craftsmanship and contemporary reliability across India.",
      ctaPrimaryText: "Explore Catalogue",
      ctaSecondaryText: "Enquire for Bulk",
    },
    brandStory: {
      eyebrow: "OUR JOURNEY",
      headline: "From a Trusted Local Counter to a Pan-India Enterprise",
      paragraph1:
        "Built on the foundational promise of 'जहाँ भाया, वहाँ भरोसा', Bhaya India started as a merchant family deeply rooted in customer trust, reliable sourcing, and honest pricing.",
      paragraph2:
        "Today, we bring that same personal commitment to our digital ecosystem — offering enterprises, retailers, and discerning individuals direct access to premium Indian craftsmanship.",
      stats: [
        { label: "Satisfied Clients", value: "10,000+" },
        { label: "Product Varieties", value: "250+" },
        { label: "Pan-India Pincodes", value: "19,000+" },
        { label: "Years of Trust", value: "25+" },
      ],
    },
    whyBhaya: {
      eyebrow: "WHY CHOOSE BHAYA INDIA",
      headline: "Built on Values That Stand the Test of Time",
      pillars: [
        {
          title: "Authentic Craftsmanship",
          desc: "Every product in our catalogue is sourced directly from vetted master weavers, craft houses, and certified manufacturers.",
          icon: "shield",
        },
        {
          title: "Honest & Transparent Value",
          desc: "No hidden surcharges. Direct factory-to-door pricing that honors both our artisans and our customers.",
          icon: "tag",
        },
        {
          title: "Comprehensive Range",
          desc: "From delicate Banarasi silks to corporate executive hampers and bulk stationery, discover curated variety under one roof.",
          icon: "layers",
        },
        {
          title: "Dedicated Client Concierge",
          desc: "Personalized assistance for corporate orders, custom branding, wholesale enquiries, and timely dispatch.",
          icon: "headset",
        },
      ],
    },
    sellerCta: {
      headline: "Partner With Bhaya India",
      body: "Are you a master manufacturer, textile artisan, or premium product creator? Expand your reach through Bhaya India's nationwide distribution network.",
      ctaText: "Become a Business Partner",
    },
    bhaya2: {
      headline: "Bhaya India 2.0 — The Future Vision",
      subheadline: "A Unified Multi-Vendor B2B & B2C Marketplace",
      body: "We are architecting the next generation of digital commerce — connecting verified regional manufacturers directly with bulk buyers, institutional clients, and global shoppers under the trusted umbrella of Bhaya India.",
    },
  },
  categories: [
    {
      id: "cat-1",
      name: "Textiles & Fabrics",
      slug: "textiles-fabrics",
      description: "Handcrafted sarees, pure silks, heritage shawls, and premium tailored linens.",
      image: "/assets/category-textiles.jpg",
      productCount: 48,
      subcategories: ["Sarees", "Silk Dupattas", "Handloom Shawls", "Unstitched Suits"],
    },
    {
      id: "cat-2",
      name: "Stationery & Office",
      slug: "stationery-office",
      description: "Fine leather journals, executive desk accessories, and corporate paper supplies.",
      image: "/assets/category-stationery.jpg",
      productCount: 36,
      subcategories: ["Notebooks", "Executive Pens", "Desk Organizers", "Paper Sets"],
    },
    {
      id: "cat-3",
      name: "Gift Hampers",
      slug: "gift-hampers",
      description: "Bespoke curated gifting for festive celebrations, weddings, and corporate recognition.",
      image: "/assets/hero-editorial.jpg",
      productCount: 24,
      subcategories: ["Corporate Gifts", "Festival Hampers", "Wedding Favours", "Custom Hampers"],
    },
    {
      id: "cat-4",
      name: "Home & Living",
      slug: "home-living",
      description: "Artisanal brassware, hand-carved accessories, and luxury home decor accents.",
      image: "/assets/hero-editorial.jpg",
      productCount: 42,
      subcategories: ["Brass Decor", "Bedding", "Tableware", "Artisanal Accents"],
    },
    {
      id: "cat-5",
      name: "Wholesale & Bulk",
      slug: "wholesale-bulk",
      description: "Institutional supply, commercial fabrics, corporate supplies, and bulk packaging.",
      image: "/assets/category-stationery.jpg",
      productCount: 65,
      subcategories: ["Institutional Textiles", "Bulk Stationery", "Custom Merchandise"],
    },
  ],
  products: [
    {
      id: "prod-001",
      name: "Premium Banarasi Silk Saree",
      slug: "premium-banarasi-silk-saree",
      category: "Textiles & Fabrics",
      categorySlug: "textiles-fabrics",
      subcategory: "Sarees",
      tagline: "Heritage weave, contemporary grace",
      description:
        "Handwoven Banarasi silk saree crafted with genuine gold-tone zari embellishment along the borders and ornate pallu. Blends timeless Indian craftsmanship with modern refinement, ideal for weddings, family milestones, and auspicious celebrations.",
      images: ["/assets/category-textiles.jpg"],
      price: 3800,
      priceNote: "Per piece (Inclusive of Taxes)",
      specs: [
        { label: "Material", value: "Pure Katan Silk" },
        { label: "Length", value: "6.5 metres (with blouse)" },
        { label: "Blouse Piece", value: "Included (0.8m)" },
        { label: "Weave Technique", value: "Kadhwa Handloom" },
        { label: "Care Instructions", value: "Dry Clean Only" },
      ],
      features: [
        "Pure mulberry silk foundation",
        "Authentic Banarasi Kadhwa weave",
        "Rich zari borders and heavy ornamental pallu",
        "Silk Mark certified quality assurance",
      ],
      benefits: [
        "Inheritance-grade longevity and natural silk lustre",
        "Lightweight drape for effortless evening wear",
        "Includes matched unstitched blouse piece",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-TX-001",
      seoTitle: "Premium Banarasi Silk Saree — Bhaya India",
      seoDescription: "Authentic handwoven Banarasi pure silk saree with zari border. Pan-India delivery from Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-002",
      name: "Leather-Bound Executive Notebook",
      slug: "leather-bound-executive-notebook",
      category: "Stationery & Office",
      categorySlug: "stationery-office",
      subcategory: "Notebooks",
      tagline: "Write your legacy with intention",
      description:
        "Handcrafted top-grain leather journal with 200 pages of 90 GSM archival-grade ivory paper. Featuring lay-flat bookbinding, gilded edge accents, and a satin bookmark ribbon. Built for leaders, thinkers, and discerning professionals.",
      images: ["/assets/category-stationery.jpg"],
      price: 650,
      priceNote: "Per piece (Bulk rates available)",
      specs: [
        { label: "Cover Material", value: "Genuine Full-Grain Leather" },
        { label: "Paper", value: "90 GSM Fountain-pen friendly Ivory" },
        { label: "Page Count", value: "200 Ruled Pages" },
        { label: "Dimensions", value: "A5 (148 × 210 mm)" },
        { label: "Binding", value: "Hand-stitched Lay-flat" },
      ],
      features: [
        "Supple genuine leather finish that patinas with age",
        "Zero bleed-through on fountain pens and rollers",
        "Integrated dual bookmark ribbons",
        "Custom hot-foil gold monogramming available on bulk orders",
      ],
      benefits: [
        "Elevates executive workspace aesthetic",
        "Resistant to environmental humidity and yellowing",
        "Ideal corporate executive gift",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: true,
      inStock: true,
      minOrder: 1,
      sku: "BI-ST-002",
      seoTitle: "Leather-Bound Executive Notebook — Bhaya India",
      seoDescription: "Fine genuine leather notebook with archival paper. Shop luxury office stationery at Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-003",
      name: "Royal Heritage Festival Hamper",
      slug: "royal-heritage-festival-hamper",
      category: "Gift Hampers",
      categorySlug: "gift-hampers",
      subcategory: "Festival Hampers",
      tagline: "Thoughtful gifting made effortless",
      description:
        "An opulent gift trunk handcrafted in wooden casing with gold-embossed faux leather trim. Includes artisanal saffron treats, stone-ground dry fruits, pure brass incense holder, hand-poured soy candle, and personalized greeting scroll.",
      images: ["/assets/hero-editorial.jpg"],
      price: 2450,
      priceNote: "Per hamper (Minimum order for customization: 15)",
      specs: [
        { label: "Trunk Dimensions", value: "32 × 24 × 12 cm" },
        { label: "Trunk Material", value: "Textured Vegan Leather & Brass Clasps" },
        { label: "Shelf Life", value: "6 Months for Food Items" },
        { label: "Packaging", value: "Individual air-sealed containers" },
      ],
      features: [
        "Curated assortment of premium dry fruits and sweets",
        "Brass handcrafted artifact for lasting keepsake",
        "Custom foil-stamped corporate company ribbon option",
        "Express temperature-controlled shipping",
      ],
      benefits: [
        "Leaves an unforgettable impression on clients and family",
        "Zero plastic presentation with reusable storage trunk",
        "Complete gifting solution ready to present",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: true,
      inStock: true,
      minOrder: 1,
      sku: "BI-GH-003",
      seoTitle: "Royal Heritage Festival Hamper — Bhaya India",
      seoDescription: "Luxury corporate and festive gifting hampers by Bhaya India. Nationwide delivery.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-004",
      name: "Handcrafted Brass Urli Bowl",
      slug: "handcrafted-brass-urli-bowl",
      category: "Home & Living",
      categorySlug: "home-living",
      subcategory: "Brass Decor",
      tagline: "Spiritual serenity in pure metal",
      description:
        "Traditional bell-metal brass urli bowl hand-beaten by hereditary artisans. Perfectly sized for floating flower petals, aromatic water, and tealights at the entrance of homes and luxury office receptions.",
      images: ["/assets/hero-editorial.jpg"],
      price: 1850,
      priceNote: "Per piece",
      specs: [
        { label: "Metal", value: "Virgin Cast Brass (85% Copper, 15% Zinc)" },
        { label: "Diameter", value: "12 inches (30 cm)" },
        { label: "Weight", value: "2.1 kg" },
        { label: "Finish", value: "Traditional Antique Gold Polish" },
      ],
      features: [
        "Hand-carved floral edge filigree",
        "Heavy stable base prevents tipping",
        "Coated with natural tarnish-resistant lacquer",
      ],
      benefits: [
        "Invokes traditional Vastu positive energy",
        "Timeless decorative centerpiece for living and dining areas",
        "Durable heirloom piece",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-HL-004",
      seoTitle: "Handcrafted Brass Urli Bowl — Bhaya India Home",
      seoDescription: "Pure brass hand-carved urli bowl for floating flowers. Buy authentic home decor at Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-005",
      name: "Chanderi Silk Cotton Dupatta",
      slug: "chanderi-silk-cotton-dupatta",
      category: "Textiles & Fabrics",
      categorySlug: "textiles-fabrics",
      subcategory: "Silk Dupattas",
      tagline: "Breezy elegance woven with grace",
      description:
        "Lightweight authentic Chanderi fabric combining raw silk warp with fine combed cotton weft. Embellished with delicate hand-block gold motifs (boota) and sheer pallu detailing.",
      images: ["/assets/category-textiles.jpg"],
      price: 1250,
      priceNote: "Per piece",
      specs: [
        { label: "Composition", value: "70% Cotton, 30% Silk" },
        { label: "Length", value: "2.5 metres" },
        { label: "Width", value: "36 inches" },
        { label: "Care", value: "Gentle Hand Wash or Dry Clean" },
      ],
      features: [
        "Authentic Madhya Pradesh Chanderi cluster weave",
        "Zari tissue borders",
        "Subtle shimmer in natural daylight",
      ],
      benefits: [
        "Comfortable for all-day festive wear in warm climates",
        "Pairs seamlessly with ethnic kurtas and fusion outfits",
      ],
      isFeatured: false,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-TX-005",
      seoTitle: "Chanderi Silk Cotton Dupatta — Bhaya India",
      seoDescription: "Authentic handwoven Chanderi dupatta with gold boota motifs. Bhaya India textiles.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-006",
      name: "Institutional Bulk Uniform Fabric",
      slug: "institutional-bulk-uniform-fabric",
      category: "Wholesale & Bulk",
      categorySlug: "wholesale-bulk",
      subcategory: "Institutional Textiles",
      tagline: "Industrial durability meets comfort",
      description:
        "High-density poly-viscose and combed cotton blended textiles tailored for institutional uniforms, corporate workforce attire, and hospitality garments. Available in roll bolts of 50m to 500m.",
      images: ["/assets/category-textiles.jpg"],
      price: null, // Get Quote
      priceNote: "Custom Quotation based on Meterage",
      specs: [
        { label: "Blend", value: "65% Poly, 35% Viscose" },
        { label: "GSM", value: "210 GSM" },
        { label: "Bolt Width", value: "58 inches (147 cm)" },
        { label: "Colour Fastness", value: "Grade 4.5 Certified" },
      ],
      features: [
        "Wrinkle-resistant and sweat-wicking breathability",
        "Tested for 100+ commercial wash cycles",
        "Custom Pantone dyeing available for 500m+ orders",
      ],
      benefits: [
        "Standardized color matching across repeated batch orders",
        "Direct mill pricing ensures optimal margin for institutions",
      ],
      isFeatured: false,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 50,
      sku: "BI-WB-006",
      seoTitle: "Institutional Bulk Uniform Fabric — Bhaya India Wholesale",
      seoDescription: "Commercial and institutional uniform textiles in bulk rolls. Request quotation from Bhaya India.",
      createdAt: new Date().toISOString(),
    },
  ],
  enquiries: [
    {
      id: "enq-101",
      name: "Rajesh Sharma",
      mobile: "+91 98200 12345",
      email: "rajesh@sharmatraders.in",
      productName: "Royal Heritage Festival Hamper",
      productId: "prod-003",
      quantity: 50,
      message: "Looking for 50 corporate Diwali gift hampers with custom company logo embossing. Need delivery in Mumbai by next month.",
      status: "In Progress",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "enq-102",
      name: "Pooja Verma",
      mobile: "+91 97111 89012",
      email: "pooja.v@delhidesigns.org",
      productName: "Premium Banarasi Silk Saree",
      productId: "prod-001",
      quantity: 5,
      message: "Interested in sample swatches for bridal orders. Please confirm if red and emerald green colourways are available.",
      status: "New",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  orders: [
    {
      id: "ORD-9012",
      customerName: "Ananya Gupta",
      email: "ananya.g@gmail.com",
      phone: "+91 98101 22334",
      address: "Flat 402, Lotus Heights, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      items: [
        {
          productId: "prod-002",
          name: "Leather-Bound Executive Notebook",
          price: 650,
          quantity: 2,
          image: "/assets/category-stationery.jpg",
        },
      ],
      totalAmount: 1300,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      orderStatus: "Processing",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  testimonials: [
    {
      id: "test-1",
      customerName: "Rameshwar Kulkarni",
      role: "Director of Procurement",
      company: "Kulkarni Retail & Logistics, Pune",
      review:
        "Bhaya India sets the benchmark for consistency. We ordered over 200 corporate festival hampers with custom branding. Every trunk arrived in pristine condition right on schedule. Truly 'जहाँ भाया, वहाँ भरोसा'.",
      rating: 5,
      photo: "",
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "test-2",
      customerName: "Sunita Agarwal",
      role: "Founder & Creative Lead",
      company: "Virasat Handlooms, Jaipur",
      review:
        "The authenticity of the Banarasi sarees from Bhaya India is unmatched. The silk feel, weight, and zari work exceeded our expectations. Our bridal clients were delighted.",
      rating: 5,
      photo: "",
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "test-3",
      customerName: "Vikram Singhania",
      role: "Operations Head",
      company: "Nexus Enterprises, Gurugram",
      review:
        "Sourcing uniform textiles and corporate stationery at scale used to be a hassle until we partnered with Bhaya India. Transparent quotes, fast logistics, and dependable team.",
      rating: 5,
      photo: "",
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "How do I place a bulk or corporate enquiry?",
      answer:
        "You can click 'Get Quote' or 'Enquire Now' on any product page, fill out the simple enquiry form, or reach out to our team directly via WhatsApp. Our corporate team typically responds with itemized pricing and timeline estimates within 2 to 4 business hours.",
      category: "Product",
      isPublished: true,
      sortOrder: 1,
    },
    {
      id: "faq-2",
      question: "Do you ship across all pincodes in India?",
      answer:
        "Yes. Bhaya India partners with premier logistics couriers covering over 19,000+ pincodes across urban and rural India, including express air transport for fragile and high-value orders.",
      category: "Delivery",
      isPublished: true,
      sortOrder: 2,
    },
    {
      id: "faq-3",
      question: "Can products be customized with our company branding?",
      answer:
        "Yes! We offer custom logo embossing, foil-stamping on leather stationery, customized gift hamper packaging, and tailored corporate message cards for qualifying minimum order quantities.",
      category: "Service",
      isPublished: true,
      sortOrder: 3,
    },
    {
      id: "faq-4",
      question: "What payment methods are supported on Bhaya India?",
      answer:
        "We support all major Indian payment channels including UPI (Google Pay, PhonePe, Paytm), Debit & Credit Cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and NEFT/RTGS for wholesale invoices.",
      category: "Payment",
      isPublished: true,
      sortOrder: 4,
    },
    {
      id: "faq-5",
      question: "What is Bhaya India's quality guarantee policy?",
      answer:
        "We stand by 'जहाँ भाया, वहाँ भरोसा'. Every piece undergoes multi-point inspection before dispatch. If an item arrives damaged or materially differs from specifications, we arrange immediate replacement or credit.",
      category: "General",
      isPublished: true,
      sortOrder: 5,
    },
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Handloom Weaving Workshop",
      url: "/assets/category-textiles.jpg",
      category: "Company",
      caption: "Master weavers working on traditional loom setups in Varanasi.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "gal-2",
      title: "Handcrafted Stationery Production",
      url: "/assets/category-stationery.jpg",
      category: "Products",
      caption: "Binding genuine leather journals and archival notebook covers.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "gal-3",
      title: "Festival Hamper Assembly",
      url: "/assets/hero-editorial.jpg",
      category: "Projects",
      caption: "Meticulous quality check and ribbon finishing for corporate clients.",
      createdAt: new Date().toISOString(),
    },
  ],
};

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, falling back to initialData:", err);
    return initialData;
  }
}

function writeDb(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}

// ------------------- PRODUCTS -------------------
export function getProducts(): Product[] {
  const db = ensureDb();
  return db.products || [];
}

export function getProductBySlug(slug: string): Product | undefined {
  const db = ensureDb();
  return db.products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const db = ensureDb();
  return db.products.find((p) => p.id === id);
}

export function createProduct(productData: Omit<Product, "id" | "createdAt">): Product {
  const db = ensureDb();
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  // Update category count
  const cat = db.categories.find((c) => c.slug === newProduct.categorySlug);
  if (cat) cat.productCount = (cat.productCount || 0) + 1;
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...updates };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = ensureDb();
  const product = db.products.find((p) => p.id === id);
  if (!product) return false;
  db.products = db.products.filter((p) => p.id !== id);
  const cat = db.categories.find((c) => c.slug === product.categorySlug);
  if (cat && cat.productCount > 0) cat.productCount -= 1;
  writeDb(db);
  return true;
}

// ------------------- CATEGORIES -------------------
export function getCategories(): Category[] {
  const db = ensureDb();
  return db.categories || [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = ensureDb();
  return db.categories.find((c) => c.slug === slug);
}

export function createCategory(catData: Omit<Category, "id" | "productCount">): Category {
  const db = ensureDb();
  const newCat: Category = {
    ...catData,
    id: `cat-${Date.now()}`,
    productCount: 0,
  };
  db.categories.push(newCat);
  writeDb(db);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const db = ensureDb();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...updates };
  writeDb(db);
  return db.categories[index];
}

export function deleteCategory(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- ENQUIRIES -------------------
export function getEnquiries(): Enquiry[] {
  const db = ensureDb();
  return db.enquiries || [];
}

export function createEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
  const db = ensureDb();
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  writeDb(db);
  return newEnquiry;
}

export function updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
  const db = ensureDb();
  const enq = db.enquiries.find((e) => e.id === id);
  if (!enq) return null;
  enq.status = status;
  writeDb(db);
  return enq;
}

// ------------------- ORDERS -------------------
export function getOrders(): Order[] {
  const db = ensureDb();
  return db.orders || [];
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
  const db = ensureDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${randomSuffix}`,
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(newOrder);
  writeDb(db);
  return newOrder;
}

export function updateOrderStatus(
  id: string,
  orderStatus?: Order["orderStatus"],
  paymentStatus?: Order["paymentStatus"]
): Order | null {
  const db = ensureDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  writeDb(db);
  return order;
}

// ------------------- TESTIMONIALS -------------------
export function getTestimonials(): Testimonial[] {
  const db = ensureDb();
  return db.testimonials || [];
}

export function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Testimonial {
  const db = ensureDb();
  const item: Testimonial = {
    ...data,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.testimonials.unshift(item);
  writeDb(db);
  return item;
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
  const db = ensureDb();
  const index = db.testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  db.testimonials[index] = { ...db.testimonials[index], ...updates };
  writeDb(db);
  return db.testimonials[index];
}

export function deleteTestimonial(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.testimonials.length;
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  if (db.testimonials.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- FAQS -------------------
export function getFaqs(): FAQ[] {
  const db = ensureDb();
  return db.faqs || [];
}

export function createFaq(data: Omit<FAQ, "id">): FAQ {
  const db = ensureDb();
  const item: FAQ = {
    ...data,
    id: `faq-${Date.now()}`,
  };
  db.faqs.push(item);
  writeDb(db);
  return item;
}

export function updateFaq(id: string, updates: Partial<FAQ>): FAQ | null {
  const db = ensureDb();
  const index = db.faqs.findIndex((f) => f.id === id);
  if (index === -1) return null;
  db.faqs[index] = { ...db.faqs[index], ...updates };
  writeDb(db);
  return db.faqs[index];
}

export function deleteFaq(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.faqs.length;
  db.faqs = db.faqs.filter((f) => f.id !== id);
  if (db.faqs.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- GALLERY -------------------
export function getGallery(): GalleryItem[] {
  const db = ensureDb();
  return db.gallery || [];
}

export function createGalleryItem(data: Omit<GalleryItem, "id" | "createdAt">): GalleryItem {
  const db = ensureDb();
  const item: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.gallery.unshift(item);
  writeDb(db);
  return item;
}

export function deleteGalleryItem(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  if (db.gallery.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- SETTINGS & CONTENT -------------------
export function getSiteSettings(): SiteSettings {
  const db = ensureDb();
  return db.settings || initialData.settings;
}

export function updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const db = ensureDb();
  db.settings = { ...db.settings, ...settings };
  writeDb(db);
  return db.settings;
}

export function getPageContent(): PageContent {
  const db = ensureDb();
  return db.content || initialData.content;
}

export function updatePageContent(content: Partial<PageContent>): PageContent {
  const db = ensureDb();
  db.content = { ...db.content, ...content };
  writeDb(db);
  return db.content;
}
