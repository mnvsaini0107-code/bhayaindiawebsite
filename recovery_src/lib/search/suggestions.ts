// BHAYA INDIA — Autocomplete & Search Suggestions Engine
// Generates intelligent, responsive suggestions as the user types.

import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { CATEGORIES_TAXONOMY } from "@/lib/taxonomy";
import { SEARCH_INTENT_CLUSTERS } from "./intentAliases";
import { normalizeString } from "./normalization";
import type { SearchSuggestionItem } from "./types";

export function generateSearchSuggestions(
  query: string,
  catalog: BhayaShopifyProduct[],
  language: "en" | "hi" = "en"
): SearchSuggestionItem[] {
  const normQuery = normalizeString(query);
  if (!normQuery || normQuery.length < 1) return [];

  const suggestions: SearchSuggestionItem[] = [];
  const addedTitles = new Set<string>();

  const isHi = language === "hi";

  // 1. Direct Category Matches
  for (const cat of CATEGORIES_TAXONOMY) {
    const catEn = normalizeString(cat.name_en);
    const catHi = normalizeString(cat.name_hi);
    const catSlug = cat.slug;

    if (
      catEn.startsWith(normQuery) ||
      catHi.startsWith(normQuery) ||
      catSlug.startsWith(normQuery) ||
      cat.searchAliases.some((a) => normalizeString(a).startsWith(normQuery) || normalizeString(a).includes(normQuery))
    ) {
      const title = isHi ? cat.name_hi : cat.name_en;
      if (!addedTitles.has(title.toLowerCase())) {
        addedTitles.add(title.toLowerCase());
        suggestions.push({
          id: `cat-${cat.slug}`,
          title,
          titleHi: cat.name_hi,
          type: "category",
          categoryTag: isHi ? "श्रेणी" : "Category",
          url: `/search?category=${encodeURIComponent(cat.slug)}&q=${encodeURIComponent(title)}`,
        });
      }
    }

    // 2. Subcategory Matches within this Category
    for (const sub of cat.subcategories) {
      const subEn = normalizeString(sub.name_en);
      const subHi = normalizeString(sub.name_hi);
      const subSlug = sub.slug;

      if (
        subEn.startsWith(normQuery) ||
        subHi.startsWith(normQuery) ||
        subSlug.startsWith(normQuery) ||
        subEn.includes(normQuery) ||
        subHi.includes(normQuery) ||
        sub.searchAliases.some((a) => normalizeString(a).startsWith(normQuery) || normalizeString(a).includes(normQuery))
      ) {
        const title = isHi ? sub.name_hi : sub.name_en;
        if (!addedTitles.has(title.toLowerCase())) {
          addedTitles.add(title.toLowerCase());
          suggestions.push({
            id: `sub-${sub.slug}`,
            title,
            titleHi: sub.name_hi,
            type: "subcategory",
            categoryTag: isHi ? `उप-श्रेणी (${cat.name_hi})` : `Subcategory (${cat.name_en})`,
            url: `/search?category=${encodeURIComponent(cat.slug)}&subcat=${encodeURIComponent(sub.slug)}&q=${encodeURIComponent(title)}`,
          });
        }
      }
    }
  }

  // 3. Search Intent Clusters & Aliases Matching (e.g. "Karwa" -> "Karwa Chauth", "करवा चौथ", "Karwa Chauth Thali", etc.)
  for (const cluster of SEARCH_INTENT_CLUSTERS) {
    const hasAliasMatch = cluster.aliases.some((alias) => {
      const normAlias = normalizeString(alias);
      return normAlias.startsWith(normQuery) || normAlias.includes(normQuery) || normQuery.includes(normAlias);
    });

    if (hasAliasMatch) {
      // Suggest top aliases in both English and Hindi
      const relevantAliases = cluster.aliases
        .filter((a) => {
          const na = normalizeString(a);
          return na.startsWith(normQuery) || na.includes(normQuery);
        })
        .slice(0, 4);

      for (const alias of relevantAliases) {
        if (!addedTitles.has(alias.toLowerCase())) {
          addedTitles.add(alias.toLowerCase());
          suggestions.push({
            id: `alias-${alias}`,
            title: alias,
            type: "query",
            categoryTag: isHi ? cluster.parentCategoryName.hi : cluster.parentCategoryName.en,
            url: `/search?q=${encodeURIComponent(alias)}`,
          });
        }
      }

      // Add related terms from this cluster (e.g. Festival, Puja Samagri, Karwa Chauth Thali)
      for (const rel of cluster.relatedTerms.slice(0, 3)) {
        if (!addedTitles.has(rel.toLowerCase())) {
          addedTitles.add(rel.toLowerCase());
          suggestions.push({
            id: `rel-${rel}`,
            title: rel,
            type: "query",
            categoryTag: isHi ? "सुझाव" : "Suggestion",
            url: `/search?q=${encodeURIComponent(rel)}`,
          });
        }
      }
    }
  }

  // 4. Direct Matching Products from Shopify Catalog
  const matchingProducts = catalog.filter((p) => {
    const pTitleEn = normalizeString(p.name);
    const pTitleHi = normalizeString(p.nameHi || "");
    const pSku = normalizeString(p.sku || "");

    return (
      pTitleEn.startsWith(normQuery) ||
      pTitleHi.startsWith(normQuery) ||
      pTitleEn.includes(normQuery) ||
      pTitleHi.includes(normQuery) ||
      pSku.includes(normQuery)
    );
  });

  for (const prod of matchingProducts.slice(0, 4)) {
    const title = isHi && prod.nameHi ? prod.nameHi : prod.name;
    if (!addedTitles.has(title.toLowerCase())) {
      addedTitles.add(title.toLowerCase());
      suggestions.push({
        id: `prod-${prod.id}`,
        title,
        titleHi: prod.nameHi,
        type: "product",
        subtitle: prod.price !== null ? `₹${prod.price.toLocaleString("en-IN")}` : "Custom Quote",
        image: prod.images?.[0],
        price: prod.price,
        categoryTag: isHi && prod.categoryHi ? prod.categoryHi : prod.category,
        url: `/products/${prod.slug}`,
      });
    }
  }

  // Limit suggestions list to top 8 items to fit nicely on mobile and desktop
  return suggestions.slice(0, 8);
}
