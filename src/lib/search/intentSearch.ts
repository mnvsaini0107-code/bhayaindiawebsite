// BHAYA INDIA — Intelligent Intent-Aware Search & Relevance Ranking Engine
// Re-exports and compatibility bridge for the modular search engine.

export * from "./types";
export * from "./normalization";
export * from "./intentAliases";
export * from "./relevance";
export * from "./suggestions";
export * from "./engine";

import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { executeSearch } from "./engine";
import type { SearchExecutionResult } from "./types";

export interface SearchIntentResult {
  query: string;
  matchedCategory: {
    slug: string;
    name_en: string;
    name_hi: string;
  } | null;
  matchedSubcategories: Array<{
    slug: string;
    name_en: string;
    name_hi: string;
    parentSlug: string;
  }>;
  relatedSearches: string[];
  products: BhayaShopifyProduct[];
  totalFound: number;
}

export function executeIntentSearch(
  query: string,
  catalog: BhayaShopifyProduct[]
): SearchIntentResult {
  const result: SearchExecutionResult = executeSearch(query, catalog);

  return {
    query: result.query,
    matchedCategory: result.matchedCategory
      ? {
          slug: result.matchedCategory.slug,
          name_en: result.matchedCategory.name_en,
          name_hi: result.matchedCategory.name_hi,
        }
      : null,
    matchedSubcategories: result.matchedSubcategories.map((s) => ({
      slug: s.slug,
      name_en: s.name_en,
      name_hi: s.name_hi,
      parentSlug: s.parentSlug,
    })),
    relatedSearches: result.relatedSearches,
    products: result.products,
    totalFound: result.totalFound,
  };
}

export function scoreAndRankProducts(
  products: BhayaShopifyProduct[],
  query: string,
  ..._rest: unknown[]
): BhayaShopifyProduct[] {
  const result = executeSearch(query, products);
  return result.products;
}
