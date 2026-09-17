import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import { getTestimonials } from "@/lib/db";
import styles from "./testimonials.module.css";

export const metadata: Metadata = {
  title: "Client Testimonials & Customer Reviews — BHAYA INDIA",
  description:
    "Genuine experiences and verified feedback from retail customers and wholesale business partners across India.",
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
              Hear how BHAYA INDIA delivers on the promise of &ldquo;जहाँ भाया, वहाँ भरोसा&rdquo;.
            </p>
          </div>
        </div>

        <div className="container">
          {testimonials.length === 0 ? (
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border-medium)",
                borderRadius: "8px",
                padding: "60px 32px",
                textAlign: "center",
                maxWidth: "680px",
                margin: "3rem auto",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "rgba(197,160,89,0.15)",
                  color: "var(--gold)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  marginBottom: "16px",
                }}
              >
                Verification In Progress
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  color: "var(--sapphire)",
                  marginBottom: "12px",
                }}
              >
                Verified Reviews Coming Soon
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                Under our strict Truthful Content Policy, we do not show placeholder or fabricated testimonials. Direct reviews from verified delivered orders are currently being verified and will be published here shortly.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/products" className="btn btn-primary">
                  Explore Products →
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Share Your Experience
                </Link>
              </div>
            </div>
          ) : (
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
          )}

          <div className={styles.shareBlock}>
            <h2>Have you experienced BHAYA INDIA?</h2>
            <p>We welcome your honest feedback, product impressions, and partnership reviews.</p>
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
