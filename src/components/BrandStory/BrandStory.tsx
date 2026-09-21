"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./BrandStory.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function BrandStory() {
  const { t } = useLanguage();

  return (
    <section className={`section section--subtle ${styles.storySection}`} aria-labelledby="story-heading">
      <div className="container">
        <div className={styles.splitLayout}>
          {/* Visual Column */}
          <div className={styles.visualCol}>
            <div className={styles.imageFrame}>
              <Image
                src="/assets/category-textiles.jpg"
                alt="Bhaya India — heritage craftsmanship, textiles and authentic trade"
                fill
                className={styles.storyImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className={styles.imageOverlay} />
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className={styles.contentCol}>
            <div className="eyebrow eyebrow--gold">
              <span className="eyebrow-line" />
              {t("storyEyebrow")}
            </div>

            <h2 className={styles.heading} id="story-heading">
              {t("storyHeadline")}
            </h2>

            <div className={styles.bodyText}>
              <p>{t("storyP1")}</p>

              <blockquote className={styles.pullQuote}>
                <span className={`${styles.pullQuoteText} font-devanagari`}>
                  &ldquo;जहाँ भाया, वहाँ भरोसा&rdquo;
                </span>
                <span className={styles.pullQuoteAuthor}>{t("storyQuote")}</span>
              </blockquote>

              <p>{t("storyP2")}</p>
            </div>

            <div className={styles.actionRow}>
              <Link href="/about" className={styles.storyLink} id="story-about-link">
                {t("storyReadMore")}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
