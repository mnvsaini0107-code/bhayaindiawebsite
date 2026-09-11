import { getTestimonials, Testimonial } from "@/lib/db";
import styles from "./Testimonials.module.css";

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
            Trusted by discerning retail connoisseurs and institutional procurement directors across India.
          </p>
        </div>

        {/* 3 Editorial Testimonial Columns */}
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
      </div>
    </section>
  );
}
