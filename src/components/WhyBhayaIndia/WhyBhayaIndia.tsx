import styles from "./WhyBhayaIndia.module.css";
import { getPageContent } from "@/lib/db";

export default function WhyBhayaIndia() {
  const content = getPageContent();
  const pillars = content.whyBhaya?.pillars || [
    {
      title: "Authentic Craftsmanship",
      desc: "Every product in our catalogue is sourced directly from vetted master weavers, artisanal guilds, and certified domestic manufacturers.",
    },
    {
      title: "Transparent & Honest Value",
      desc: "Zero hidden surcharges. Direct-to-door commercial pricing that honors our artisan creators and delivers measurable enterprise value.",
    },
    {
      title: "Comprehensive Range",
      desc: "From pure handloom silks and executive leather stationery to festive gifting trunks and bulk supplies, all under one certified umbrella.",
    },
    {
      title: "Dedicated Client Concierge",
      desc: "Personalized assistance for corporate orders, custom branding, wholesale allocations, and punctual pan-India dispatch.",
    },
  ];

  return (
    <section className={`section ${styles.whySection}`} aria-labelledby="why-heading">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {content.whyBhaya.eyebrow || "Why Choose Bhaya India"}
          </div>

          <div className={styles.headerRow}>
            <h2 className={styles.title} id="why-heading">
              {content.whyBhaya.headline || "Principles That Endure"}
            </h2>
            <p className={styles.subtitle}>
              Our foundational commitments guide every transaction — from individual retail orders to wholesale consignments with genuine trust.
            </p>
          </div>
        </div>

        {/* 4 Numbered Editorial Pillars */}
        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, idx) => (
            <div key={idx} className={styles.pillarItem} id={`why-pillar-${idx + 1}`}>
              <div className={styles.pillarIndex}>
                0{idx + 1}
              </div>
              <div className={styles.pillarDivider} />
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarText}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
