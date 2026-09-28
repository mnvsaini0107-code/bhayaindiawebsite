"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const WHATSAPP_NUMBER = "918726690926";

export default function ContactClient() {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    language === "hi"
      ? "नमस्कार BHAYA INDIA, मुझे आपके उत्पादों एवं सेवाओं के संबंध में जानकारी चाहिए।"
      : "Hi Bhaya India, I would like to get in touch regarding your products and services."
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <main>
      {/* Hero */}
      <div style={{ background: "var(--sapphire)", padding: "80px 0 64px", borderBottom: "1px solid rgba(197,160,89,0.15)" }}>
        <div className="container">
          <nav style={{ display: "flex", gap: "8px", fontSize: "12px", marginBottom: "24px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.03em" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>
              {language === "hi" ? "होम" : "Home"}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              {language === "hi" ? "संपर्क" : "Contact"}
            </span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 600, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>
            {language === "hi" ? "हमसे संपर्क करें" : "Get In Touch"}
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", fontWeight: 300, maxWidth: "600px" }}>
            {language === "hi"
              ? "हम सदैव आपकी सहायता के लिए उपलब्ध हैं। नीचे दिए गए किसी भी माध्यम से हमसे संपर्क करें।"
              : "We are always happy to help. Reach us through any of the channels below."}
          </p>
        </div>
      </div>

      <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px" }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "var(--sapphire)", marginBottom: "32px", letterSpacing: "-0.01em" }}>
                {language === "hi" ? "संपर्क विवरण" : "Contact Details"}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {[
                  {
                    label: "WhatsApp",
                    value: "+91 87266 90926",
                    sublabel: language === "hi" ? "त्वरित उत्तर — आमतौर पर कुछ ही मिनटों में" : "Fastest response — typically within minutes",
                    href: whatsappUrl,
                    isWhatsapp: true,
                  },
                  {
                    label: language === "hi" ? "ग्राहक सेवा / फोन" : "Customer Desk / Phone",
                    value: "+91 87266 90926",
                    sublabel: language === "hi" ? "सोमवार–शनिवार, सुबह 9 से शाम 7 बजे तक" : "Mon–Sat, 9 AM – 7 PM",
                    href: "tel:+918726690926",
                  },
                  {
                    label: "Email",
                    value: "hello@bhayaindia.com",
                    sublabel: language === "hi" ? "हम 24 घंटे के भीतर उत्तर देते हैं" : "We reply within 24 hours",
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

              <div style={{ marginTop: "40px", padding: "24px", background: "var(--ivory-warm)", border: "1px solid rgba(18,52,86,0.07)", borderRadius: "4px" }}>
                <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: "var(--sapphire)" }}>
                    {language === "hi" ? "व्यापारिक पूछताछ एवं थोक:" : "Business Enquiries & Wholesale:"}
                  </strong>{" "}
                  {language === "hi"
                    ? "थोक ऑर्डर, कॉर्पोरेट उपहार या व्यावसायिक साझेदारी के लिए त्वरित उत्तर पाने हेतु कृपया अपनी आवश्यकताएं व्हाट्सएप या ईमेल पर भेजें।"
                    : "For bulk orders, corporate gifts or business partnerships, please mention your requirements via WhatsApp or email for a faster response."}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600, color: "var(--sapphire)", marginBottom: "32px", letterSpacing: "-0.01em" }}>
                {language === "hi" ? "संदेश भेजें" : "Send a Message"}
              </h2>

              {submitted ? (
                <div style={{ padding: "32px", background: "var(--white)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "4px" }}>
                  <h3 style={{ color: "#15803d", marginBottom: "8px" }}>
                    {language === "hi" ? "संदेश प्राप्त हुआ!" : "Message Received!"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--gray-600)", margin: 0 }}>
                    {language === "hi"
                      ? "धन्यवाद! हमारी टीम शीघ्र ही आपसे संपर्क करेगी।"
                      : "Thank you! Our support team will get back to you shortly."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      {language === "hi" ? "आपका पूरा नाम *" : "Your Full Name *"}
                    </label>
                    <input id="contact-name" required type="text" placeholder={language === "hi" ? "उदा. राजेश कुमार" : "Full name"} style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }} />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      {language === "hi" ? "फोन / व्हाट्सएप *" : "Phone / WhatsApp *"}
                    </label>
                    <input id="contact-phone" required type="tel" placeholder="+91 XXXXX XXXXX" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }} />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      {language === "hi" ? "विषय" : "Subject"}
                    </label>
                    <select id="contact-subject" style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none" }}>
                      <option>{language === "hi" ? "उत्पाद पूछताछ" : "Product Enquiry"}</option>
                      <option>{language === "hi" ? "थोक / बड़ा ऑर्डर" : "Wholesale / Bulk Order"}</option>
                      <option>{language === "hi" ? "विक्रेता साझेदारी" : "Seller Partnership"}</option>
                      <option>{language === "hi" ? "कॉर्पोरेट उपहार" : "Corporate Gifts"}</option>
                      <option>{language === "hi" ? "अन्य" : "Other"}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--sapphire)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                      {language === "hi" ? "संदेश *" : "Message *"}
                    </label>
                    <textarea id="contact-message" required rows={5} placeholder={language === "hi" ? "अपनी आवश्यकताएं यहां लिखें..." : "Tell us what you need..."} style={{ width: "100%", padding: "12px 16px", border: "1px solid rgba(18,52,86,0.15)", background: "var(--white)", fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--sapphire)", outline: "none", resize: "vertical" }} />
                  </div>
                  <button type="submit" disabled={submitting} id="contact-submit-btn" style={{ padding: "14px 32px", background: "var(--sapphire)", color: "white", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", cursor: "pointer", width: "fit-content" }}>
                    {submitting
                      ? (language === "hi" ? "भेजा जा रहा है..." : "Sending...")
                      : (language === "hi" ? "संदेश भेजें →" : "Send Message →")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
