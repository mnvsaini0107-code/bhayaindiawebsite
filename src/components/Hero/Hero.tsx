"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

interface HeroProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
}

export default function Hero({
  eyebrow = "BHAYA INDIA — TRUSTED CRAFTSMANSHIP",
  headline = "Quality Products. Uncompromising Trust.",
  subheadline = "Delivering certified textiles, luxury executive stationery, bespoke gifting trunks, and wholesale goods with master heritage and contemporary reliability across India.",
  ctaPrimaryText = "Explore Catalogue",
  ctaSecondaryText = "Enquire Now",
}: HeroProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <section className={styles.heroSection} aria-label="Welcome to Bhaya India">
        <div className="container">
          <div className={styles.heroLayout}>
            {/* Editorial Copy Column */}
            <div className={styles.heroCopy}>
              <div className="eyebrow eyebrow--gold">
                <span className="eyebrow-line" />
                {eyebrow}
              </div>

              <h1 className={styles.heroHeading}>
                {headline}
              </h1>

              <p className={styles.heroSubtext}>
                {subheadline}
              </p>

              <div className={styles.heroCtas}>
                <Link
                  href="/products"
                  className="btn btn-primary"
                  id="hero-explore-products-btn"
                >
                  {ctaPrimaryText}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className="btn btn-secondary"
                  id="hero-enquire-btn"
                >
                  {ctaSecondaryText}
                </button>
              </div>

              <div className={styles.heroNote}>
                <span className={styles.heroNoteDot} />
                <span className="font-devanagari">जहाँ भाया, वहाँ भरोसा</span>
                <span className={styles.heroNoteSep}>·</span>
                <span>Pan-India Certified Delivery</span>
              </div>
            </div>

            {/* Editorial Visual Column */}
            <div className={styles.heroVisualCol}>
              <div className={styles.imageFrame}>
                <Image
                  src="/assets/hero-editorial.jpg"
                  alt="Curated Bhaya India signature collection — premium textiles, artisanal stationery, and fine gifting"
                  fill
                  priority
                  className={styles.heroImage}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className={styles.imageOverlay} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="Catalogue Consultation & Bulk Orders"
      />
    </>
  );
}
