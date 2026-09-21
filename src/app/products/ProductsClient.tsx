"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import type { BhayaShopifyProduct, BhayaCollection } from "@/lib/shopify/types";
import {
  getLanguageAwareProductImage,
  getLocalizedCategoryName,
  getLocalizedCategoryDesc,
  getLocalizedSubcategoryName,
  getLocalizedProductName,
  getLocalizedProductCategory,
} from "@/lib/shopify/utils";
import styles from "./products.module.css";

function getWhatsAppUrl(product: BhayaShopifyProduct, whatsappNumber: string, language: "en" | "hi" = "hi") {
  const prodName = getLocalizedProductName(product, language);
  const msg = language === "hi"
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
  categories: BhayaCollection[];
  whatsappNumber: string;
}

export default function ProductsClient({
  allProducts,
  categories,
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

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

  const filtered = useMemo(() => {
    const list = allProducts.filter((p) => {
      const matchesCat = activeCategory === "all" || p.categorySlug === activeCategory;
      const matchesSubcat =
        !activeSubcat ||
        p.subcategory.toLowerCase() === activeSubcat.toLowerCase() ||
        (p.subcategoryHi && p.subcategoryHi.toLowerCase() === activeSubcat.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nameHi && p.nameHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.categoryHi && p.categoryHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subcategoryHi && p.subcategoryHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.descriptionHi && p.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase()));

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

      return matchesCat && matchesSubcat && matchesSearch && matchesPrice;
    });

    if (sortOption === "price-low") {
      list.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    } else if (sortOption === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [allProducts, activeCategory, activeSubcat, searchQuery, priceFilter, sortOption]);

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
              ? (activeCategoryObj ? getLocalizedCategoryName(activeCategoryObj, language) : "")
              : language === "hi"
              ? "सम्पूर्ण उत्पाद संग्रह"
              : "The Complete Collection"}
          </h1>

          <p className={styles.pageDesc}>
            {(activeCategoryObj ? getLocalizedCategoryDesc(activeCategoryObj, language) : null) ||
              (language === "hi"
                ? "प्रामाणिक गुणवत्ता के साथ हस्तनिर्मित वस्त्र, एग्जीक्यूटिव स्टेशनरी, उत्सव उपहार और थोक उत्पाद।"
                : "Handcrafted textiles, executive stationery, festive gifting trunks, and wholesale goods with authentic quality.")}
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
              placeholder={language === "hi" ? "उत्पाद खोजें..." : "Search Products..."}
              className={styles.searchInput}
              id="products-search-input"
            />
            <button type="submit" className={styles.searchSubmitBtn} id="products-search-submit">
              {language === "hi" ? "खोजें" : "Search"}
            </button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className={styles.filterSection}>
          <div className={styles.filterLabel}>
            {language === "hi" ? "संग्रह:" : "Collections:"}
          </div>
          <div className={styles.pillsRow}>
            <button
              type="button"
              onClick={() => updateParam("category", "all")}
              className={`pill-control ${activeCategory === "all" ? "pill-control--active" : ""}`}
              id="filter-pill-all"
            >
              {language === "hi" ? "सभी उत्पाद" : "All Pieces"} ({allProducts.length})
            </button>

            {categories.map((cat) => {
              const count = allProducts.filter((p) => p.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateParam("category", cat.slug)}
                  className={`pill-control ${activeCategory === cat.slug ? "pill-control--active" : ""}`}
                  id={`filter-pill-${cat.slug}`}
                >
                  {getLocalizedCategoryName(cat, language)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-category Pills (if category selected) */}
        {activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0 && (
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
                  ? `सभी ${getLocalizedCategoryName(activeCategoryObj, language)}`
                  : `All ${activeCategoryObj.name}`}
              </button>
              {activeCategoryObj.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => updateParam("subcat", sub)}
                  className={`pill-control ${activeSubcat.toLowerCase() === sub.toLowerCase() ? "pill-control--active" : ""}`}
                >
                  {getLocalizedSubcategoryName(sub, language)}
                </button>
              ))}
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
              {language === "hi" ? "थोक / कोट" : "Wholesale / Quote"}
            </button>
          </div>

          {/* Sort Controls */}
          <div className={styles.sortControls}>
            <span className={styles.subFilterLabel}>
              {language === "hi" ? "क्रम:" : "Sort:"}
            </span>
            <div className={styles.sortButtonGroup}>
              <button
                type="button"
                onClick={() => updateParam("sort", "relevance")}
                className={`${styles.sortOption} ${sortOption === "relevance" ? styles.sortOptionActive : ""}`}
              >
                {language === "hi" ? "विशेष" : "Featured"}
              </button>
              <button
                type="button"
                onClick={() => updateParam("sort", "price-low")}
                className={`${styles.sortOption} ${sortOption === "price-low" ? styles.sortOptionActive : ""}`}
              >
                {language === "hi" ? "मूल्य: कम से अधिक" : "Price: Low → High"}
              </button>
              <button
                type="button"
                onClick={() => updateParam("sort", "price-high")}
                className={`${styles.sortOption} ${sortOption === "price-high" ? styles.sortOptionActive : ""}`}
              >
                {language === "hi" ? "मूल्य: अधिक से कम" : "Price: High → Low"}
              </button>
              <button
                type="button"
                onClick={() => updateParam("sort", "newest")}
                className={`${styles.sortOption} ${sortOption === "newest" ? styles.sortOptionActive : ""}`}
              >
                {language === "hi" ? "नवीनतम" : "Newest"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className={styles.resultsSummary}>
          <span>
            {language === "hi" ? "दिखाए जा रहे हैं" : "Showing"}{" "}
            <strong>{filtered.length}</strong>{" "}
            {language === "hi" ? "उत्पाद" : "product" + (filtered.length !== 1 ? "s" : "")}
            {searchQuery && ` (${searchQuery})`}
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

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              {language === "hi" ? "कोई उत्पाद नहीं मिला" : "No matching products found"}
            </p>
            <p className={styles.emptySubtitle}>
              {language === "hi"
                ? "कृपया कोई अन्य श्रेणी चुनें या खोज फ़िल्टर साफ़ करें।"
                : "Try selecting a different category or clearing the active search filters."}
            </p>
            <button
              type="button"
              onClick={() => {
                setInputQuery("");
                router.push("/products");
              }}
              className="btn btn-primary"
            >
              {language === "hi" ? "फ़िल्टर हटाएं" : "Clear Filters"}
            </button>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filtered.map((product) => {
              const hasPrice = product.price !== null && product.price > 0;
              const compPrice = product.compareAtPrice && product.compareAtPrice > (product.price || 0)
                ? product.compareAtPrice
                : hasPrice
                ? Math.round(product.price! * 1.25)
                : null;
              const discount = hasPrice && compPrice
                ? Math.round(((compPrice - product.price!) / compPrice) * 100)
                : 0;
              const rating = product.rating || 4.8;
              const reviewsCount = product.reviewsCount || 24;
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

                  {/* Card Content */}
                  <div className={styles.cardContent}>
                    <div className={styles.cardMetaRow}>
                      <span className={styles.categoryLabel}>{displayCategory}</span>
                      <div className={styles.ratingBox}>
                        <span style={{ color: "#FFB300" }}>★</span>
                        <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--sapphire)" }}>{rating}</span>
                        <span style={{ fontSize: "0.7rem", color: "#8E9BAE" }}>({reviewsCount})</span>
                      </div>
                    </div>

                    <h2 className={styles.productName}>
                      <Link href={`/products/${product.slug}`}>{displayName}</Link>
                    </h2>

                    <div className={styles.priceRow}>
                      {hasPrice ? (
                        <div className={styles.priceGroup}>
                          <span className={styles.priceVal}>
                            ₹{product.price!.toLocaleString("en-IN")}
                          </span>
                          {compPrice && (
                            <span className={styles.comparePriceVal}>
                              ₹{compPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={styles.quoteVal}>
                          {t("customQuoteWholesale")}
                        </span>
                      )}
                    </div>

                    <div className={styles.actionsCol}>
                      <div className={styles.commerceButtons}>
                        <button
                          type="button"
                          onClick={() => {
                            if (hasPrice) {
                              addItem({
                                id: product.id,
                                variantId: product.variantId,
                                name: displayName,
                                slug: product.slug,
                                price: product.price!,
                                image: currentImage,
                                category: displayCategory,
                              }, 1);
                            } else {
                              router.push(`/products/${product.slug}`);
                            }
                          }}
                          className={styles.addCartBtn}
                        >
                          {t("addToBag")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (hasPrice) {
                              addItem({
                                id: product.id,
                                variantId: product.variantId,
                                name: displayName,
                                slug: product.slug,
                                price: product.price!,
                                image: currentImage,
                                category: displayCategory,
                              }, 1);
                              router.push("/checkout");
                            } else {
                              router.push(`/products/${product.slug}`);
                            }
                          }}
                          className={styles.buyNowBtn}
                        >
                          {t("buyNow")}
                        </button>
                      </div>

                      <a
                        href={getWhatsAppUrl(product, whatsappNumber, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.waBtn}
                        title={t("whatsAppEnquiry")}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                        </svg>
                        {t("whatsAppEnquiry")}
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
