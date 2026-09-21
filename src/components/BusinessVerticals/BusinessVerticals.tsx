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
      link: "/products?category=gift-hampers",
      isFeatured: false,
    },
    {
      id: "v2-retail",
      title: t("v2Title"),
      desc: t("v2Desc"),
      status: t("v2Status"),
      link: "/products",
      isFeatured: false,
    },
    {
      id: "v3-agro",
      title: t("v3Title"),
      desc: t("v3Desc"),
      status: t("v3Status"),
      link: "/contact?type=agro",
      isFeatured: false,
    },
    {
      id: "v4-manufacturing",
      title: t("v4Title"),
      desc: t("v4Desc"),
      status: t("v4Status"),
      link: "/manufacturers",
      isFeatured: false,
    },
    {
      id: "v5-logistics",
      title: t("v5Title"),
      desc: t("v5Desc"),
      status: t("v5Status"),
      link: "/services",
      isFeatured: false,
    },
    {
      id: "v6-exports",
      title: t("v6Title"),
      desc: t("v6Desc"),
      status: t("v6Status"),
      link: "/wholesale",
      isFeatured: false,
    },
    {
      id: "v7-ecommerce",
      title: t("v7Title"),
      desc: t("v7Desc"),
      status: t("v7Status"),
      link: "/products",
      isFeatured: true,
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

        {/* 7 Verticals Grid */}
        <div className={styles.grid}>
          {verticals.map((v) => (
            <div
              key={v.id}
              className={`${styles.card} ${v.isFeatured ? styles.cardFeatured : ""}`}
              id={`vertical-card-${v.id}`}
            >
              <div className={styles.cardTop}>
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
