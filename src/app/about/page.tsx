import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "About Us — Our Story & Vision",
  description:
    "Learn about Bhaya India — our story, values, vision for Bhaya India 2.0 and our commitment to quality products and trusted service.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div style={{
          background: "var(--sapphire)",
          padding: "80px 0 64px",
          borderBottom: "1px solid rgba(197,160,89,0.15)",
        }}>
          <div className="container">
            <nav style={{ display: "flex", gap: "8px", fontSize: "12px", marginBottom: "24px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>About</span>
            </nav>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              About Bhaya India
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", fontWeight: 300, maxWidth: "500px" }}>
              A trusted Indian business — local roots, national vision.
            </p>
          </div>
        </div>

        {/* Story */}
        <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
          <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span style={{ display: "block", width: "32px", height: "1px", background: "var(--gold)", marginBottom: "20px" }} />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "-0.02em", marginBottom: "24px", lineHeight: 1.15 }}>
                Where It All Began
              </h2>
              <p style={{ fontSize: "16px", color: "var(--gray-500)", lineHeight: 1.8, fontWeight: 300, marginBottom: "20px" }}>
                Bhaya India was born from a simple belief: that quality products and honest service should be accessible to everyone. We started as a local business — built on the trust of our community, one customer at a time.
              </p>
              <p style={{ fontSize: "16px", color: "var(--gray-500)", lineHeight: 1.8, fontWeight: 300, marginBottom: "20px" }}>
                Over time, that trust grew into a reputation. And with that reputation came a responsibility — to bring the same quality and personal service to more people across India.
              </p>
              <p style={{ fontSize: "16px", color: "var(--gray-500)", lineHeight: 1.8, fontWeight: 300 }}>
                Today, Bhaya India is making that journey online — bringing verified quality products from trusted sources to customers nationwide, without losing the personal touch that made us who we are.
              </p>
            </div>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3", background: "var(--ivory-warm)" }}>
              <Image
                src="/assets/hero-editorial.jpg"
                alt="Bhaya India — quality products and trusted service"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section style={{ padding: "80px 0", background: "var(--ivory-warm)", borderTop: "1px solid rgba(18,52,86,0.06)" }}>
          <div className="container">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "-0.02em", marginBottom: "48px" }}>
              Our Values
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
              {[
                { title: "Quality First", text: "Every product is chosen for quality, not just price. We hold ourselves to the standard we'd set for our own family." },
                { title: "Honest Service", text: "Transparent pricing, straightforward communication, and personal attention — that is how we have always operated." },
                { title: "Indian Craftsmanship", text: "We celebrate and support the quality traditions of Indian manufacturing, sourcing and artisanship." },
              ].map((v) => (
                <div key={v.title} style={{ padding: "32px", background: "var(--white)", border: "1px solid rgba(18,52,86,0.07)" }}>
                  <div style={{ width: "32px", height: "2px", background: "var(--gold)", marginBottom: "20px" }} />
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, color: "var(--sapphire)", marginBottom: "12px" }}>{v.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7, fontWeight: 300 }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision 2.0 */}
        <section id="vision" style={{ padding: "80px 0", background: "var(--sapphire)" }}>
          <div className="container">
            <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
              <span style={{ display: "inline-block", padding: "5px 14px", border: "1px solid rgba(197,160,89,0.35)", color: "var(--gold)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px" }}>
                Coming Soon
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                Bhaya India 2.0
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontWeight: 300, marginBottom: "32px" }}>
                We are building toward a larger vision — a trusted Indian marketplace that connects quality sellers with customers across the country. Bhaya India 2.0 will be the platform that takes this further.
              </p>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", border: "1px solid rgba(197,160,89,0.3)", color: "var(--gold)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Register Interest
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
