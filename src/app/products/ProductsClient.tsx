"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import {
  CATEGORIES_TAXONOMY,
  findCategoryBySlug,
  findSubcategoryBySlug,
} from "@/lib/taxonomy";
import {
  analyzeSearchIntent,
  scoreAndRankProducts,
} from "@/lib/search/intentSearch";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./products.module.css";

interface Props {
  allProducts: BhayaShopifyProduct[];
  whatsappNumber: string;
}

export default function ProductsClient({
  allProducts,
  whatsappNumber,
}: Props) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category") || "all";
  const activeSubcat = searchParams.get("subcat") || "";
  const searchQuery = searchParams.get("q") || "";
  const sortOption = searchParams.get("sort") || "relevance";
  const priceFilter = searchParams.get("price") || "all";

  const [inputQuery, setInputQuery] = useState(searchQuery);

  const matchedTaxonomyCategory = activeCategory !== "all" ? findCategoryBySlug(activeCategory) : null;
  const matchedTaxonomySubcategory = activeSubcat ? findSubcategoryBySlug(activeSubcat) : null;

  // Search intent analysis if search query exists
  const searchIntent = useMemo(() => {
    if (!searchQuery) return null;
    return analyzeSearchIntent(searchQuery);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      // Category match
      let matchesCat = true;
      if (activeCategory !== "all") {
        if (matchedTaxonomyCategory) {
          const catSlugs = new Set([
            matchedTaxonomyCategory.slug,
            ...matchedTaxonomyCategory.subcategories.map((s) => s.slug),
          ]);
          matchesCat = Boolean(
            catSlugs.has(p.categorySlug) ||
            p.category.toLowerCase() === matchedTaxonomyCategory.name_en.toLowerCase() ||
            (p.categoryHi && p.categoryHi.toLowerCase() === matchedTaxonomyCategory.name_hi.toLowerCase())
          );
        } else {
          matchesCat = p.categorySlug === activeCategory;
        }
      }

      // Subcategory match
      let matchesSubcat = true;
      if (activeSubcat) {
        matchesSubcat = Boolean(
          p.subcategory.toLowerCase() === activeSubcat.toLowerCase() ||
          (p.subcategoryHi && p.subcategoryHi.toLowerCase() === activeSubcat.toLowerCase()) ||
          (matchedTaxonomySubcategory &&
            (p.subcategory.toLowerCase() === matchedTaxonomySubcategory.name_en.toLowerCase() ||
              (p.subcategoryHi && p.subcategoryHi.toLowerCase() === matchedTaxonomySubcategory.name_hi.toLowerCase()) ||
              matchedTaxonomySubcategory.searchAliases.some((alias) =>
                p.subcategory.toLowerCase().includes(alias.toLowerCase())
              )))
        );
      }

      // Price filter
      let matchesPrice = true;
      if (priceFilter === "under-1000") {
        matchesPrice = p.price !== null && p.price < 1000;
      } else if (priceFilter === "1000-3000") {
        matchesPrice = p.price !== null && p.price >= 1000 && p.price <= 3000;
      } else if (priceFilter === "above-3000") {
        matchesPrice = p.price !== null && p.price > 3000;
      } else if (priceFilter === "quote") {
        matchesPrice = p.price === null;
      }

      return matchesCat && matchesSubcat && matchesPrice;
    });

    // If search query is present, rank with intelligent intent engine
    if (searchQuery.trim()) {
      list = scoreAndRankProducts(list, searchQuery);
    }

    if (sortOption === "price-low") {
      list.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    } else if (sortOption === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [
    allProducts,
    activeCategory,
    activeSubcat,
    searchQuery,
    priceFilter,
    sortOption,
    matchedTaxonomyCategory,
    matchedTaxonomySubcategory,
  ]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "category") {
      params.delete("subcat");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", inputQuery.trim());
  };

  return (
    <main className={styles.main} suppressHydrationWarning>
      {/* Page Hero Header */}
      <div className={styles.pageHero} suppressHydrationWarning>
        <div className="container" suppressHydrationWarning>
          <div className="eyebrow eyebrow--gold" suppressHydrationWarning>
            <span className="eyebrow-line" />
            {language === "hi" ? "उत्पाद सूची" : "Product Catalogue"}
          </div>

          <h1 className={styles.pageTitle}>
            {activeCategory !== "all"
              ? (matchedTaxonomyCategory ? (language === "hi" ? matchedTaxonomyCategory.name_hi : matchedTaxonomyCategory.name_en) : activeCategory)
              : language === "hi"
              ? "सम्पूर्ण उत्पाद संग्रह"
              : "The Complete Collection"}
          </h1>

          <p className={styles.pageDesc}>
            {(matchedTaxonomyCategory ? (language === "hi" ? matchedTaxonomyCategory.description_hi : matchedTaxonomyCategory.description_en) : null) ||
              (language === "hi"
                ? "प्रामाणिक गुणवत्ता के साथ हस्तनिर्मित वस्त्र, एग्जीक्यूटिव स्टेशनरी, उत्सव उपहार, पैकेजिंग और थोक उत्पाद।"
                : "Handcrafted textiles, executive stationery, festive gifting trunks, packaging and wholesale goods with authentic quality.")}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search Products Bar */}
        <div className={styles.searchBarRow}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              name="q"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === "hi"
                  ? "त्योहार, करवा चौथ, पूजा सामग्री, पैकेजिंग, उत्पाद खोजें..."
                  : "Search festival, Karwa Chauth, puja items, packaging, products..."
              }
              className={styles.searchInput}
              id="products-search-input"
            />
            <button type="submit" className={styles.searchSubmitBtn} id="products-search-submit">
              {language === "hi" ? "खोजें" : "Search"}
            </button>
          </form>
        </div>

        {/* Search Intent Suggestions Strip if query present */}
        {searchIntent && (searchIntent.matchedCategory || searchIntent.matchedSubcategories.length > 0 || searchIntent.relatedSearches.length > 0) && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(197,160,89,0.25)",
              borderRadius: "6px",
              padding: "16px 20px",
              marginBottom: "24px",
              boxShadow: "0 2px 8px rgba(18,52,86,0.04)",
            }}
          >
            {/* Matched Category & Subcategories Discovery */}
            {searchIntent.matchedCategory && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {language === "hi" ? "संबंधित मुख्य श्रेणी:" : "Related Category:"}
                </span>
                <button
                  type="button"
                  onClick={() => updateParam("category", searchIntent.matchedCategory!.slug)}
                  className="pill-control pill-control--active"
                  style={{ fontSize: "12px", padding: "4px 12px" }}
                >
                  {language === "hi" ? searchIntent.matchedCategory.name_hi : searchIntent.matchedCategory.name_en} →
                </button>
              </div>
            )}

            {searchIntent.matchedSubcategories.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--sapphire)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {language === "hi" ? "उप-श्रेणी सुझाव:" : "Subcategory Suggestions:"}
                </span>
                {searchIntent.matchedSubcategories.slice(0, 6).map((sub) => (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => {
                      updateParam("category", sub.parentSlug);
                      updateParam("subcat", sub.slug);
                    }}
                    className="pill-control"
                    style={{ fontSize: "12px", padding: "4px 10px" }}
                  >
                    {language === "hi" ? sub.name_hi : sub.name_en}
                  </button>
                ))}
              </div>
            )}

            {/* Related Searches */}
            {searchIntent.relatedSearches.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>
                  {language === "hi" ? "संबंधित खोजें:" : "Related Searches:"}
                </span>
                {searchIntent.relatedSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInputQuery(term);
                      updateParam("q", term);
                    }}
                    style={{
                      background: "rgba(197,160,89,0.1)",
                      border: "1px solid rgba(197,160,89,0.25)",
                      color: "var(--gold-dark)",
                      fontSize: "12px",
                      padding: "3px 10px",
                      borderRadius: "16px",
                      cursor: "pointer",
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 8 Primary Business Category Pills */}
        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>
            {language === "hi" ? "व्यावसायिक श्रेणियाँ:" : "Core Categories:"}
          </div>
          <div className={styles.pillsRow}>
            <button
              type="button"
              onClick={() => updateParam("category", "all")}
              className={`pill-control ${activeCategory === "all" ? "pill-control--active" : ""}`}
              id="filter-pill-all"
            >
              {language === "hi" ? "सभी श्रेणियाँ" : "All Categories"} ({allProducts.length})
            </button>

            {CATEGORIES_TAXONOMY.map((cat) => {
              // Dynamic product count calculated from actual catalog
              const count = allProducts.filter((p) => {
                const subSlugs = new Set([cat.slug, ...cat.subcategories.map((s) => s.slug)]);
                return (
                  subSlugs.has(p.categorySlug) ||
                  p.category.toLowerCase() === cat.name_en.toLowerCase() ||
                  (p.categoryHi && p.categoryHi.toLowerCase() === cat.name_hi.toLowerCase())
                );
              }).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateParam("category", cat.slug)}
                  className={`pill-control ${activeCategory === cat.slug ? "pill-control--active" : ""}`}
                  id={`filter-pill-${cat.slug}`}
                >
                  {language === "hi" ? cat.name_hi : cat.name_en} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-category Pills (Shown when a category is selected) */}
        {matchedTaxonomyCategory && matchedTaxonomyCategory.subcategories.length > 0 && (
          <div className={styles.filterSection} style={{ marginTop: "-0.5rem" }}>
            <div className={styles.filterLabel}>
              {language === "hi" ? "उप-श्रेणी:" : "Sub-Category:"}
            </div>
            <div className={styles.pillsRow}>
              <button
                type="button"
                onClick={() => updateParam("subcat", "")}
                className={`pill-control ${!activeSubcat ? "pill-control--active" : ""}`}
              >
                {language === "hi"
                  ? `सभी ${matchedTaxonomyCategory.name_hi}`
                  : `All ${matchedTaxonomyCategory.name_en}`}
              </button>
              {matchedTaxonomyCategory.subcategories.map((sub) => {
                const isSelected =
                  activeSubcat.toLowerCase() === sub.slug.toLowerCase() ||
                  activeSubcat.toLowerCase() === sub.name_en.toLowerCase();

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => updateParam("subcat", sub.slug)}
                    className={`pill-control ${isSelected ? "pill-control--active" : ""}`}
                    id={`filter-subcat-${sub.slug}`}
                  >
                    {language === "hi" ? sub.name_hi : sub.name_en}
                    {sub.status === "coming_soon" && (
                      <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>
                        ({language === "hi" ? "शीघ्र" : "Soon"})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub-Bar: Price Slabs & Sorting Toolbar */}
        <div className={styles.toolbarRow}>
          {/* Price Slabs */}
          <div className={styles.pricePillsRow}>
            <span className={styles.subFilterLabel}>
              {language === "hi" ? "मूल्य:" : "Price:"}
            </span>
            <button
              type="button"
              onClick={() => updateParam("price", "all")}
              className={`${styles.pricePill} ${priceFilter === "all" ? styles.pricePillActive : ""}`}
            >
              {language === "hi" ? "सभी" : "All"}
            </button>
            <button
              type="button"
              onClick={() => updateParam("price", "under-1000")}
              className={`${styles.pricePill} ${priceFilter === "under-1000" ? styles.pricePillActive : ""}`}
            >
              {language === "hi" ? "₹1,000 से कम" : "Under ₹1,000"}
            </button>
            <button
              type="button"
              onClick={() => updateParam("price", "1000-3000")}
              className={`${styles.pricePill} ${priceFilter === "1000-3000" ? styles.pricePillActive : ""}`}
            >
              ₹1,000 – ₹3,000
            </button>
            <button
              type="button"
              onClick={() => updateParam("price", "above-3000")}
              className={`${styles.pricePill} ${priceFilter === "above-3000" ? styles.pricePillActive : ""}`}
            >
              {language === "hi" ? "₹3,000 से अधिक" : "Above ₹3,000"}
            </button>
            <button
              type="button"
              onClick={() => updateParam("price", "quote")}
              className={`${styles.pricePill} ${priceFilter === "quote" ? styles.pricePillActive : ""}`}
            >
              {language === "hi" ? "कोटेशन/थोक" : "Wholesale Quote"}
            </button>
          </div>

          {/* Sort Selector */}
          <div className={styles.sortWrapper}>
            <label htmlFor="sort-select" className={styles.subFilterLabel}>
              {language === "hi" ? "क्रम:" : "Sort:"}
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => updateParam("sort", e.target.value)}
              className={styles.sortSelect}
            >
              <option value="relevance">{language === "hi" ? "प्रासंगिकता" : "Relevance"}</option>
              <option value="price-low">{language === "hi" ? "मूल्य: कम से ज्यादा" : "Price: Low to High"}</option>
              <option value="price-high">{language === "hi" ? "मूल्य: ज्यादा से कम" : "Price: High to Low"}</option>
              <option value="newest">{language === "hi" ? "नवीनतम उत्पाद" : "Newest Arrivals"}</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Reset Action */}
        <div className={styles.resultCountBar}>
          <span className={styles.countText}>
            {language === "hi" ? (
              <>
                <strong>{filtered.length}</strong> उत्पाद उपलब्ध
                {searchQuery && <> (खोज: &ldquo;{searchQuery}&rdquo;)</>}
              </>
            ) : (
              <>
                Showing <strong>{filtered.length}</strong> products
                {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
              </>
            )}
          </span>

          {(activeCategory !== "all" || priceFilter !== "all" || searchQuery || activeSubcat) && (
            <button
              type="button"
              onClick={() => {
                setInputQuery("");
                router.push("/products");
              }}
              className={styles.resetLink}
            >
              {language === "hi" ? "सभी फ़िल्टर रीसेट करें" : "Reset all filters"}
            </button>
          )}
        </div>

        {/* Product Grid / Empty State */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "rgba(197,160,89,0.15)",
                color: "var(--gold)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                marginBottom: "16px",
              }}
            >
              {language === "hi" ? "शीघ्र उपलब्ध • Coming Soon" : "Coming Soon"}
            </span>
            <p className={styles.emptyTitle}>
              {matchedTaxonomyCategory || matchedTaxonomySubcategory
                ? language === "hi"
                  ? "उत्पाद जल्द आ रहे हैं — Products Coming Soon"
                  : "Products Coming Soon"
                : language === "hi"
                ? "कोई उत्पाद नहीं मिला"
                : "No matching products found"}
            </p>
            <p className={styles.emptySubtitle}>
              {language === "hi"
                ? "हमारी टीम इस श्रेणी के लिए प्रमाणित भारतीय उत्पादों को तेजी से कैटलॉग में जोड़ रही है। किसी विशेष थोक या कस्टम आवश्यकता के लिए संपर्क करें।"
                : "Our merchant team is actively onboarding certified authentic Indian products for this category. Enquire directly for wholesale or custom requirements."}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => {
                  setInputQuery("");
                  router.push("/products");
                }}
                className="btn btn-primary"
              >
                {language === "hi" ? "सभी श्रेणियाँ देखें" : "View All Categories"}
              </button>
              <Link href="/contact" className="btn btn-secondary">
                {language === "hi" ? "कस्टम कोटेशन मांगें" : "Request Custom Quote"}
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
