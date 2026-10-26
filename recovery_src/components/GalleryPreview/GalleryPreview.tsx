"use client";

import Link from "next/link";
import styles from "./GalleryPreview.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function GalleryPreview() {
  const { t, language } = useLanguage();

  return (
    <section className={styles.section} aria-labelledby="gallery-preview-heading">
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {language === "hi" ? "दृश्य दीर्घा एवं कार्यशालाएं" : "VISUAL GALLERY & ATELIERS"}
          </div>

          <h2 className={styles.title} id="gallery-preview-heading">
            {language === "hi" ? "भाया इंडिया दृश्य संग्रह" : "Bhaya India Visual Chronicle"}
          </h2>

          <p className={styles.subtitle}>
            {language === "hi"
              ? "सत्यापित भारतीय कार्यशालाओं, कारीगर केंद्रों और वास्तविक उत्पाद निर्माण की एक प्रामाणिक झलक।"
              : "Authentic glimpses into verified workshops, artisan clusters, and genuine product creation."}
          </p>
        </div>

        {/* Truthful Notice Card */}
        <div className={styles.noticeCard}>
          <span className={styles.noticeBadge}>
            {t("galleryNoticeBadge")}
          </span>

          <h3 className={styles.noticeHeading}>
            {t("galleryNoticeTitle")}
          </h3>

          <p className={styles.noticeBody}>
            {t("galleryNoticeDesc")}
          </p>

          <div className={styles.noticeActions}>
            <Link href="/products" className="btn btn-primary" id="gallery-explore-catalogue-btn">
              {language === "hi" ? "उत्पाद संग्रह देखें" : "Explore Products"} →
            </Link>
            <Link href="/gallery" className="btn btn-secondary" id="gallery-view-portal-btn">
              {language === "hi" ? "गैलरी पेज देखें" : "View Gallery Page"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
