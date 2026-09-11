// BHAYA INDIA — Products Data

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  tagline: string;
  description: string;
  images: string[];
  price: number | null; // null = Get Quote
  priceNote?: string;
  specs: ProductSpec[];
  features: string[];
  isFeatured: boolean;
  isNew?: boolean;
  inStock: boolean;
  minOrder?: number;
  sku: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Premium Banarasi Silk Saree",
    slug: "premium-banarasi-silk-saree",
    category: "Textiles & Fabrics",
    categorySlug: "textiles-fabrics",
    subcategory: "Sarees",
    tagline: "Heritage weave, contemporary grace",
    description: "Handwoven Banarasi silk saree with traditional zari work border. A timeless piece that blends heritage craftsmanship with refined contemporary taste. Suitable for weddings, festivals and formal occasions.",
    images: ["/assets/category-textiles.jpg"],
    price: 3800,
    priceNote: "Per piece",
    specs: [
      { label: "Material", value: "Pure Silk" },
      { label: "Length", value: "6.5 metres" },
      { label: "Blouse Piece", value: "Included" },
      { label: "Care", value: "Dry Clean Only" },
    ],
    features: [
      "Handwoven Banarasi technique",
      "Traditional zari border",
      "Rich pallu design",
      "Blouse piece included",
    ],
    isFeatured: true,
    isNew: false,
    inStock: true,
    sku: "BI-TX-001",
  },
  {
    id: "prod-002",
    name: "Leather-Bound Premium Notebook",
    slug: "leather-bound-premium-notebook",
    category: "Stationery & Office",
    categorySlug: "stationery-office",
    subcategory: "Notebooks",
    tagline: "Write your story with intention",
    description: "Crafted with a genuine leather cover and acid-free ivory pages, this premium notebook is designed for professionals and creatives who value quality in every detail.",
    images: ["/assets/category-stationery.jpg"],
    price: 650,
    priceNote: "Per piece",
    specs: [
      { label: "Cover", value: "Genuine Leather" },
      { label: "Pages", value: "200 ruled pages" },
      { label: "Size", value: "A5 (148 × 210mm)" },
      { label: "Paper", value: "90 GSM Acid-Free" },
    ],
    features: [
      "Genuine leather cover",
      "Lay-flat binding",
      "Ribbon bookmark",
      "Custom embossing available",
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: "BI-ST-002",
  },
  {
    id: "prod-003",
    name: "Corporate Festival Hamper",
    slug: "corporate-festival-hamper",
    category: "Gift Hampers",
    categorySlug: "gift-hampers",
    subcategory: "Corporate Gifts",
    tagline: "Thoughtful gifting made effortless",
    description: "A premium curated hamper for corporate gifting — includes artisanal sweets, quality stationery, and artisan homeware. Customisable branding available for orders of 25+.",
    images: ["/assets/hero-editorial.jpg"],
    price: null,
    priceNote: "Get Quote",
    specs: [
      { label: "Contents", value: "5–8 curated items" },
      { label: "Packaging", value: "Premium gift box" },
      { label: "Branding", value: "Custom available (25+ pcs)" },
      { label: "Delivery", value: "Pan-India" },
    ],
    features: [
      "Curated premium contents",
      "Custom brand printing",
      "Premium gift packaging",
      "Bulk pricing available",
    ],
    isFeatured: true,
    inStock: true,
    minOrder: 1,
    sku: "BI-GH-003",
  },
  {
    id: "prod-004",
    name: "Premium Wireless Earphones",
    slug: "premium-wireless-earphones",
    category: "Electronics & Accessories",
    categorySlug: "electronics-accessories",
    subcategory: "Audio",
    tagline: "Immersive sound, all day comfort",
    description: "Quality wireless earphones with active noise cancellation, 30-hour battery life and premium sound drivers. Ideal for professionals and everyday use.",
    images: ["/assets/category-stationery.jpg"],
    price: 2200,
    priceNote: "Per piece",
    specs: [
      { label: "Battery", value: "30 hours" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Noise Cancellation", value: "Active (ANC)" },
      { label: "Warranty", value: "1 Year" },
    ],
    features: [
      "Active noise cancellation",
      "30-hour battery life",
      "Quick charge 15 min",
      "Foldable design",
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: "BI-EL-004",
  },
  {
    id: "prod-005",
    name: "Handcrafted Brass Diya Set",
    slug: "handcrafted-brass-diya-set",
    category: "Home & Lifestyle",
    categorySlug: "home-lifestyle",
    subcategory: "Décor",
    tagline: "Light your home with tradition",
    description: "Set of four handcrafted brass diyas with intricate traditional patterns. Each piece is individually finished by skilled artisans, making every set uniquely beautiful.",
    images: ["/assets/category-textiles.jpg"],
    price: 880,
    priceNote: "Set of 4",
    specs: [
      { label: "Material", value: "Pure Brass" },
      { label: "Finish", value: "Antique Polish" },
      { label: "Size", value: "3–5 inches (assorted)" },
      { label: "Set Contains", value: "4 pieces" },
    ],
    features: [
      "Handcrafted by artisans",
      "Traditional motifs",
      "Antique brass finish",
      "Gift box packaging",
    ],
    isFeatured: true,
    inStock: true,
    sku: "BI-HL-005",
  },
  {
    id: "prod-006",
    name: "Bulk Cotton Dress Material Pack",
    slug: "bulk-cotton-dress-material-pack",
    category: "Wholesale & Bulk",
    categorySlug: "wholesale-bulk",
    subcategory: "Bulk Orders",
    tagline: "Quality at scale",
    description: "Wholesale pack of premium cotton dress materials in assorted prints. Ideal for retailers, boutiques and institutions. Custom colour and print selection available on bulk orders.",
    images: ["/assets/category-textiles.jpg"],
    price: null,
    priceNote: "Get Quote",
    specs: [
      { label: "Pack Size", value: "50 pieces" },
      { label: "Material", value: "100% Cotton" },
      { label: "GSM", value: "120 GSM" },
      { label: "Min Order", value: "50 pcs" },
    ],
    features: [
      "Wholesale pricing",
      "Assorted prints available",
      "Custom colour selection",
      "Pan-India delivery",
    ],
    isFeatured: true,
    inStock: true,
    minOrder: 50,
    sku: "BI-WB-006",
  },
];

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.isFeatured);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (categorySlug: string): Product[] =>
  products.filter((p) => p.categorySlug === categorySlug);
