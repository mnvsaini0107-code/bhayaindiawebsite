"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import type { FAQ } from "@/lib/types";
import styles from "./faq.module.css";

export default function FAQPage() {
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
    { label: "All Questions", value: "all" },
    { label: "Product & Silk Quality", value: "Product" },
    { label: "Corporate Services & Bulk", value: "Service" },
    { label: "Payment & Invoicing", value: "Payment" },
    { label: "Pan-India Delivery", value: "Delivery" },
    { label: "General Business", value: "General" },
  ];

  const filtered = faqs.filter(
    (f) => activeCategory === "all" || f.category === activeCategory
  );

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Frequently Asked Questions</span>
            </div>
            <span className={styles.eyebrow}>CLIENT KNOWLEDGE BASE</span>
            <h1 className={styles.title}>Frequently Asked Questions</h1>
            <p className={styles.subtitle}>
              Clear answers regarding our craftsmanship, corporate allocations, pan-India logistics, and payments.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Category Sidebar */}
            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Categories</h3>
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
                <h4>Need Custom Assistance?</h4>
                <p>Our corporate client desk is available on WhatsApp for immediate queries.</p>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Bhaya%20India%2C%20I%20have%20a%20question%20regarding%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waLink}
                >
                  💬 Chat on WhatsApp →
                </a>
              </div>
            </aside>

            {/* Accordion List */}
            <div className={styles.contentCol}>
              {loading ? (
                <p className={styles.statusMsg}>Loading frequently asked questions...</p>
              ) : filtered.length === 0 ? (
                <p className={styles.statusMsg}>No questions currently available in this category.</p>
              ) : (
                <div className={styles.accordionList}>
                  {filtered.map((item) => {
                    const isOpen = openId === item.id;
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
                          <span className={styles.question}>{item.question}</span>
                          <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className={styles.accordionBody}>
                            <p>{item.answer}</p>
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
