"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import styles from "./testimonials.module.css";

export default function TestimonialsClient() {
  const { language, t } = useLanguage();

  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
            <span className={styles.sep}>/</span>
            <span>{language === "hi" ? "ग्राहक समीक्षाएं" : "Testimonials & Reviews"}</span>
          </div>
          <span className={styles.eyebrow}>
            {language === "hi" ? "ग्राहकों का विश्वास" : "CLIENT ADVOCACY"}
          </span>
          <h1 className={styles.title}>
            {language === "hi" ? "ग्राहक समीक्षा — जल्द उपलब्ध" : "Customer Reviews — Coming Soon"}
          </h1>
          <p className={styles.subtitle}>
            {language === "hi"
              ? "जानिए कैसे BHAYA INDIA 'जहाँ भाया, वहाँ भरोसा' के वादे को पूरा करता है।"
              : "Discover how BHAYA INDIA delivers on the promise of “जहाँ भाया, वहाँ भरोसा”."}
          </p>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border-medium, rgba(18,52,86,0.12))",
            borderRadius: "8px",
            padding: "60px 32px",
            textAlign: "center",
            maxWidth: "680px",
            margin: "3rem auto",
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
              marginBottom: "16px",
            }}
          >
            {language === "hi" ? "सत्यापन प्रक्रिया जारी" : "Verification In Progress"}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "24px",
              color: "var(--sapphire, #123456)",
              marginBottom: "14px",
              fontWeight: 600,
            }}
          >
            {language === "hi" ? "ग्राहक समीक्षा — जल्द उपलब्ध" : "Customer Reviews — Coming Soon"}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary, #555)",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            {language === "hi"
              ? "हमारी सख्त सत्यनिष्ठ सामग्री नीति के तहत, हम कोई भी काल्पनिक नाम, फर्जी समीक्षाएं या नकली रेटिंग्स प्रदर्शित नहीं करते हैं। वास्तविक डिलीवर किए गए ऑर्डरों से प्राप्त ग्राहक समीक्षाओं का सत्यापन किया जा रहा है और शीघ्र यहाँ प्रकाशित की जाएंगी।"
              : "Under our strict Truthful Content Policy, we do not show placeholder or fabricated testimonials, fake company names, or invented ratings. Direct reviews from verified delivered orders are currently being verified and will be published here shortly."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary">
              {language === "hi" ? "उत्पाद संग्रह देखें →" : "Explore Products →"}
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              {language === "hi" ? "अपना अनुभव साझा करें" : "Share Your Experience"}
            </Link>
          </div>
        </div>

        <div className={styles.shareBlock}>
          <h2>{language === "hi" ? "क्या आपने BHAYA INDIA का अनुभव किया है?" : "Have you experienced BHAYA INDIA?"}</h2>
          <p>
            {language === "hi"
              ? "हम आपकी निष्पक्ष राय, उत्पाद प्रतिक्रिया और व्यावसायिक समीक्षा का हार्दिक स्वागत करते हैं।"
              : "We welcome your honest feedback, product impressions, and partnership reviews."}
          </p>
          <Link href="/contact" className="btn btn-primary">
            {language === "hi" ? "हमारे साथ अपना अनुभव साझा करें →" : "Share Your Experience With Us →"}
          </Link>
        </div>
      </div>

      <CredibilityStrip />
    </main>
  );
}
