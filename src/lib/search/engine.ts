// BHAYA INDIA — Unified Search Execution Engine
// Combines intent parsing, category/subcategory discovery, Shopify catalog querying,
// 10-tier relevance ranking, filters, and multilingual awareness.

import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { CATEGORIES_TAXONOMY, findCategoryBySlug } from "@/lib/taxonomy";
import { SEARCH_INTENT_CLUSTERS, SearchIntentCluster } from "./intentAliases";
import {
  normalizeString,
  detectLanguage,
  extractMeaningfulTokens,
  getExpandedTokens,
  PHONETIC_TRANSLITERATION_MAP,
} from "./normalization";
import { rankProductsByRelevance } from "./relevance";
import type {
  SearchIntentAnalysis,
  SearchFilters,
  SearchExecutionResult,
  MatchedCategoryInfo,
  MatchedSubcategoryInfo,
} from "./types";

export function analyzeSearchIntent(query: string): SearchIntentAnalysis {
  const normQuery = normalizeString(query);
  const detectedLanguage = detectLanguage(query);

  if (!normQuery) {
    return {
      rawQuery: query,
      normalizedQuery: "",
      detectedLanguage,
      matchedCategory: null,
      matchedSubcategories: [],
      synonyms: [],
      relatedSearches: [],
      isFutureCategory: false,
    };
  }



  let matchedCluster: SearchIntentCluster | null = null;
  let isFutureCategory = false;
  let futureCategoryName: { en: string; hi: string } | undefined;

  // 1. Match against Search Intent Clusters
  for (const cluster of SEARCH_INTENT_CLUSTERS) {
    const isDirectMatch = cluster.aliases.some((alias) => {
      const normAlias = normalizeString(alias);
      return (
        normAlias === normQuery ||
        normQuery.startsWith(normAlias) ||
        normQuery.includes(normAlias) ||
        normAlias.includes(normQuery)
      );
    });

    if (isDirectMatch) {
      matchedCluster = cluster;
      if (cluster.isFutureCategory) {
        isFutureCategory = true;
        futureCategoryName = cluster.parentCategoryName;
      }
      break;
    }
  }

  // 2. Detect Category from Core Taxonomy
  let matchedCategory: MatchedCategoryInfo | null = null;

  if (matchedCluster) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === matchedCluster!.parentCategorySlug);
    if (taxCat) {
      matchedCategory = {
        id: taxCat.id,
        slug: taxCat.slug,
        name_en: taxCat.name_en,
        name_hi: taxCat.name_hi,
        tagline_en: taxCat.tagline_en,
        tagline_hi: taxCat.tagline_hi,
        image: taxCat.image,
        status: taxCat.status,
        shopifyCollectionHandle: taxCat.shopifyCollectionHandle,
      };
    } else if (matchedCluster.isFutureCategory) {
      matchedCategory = {
        id: `cat-${matchedCluster.parentCategorySlug}`,
        slug: matchedCluster.parentCategorySlug,
        name_en: matchedCluster.parentCategoryName.en,
        name_hi: matchedCluster.parentCategoryName.hi,
        status: "coming_soon",
      };
    }
  }

  if (!matchedCategory) {
    for (const cat of CATEGORIES_TAXONOMY) {
      const catEn = normalizeString(cat.name_en);
      const catHi = normalizeString(cat.name_hi);
      if (
        normQuery === cat.slug ||
        normQuery === catEn ||
        normQuery === catHi ||
        cat.searchAliases.some((alias) => {
          const normA = normalizeString(alias);
          return normA === normQuery || normQuery.includes(normA) || normA.includes(normQuery);
        })
      ) {
        matchedCategory = {
          id: cat.id,
          slug: cat.slug,
          name_en: cat.name_en,
          name_hi: cat.name_hi,
          tagline_en: cat.tagline_en,
          tagline_hi: cat.tagline_hi,
          image: cat.image,
          status: cat.status,
          shopifyCollectionHandle: cat.shopifyCollectionHandle,
        };
        break;
      }
    }
  }

  // 3. Detect Subcategories from Taxonomy
  const matchedSubcategories: MatchedSubcategoryInfo[] = [];

  for (const cat of CATEGORIES_TAXONOMY) {
    for (const sub of cat.subcategories) {
      const subEn = normalizeString(sub.name_en);
      const subHi = normalizeString(sub.name_hi);
      const isSubMatch =
        normQuery === sub.slug ||
        normQuery === subEn ||
        normQuery === subHi ||
        sub.searchAliases.some((alias) => {
          const normA = normalizeString(alias);
          return normA === normQuery || normQuery.includes(normA) || normA.includes(normQuery);
        });

      if (isSubMatch) {
        matchedSubcategories.push({
          id: sub.id,
          slug: sub.slug,
          name_en: sub.name_en,
          name_hi: sub.name_hi,
          parentSlug: sub.parentSlug,
          status: sub.status,
          shopifyCollectionHandle: sub.shopifyCollectionHandle,
        });

        if (!matchedCategory) {
          matchedCategory = {
            id: cat.id,
            slug: cat.slug,
            name_en: cat.name_en,
            name_hi: cat.name_hi,
            tagline_en: cat.tagline_en,
            tagline_hi: cat.tagline_hi,
            image: cat.image,
            status: cat.status,
            shopifyCollectionHandle: cat.shopifyCollectionHandle,
          };
        }
      }
    }
  }

  if (matchedCluster?.subcategorySlug) {
    for (const cat of CATEGORIES_TAXONOMY) {
      const sub = cat.subcategories.find((s) => s.slug === matchedCluster!.subcategorySlug);
      if (sub && !matchedSubcategories.some((s) => s.slug === sub.slug)) {
        matchedSubcategories.unshift({
          id: sub.id,
          slug: sub.slug,
          name_en: sub.name_en,
          name_hi: sub.name_hi,
          parentSlug: sub.parentSlug,
          status: sub.status,
          shopifyCollectionHandle: sub.shopifyCollectionHandle,
        });
        if (!matchedCategory) {
          matchedCategory = {
            id: cat.id,
            slug: cat.slug,
            name_en: cat.name_en,
            name_hi: cat.name_hi,
            tagline_en: cat.tagline_en,
            tagline_hi: cat.tagline_hi,
            image: cat.image,
            status: cat.status,
            shopifyCollectionHandle: cat.shopifyCollectionHandle,
          };
        }
        break;
      }
    }
  }

  // If a Category was matched directly (e.g. "Festival"), populate its primary subcategories
  if (matchedCategory && matchedSubcategories.length === 0) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === matchedCategory!.slug);
    if (taxCat && taxCat.subcategories.length > 0) {
      for (const sub of taxCat.subcategories.slice(0, 9)) {
        matchedSubcategories.push({
          id: sub.id,
          slug: sub.slug,
          name_en: sub.name_en,
          name_hi: sub.name_hi,
          parentSlug: sub.parentSlug,
          status: sub.status,
          shopifyCollectionHandle: sub.shopifyCollectionHandle,
        });
      }
    }
  }

  // 4. Collect Synonyms & Related Searches
  const relatedSet = new Set<string>();

  if (matchedCluster) {
    matchedCluster.relatedTerms.forEach((t) => relatedSet.add(t));
  }

  // Check phonetic transliteration dictionary
  for (const [key, variants] of Object.entries(PHONETIC_TRANSLITERATION_MAP)) {
    const normKey = normalizeString(key);
    if (normKey === normQuery || normQuery.includes(normKey) || normKey.includes(normQuery)) {
      variants.forEach((v) => relatedSet.add(v));
    }
  }

  if (matchedCategory) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === matchedCategory!.slug);
    if (taxCat) {
      taxCat.relatedTerms.slice(0, 6).forEach((t) => relatedSet.add(t));
    }
  }

  for (const sub of matchedSubcategories.slice(0, 4)) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === sub.parentSlug);
    const taxSub = taxCat?.subcategories.find((s) => s.slug === sub.slug);
    if (taxSub) {
      taxSub.relatedTerms.slice(0, 4).forEach((t) => relatedSet.add(t));
    }
  }

  // Filter out exact query from related searches
  const relatedSearches = Array.from(relatedSet)
    .filter((s) => normalizeString(s) !== normQuery)
    .slice(0, 8);

  const synonyms = matchedCluster ? matchedCluster.aliases : [];

  return {
    rawQuery: query,
    normalizedQuery: normQuery,
    detectedLanguage,
    matchedCategory,
    matchedSubcategories,
    synonyms,
    relatedSearches,
    isFutureCategory,
    futureCategoryName,
  };
}

