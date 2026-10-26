// BHAYA INDIA — Category definitions backed by comprehensive taxonomy
import { CATEGORIES_TAXONOMY, CategoryDef, SubcategoryDef } from "@/lib/taxonomy";

export interface Category {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  tagline: string;
  taglineHi?: string;
  description: string;
  descriptionHi?: string;
  image: string;
  productCount: number; // Dynamically populated from Shopify, default 0
  subcategories: string[];
  subcategoriesHi?: string[];
}

// Convert taxonomy into legacy Category list for backward compatibility
export const categories: Category[] = CATEGORIES_TAXONOMY.map((c) => ({
  id: c.id,
  name: c.name_en,
  nameHi: c.name_hi,
  slug: c.slug,
  tagline: c.tagline_en,
  taglineHi: c.tagline_hi,
  description: c.description_en,
  descriptionHi: c.description_hi,
  image: c.image,
  productCount: 0, // Dynamic; no hardcoded fake counts
  subcategories: c.subcategories.map((s) => s.name_en),
  subcategoriesHi: c.subcategories.map((s) => s.name_hi),
}));

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const direct = categories.find((c) => c.slug === slug);
  if (direct) return direct;

  const compatMap: Record<string, string> = {
    "puja-samagri": "festival",
    "festival-decoration": "festival",
    "wedding-marriage-items": "festival",
    "handicraft": "manufacturing",
    "home-decoration": "retail",
    "gift-items": "festival",
    "household-products": "retail",
    "other-categories": "ecommerce",
    "textiles-fabrics": "ecommerce",
    "stationery-office": "retail",
    "gift-hampers": "festival",
    "packaging-paper-products": "packaging",
  };

  const mapped = compatMap[slug];
  if (mapped) return categories.find((c) => c.slug === mapped);
  return undefined;
};

export { CATEGORIES_TAXONOMY };
export type { CategoryDef, SubcategoryDef };
