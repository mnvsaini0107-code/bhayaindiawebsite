import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import { getTestimonials } from "@/lib/db";
import styles from "./testimonials.module.css";

export const metadata: Metadata = {
  title: "Client Testimonials & Enterprise Reviews — Bhaya India",
  description:
    "Read genuine reviews and experiences from corporate procurement heads, wedding clients, and wholesale partners across India.",
};

export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  const testimonials = getTestimonials().filter((t) => t.isPublished);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Testimonials & Reviews</span>
            </div>
            <span className={styles.eyebrow}>CLIENT ADVOCACY</span>
            <h1 className={styles.title}>Voices of Trust & Quality</h1>
            <p className={styles.subtitle}>
              From custom festive hampers to bridal Banarasi handlooms — hear how Bhaya India delivers on the promise of &ldquo;जहाँ भाया, वहाँ भरोसा&rdquo;.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.reviewsGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.reviewCard}>
                <div className={styles.starRow}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
                <p className={styles.reviewQuote}>&ldquo;{t.review}&rdquo;</p>
                <div className={styles.authorBlock}>
                  <strong className={styles.authorName}>{t.customerName}</strong>
                  <span className={styles.authorMeta}>{t.role} · {t.company}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.shareBlock}>
            <h2>Have you experienced Bhaya India?</h2>
            <p>We welcome your feedback and corporate partnership reviews.</p>
            <Link href="/contact" className="btn btn-primary">
              Share Your Experience With Us →
            </Link>
          </div>
        </div>

        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
