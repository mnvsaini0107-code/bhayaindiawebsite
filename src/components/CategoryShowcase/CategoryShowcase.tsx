import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/db";
import type { Category } from "@/lib/types";
import styles from "./CategoryShowcase.module.css";

export default function CategoryShowcase() {
  const categories = getCategories();
  if (!categories || categories.length === 0) return null;

  const [leadCategory, ...supportingCategories] = categories;
  const displaySupporting = supportingCategories.slice(0, 4);

  return (
    <section className={`section section--warm ${styles.categorySection}`} aria-labelledby="categories-heading">
      <div className="container">
        {/* Editorial Section Header */}
        <div className={styles.sectionHeader}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            Our Collection
          </div>
          <div className={styles.headerRow}>
            <h2 className={styles.sectionHeading} id="categories-heading">
              Curated Artisan Collections
            </h2>
            <Link href="/products" className={styles.exploreAllLink}>
              View Complete Catalogue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Editorial Layout: Lead Feature + Supporting Grid */}
        <div className={styles.editorialGrid}>
          {/* Lead Featured Category */}
          {leadCategory && (
            <Link
              href={`/products?category=${leadCategory.slug}`}
              className={styles.leadCard}
              id={`cat-card-${leadCategory.slug}`}
            >
              <div className={styles.leadImageWrap}>
                <Image
                  src={leadCategory.image}
                  alt={leadCategory.name}
                  fill
                  className={styles.cardImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.leadOverlay} />
              </div>
              <div className={styles.leadContent}>
                <span className={styles.countPill}>
                  {leadCategory.productCount} Certified Pieces
                </span>
                <h3 className={styles.leadTitle}>{leadCategory.name}</h3>
                <p className={styles.leadDesc}>{leadCategory.description}</p>
                <span className={styles.leadAction}>
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          )}

          {/* Supporting Categories */}
          <div className={styles.supportingGrid}>
            {displaySupporting.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.supportingCard}
                id={`cat-card-${cat.slug}`}
              >
                <div className={styles.supportingImageWrap}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className={styles.supportingOverlay} />
                </div>
                <div className={styles.supportingContent}>
                  <span className={styles.supportingCount}>
                    {cat.productCount} Pieces
                  </span>
                  <h3 className={styles.supportingTitle}>{cat.name}</h3>
                  <p className={styles.supportingDesc}>{cat.description}</p>
                  <span className={styles.supportingLink}>
                    Discover &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
