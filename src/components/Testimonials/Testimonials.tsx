"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const { language, t } = useLanguage();

  return (
    <section className={`section ${styles.testimonialsSection}`} aria-labelledby="testimonials-heading">
      <div className="container">
        {/* Editorial Section Header */}
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {language === "hi" ? "ग्राहकों का विश्वास" : "Client Trust"}
          </div>
          <h2 className={styles.heading} id="testimonials-heading">
            {language === "hi" ? "ग्राहक समीक्षा — जल्द उपलब्ध" : "Customer Reviews — Coming Soon"}
          </h2>
          <p className={styles.subtext}>
            {language === "hi"
              ? "सच्ची ग्राहक समीक्षाएं एवं अनुभव सत्यापन के अधीन हैं।"
              : "Genuine verified feedback from retail customers and wholesale partners across India."}
          </p>
        </div>

        {/* Truthful Content State: Coming Soon */}
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border-medium, rgba(18,52,86,0.12))",
            borderRadius: "8px",
            padding: "48px 24px",
            textAlign: "center",
            maxWidth: "640px",
            margin: "2rem auto 0",
            boxShadow: "var(--shadow-subtle, 0 4px 16px rgba(18,52,86,0.06))",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(197,160,89,0.15)",
              color: "var(--gold-dark, #a8833c)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "2px",
              marginBottom: "14px",
            }}
          >
            {language === "hi" ? "सत्यापन प्रक्रिया जारी" : "Verification In Progress"}
          </span>
          <h3
            style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "22px",
              color: "var(--sapphire, #123456)",
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            {language === "hi" ? "ग्राहक समीक्षा — जल्द उपलब्ध" : "Customer Reviews — Coming Soon"}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--gray-600, #555)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            {language === "hi"
              ? "हमारी सख्त सत्यनिष्ठ सामग्री नीति के अनुसार, हम कोई भी कृत्रिम समीक्षा या काल्पनिक प्रशंसापत्र प्रकाशित नहीं करते हैं। वास्तविक डिलीवर किए गए ऑर्डरों से प्राप्त ग्राहक समीक्षाओं का सत्यापन जारी है और वे शीघ्र यहाँ लाइव होंगी।"
              : "Under our strict Truthful Content Policy, we do not show fabricated testimonials, fake company names, or invented ratings. Genuine customer reviews from verified delivered orders are currently being verified and will be published here shortly."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary" style={{ fontSize: "13px" }}>
              {language === "hi" ? "उत्पाद सूची देखें →" : "Explore Products →"}
            </Link>
            <Link href="/contact" className="btn btn-secondary" style={{ fontSize: "13px" }}>
              {language === "hi" ? "अपना अनुभव साझा करें" : "Share Your Experience"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
