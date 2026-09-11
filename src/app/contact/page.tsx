import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Bhaya India for product enquiries, wholesale requests, or general questions. WhatsApp, phone and email available.",
};

const WHATSAPP_NUMBER = "919999999999";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Bhaya%20India%2C%20I%20would%20like%20to%20get%20in%20touch.`;

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <div style={{ background: "var(--sapphire)", padding: "80px 0 64px", borderBottom: "1px solid rgba(197,160,89,0.15)" }}>
          <div className="container">
            <nav style={{ display: "flex", gap: "8px", fontSize: "12px", marginBottom: "24px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Contact</span>
            </nav>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Get In Touch
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>
              We are always happy to help. Reach us through any of the channels below.
            </p>
          </div>
        </div>

        <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
              {/* Contact Info */}
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "var(--sapphire)", marginBottom: "32px", letterSpacing: "-0.01em" }}>
                  Contact Details
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  {[
                    {
                      label: "WhatsApp",
                      value: "+91 99999 99999",
                      sublabel: "Fastest response — typically within minutes",
                      href: WHATSAPP_URL,
                      isWhatsapp: true,
                    },
                    {
                      label: "Phone",
                      value: "+91 99999 99999",
                      sublabel: "Mon–Sat, 9 AM – 7 PM",
                      href: "tel:+919999999999",
                    },
                    {
                      label: "Email",
                      value: "hello@bhayaindia.com",
                      sublabel: "We reply within 24 hours",
                      href: "mailto:hello@bhayaindia.com",
                    },
                  ].map((item) => (
                    <div key={item.label} style={{ borderBottom: "1px solid rgba(18,52,86,0.07)", paddingBottom: "24px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                        {item.label}
                      </p>
                      <a href={item.href} target={item.isWhatsapp ? "_blank" : undefined} rel={item.isWhatsapp ? "noopener noreferrer" : undefined} style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 500, color: "var(--sapphire)", marginBottom: "4px" }}>
                        {item.value}
                      </a>
                      <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>{item.sublabel}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "40px", padding: "24px", background: "var(--ivory-warm)", border: "1px solid rgba(18,52,86,0.07)" }}>
                  <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: 1.7 }}>
                    <strong style={{ color: "var(--sapphire)" }}>Business Enquiries & Wholesale:</strong> For bulk orders, corporate gifts or business partnerships, please mention your requirements via WhatsApp or email for a faster response.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "var(--sapphire)", marginBottom: "32px", letterSpacing: "-0.01em" }}>
                  Send a Message
                </h2>
                <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Your Name
                    </label>
                    <input id="contact-name" type="text" placeholder="Full name" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Phone / WhatsApp
                    </label>
                    <input id="contact-phone" type="tel" placeholder="+91 XXXXX XXXXX" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }} />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Subject
                    </label>
                    <select id="contact-subject" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }}>
                      <option>Product Enquiry</option>
                      <option>Wholesale / Bulk Order</option>
                      <option>Seller Partnership</option>
                      <option>Corporate Gifts</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      Message
                    </label>
                    <textarea id="contact-message" rows={5} placeholder="Tell us what you need..." style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none", resize: "vertical" }} />
                  </div>
                  <button type="submit" id="contact-submit-btn" style={{ padding: "14px 32px", background: "var(--sapphire)", color: "white", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", cursor: "pointer", width: "fit-content" }}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
