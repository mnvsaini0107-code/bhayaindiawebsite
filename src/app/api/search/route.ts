// BHAYA INDIA — Search & Autocomplete API
// Connects to live Shopify catalog with intent classification, ranking, and suggestions.

import { NextResponse } from "next/server";
import { getShopifyProducts, isShopifyConfigured } from "@/lib/shopify";
import { executeSearch } from "@/lib/search/engine";
import { generateSearchSuggestions } from "@/lib/search/suggestions";
import type { SearchFilters } from "@/lib/search/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type"); // "suggestions" | "full"
    const category = searchParams.get("category") || undefined;
    const subcat = searchParams.get("subcat") || undefined;
    const price = (searchParams.get("price") as SearchFilters["price"]) || undefined;
    const availability = (searchParams.get("availability") as SearchFilters["availability"]) || undefined;
    const sort = (searchParams.get("sort") as SearchFilters["sort"]) || undefined;
    const lang = (searchParams.get("lang") === "hi" ? "hi" : "en") as "en" | "hi";

    // 1. Fetch live products from Shopify
    // When Shopify is configured, this queries Shopify Storefront API
    const shopifyConfigured = isShopifyConfigured();
    const allProducts = await getShopifyProducts();

    // 2. Autocomplete Suggestions request (lightweight for live keystrokes)
    if (type === "suggestions") {
      const suggestions = generateSearchSuggestions(query, allProducts, lang);
      return NextResponse.json({
        success: true,
        query,
        isShopify: shopifyConfigured,
        suggestions,
      });
    }

    // 3. Full Search Execution with 10-tier relevance ranking and filters
    const searchResult = executeSearch(query, allProducts, {
      category,
      subcat,
      price,
      availability,
      sort,
    });

    return NextResponse.json({
      success: true,
      query: searchResult.query,
      count: searchResult.totalFound,
      isShopify: shopifyConfigured,
      products: searchResult.products,
      matchedCategory: searchResult.matchedCategory,
      matchedSubcategories: searchResult.matchedSubcategories,
      relatedSearches: searchResult.relatedSearches,
      isFutureCategory: searchResult.isFutureCategory,
      futureCategoryName: searchResult.futureCategoryName,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute search query" },
      { status: 500 }
    );
  }
}
