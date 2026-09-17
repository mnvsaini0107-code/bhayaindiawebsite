import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import { getGallery } from "@/lib/db";
import styles from "./gallery.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visual Gallery — Workshops, Products & Facilities | BHAYA INDIA",
  description:
    "A visual glimpse into authentic artisan workshops, product lines, and verified manufacturing partners of BHAYA INDIA.",
};

export default function GalleryPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const allItems = getGallery();
  const activeCategory = searchParams?.category || "all";

  const filtered = allItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const categories = [
    { label: "All Works", value: "all" },
    { label: "Products", value: "Products" },
    { label: "Company & Ateliers", value: "Company" },
    { label: "Projects & Trunks", value: "Projects" },
    { label: "Business", value: "Business" },
  ];

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Visual Gallery</span>
            </div>
            <span className={styles.eyebrow}>VISUAL CHRONICLE</span>
            <h1 className={styles.title}>Workshops, Craft & Products</h1>
            <p className={styles.subtitle}>
              A visual glimpse into authentic artisan workshops, product lines, and verified partner manufacturing units.
            </p>
          </div>
        </div>

        <div className="container">
          {/* Category Tabs */}
          <div className={styles.filterTabs}>
            {categories.map((c) => (
              <Link
                key={c.value}
                href={c.value === "all" ? "/gallery" : `/gallery?category=${c.value}`}
                className={`${styles.tabBtn} ${activeCategory === c.value ? styles.tabActive : ""}`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border-medium)",
                borderRadius: "8px",
                padding: "60px 32px",
                textAlign: "center",
                maxWidth: "680px",
                margin: "0 auto 4rem",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "rgba(197,160,89,0.15)",
                  color: "var(--gold)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  marginBottom: "16px",
                }}
              >
                Photography In Progress — Coming Soon
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  color: "var(--sapphire)",
                  marginBottom: "12px",
                }}
              >
                Authentic Visual Documentation Coming Soon
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                In accordance with our strict truthful content policy, we do not use stock library photos. We are currently photographing verified artisan workshops, manufacturing facilities, and product batches. Original imagery will be published here shortly.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link href="/products" className="btn btn-primary">
                  Browse Product Catalogue →
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Request Sample Photographs
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {filtered.map((img) => (
                <div key={img.id} className={styles.galleryCard} id={`gallery-${img.id}`}>
                  <div className={styles.imgWrap}>
                    <Image
                      src={img.url}
                      alt={img.title}
                      fill
                      className={styles.img}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className={styles.categoryTag}>{img.category}</span>
                  </div>
                  <div className={styles.captionArea}>
                    <h3 className={styles.imgTitle}>{img.title}</h3>
                    {img.caption && <p className={styles.imgCaption}>{img.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.ctaBox}>
            <p>Looking for high-resolution material swatches or bespoke corporate gifting samples?</p>
            <Link href="/contact" className="btn btn-primary">
              Connect With Our Studio Desk →
            </Link>
          </div>
        </div>

        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
