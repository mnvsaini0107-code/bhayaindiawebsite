import Link from "next/link";
import styles from "./SellerCTA.module.css";
import { getPageContent } from "@/lib/db";

export default function SellerCTA() {
  const content = getPageContent();

  return (
    <section className={styles.section} aria-labelledby="seller-heading">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.content}>
            <h2 className={styles.heading} id="seller-heading">
              {content.sellerCta.headline}
            </h2>
            <p className={styles.desc}>
              {content.sellerCta.body}
            </p>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.cta}>
            <Link
              href="/contact?subject=seller-enquiry"
              className={styles.ctaPrimary}
              id="become-seller-btn"
            >
              {content.sellerCta.ctaText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <p className={styles.ctaNote}>
              Register your interest — our partnership desk will reach out directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
