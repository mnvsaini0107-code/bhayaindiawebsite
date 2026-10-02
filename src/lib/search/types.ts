// BHAYA INDIA — Search System Type Definitions
// Supports multilingual indexing, intent clustering, category mapping, and ranking.

import type { BhayaShopifyProduct } from "@/lib/shopify/types";

export type SupportedSearchLanguage =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "gu"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "pa"
  | "or"
  | "as";

export interface MatchedCategoryInfo {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  tagline_en?: string;
  tagline_hi?: string;
  image?: string;
  status: "active" | "coming_soon";
  shopifyCollectionHandle?: string;
}

export interface MatchedSubcategoryInfo {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  parentSlug: string;
  status: "active" | "coming_soon";
  shopifyCollectionHandle?: string;
}

export interface SearchIntentAnalysis {
  rawQuery: string;
  normalizedQuery: string;
  detectedLanguage: SupportedSearchLanguage;
  matchedCategory: MatchedCategoryInfo | null;
  matchedSubcategories: MatchedSubcategoryInfo[];
  synonyms: string[];
  relatedSearches: string[];
  isFutureCategory: boolean;
  futureCategoryName?: { en: string; hi: string };
}

export interface SearchFilters {
  category?: string;
  subcat?: string;
  price?: "all" | "under-1000" | "1000-3000" | "above-3000" | "quote";
  availability?: "all" | "in-stock";
  sort?: "relevance" | "featured" | "price-low" | "price-high" | "newest";
}

export interface ScoredProductResult {
  product: BhayaShopifyProduct;
  score: number;
  matchReasons: string[];
}

export interface SearchExecutionResult {
  query: string;
  matchedCategory: MatchedCategoryInfo | null;
  matchedSubcategories: MatchedSubcategoryInfo[];
  relatedSearches: string[];
  products: BhayaShopifyProduct[];
  totalFound: number;
  isShopify: boolean;
  isFutureCategory?: boolean;
  futureCategoryName?: { en: string; hi: string };
}

export interface SearchSuggestionItem {
  id: string;
  title: string;
  titleHi?: string;
  type: "query" | "category" | "subcategory" | "product";
  url: string;
  subtitle?: string;
  image?: string;
  price?: number | null;
  categoryTag?: string;
}
