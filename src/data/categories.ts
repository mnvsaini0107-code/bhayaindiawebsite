// BHAYA INDIA — Categories Data

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  productCount: number;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: "cat-01",
    name: "Textiles & Fabrics",
    slug: "textiles-fabrics",
    tagline: "Woven with care",
    description: "Premium Indian textiles — sarees, dress materials, ready-made garments and fine fabrics sourced with quality assurance.",
    image: "/assets/category-textiles.jpg",
    productCount: 68,
    subcategories: ["Sarees", "Dress Materials", "Ready-made", "Suiting Fabrics"],
  },
  {
    id: "cat-02",
    name: "Stationery & Office",
    slug: "stationery-office",
    tagline: "Built for productivity",
    description: "Quality stationery, office essentials and premium writing instruments for individuals, schools and businesses.",
    image: "/assets/category-stationery.jpg",
    productCount: 42,
    subcategories: ["Notebooks", "Pens & Pencils", "Office Supplies", "Packaging"],
  },
  {
    id: "cat-03",
    name: "Gift Hampers",
    slug: "gift-hampers",
    tagline: "Curated with meaning",
    description: "Thoughtfully assembled gift hampers for festivals, corporate events and personal occasions.",
    image: "/assets/hero-editorial.jpg",
    productCount: 24,
    subcategories: ["Corporate Gifts", "Festival Hampers", "Personal Gifts", "Custom Hampers"],
  },
  {
    id: "cat-04",
    name: "Electronics & Accessories",
    slug: "electronics-accessories",
    tagline: "Connected, always",
    description: "Quality consumer electronics and accessories — earphones, charging solutions and smart home devices.",
    image: "/assets/category-stationery.jpg",
    productCount: 35,
    subcategories: ["Audio", "Charging", "Smart Home", "Mobile Accessories"],
  },
  {
    id: "cat-05",
    name: "Home & Lifestyle",
    slug: "home-lifestyle",
    tagline: "Elevate your space",
    description: "Artisan and quality homeware — from kitchen essentials to decorative pieces for the modern Indian home.",
    image: "/assets/category-textiles.jpg",
    productCount: 51,
    subcategories: ["Kitchen", "Décor", "Wellness", "Storage"],
  },
  {
    id: "cat-06",
    name: "Wholesale & Bulk",
    slug: "wholesale-bulk",
    tagline: "Scale your business",
    description: "Wholesale pricing on quality goods for retailers, resellers, institutions and large organisations.",
    image: "/assets/hero-editorial.jpg",
    productCount: 120,
    subcategories: ["Bulk Orders", "Institutional", "Reseller", "Custom Branding"],
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
