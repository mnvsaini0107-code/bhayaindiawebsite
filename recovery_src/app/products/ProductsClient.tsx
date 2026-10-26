"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
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
import {
  getLanguageAwareProductImage,
  getLocalizedProductName,
  getLocalizedProductCategory,
  getLocalizedProductSubcategory,
} from "@/lib/shopify/utils";
import styles from "./products.module.css";

function getWhatsAppUrl(product: BhayaShopifyProduct, whatsappNumber: string, language: "en" | "hi" = "hi") {
  const prodName = getLocalizedProductName(product, language);
  const msg =
    language === "hi"
      ? `नमस्कार, मुझे BHAYA INDIA के इस product के बारे में जानकारी चाहिए:

Product Name: ${prodName}
Quantity: 1`
      : `Hello, I would like to enquire about this BHAYA INDIA product:

Product Name: ${prodName}
Quantity: 1`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

interface Props {
  allProducts: BhayaShopifyProduct[];
  whatsappNumber: string;
}

export default function ProductsClient({
  allProducts,
  whatsappNumber,
}: Props) {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
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
      list = scoreAndRankProducts(
        list,
        searchQuery,
        searchIntent?.matchedCategory || matchedTaxonomyCategory || null,
        searchIntent?.matchedSubcategories || []
      );
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
    searchIntent,
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
            {filtered.map((product) => {
              const hasPrice = product.price !== null && product.price > 0;
              const compPrice =
                product.compareAtPrice && product.compareAtPrice > (product.price || 0)
                  ? product.compareAtPrice
                  : hasPrice
                  ? Math.round(product.price! * 1.25)
                  : null;
              const discount =
                hasPrice && compPrice
                  ? Math.round(((compPrice - product.price!) / compPrice) * 100)
                  : 0;
              const rating = product.rating;
              const reviewsCount = product.reviewsCount;
              const currentImage = getLanguageAwareProductImage(product, language);
              const displayName = getLocalizedProductName(product, language);
              const displayCategory = getLocalizedProductCategory(product, language);

              return (
                <article key={product.id} className={styles.card} id={`product-${product.sku}`}>
                  {/* Image Wrap */}
                  <div className={styles.imageWrap}>
                    <Link href={`/products/${product.slug}`} className={styles.imageLink}>
                      <Image
                        src={currentImage}
                        alt={displayName}
                        fill
                        className={styles.productImg}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>

                    <div className={styles.badgeGroup}>
                      {discount > 0 && (
                        <span className={styles.discountBadge}>
                          {t("offDiscount", { discount })}
                        </span>
                      )}
                      {product.isNew && (
                        <span className={styles.badge}>
                          {t("newArrival")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className={styles.cardBody}>
                    <span className={styles.category}>{displayCategory}</span>

                    <h2 className={styles.title}>
                      <Link href={`/products/${product.slug}`}>{displayName}</Link>
                    </h2>

                    {rating ? (
                      <div className={styles.ratingRow}>
                        <span className={styles.stars}>★</span>
                        <span className={styles.ratingNum}>{rating}</span>
                        {reviewsCount ? (
                          <span className={styles.reviewCount}>({reviewsCount})</span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className={styles.priceRow}>
                      {hasPrice ? (
                        <>
                          <span className={styles.price}>
                            ₹{product.price!.toLocaleString("en-IN")}
                          </span>
                          {compPrice && (
                            <span className={styles.originalPrice}>
                              ₹{compPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.quoteOnly}>
                          {t("customQuoteWholesale")}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={styles.cardActions}>
                      {product.inStock ? (
                        <button
                          type="button"
                          className={styles.addToBagBtn}
                          onClick={() => {
                            addItem({
                              id: product.id,
                              name: displayName,
                              slug: product.slug,
                              price: product.price || 0,
                              image: currentImage,
                              category: product.category || "retail",
                              variantId: product.variantId,
                            });
                          }}
                          id={`add-bag-${product.id}`}
                        >
                          {t("addToBag")}
                        </button>
                      ) : (
                        <button type="button" className={styles.outOfStockBtn} disabled>
                          {t("outOfStock")}
                        </button>
                      )}

                      <a
                        href={getWhatsAppUrl(product, whatsappNumber, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappIconBtn}
                        aria-label={`Enquire about ${displayName} on WhatsApp`}
                        title={t("whatsAppEnquiry")}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
