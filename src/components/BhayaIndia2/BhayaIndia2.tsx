import Link from "next/link";
import styles from "./BhayaIndia2.module.css";
import { getPageContent } from "@/lib/db";

const defaultPillars = [
  {
    num: "01",
    title: "Shopkeeper & Vendor Network (Coming Soon)",
    text: "Enabling verified local shopkeepers and retail merchants to join the BHAYA INDIA digital ecosystem.",
  },
  {
    num: "02",
    title: "Direct Manufacturer Tie-ups (Coming Soon)",
    text: "Connecting regional manufacturers directly with customers and institutional buyers across India.",
  },
  {
    num: "03",
    title: "Wholesale & B2B Hub (Operational)",
    text: "Facilitating transparent product sourcing, bulk allocation, and customized corporate enquiries.",
  },
  {
    num: "04",
    title: "Integrated Logistics & Marketplace (Future Vision)",
    text: "Building end-to-end fulfillment, digital storefronts, and multi-seller tools under one trusted umbrella.",
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
                Future Platform Vision • Coming Soon
              </div>

              <h2 className={styles.heading} id="bi2-heading">
                BHAYA INDIA 2.0
              </h2>

              <p className={styles.subheading}>
                एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा
              </p>

              <p className={styles.desc}>
                {content.bhaya2.body ||
                  "Customer ➔ BHAYA INDIA ➔ Shopkeeper / Manufacturer. We are architecting a connected ecosystem for vendors, manufacturers, wholesale, and logistics under one trusted name."}
              </p>

              <div className={styles.actionRow}>
                <Link href="/bhaya-india-2" className={`btn ${styles.btnGold}`} id="bi2-vision-link">
                  Explore BHAYA INDIA 2.0 Vision
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
