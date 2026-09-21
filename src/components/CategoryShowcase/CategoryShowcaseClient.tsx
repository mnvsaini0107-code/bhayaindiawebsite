"use client";

import Link from "next/link";
import Image from "next/image";
import type { BhayaCollection } from "@/lib/shopify/types";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedCategoryName, getLocalizedCategoryDesc } from "@/lib/shopify/utils";
import styles from "./CategoryShowcase.module.css";

export default function CategoryShowcaseClient({ categories }: { categories: BhayaCollection[] }) {
  const { language, t } = useLanguage();

  if (!categories || categories.length === 0) return null;

  // Circular strip items representing core categories + directions
  const circularItems = [
    { name: t("catFestival"), slug: "gift-hampers", image: "/assets/hero-editorial.jpg" },
    { name: t("catTextiles"), slug: "textiles-fabrics", image: "/assets/category-textiles.jpg" },
    { name: t("catStationery"), slug: "stationery-office", image: "/assets/category-stationery.jpg" },
    { name: t("catHampers"), slug: "gift-hampers", image: "/assets/hero-editorial.jpg" },
    { name: t("catHomeLiving"), slug: "home-living", image: "/assets/category-textiles.jpg" },
    { name: t("catWholesale"), slug: "wholesale-bulk", image: "/assets/category-stationery.jpg" },
    { name: t("catRetail"), slug: "all", image: "/assets/hero-editorial.jpg" },
  ];

  return (
    <section className={`section section--warm ${styles.categorySection}`} aria-labelledby="categories-heading">
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {t("catShowcaseEyebrow")}
          </div>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionHeading} id="categories-heading">
              {t("catShowcaseHeadline")}
            </h2>
            <Link href="/products" className={styles.exploreAllLink}>
              {t("catShowcaseViewAll")}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Circular / Category Presentation */}
        <div className={styles.circularStrip} aria-label="Quick Category Selection">
          {circularItems.map((item, idx) => (
            <Link
              key={idx}
              href={`/products?category=${item.slug}`}
              className={styles.circularCard}
              id={`cat-circle-${item.slug}`}
            >
              <div className={styles.circularRing}>
                <div className={styles.circularThumb}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={styles.circularImg}
                    sizes="90px"
                  />
                </div>
              </div>
              <span className={styles.circularLabel}>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Main Grid: Collections with Subcategories */}
        <div className={styles.gridShowcase}>
          {categories.map((cat) => {
            const displayName = getLocalizedCategoryName(cat, language);
            const displayDesc = getLocalizedCategoryDesc(cat, language);
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.categoryCard}
                id={`cat-card-${cat.slug}`}
              >
                <div className={styles.cardImageWrap}>
                  <Image
                    src={cat.image}
                    alt={displayName}
                    fill
                    className={styles.cardImg}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className={styles.cardOverlay} />
                  <div className={styles.cardContent}>
                    <span className={styles.countBadge}>
                      {cat.productCount > 0 ? t("catProductsCount", { count: cat.productCount }) : t("catCatalogueText")}
                    </span>
                    <h3 className={styles.cardTitle}>{displayName}</h3>
                    <p className={styles.cardDesc}>{displayDesc}</p>
                    <span className={styles.cardCta}>
                      {t("catExploreCta")} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
