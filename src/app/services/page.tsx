import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Services",
  description: "Bhaya India services — product sourcing, corporate gifting, wholesale supply, custom branding and bulk order management.",
};

const services = [
  {
    id: "svc-01",
    title: "Product Sourcing",
    desc: "Tell us what you need and we will find the right product from our network of verified suppliers. Ideal for businesses and individuals looking for specific items.",
    items: ["Specification-based sourcing", "Sample requests", "Quality verification", "Competitive pricing"],
  },
  {
    id: "svc-02",
    title: "Corporate Gifting",
    desc: "Thoughtfully curated gift hampers and product packages for corporate events, festivals and employee recognition — custom-branded for your organisation.",
    items: ["Custom curation", "Brand printing & packaging", "Bulk delivery", "Festival & event specials"],
  },
  {
    id: "svc-03",
    title: "Wholesale Supply",
    desc: "Reliable wholesale supply for retailers, resellers and institutions across India. Consistent quality, competitive pricing and dependable logistics.",
    items: ["Wholesale pricing tiers", "Regular supply agreements", "Dedicated account management", "Pan-India distribution"],
  },
  {
    id: "svc-04",
    title: "Custom Packaging & Branding",
    desc: "Custom-printed packaging solutions for businesses looking to present their products or gifts with their own brand identity.",
    items: ["Custom box printing", "Label & tag design", "Ribbon & finishing", "Minimum order: 25 pieces"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <div style={{ background: "var(--sapphire)", padding: "80px 0 64px", borderBottom: "1px solid rgba(197,160,89,0.15)" }}>
          <div className="container">
            <nav style={{ display: "flex", gap: "8px", fontSize: "12px", marginBottom: "24px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Services</span>
            </nav>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Our Services
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", fontWeight: 300, maxWidth: "540px" }}>
              Beyond products — we offer end-to-end solutions for businesses, institutions and individuals.
            </p>
          </div>
        </div>

        <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {services.map((svc) => (
                <div key={svc.id} id={svc.id} style={{ padding: "40px", border: "1px solid rgba(18,52,86,0.08)", background: "var(--white)" }}>
                  <div style={{ width: "32px", height: "2px", background: "var(--gold)", marginBottom: "20px" }} />
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 600, color: "var(--sapphire)", marginBottom: "12px" }}>
                    {svc.title}
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7, fontWeight: 300, marginBottom: "24px" }}>
                    {svc.desc}
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {svc.items.map((item) => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--gray-600)" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "64px", padding: "48px", background: "var(--sapphire)", textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "white", marginBottom: "16px", letterSpacing: "-0.01em" }}>
                Not sure which service you need?
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", fontWeight: 300, marginBottom: "32px" }}>
                Talk to us — we will guide you to the right solution.
              </p>
              <Link href="/contact" id="services-contact-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "var(--gold)", color: "var(--sapphire)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
