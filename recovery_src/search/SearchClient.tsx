"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { CATEGORIES_TAXONOMY, findCategoryBySlug } from "@/lib/taxonomy";
import { executeSearch, analyzeSearchIntent } from "@/lib/search/engine";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./search.module.css";

import type { SearchFilters } from "@/lib/search/types";

interface SearchClientProps {
  initialProducts: BhayaShopifyProduct[];
  whatsappNumber: string;
  isShopify: boolean;
}

export default function SearchClient({
  initialProducts,
  whatsappNumber,
  isShopify,
}: SearchClientProps) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const subcatParam = searchParams.get("subcat") || "";
  const priceParam = (searchParams.get("price") as SearchFilters["price"]) || "all";
  const availabilityParam = (searchParams.get("availability") as SearchFilters["availability"]) || "all";
  const sortParam = (searchParams.get("sort") as SearchFilters["sort"]) || "relevance";

  const [inputQuery, setInputQuery] = useState(queryParam);

  // Sync input when URL parameter changes
  useEffect(() => {
    setInputQuery(queryParam);
  }, [queryParam]);

  // Analyze intent of current query
  const intentAnalysis = useMemo(() => {
    return analyzeSearchIntent(queryParam);
  }, [queryParam]);

  // Execute search and ranking
  const searchResult = useMemo(() => {
    return executeSearch(queryParam, initialProducts, {
      category: categoryParam !== "all" ? categoryParam : undefined,
      subcat: subcatParam || undefined,
      price: priceParam !== "all" ? priceParam : undefined,
      availability: availabilityParam !== "all" ? availabilityParam : undefined,
      sort: sortParam,
    });
  }, [
    queryParam,
    initialProducts,
    categoryParam,
    subcatParam,
    priceParam,
    availabilityParam,
    sortParam,
  ]);

  const updateParam = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam({ q: inputQuery.trim() });
  };

  const handleClearInput = () => {
    setInputQuery("");
    updateParam({ q: null });
  };

  const handleResetFilters = () => {
    setInputQuery("");
    router.push("/search");
  };

  const activeCategoryDef = categoryParam !== "all" ? findCategoryBySlug(categoryParam) : null;

  return (
    <main className={styles.main}>
      {/* 1. HERO HEADER */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span>{language === "hi" ? "खोज परिणाम" : "Search Results"}</span>
            </div>

            <h1 className={styles.searchHeaderTitle}>
              {queryParam ? (
                <>
                  {language === "hi" ? "खोज परिणाम: " : "Search Results for: "}
                  <span className={styles.searchQueryHighlight}>&ldquo;{queryParam}&rdquo;</span>
                </>
              ) : activeCategoryDef ? (
                language === "hi" ? activeCategoryDef.name_hi : activeCategoryDef.name_en
              ) : (
                language === "hi" ? "उत्पाद सूची खोजें" : "Explore Products"
              )}
            </h1>

            <p className={styles.searchHeaderDesc}>
              {language === "hi"
                ? "प्रामाणिक गुणवत्ता और भरोसेमंद व्यापार के साथ हस्तनिर्मित वस्त्र, कॉर्पोरेट स्टेशनरी, उत्सव सामग्री, पैकेजिंग एवं थोक उत्पाद।"
                : "Discover authentic Indian textiles, executive stationery, festive ritual essentials, packaging and wholesale merchandise."}
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* 2. INLINE SEARCH INPUT */}
        <div className={styles.refineSearchRow}>
          <form onSubmit={handleRefineSubmit} className={styles.refineSearchForm}>
            <span className={styles.refineIconLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === "hi"
                  ? "उत्पाद खोजें..."
                  : "Search Products..."
              }
              className={styles.refineInput}
              id="search-page-refine-input"
            />
            {inputQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={handleClearInput}
                className={styles.refineClearBtn}
                aria-label={t("clearSearch")}
                title={t("clearSearch")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.refineSubmitBtn} id="search-page-refine-submit">
              {language === "hi" ? "खोजें" : "Search"}
            </button>
          </form>
        </div>

        {/* 3. INTENT DISCOVERY STRIP (Relevant Category, Subcategories & Related Searches) */}
        {queryParam && (intentAnalysis.matchedCategory || intentAnalysis.matchedSubcategories.length > 0 || intentAnalysis.relatedSearches.length > 0) && (
          <div className={styles.discoveryBox}>
            {/* Relevant Primary Category */}
            {intentAnalysis.matchedCategory && (
              <div className={styles.discoveryRow}>
                <span className={styles.discoveryLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  {language === "hi" ? "संबंधित मुख्य श्रेणी:" : "Relevant Category:"}
                </span>
                <button
                  type="button"
                  onClick={() => updateParam({ category: intentAnalysis.matchedCategory!.slug, subcat: null })}
                  className={styles.categoryTagPill}
                >
                  <span>{language === "hi" ? intentAnalysis.matchedCategory.name_hi : intentAnalysis.matchedCategory.name_en}</span>
                  <span>→</span>
                </button>
                {intentAnalysis.matchedCategory.status === "coming_soon" && (
                  <span style={{ fontSize: "11px", color: "var(--gold-dark)", background: "rgba(197,160,89,0.15)", padding: "2px 8px", borderRadius: "3px" }}>
                    {language === "hi" ? "शीघ्र उपलब्ध" : "Coming Soon"}
                  </span>
                )}
              </div>
            )}

            {/* Relevant Subcategories */}
            {intentAnalysis.matchedSubcategories.length > 0 && (
              <div className={styles.discoveryRow}>
                <span className={styles.discoveryLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  {language === "hi" ? "संबंधित उप-श्रेणियाँ:" : "Relevant Subcategories:"}
                </span>
                {intentAnalysis.matchedSubcategories.map((sub) => {
                  const isCurrent = subcatParam === sub.slug;
                  return (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => updateParam({ category: sub.parentSlug, subcat: sub.slug })}
                      className={`${styles.subcatChip} ${isCurrent ? styles.subcatChipActive : ""}`}
                    >
                      <span>{language === "hi" ? sub.name_hi : sub.name_en}</span>
                      {sub.status === "coming_soon" && (
                        <span style={{ fontSize: "10px", opacity: 0.65 }}>
                          ({language === "hi" ? "शीघ्र" : "Soon"})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Related Searches */}
            {intentAnalysis.relatedSearches.length > 0 && (
              <div className={styles.discoveryRow}>
                <span className={styles.discoveryLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  {language === "hi" ? "संबंधित खोजें:" : "Related Searches:"}
                </span>
                {intentAnalysis.relatedSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInputQuery(term);
                      updateParam({ q: term });
                    }}
                    className={styles.relatedPill}
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. FILTERS & SORTING TOOLBAR */}
        <div className={styles.toolbarCard}>
          {/* Core Categories Bar */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span className={styles.filterLabel}>
                {language === "hi" ? "श्रेणी:" : "Category:"}
              </span>
              <button
                type="button"
                onClick={() => updateParam({ category: "all", subcat: null })}
                className={`${styles.pillBtn} ${categoryParam === "all" ? styles.pillBtnActive : ""}`}
              >
                {language === "hi" ? "सभी श्रेणियाँ" : "All Categories"} ({initialProducts.length})
              </button>
              {CATEGORIES_TAXONOMY.map((cat) => {
                const count = initialProducts.filter((p) => {
                  const allowed = new Set([cat.slug, ...cat.subcategories.map((s) => s.slug)]);
                  return (
                    allowed.has(p.categorySlug) ||
                    p.category.toLowerCase() === cat.name_en.toLowerCase() ||
                    (p.categoryHi && p.categoryHi.toLowerCase() === cat.name_hi.toLowerCase())
                  );
                }).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateParam({ category: cat.slug, subcat: null })}
                    className={`${styles.pillBtn} ${categoryParam === cat.slug ? styles.pillBtnActive : ""}`}
                  >
                    {language === "hi" ? cat.name_hi : cat.name_en} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Pills (when a category is selected) */}
          {activeCategoryDef && activeCategoryDef.subcategories.length > 0 && (
            <div style={{ marginBottom: "1rem", paddingTop: "0.5rem", borderTop: "1px dashed #e1e4e8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                <span className={styles.filterLabel}>
                  {language === "hi" ? "उप-श्रेणी:" : "Subcategory:"}
                </span>
                <button
                  type="button"
                  onClick={() => updateParam({ subcat: null })}
                  className={`${styles.pillBtn} ${!subcatParam ? styles.pillBtnActive : ""}`}
                >
                  {language === "hi" ? `सभी ${activeCategoryDef.name_hi}` : `All ${activeCategoryDef.name_en}`}
                </button>
                {activeCategoryDef.subcategories.map((sub) => {
                  const isSelected = subcatParam === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => updateParam({ subcat: sub.slug })}
                      className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ""}`}
                    >
                      {language === "hi" ? sub.name_hi : sub.name_en}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price, Availability & Sorting Controls */}
          <div className={styles.toolbarRow}>
            {/* Price Slabs */}
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>
                {language === "hi" ? "कीमत:" : "Price:"}
              </span>
              <button
                type="button"
                onClick={() => updateParam({ price: "all" })}
                className={`${styles.pillBtn} ${priceParam === "all" ? styles.pillBtnActive : ""}`}
              >
                {language === "hi" ? "सभी" : "All"}
              </button>
              <button
                type="button"
                onClick={() => updateParam({ price: "under-1000" })}
                className={`${styles.pillBtn} ${priceParam === "under-1000" ? styles.pillBtnActive : ""}`}
              >
                {language === "hi" ? "₹1,000 से कम" : "Under ₹1,000"}
              </button>
              <button
                type="button"
                onClick={() => updateParam({ price: "1000-3000" })}
                className={`${styles.pillBtn} ${priceParam === "1000-3000" ? styles.pillBtnActive : ""}`}
              >
                ₹1,000 – ₹3,000
              </button>
              <button
                type="button"
                onClick={() => updateParam({ price: "above-3000" })}
                className={`${styles.pillBtn} ${priceParam === "above-3000" ? styles.pillBtnActive : ""}`}
              >
                {language === "hi" ? "₹3,000 से अधिक" : "Above ₹3,000"}
              </button>
              <button
                type="button"
                onClick={() => updateParam({ price: "quote" })}
                className={`${styles.pillBtn} ${priceParam === "quote" ? styles.pillBtnActive : ""}`}
              >
                {language === "hi" ? "थोक / कोटेशन" : "Wholesale Quote"}
              </button>
            </div>

            {/* Availability & Sorting Dropdowns */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label htmlFor="avail-select" className={styles.filterLabel}>
                  {language === "hi" ? "उपलब्धता:" : "Availability:"}
                </label>
                <select
                  id="avail-select"
                  value={availabilityParam}
                  onChange={(e) => updateParam({ availability: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="all">{language === "hi" ? "सभी उत्पाद" : "All"}</option>
                  <option value="in-stock">{language === "hi" ? "केवल उपलब्ध" : "In Stock"}</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <label htmlFor="sort-select" className={styles.filterLabel}>
                  {language === "hi" ? "क्रमबद्ध करें:" : "Sort:"}
                </label>
                <select
                  id="sort-select"
                  value={sortParam}
                  onChange={(e) => updateParam({ sort: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="relevance">{language === "hi" ? "प्रासंगिकता" : "Relevance"}</option>
                  <option value="featured">{language === "hi" ? "प्रमुख" : "Featured"}</option>
                  <option value="price-low">{language === "hi" ? "कीमत: कम से अधिक" : "Price: Low to High"}</option>
                  <option value="price-high">{language === "hi" ? "कीमत: अधिक से कम" : "Price: High to Low"}</option>
                  <option value="newest">{language === "hi" ? "नवीनतम" : "Newest"}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 5. PRODUCT COUNT & RESET CONTROLS */}
        <div className={styles.countBar}>
          <span className={styles.countText}>
            {language === "hi" ? (
              <>
                <strong>{searchResult.totalFound}</strong> उत्पाद दिखाए जा रहे हैं
                {queryParam && <> (खोज: &ldquo;{queryParam}&rdquo;)</>}
              </>
            ) : (
              <>
                Showing <strong>{searchResult.totalFound}</strong> products
                {queryParam && <> for &ldquo;{queryParam}&rdquo;</>}
              </>
            )}
            {isShopify && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--gold-dark)",
                  background: "rgba(197, 160, 89, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "3px",
                }}
              >
                {language === "hi" ? "शॉपिफाई कैटलॉग" : "Shopify Catalog"}
              </span>
            )}
          </span>

          {(queryParam || categoryParam !== "all" || subcatParam || priceParam !== "all" || availabilityParam !== "all") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles.resetAllBtn}
            >
              {language === "hi" ? "सभी फ़िल्टर हटाएं" : "Reset all filters"}
            </button>
          )}
        </div>

        {/* 6. PRODUCTS GRID / EMPTY STATE */}
        {searchResult.totalFound === 0 ? (
          <div className={styles.emptyState}>
            {intentAnalysis.isFutureCategory ? (
              <>
                <span className={styles.emptyBadge}>
                  {language === "hi" ? "शीघ्र उपलब्ध • Coming Soon" : "Coming Soon"}
                </span>
                <h2 className={styles.emptyTitle}>
                  {intentAnalysis.futureCategoryName
                    ? `${language === "hi" ? intentAnalysis.futureCategoryName.hi : intentAnalysis.futureCategoryName.en} — ${language === "hi" ? "उत्पाद जल्द आ रहे हैं" : "Products Coming Soon"}`
                    : language === "hi" ? "उत्पाद जल्द आ रहे हैं" : "Products Coming Soon"}
                </h2>
                <p className={styles.emptySubtitle}>
                  {language === "hi"
                    ? "भाया इंडिया इस श्रेणी के सत्यापित निर्माताओं एवं आपूर्तिकर्ताओं को ऑनबोर्ड कर रहा है। थोक या सप्लायर पार्टनरशिप के लिए संपर्क करें।"
                    : "BHAYA INDIA is actively onboarding certified manufacturers and merchants for this category. Enquire directly for wholesale supply or seller onboarding."}
                </p>
              </>
            ) : initialProducts.length === 0 ? (
              <>
                <span className={styles.emptyBadge}>
                  {language === "hi" ? "उत्पाद जल्द आ रहे हैं" : "Products Coming Soon"}
                </span>
                <h2 className={styles.emptyTitle}>
                  {language === "hi" ? "अभी कोई उत्पाद उपलब्ध नहीं है" : "No products available yet"}
                </h2>
                <p className={styles.emptySubtitle}>
                  {language === "hi"
                    ? "हमारा प्रमाणित कैटलॉग लाइव अपडेट किया जा रहा है। किसी विशेष आवश्यकता या थोक ऑर्डर के लिए हमारे मर्चेंट डेस्क से संपर्क करें।"
                    : "Our catalog is being updated with verified products. Explore our core categories or contact our merchant desk for custom requirements."}
                </p>
              </>
            ) : (
              <>
                <span className={styles.emptyBadge}>
                  {language === "hi" ? "खोज परिणाम" : "Search Results"}
                </span>
                <h2 className={styles.emptyTitle}>
                  {language === "hi" ? "कोई उत्पाद नहीं मिला।" : "No products found."}
                </h2>
                <p className={styles.emptySubtitle}>
                  {language === "hi"
                    ? "कोई दूसरा शब्द खोजें या हमारी श्रेणियाँ देखें।"
                    : "Try another search term or explore our categories."}
                </p>
              </>
            )}

            {/* Useful Category Suggestions */}
            <div className={styles.categorySuggestionsRow}>
              {CATEGORIES_TAXONOMY.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setInputQuery("");
                    updateParam({ category: cat.slug, subcat: null, q: null });
                  }}
                  className={styles.pillBtn}
                >
                  {language === "hi" ? cat.name_hi : cat.name_en}
                </button>
              ))}
            </div>

            <div className={styles.emptyActionRow}>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-primary"
              >
                {language === "hi" ? "हमारी श्रेणियाँ देखें" : "Explore Categories"}
              </button>
              <Link href="/contact" className="btn btn-secondary">
                {language === "hi" ? "कस्टम कोटेशन मांगें" : "Request Custom Quote"}
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {searchResult.products.map((product) => (
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