/**
 * Execute search query against live Shopify catalog with filters and relevance ranking
 */
export function executeSearch(
  query: string,
  catalog: BhayaShopifyProduct[],
  filters?: SearchFilters
): SearchExecutionResult {
  const normQuery = normalizeString(query);
  const intent = analyzeSearchIntent(query);

  const queryTokens = extractMeaningfulTokens(normQuery);
  const expandedTokens = getExpandedTokens(normQuery);

  const allAliases = intent.synonyms;
  if (intent.matchedCategory) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === intent.matchedCategory!.slug);
    if (taxCat) {
      allAliases.push(...taxCat.searchAliases);
    }
  }
  for (const sub of intent.matchedSubcategories) {
    const taxCat = CATEGORIES_TAXONOMY.find((c) => c.slug === sub.parentSlug);
    const taxSub = taxCat?.subcategories.find((s) => s.slug === sub.slug);
    if (taxSub) {
      allAliases.push(...taxSub.searchAliases);
    }
  }

  // 1. Initial Filtering by explicit filter parameters (if provided)
  const candidateProducts = catalog.filter((product) => {
    // Explicit Category filter
    if (filters?.category && filters.category !== "all") {
      const targetCat = findCategoryBySlug(filters.category);
      if (targetCat) {
        const allowedSlugs = new Set([targetCat.slug, ...targetCat.subcategories.map((s) => s.slug)]);
        const matches =
          allowedSlugs.has(product.categorySlug) ||
          product.category.toLowerCase() === targetCat.name_en.toLowerCase() ||
          (product.categoryHi && product.categoryHi.toLowerCase() === targetCat.name_hi.toLowerCase());
        if (!matches) return false;
      } else if (product.categorySlug !== filters.category) {
        return false;
      }
    }

    // Explicit Subcategory filter
    if (filters?.subcat && filters.subcat !== "all") {
      const sub = filters.subcat.toLowerCase();
      const matches =
        product.subcategory.toLowerCase() === sub ||
        (product.subcategoryHi && product.subcategoryHi.toLowerCase() === sub);
      if (!matches) return false;
    }

    // Availability filter
    if (filters?.availability === "in-stock" && !product.inStock) {
      return false;
    }

    // Price slab filter
    if (filters?.price) {
      if (filters.price === "under-1000") {
        if (product.price === null || product.price >= 1000) return false;
      } else if (filters.price === "1000-3000") {
        if (product.price === null || product.price < 1000 || product.price > 3000) return false;
      } else if (filters.price === "above-3000") {
        if (product.price === null || product.price <= 3000) return false;
      } else if (filters.price === "quote") {
        if (product.price !== null) return false;
      }
    }

    return true;
  });

  // 2. Score and Rank candidates if search query exists
  let ranked: BhayaShopifyProduct[] = [];

  if (normQuery) {
    ranked = rankProductsByRelevance(candidateProducts, {
      normQuery,
      queryTokens,
      expandedTokens,
      matchedCategory: intent.matchedCategory,
      matchedSubcategories: intent.matchedSubcategories,
      allAliases,
      relatedTerms: intent.relatedSearches,
    });
  } else {
    ranked = [...candidateProducts];
  }

  // 3. Apply Sorting
  if (filters?.sort === "price-low") {
    ranked.sort((a, b) => (a.price || 999999) - (b.price || 999999));
  } else if (filters?.sort === "price-high") {
    ranked.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (filters?.sort === "newest") {
    ranked.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filters?.sort === "featured") {
    ranked.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return {
    query,
    matchedCategory: intent.matchedCategory,
    matchedSubcategories: intent.matchedSubcategories,
    relatedSearches: intent.relatedSearches,
    products: ranked,
    totalFound: ranked.length,
    isShopify: isShopifyConfigured(),
    isFutureCategory: intent.isFutureCategory,
    futureCategoryName: intent.futureCategoryName,
  };
}
