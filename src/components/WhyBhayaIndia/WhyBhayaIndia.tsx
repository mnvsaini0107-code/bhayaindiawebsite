"use client";

import styles from "./WhyBhayaIndia.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyBhayaIndia() {
  const { t, language } = useLanguage();

  const trustPillars = [
    {
      id: "trust",
      title: t("trustPillar1"),
      desc: t("trustPillar1Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
    },
    {
      id: "transparency",
      title: t("trustPillar2"),
      desc: t("trustPillar2Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      ),
    },
    {
      id: "fair-business",
      title: t("trustPillar3"),
      desc: t("trustPillar3Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="M7 21h10"/>
          <path d="M12 3v18"/>
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
        </svg>
      ),
    },
    {
      id: "quality",
      title: t("trustPillar4"),
      desc: t("trustPillar4Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
    },
    {
      id: "customer-respect",
      title: t("trustPillar5"),
      desc: t("trustPillar5Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
    {
      id: "timely-service",
      title: t("trustPillar6"),
      desc: t("trustPillar6Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      id: "secure-payment",
      title: t("trustPillar7"),
      desc: t("trustPillar7Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
    },
    {
      id: "responsibility",
      title: t("trustPillar8"),
      desc: t("trustPillar8Desc"),
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18a1 1 0 0 1-2 0v-1.07A6 6 0 0 1 7.07 13H6a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 7.07V6a1 1 0 0 1 2 0v1.07A6 6 0 0 1 16.93 11H18a1 1 0 0 1 0 2h-1.07A6 6 0 0 1 13 16.93z"/>
          <circle cx="12" cy="12" r="2"/>
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
            {language === "hi" ? "ब्रांड का मूल संकल्प" : "CORE BRAND PLEDGE"}
          </div>

          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title} id="why-heading">
                {t("whyBhayaTitle")}
              </h2>
              <div className={styles.brandMottoBadge}>
                <span className="font-devanagari">“जहाँ भाया, वहाँ भरोसा।”</span>
              </div>
            </div>
            <p className={styles.subtitle}>
              {t("whyBhayaSubtitle")}
            </p>
          </div>
        </div>

        {/* 8 Core Brand Trust Pillars */}
        <div className={styles.pillarsGrid}>
          {trustPillars.map((pillar, idx) => (
            <div key={pillar.id} className={styles.pillarItem} id={`why-pillar-${pillar.id}`}>
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
