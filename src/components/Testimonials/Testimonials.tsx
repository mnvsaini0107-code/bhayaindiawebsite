import { getTestimonials, Testimonial } from "@/lib/db";
import styles from "./Testimonials.module.css";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`Rated ${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={styles.star}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const allReviews = getTestimonials();
  const published = allReviews.filter((t) => t.isPublished).slice(0, 3);

  return (
    <section className={`section ${styles.testimonialsSection}`} aria-labelledby="testimonials-heading">
      <div className="container">
        {/* Editorial Section Header */}
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            Client Perspectives
          </div>
          <h2 className={styles.heading} id="testimonials-heading">
            Voices of Trust & Partnership
          </h2>
          <p className={styles.subtext}>
            Genuine feedback from retail customers and wholesale partners across India.
          </p>
        </div>

        {published.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "6px",
              padding: "48px 24px",
              textAlign: "center",
              maxWidth: "640px",
              margin: "2rem auto 0",
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
                marginBottom: "14px",
              }}
            >
              Verified Reviews — Coming Soon
            </span>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                color: "var(--sapphire)",
                marginBottom: "10px",
              }}
            >
              Customer Feedback Verification Underway
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                marginBottom: "20px",
              }}
            >
              Under our strict Truthful Content Policy, we only publish authenticated reviews from verified order deliveries. Genuine client reviews are being aggregated and will appear here shortly.
            </p>
            <Link href="/contact" className="btn btn-secondary" style={{ fontSize: "13px" }}>
              Submit Your Experience →
            </Link>
          </div>
        ) : (
          /* 3 Editorial Testimonial Columns */
          <div className={styles.grid}>
            {published.map((t: Testimonial, idx) => (
              <div key={t.id} className={styles.testimonialCol} id={`testimonial-${t.id}`}>
                <div className={styles.topRow}>
                  <StarRating rating={t.rating} />
                  <span className={styles.reviewIndex}>0{idx + 1}</span>
                </div>

                <blockquote className={styles.quote}>
                  &ldquo;{t.review}&rdquo;
                </blockquote>

                <div className={styles.reviewerMeta}>
                  <p className={styles.reviewerName}>{t.customerName}</p>
                  <p className={styles.reviewerRole}>
                    {t.role} {t.company ? `· ${t.company}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
