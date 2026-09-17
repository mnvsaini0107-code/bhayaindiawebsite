import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getProducts, getCategories, getSiteSettings, Product } from "@/lib/db";
import styles from "./products.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue — Handcrafted Textiles, Executive Stationery & Fine Gifting | Bhaya India",
  description:
    "Explore Bhaya India's certified collection — pure handloom silks, fine stationery, corporate hampers and wholesale consignments across India.",
};

function getWhatsAppUrl(product: Product, whatsappNumber: string) {
  const msg = `नमस्कार, मुझे BHAYA INDIA के इस product के बारे में जानकारी चाहिए:

Product Name: ${product.name}
Quantity: 1`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcat?: string; q?: string; sort?: string; price?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "all";
  const activeSubcat = resolvedParams.subcat || "";
  const searchQuery = resolvedParams.q || "";
  const sortOption = resolvedParams.sort || "relevance";
  const priceFilter = resolvedParams.price || "all";

  const allProducts = getProducts().filter((p) => p.isPublished);
  const categories = getCategories();
  const settings = getSiteSettings();

  const filtered = allProducts.filter((p) => {
    const matchesCat = activeCategory === "all" || p.categorySlug === activeCategory;
    const matchesSubcat = !activeSubcat || p.subcategory.toLowerCase() === activeSubcat.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

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

  // Sorting
  if (sortOption === "price-low") {
    filtered.sort((a, b) => (a.price || 999999) - (b.price || 999999));
  } else if (sortOption === "price-high") {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Page Hero Header */}
        <div className={styles.pageHero}>
          <div className="container">
            <div className="eyebrow eyebrow--gold">
              <span className="eyebrow-line" />
              Catalogue & Allocations
            </div>

            <h1 className={styles.pageTitle}>
              {activeCategory !== "all" ? activeCategoryObj?.name : "The Complete Collection"}
            </h1>

            <p className={styles.pageDesc}>
              {activeCategoryObj?.description ||
                "Certified craftsmanship across pure handloom silks, executive stationery, festive gifting trunks, and wholesale goods with guaranteed quality."}
            </p>
          </div>
        </div>

        <div className="container">
          {/* Search Products Bar (Section 4) */}
          <div className={styles.searchBarRow}>
            <form action="/products" method="GET" className={styles.searchForm}>
              {activeCategory !== "all" && <input type="hidden" name="category" value={activeCategory} />}
              {activeSubcat && <input type="hidden" name="subcat" value={activeSubcat} />}
              {priceFilter !== "all" && <input type="hidden" name="price" value={priceFilter} />}
              {sortOption !== "relevance" && <input type="hidden" name="sort" value={sortOption} />}
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search Products..."
                className={styles.searchInput}
                id="products-search-input"
              />
              <button type="submit" className={styles.searchSubmitBtn} id="products-search-submit">
                Search
              </button>
            </form>
          </div>

          {/* Category Filter Pills (Section 4) */}
          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Collections:</div>
            <div className={styles.pillsRow}>
              <Link
                href={`/products${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`pill-control ${activeCategory === "all" ? "pill-control--active" : ""}`}
                id="filter-pill-all"
              >
                All Pieces ({allProducts.length})
              </Link>

              {categories.map((cat) => {
                const count = allProducts.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                    className={`pill-control ${activeCategory === cat.slug ? "pill-control--active" : ""}`}
                    id={`filter-pill-${cat.slug}`}
                  >
                    {cat.name} ({count})
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sub-category Pills (if category selected) */}
          {activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0 && (
            <div className={styles.filterSection} style={{ marginTop: "-0.5rem" }}>
              <div className={styles.filterLabel}>Sub-Category:</div>
              <div className={styles.pillsRow}>
                <Link
                  href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${priceFilter !== "all" ? `&price=${priceFilter}` : ""}&sort=${sortOption}`}
                  className={`pill-control ${!activeSubcat ? "pill-control--active" : ""}`}
                >
                  All {activeCategoryObj.name}
                </Link>
                {activeCategoryObj.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/products?category=${activeCategory}&subcat=${encodeURIComponent(sub)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}${priceFilter !== "all" ? `&price=${priceFilter}` : ""}&sort=${sortOption}`}
                    className={`pill-control ${activeSubcat.toLowerCase() === sub.toLowerCase() ? "pill-control--active" : ""}`}
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Bar: Price Slabs & Sorting Toolbar */}
          <div className={styles.toolbarRow}>
            {/* Price Slabs */}
            <div className={styles.pricePillsRow}>
              <span className={styles.subFilterLabel}>Price:</span>
              <Link
                href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&price=all&sort=${sortOption}`}
                className={`${styles.pricePill} ${priceFilter === "all" ? styles.pricePillActive : ""}`}
              >
                All
              </Link>
              <Link
                href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&price=under-1000&sort=${sortOption}`}
                className={`${styles.pricePill} ${priceFilter === "under-1000" ? styles.pricePillActive : ""}`}
              >
                Under ₹1,000
              </Link>
              <Link
                href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&price=1000-3000&sort=${sortOption}`}
                className={`${styles.pricePill} ${priceFilter === "1000-3000" ? styles.pricePillActive : ""}`}
              >
                ₹1,000 – ₹3,000
              </Link>
              <Link
                href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&price=above-3000&sort=${sortOption}`}
                className={`${styles.pricePill} ${priceFilter === "above-3000" ? styles.pricePillActive : ""}`}
              >
                Above ₹3,000
              </Link>
              <Link
                href={`/products?category=${activeCategory}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&price=quote&sort=${sortOption}`}
                className={`${styles.pricePill} ${priceFilter === "quote" ? styles.pricePillActive : ""}`}
              >
                Wholesale / Quote
              </Link>
            </div>

            {/* Sort Controls */}
            <div className={styles.sortControls}>
              <span className={styles.subFilterLabel}>Sort:</span>
              <div className={styles.sortButtonGroup}>
                <Link
                  href={`/products?category=${activeCategory}&price=${priceFilter}&sort=relevance${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className={`${styles.sortOption} ${sortOption === "relevance" ? styles.sortOptionActive : ""}`}
                >
                  Featured
                </Link>
                <Link
                  href={`/products?category=${activeCategory}&price=${priceFilter}&sort=price-low${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className={`${styles.sortOption} ${sortOption === "price-low" ? styles.sortOptionActive : ""}`}
                >
                  Price: Low &rarr; High
                </Link>
                <Link
                  href={`/products?category=${activeCategory}&price=${priceFilter}&sort=price-high${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className={`${styles.sortOption} ${sortOption === "price-high" ? styles.sortOptionActive : ""}`}
                >
                  Price: High &rarr; Low
                </Link>
                <Link
                  href={`/products?category=${activeCategory}&price=${priceFilter}&sort=newest${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className={`${styles.sortOption} ${sortOption === "newest" ? styles.sortOptionActive : ""}`}
                >
                  Newest
                </Link>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className={styles.resultsSummary}>
            <span>
              Showing <strong>{filtered.length}</strong> certified product{filtered.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </span>

            {(activeCategory !== "all" || priceFilter !== "all" || searchQuery) && (
              <Link href="/products" className={styles.resetLink}>
                Reset all filters
              </Link>
            )}
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No matching products found</p>
              <p className={styles.emptySubtitle}>
                Try selecting a different category or clearing the active price filters.
              </p>
              <Link href="/products" className="btn btn-primary">
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filtered.map((product) => {
                const hasPrice = product.price !== null;
                return (
                  <article key={product.id} className={styles.card} id={`product-${product.sku}`}>
                    <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
                      <Image
                        src={product.images[0] || "/assets/category-textiles.jpg"}
                        alt={product.name}
                        fill
                        className={styles.productImg}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {product.isNew && <span className={styles.badge}>New</span>}
                    </Link>

                    <div className={styles.cardContent}>
                      <span className={styles.categoryLabel}>{product.category}</span>
                      <h2 className={styles.productName}>
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h2>

                      <div className={styles.priceRow}>
                        {hasPrice ? (
                          <div className={styles.priceGroup}>
                            <span className={styles.priceVal}>
                              ₹{product.price!.toLocaleString("en-IN")}
                            </span>
                            {product.priceNote && (
                              <span className={styles.priceNote}>{product.priceNote}</span>
                            )}
                          </div>
                        ) : (
                          <span className={styles.quoteVal}>Get Custom Quote</span>
                        )}
                      </div>

                      <div className={styles.actionsRow}>
                        <Link
                          href={`/products/${product.slug}`}
                          className={styles.viewPieceBtn}
                          id={`view-${product.sku}`}
                        >
                          View Piece
                        </Link>
                        <a
                          href={getWhatsAppUrl(product, settings.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.waBtn}
                          title={`Enquire on WhatsApp for ${product.name}`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                          </svg>
                          WhatsApp Enquiry
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
      <Footer />
    </>
  );
}
