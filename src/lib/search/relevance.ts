// BHAYA INDIA — 10-Tier Search Relevance & Scoring Engine
// Strictly adheres to client-specified priority hierarchy:
// 1. Exact product title
// 2. Localized product title
// 3. Category
// 4. Subcategory
// 5. Collection
// 6. Search alias
// 7. Tags
// 8. Metafields
// 9. Description
// 10. Related terms

import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { normalizeString } from "./normalization";
import type { MatchedCategoryInfo, MatchedSubcategoryInfo, ScoredProductResult } from "./types";

interface ScoreContext {
  normQuery: string;
  queryTokens: string[];
  expandedTokens: string[];
  matchedCategory: MatchedCategoryInfo | null;
  matchedSubcategories: MatchedSubcategoryInfo[];
  allAliases: string[];
  relatedTerms: string[];
}

export function calculateProductRelevance(
  product: BhayaShopifyProduct,
  ctx: ScoreContext
): ScoredProductResult {
  const { normQuery, queryTokens, expandedTokens, matchedCategory, matchedSubcategories, allAliases, relatedTerms } = ctx;

  let score = 0;
  const matchReasons: string[] = [];

  const titleEn = normalizeString(product.name);
  const titleHi = normalizeString(product.nameHi || "");
  const catEn = normalizeString(product.category);
  const catHi = normalizeString(product.categoryHi || "");
  const catSlug = normalizeString(product.categorySlug || "");
  const subcatEn = normalizeString(product.subcategory);
  const subcatHi = normalizeString(product.subcategoryHi || "");
  const descEn = normalizeString(product.description || "");
  const descHi = normalizeString(product.descriptionHi || "");
  const taglineEn = normalizeString(product.tagline || "");
  const taglineHi = normalizeString(product.taglineHi || "");
  const sku = normalizeString(product.sku || "");

  // -------------------------------------------------------------
  // TIER 1: Exact Product Title (English / Primary)
  // -------------------------------------------------------------
  if (titleEn === normQuery || sku === normQuery) {
    score += 1000;
    matchReasons.push("Exact Title Match (EN)");
  } else if (titleEn.startsWith(normQuery)) {
    score += 650;
    matchReasons.push("Title Starts With Query (EN)");
  } else if (normQuery.length > 2 && titleEn.includes(normQuery)) {
    score += 450;
    matchReasons.push("Title Contains Query (EN)");
  }

  // -------------------------------------------------------------
  // TIER 2: Localized Product Title (Hindi)
  // -------------------------------------------------------------
  if (titleHi && normQuery) {
    if (titleHi === normQuery) {
      score += 850;
      matchReasons.push("Exact Localized Title Match (HI)");
    } else if (titleHi.startsWith(normQuery)) {
      score += 550;
      matchReasons.push("Localized Title Starts With (HI)");
    } else if (normQuery.length > 2 && titleHi.includes(normQuery)) {
      score += 380;
      matchReasons.push("Localized Title Contains (HI)");
    }
  }

  // -------------------------------------------------------------
  // TIER 3: Category Match
  // -------------------------------------------------------------
  const isDirectCatMatch =
    (matchedCategory && (catSlug === matchedCategory.slug || catEn === normalizeString(matchedCategory.name_en) || catHi === normalizeString(matchedCategory.name_hi))) ||
    catEn === normQuery ||
    catHi === normQuery ||
    catSlug === normQuery;

  if (isDirectCatMatch) {
    score += 300;
    matchReasons.push("Category Match");
  } else if (catEn.includes(normQuery) || catHi.includes(normQuery)) {
    score += 180;
    matchReasons.push("Category Partial Match");
  }

  // -------------------------------------------------------------
  // TIER 4: Subcategory Match
  // -------------------------------------------------------------
  const subcatMatched = matchedSubcategories.some(
    (sub) =>
      subcatEn === normalizeString(sub.name_en) ||
      subcatHi === normalizeString(sub.name_hi) ||
      subcatEn === sub.slug ||
      sub.slug === normQuery ||
      normalizeString(sub.name_en) === normQuery ||
      normalizeString(sub.name_hi) === normQuery
  );

  if (subcatMatched || subcatEn === normQuery || subcatHi === normQuery) {
    score += 250;
    matchReasons.push("Subcategory Match");
  } else if (normQuery.length > 2 && (subcatEn.includes(normQuery) || subcatHi.includes(normQuery))) {
    score += 150;
    matchReasons.push("Subcategory Partial Match");
  }

  // -------------------------------------------------------------
  // TIER 5: Collection Match
  // -------------------------------------------------------------
  if (
    (matchedCategory?.shopifyCollectionHandle && catSlug.includes(matchedCategory.shopifyCollectionHandle)) ||
    matchedSubcategories.some((s) => s.shopifyCollectionHandle && catSlug.includes(s.shopifyCollectionHandle))
  ) {
    score += 200;
    matchReasons.push("Shopify Collection Match");
  }

  // -------------------------------------------------------------
  // TIER 6: Search Alias Match
  // -------------------------------------------------------------
  let aliasMatched = false;
  for (const alias of allAliases) {
    const normAlias = normalizeString(alias);
    if (!normAlias) continue;

    if (normAlias === normQuery) {
      if (titleEn.includes(normAlias) || titleHi.includes(normAlias)) {
        score += 180;
        aliasMatched = true;
      } else if (subcatEn.includes(normAlias) || subcatHi.includes(normAlias)) {
        score += 120;
        aliasMatched = true;
      }
    } else if (titleEn.includes(normAlias) || titleHi.includes(normAlias)) {
      score += 90;
      aliasMatched = true;
    }
  }
  if (aliasMatched) {
    matchReasons.push("Search Intent Alias Match");
  }

  // -------------------------------------------------------------
  // TIER 7: Tags Match
  // -------------------------------------------------------------
  const tagsStr = (product.features || []).concat(product.featuresHi || []).join(" ").toLowerCase();
  for (const token of queryTokens) {
    if (tagsStr.includes(token)) {
      score += 70;
      matchReasons.push(`Tag Match: ${token}`);
    }
  }

  // -------------------------------------------------------------
  // TIER 8: Metafields (Tagline, Specifications, Benefits)
  // -------------------------------------------------------------
  const metafieldsText = [
    taglineEn,
    taglineHi,
    ...(product.specs || []).map((s) => `${s.label} ${s.value}`),
    ...(product.specsHi || []).map((s) => `${s.label} ${s.value}`),
    ...(product.benefits || []),
    ...(product.benefitsHi || []),
  ].join(" ").toLowerCase();

  if (normQuery.length > 2 && metafieldsText.includes(normQuery)) {
    score += 60;
    matchReasons.push("Metafields Exact Match");
  } else {
    for (const token of queryTokens) {
      if (metafieldsText.includes(token)) {
        score += 25;
      }
    }
  }

  // -------------------------------------------------------------
  // TIER 9: Description Match
  // -------------------------------------------------------------
  if (normQuery.length > 2) {
    if (descEn.includes(normQuery) || descHi.includes(normQuery)) {
      score += 40;
      matchReasons.push("Description Full Match");
    } else {
      let descTokenCount = 0;
      for (const token of queryTokens) {
        if (descEn.includes(token) || descHi.includes(token)) {
          descTokenCount++;
        }
      }
      if (descTokenCount > 0) {
        score += Math.min(descTokenCount * 10, 30);
      }
    }
  }

  // -------------------------------------------------------------
  // TIER 10: Related Terms Match
  // -------------------------------------------------------------
  for (const relTerm of relatedTerms) {
    const normRel = normalizeString(relTerm);
    if (!normRel) continue;
    if (titleEn.includes(normRel) || titleHi.includes(normRel)) {
      score += 35;
      matchReasons.push(`Related Term: ${relTerm}`);
      break;
    }
  }

  // -------------------------------------------------------------
  // Transliteration & Phonetic Expansion Bonus
  // -------------------------------------------------------------
  for (const expToken of expandedTokens) {
    if (expToken === normQuery) continue;
    if (titleEn.includes(expToken) || titleHi.includes(expToken)) {
      score += 40;
    } else if (subcatEn.includes(expToken) || subcatHi.includes(expToken)) {
      score += 25;
    }
  }

  // Word coverage multiplier: If product contains all meaningful query words, bonus
  if (queryTokens.length > 1) {
    const fullText = `${titleEn} ${titleHi} ${subcatEn} ${subcatHi} ${catEn} ${catHi} ${descEn}`;
    const allPresent = queryTokens.every((token) => fullText.includes(token));
    if (allPresent) {
      score += 80;
    }
  }

  return {
    product,
    score,
    matchReasons,
  };
}

/**
 * Filter and sort products according to relevance scores
 */
export function rankProductsByRelevance(
  products: BhayaShopifyProduct[],
  ctx: ScoreContext
): BhayaShopifyProduct[] {
  if (!ctx.normQuery) return products;

  const scored: ScoredProductResult[] = [];

  for (const product of products) {
    const res = calculateProductRelevance(product, ctx);
    // Strict threshold: Must have scored at least 20 points (prevents stop-word noise)
    if (res.score >= 20) {
      scored.push(res);
    }
  }

  // Sort descending: highest relevance score first
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Secondary tie-breaker: in-stock items first
    if (a.product.inStock !== b.product.inStock) {
      return a.product.inStock ? -1 : 1;
    }
    // Tertiary: New arrivals first
    return (b.product.isNew ? 1 : 0) - (a.product.isNew ? 1 : 0);
  });

  return scored.map((s) => s.product);
}
