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
  title: "Visual Gallery — Heritage Looms & Products | Bhaya India",
  description:
    "Explore the visual world of Bhaya India — authentic handloom workshops, leathercraft ateliers, festival gifting assembly, and certified products.",
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
            <h1 className={styles.title}>Heritage in Every Thread</h1>
            <p className={styles.subtitle}>
              A visual glimpse into our master artisan workshops, material selection, and completed corporate allocations across India.
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

          <div className={styles.ctaBox}>
            <p>Looking for high-resolution swatches or bespoke corporate gifting samples?</p>
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
