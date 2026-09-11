import Link from "next/link";
import Image from "next/image";
import styles from "./BrandStory.module.css";
import { getPageContent } from "@/lib/db";

export default function BrandStory() {
  const content = getPageContent();

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
              {content.brandStory.eyebrow || "Our Story"}
            </div>

            <h2 className={styles.heading} id="story-heading">
              {content.brandStory.headline || "From a Trusted Merchant Counter to a Pan-India Digital Enterprise"}
            </h2>

            <div className={styles.bodyText}>
              <p>
                {content.brandStory.paragraph1 ||
                  "Built on the foundational promise of 'जहाँ भाया, वहाँ भरोसा', Bhaya India originated as a family merchant house deeply anchored in customer relationships, authenticated sourcing, and honorable pricing."}
              </p>

              <blockquote className={styles.pullQuote}>
                <span className={`${styles.pullQuoteText} font-devanagari`}>
                  &ldquo;जहाँ भाया, वहाँ भरोसा&rdquo;
                </span>
                <span className={styles.pullQuoteAuthor}>The Bhaya India Quality Pledge</span>
              </blockquote>

              <p>
                {content.brandStory.paragraph2 ||
                  "Today, we bring that same personal dedication into a scalable digital ecosystem — offering corporate institutions, retail buyers, and discerning households direct access to verified Indian craftsmanship."}
              </p>
            </div>

            <div className={styles.actionRow}>
              <Link href="/about" className={styles.storyLink} id="story-about-link">
                Read the Complete Journey
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
