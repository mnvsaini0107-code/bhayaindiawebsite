"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import type { FAQ } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site-config";
import styles from "./faq.module.css";

export default function FAQPage() {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const published = data.faqs.filter((f: FAQ) => f.isPublished);
          published.sort((a: FAQ, b: FAQ) => a.sortOrder - b.sortOrder);
          setFaqs(published);
          if (published.length > 0) setOpenId(published[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { label: language === "hi" ? "सभी प्रश्न" : "All Questions", value: "all" },
    { label: language === "hi" ? "सामान्य प्रश्न" : "General Business", value: "General" },
    { label: language === "hi" ? "उत्पाद एवं गुणवत्ता" : "Product & Quality", value: "Product" },
    { label: language === "hi" ? "ऑर्डर एवं भुगतान" : "Ordering & Payment", value: "Payment" },
    { label: language === "hi" ? "डिलीवरी एवं ट्रैकिंग" : "Delivery & Logistics", value: "Delivery" },
    { label: language === "hi" ? "थोक एवं विक्रेता" : "Wholesale & Sellers", value: "Service" },
  ];

  const filtered = faqs.filter(
    (f) => activeCategory === "all" || f.category === activeCategory
  );

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    language === "hi"
      ? "नमस्कार BHAYA INDIA, मुझे एक प्रश्न के संबंध में सहायता चाहिए।"
      : "Hi BHAYA INDIA, I have a question regarding your products or services."
  )}`;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
              <span className={styles.sep}>/</span>
              <span>{language === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}</span>
            </div>
            <span className={styles.eyebrow}>
              {language === "hi" ? "सहायता एवं ज्ञान केंद्र" : "CLIENT KNOWLEDGE BASE"}
            </span>
            <h1 className={styles.title}>
              {language === "hi" ? "अक्सर पूछे जाने वाले सवाल (FAQ)" : "Frequently Asked Questions"}
            </h1>
            <p className={styles.subtitle}>
              {language === "hi"
                ? "BHAYA INDIA, उत्पादों, ऑर्डर प्रक्रिया, थोक आपूर्ति और BHAYA INDIA 2.0 से संबंधित सभी महत्वपूर्ण उत्तर।"
                : "Clear answers regarding our operations, products, ordering, delivery, wholesale supply, and BHAYA INDIA 2.0."}
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Category Sidebar */}
            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>
                {language === "hi" ? "श्रेणियां" : "Categories"}
              </h3>
              <div className={styles.catNav}>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    className={`${styles.catBtn} ${activeCategory === c.value ? styles.catBtnActive : ""}`}
                    onClick={() => setActiveCategory(c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={styles.helpBox}>
                <h4>{language === "hi" ? "सीधी सहायता चाहिए?" : "Need Direct Assistance?"}</h4>
                <p>
                  {language === "hi"
                    ? "हमारे प्रतिनिधि व्हाट्सऐप पर आपके प्रश्नों का त्वरित उत्तर देने के लिए उपलब्ध हैं।"
                    : "Our team is available on WhatsApp for immediate queries and support."}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waLink}
                >
                  💬 {language === "hi" ? "व्हाट्सऐप पर बात करें →" : "Chat on WhatsApp →"}
                </a>
              </div>
            </aside>

            {/* Accordion List */}
            <div className={styles.contentCol}>
              {loading ? (
                <p className={styles.statusMsg}>
                  {language === "hi" ? "सवाल लोड हो रहे हैं..." : "Loading frequently asked questions..."}
                </p>
              ) : filtered.length === 0 ? (
                <p className={styles.statusMsg}>
                  {language === "hi" ? "इस श्रेणी में कोई प्रश्न उपलब्ध नहीं है।" : "No questions currently available in this category."}
                </p>
              ) : (
                <div className={styles.accordionList}>
                  {filtered.map((item) => {
                    const isOpen = openId === item.id;
                    const displayQuestion =
                      language === "hi" && item.questionHi ? item.questionHi : item.question;
                    const displayAnswer =
                      language === "hi" && item.answerHi ? item.answerHi : item.answer;

                    return (
                      <div
                        key={item.id}
                        className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ""}`}
                      >
                        <button
                          className={styles.accordionToggle}
                          onClick={() => toggleAccordion(item.id)}
                          aria-expanded={isOpen}
                        >
                          <span className={styles.question}>{displayQuestion}</span>
                          <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className={styles.accordionBody}>
                            <p style={{ whiteSpace: "pre-line" }}>{displayAnswer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
