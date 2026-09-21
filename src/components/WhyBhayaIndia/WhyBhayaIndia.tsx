"use client";

import styles from "./WhyBhayaIndia.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyBhayaIndia() {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t("whyPillar1Title"),
      desc: t("whyPillar1Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
    },
    {
      title: t("whyPillar2Title"),
      desc: t("whyPillar2Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m4.93 4.93 4.24 4.24"/>
          <path d="m14.83 9.17 4.24-4.24"/>
          <path d="m14.83 14.83 4.24 4.24"/>
          <path d="m9.17 14.83-4.24 4.24"/>
          <circle cx="12" cy="12" r="4"/>
        </svg>
      ),
    },
    {
      title: t("whyPillar3Title"),
      desc: t("whyPillar3Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      ),
    },
    {
      title: t("whyPillar4Title"),
      desc: t("whyPillar4Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.whySection} aria-labelledby="why-heading">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className="eyebrow" style={{ color: "var(--gold, #C5A059)" }}>
            <span className="eyebrow-line" style={{ background: "var(--gold, #C5A059)" }} />
            {t("whyEyebrow")}
          </div>

          <div className={styles.headerRow}>
            <h2 className={styles.title} id="why-heading">
              {t("whyHeadline")}
            </h2>
            <p className={styles.subtitle}>
              {t("whySubheadline")}
            </p>
          </div>
        </div>

        {/* 4 Navy Icon Pillars */}
        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, idx) => (
            <div key={idx} className={styles.pillarItem} id={`why-pillar-${idx + 1}`}>
              <div className={styles.iconWrap} aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarText}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
