import Link from "next/link";
import styles from "./BhayaIndia2.module.css";
import { getPageContent } from "@/lib/db";

const defaultPillars = [
  {
    num: "01",
    title: "Multi-Seller Platform",
    text: "Enabling authenticated regional weavers, craftsmen, and master manufacturers across India to list certified products directly.",
  },
  {
    num: "02",
    title: "Verified Quality Protocol",
    text: "Every piece systematically inspected for material grade, hallmark authenticity, and honest transparent pricing.",
  },
  {
    num: "03",
    title: "Enterprise Commercial Tools",
    text: "Equipping bulk purchasers, corporate gifting desks, and retailers with instant quote generation and tracked dispatch.",
  },
  {
    num: "04",
    title: "Pan-India Logistics Infrastructure",
    text: "Scalable fulfillment network reaching over 19,000+ pincodes nationwide with guaranteed transit integrity.",
  },
];

export default function BhayaIndia2() {
  const content = getPageContent();

  return (
    <section className={styles.section} aria-labelledby="bi2-heading">
      <div className="container">
        <div className={styles.inner}>
          {/* Top Editorial Row */}
          <div className={styles.headerRow}>
            <div className={styles.copyCol}>
              <div className="eyebrow eyebrow--gold">
                <span className="eyebrow-line" />
                Future Platform Vision
              </div>

              <h2 className={styles.heading} id="bi2-heading">
                BHAYA INDIA 2.0
              </h2>

              <p className={styles.subheading}>
                {content.bhaya2.subheadline || "A Unified Multi-Vendor B2B & B2C Marketplace"}
              </p>

              <p className={styles.desc}>
                {content.bhaya2.body ||
                  "We are architecting the next era of digital commerce — connecting verified regional artisans and certified manufacturers directly with institutional buyers, corporate desks, and discerning consumers under the trusted hallmark of Bhaya India."}
              </p>

              <div className={styles.actionRow}>
                <Link href="/about#vision" className={`btn ${styles.btnGold}`} id="bi2-vision-link">
                  Explore Future Roadmap
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Roadmap Pillars */}
            <div className={styles.pillarsCol}>
              {defaultPillars.map((p) => (
                <div key={p.num} className={styles.pillar}>
                  <span className={styles.pillarNumber}>{p.num}</span>
                  <div className={styles.pillarContent}>
                    <h3 className={styles.pillarTitle}>{p.title}</h3>
                    <p className={styles.pillarText}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
