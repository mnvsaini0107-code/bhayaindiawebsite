import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import ProductDetailClient from "@/components/ProductDetail/ProductDetailClient";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/db";
import styles from "./product-detail.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Bhaya India" };
  return {
    title: product.seoTitle || `${product.name} — ${product.category}`,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const settings = getSiteSettings();
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug && p.isPublished)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Breadcrumb Bar */}
        <div className={styles.breadcrumbBar}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <Link href="/products">Products</Link>
              <span className={styles.sep}>/</span>
              <Link href={`/products?category=${product.categorySlug}`}>
                {product.category}
              </Link>
              <span className={styles.sep}>/</span>
              <span aria-current="page">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Main Section */}
        <div className="container">
          <div className={styles.productLayout}>
            {/* Gallery handled by Client component */}
            <div className={styles.gallery}>
              <ProductDetailClient
                product={product}
                whatsappNumber={settings.whatsapp}
                phone={settings.phone}
              />
            </div>

            {/* Product Meta & Description */}
            <div className={styles.info}>
              <div className={styles.infoKicker}>
                <Link
                  href={`/products?category=${product.categorySlug}`}
                  className={styles.categoryLink}
                >
                  {product.category}
                </Link>
                <span className={styles.dot}>·</span>
                <span className={styles.subcategory}>{product.subcategory}</span>
                <span className={styles.dot}>·</span>
                <span className={styles.sku}>SKU: {product.sku}</span>
              </div>

              <h1 className={styles.productName}>{product.name}</h1>
              {product.tagline && (
                <p className={styles.productTagline}>{product.tagline}</p>
              )}

              <div className={styles.pricingRow}>
                {product.price !== null ? (
                  <div className={styles.pricing}>
                    <span className={styles.price}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.priceNote && (
                      <span className={styles.priceNote}>{product.priceNote}</span>
                    )}
                  </div>
                ) : (
                  <div className={styles.pricing}>
                    <span className={styles.priceQuote}>Custom Quotation</span>
                    <span className={styles.priceNote}>
                      {product.priceNote || "Volume discounts available upon request"}
                    </span>
                  </div>
                )}
              </div>

              <p className={styles.description}>{product.description}</p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className={styles.features}>
                  <h2 className={styles.sectionLabel}>Key Features & Craftsmanship</h2>
                  <ul className={styles.featureList}>
                    {product.features.map((f, i) => (
                      <li key={i} className={styles.featureItem}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className={styles.features}>
                  <h2 className={styles.sectionLabel}>Benefits & Purpose</h2>
                  <ul className={styles.featureList}>
                    {product.benefits.map((b, i) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.bulletDot}>•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications Table */}
              {product.specs && product.specs.length > 0 && (
                <div className={styles.specs}>
                  <h2 className={styles.sectionLabel}>Technical Specifications</h2>
                  <table className={styles.specTable}>
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr key={i} className={styles.specRow}>
                          <th className={styles.specLabel}>{spec.label}</th>
                          <td className={styles.specValue}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Showcase */}
          {relatedProducts.length > 0 && (
            <div className={styles.related}>
              <h2 className={styles.relatedTitle}>You May Also Appreciate</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/products/${rp.slug}`}
                    className={styles.relatedCard}
                    id={`related-${rp.sku}`}
                  >
                    <div className={styles.relatedImageWrap}>
                      <Image
                        src={rp.images[0] || "/assets/category-textiles.jpg"}
                        alt={rp.name}
                        fill
                        className={styles.relatedImage}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{rp.name}</p>
                      <p className={styles.relatedPrice}>
                        {rp.price ? `₹${rp.price.toLocaleString("en-IN")}` : "Get Quote"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
