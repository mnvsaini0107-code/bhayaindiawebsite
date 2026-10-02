"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./BusinessVerticals.module.css";

export default function BusinessVerticals() {
  const { t, language } = useLanguage();

  const verticals = [
    {
      id: "v1-festival",
      title: t("v1Title"),
      desc: t("v1Desc"),
      status: t("v1Status"),
      link: "/products?category=festival-decoration",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c.5 1.5 2 3 2 4.5A2 2 0 0 1 12 8.5 2 2 0 0 1 10 6.5C10 5 11.5 3.5 12 2z"/>
          <path d="M4 14c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
          <path d="M4 14v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2"/>
          <path d="M8 20v2"/>
          <path d="M16 20v2"/>
        </svg>
      ),
    },
    {
      id: "v2-retail",
      title: t("v2Title"),
      desc: t("v2Desc"),
      status: t("v2Status"),
      link: "/products",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: "v3-agro",
      title: t("v3Title"),
      desc: t("v3Desc"),
      status: t("v3Status"),
      link: "/contact?type=agro",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-9"/>
          <path d="M12 13a5 5 0 0 0 5-5c0-4-5-6-5-6s-5 2-5 6a5 5 0 0 0 5 5z"/>
          <path d="M7 16a4 4 0 0 1 5-3"/>
          <path d="M17 16a4 4 0 0 0-5-3"/>
        </svg>
      ),
    },
    {
      id: "v4-manufacturing",
      title: t("v4Title"),
      desc: t("v4Desc"),
      status: t("v4Status"),
      link: "/manufacturers",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20"/>
          <path d="M5 20V8l5 4V8l5 4V4h4v16"/>
          <path d="M6 16h2"/>
          <path d="M11 16h2"/>
        </svg>
      ),
    },
    {
      id: "v5-logistics",
      title: t("v5Title"),
      desc: t("v5Desc"),
      status: t("v5Status"),
      link: "/services",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
    },
    {
      id: "v6-exports",
      title: t("v6Title"),
      desc: t("v6Desc"),
      status: t("v6Status"),
      link: "/wholesale",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
    },
    {
      id: "v7-ecommerce",
      title: t("v7Title"),
      desc: t("v7Desc"),
      status: t("v7Status"),
      link: "/products",
      isFeatured: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      ),
    },
    {
      id: "v8-packaging",
      title: t("v8Title"),
      desc: t("v8Desc"),
      status: t("v8Status"),
      link: "/products?category=packaging",
      isFeatured: false,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15"/>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="verticals-heading">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {t("verticalsEyebrow")}
          </div>
          <h2 className={styles.title} id="verticals-heading">
            {t("verticalsHeadline")}
          </h2>
          <p className={styles.subtitle}>
            {t("verticalsSubtitle")}
          </p>
        </div>

        {/* 8 Verticals Grid */}
        <div className={styles.grid}>
          {verticals.map((v) => (
            <div
              key={v.id}
              className={`${styles.card} ${v.isFeatured ? styles.cardFeatured : ""}`}
              id={`vertical-card-${v.id}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconWrap} aria-hidden="true">
                  {v.icon}
                </div>
                <span
                  className={`${styles.statusBadge} ${v.isFeatured ? styles.statusBadgeEcommerce : ""}`}
                >
                  {v.status}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardDesc}>{v.desc}</p>

              <Link href={v.link} className={styles.cardAction}>
                {language === "hi" ? "और जानें" : "Explore Direction"} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
