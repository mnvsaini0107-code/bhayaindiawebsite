import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          background: "linear-gradient(180deg, #fdfdfd 0%, #f4f6f8 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gold, #c5a059)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            ERROR 404 • त्रुटि 404
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)',
              fontSize: "2.75rem",
              color: "var(--navy, #123456)",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--navy, #123456)",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            पृष्ठ उपलब्ध नहीं है
          </p>
          <p
            style={{
              color: "#555555",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            }}
          >
            The page you are looking for may have been moved, renamed, or is temporarily unavailable. Explore our authentic products and verified services below:
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.85rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              className="btn btn-primary"
              style={{
                background: "var(--navy, #123456)",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Home / होम
            </Link>
            <Link
              href="/products"
              className="btn btn-secondary"
              style={{
                background: "#ffffff",
                border: "1px solid var(--navy, #123456)",
                color: "var(--navy, #123456)",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Shop Catalogue / उत्पाद
            </Link>
            <Link
              href="/wholesale"
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#334155",
                padding: "12px 20px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Wholesale / थोक
            </Link>
            <Link
              href="/contact"
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                color: "#334155",
                padding: "12px 20px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Contact / संपर्क
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
