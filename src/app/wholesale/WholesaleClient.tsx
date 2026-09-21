"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/lib/site-config";

export default function WholesaleClient() {
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [productInterested, setProductInterested] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          businessName,
          city: location,
          productName: productInterested,
          quantity,
          type: "wholesale",
          message: `Wholesale B2B Requirement. Product: ${productInterested}, Expected Qty: ${quantity}, Location: ${location}. Details: ${requirements}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappDirectMsg = `नमस्कार, मुझे BHAYA INDIA से थोक एवं व्यावसायिक खरीद के बारे में जानकारी चाहिए:
Business Name: ${businessName || "____"}
Product: ${productInterested || "____"}
Quantity: ${quantity || "____"}`;

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappDirectMsg)}`;

  return (
    <main style={{ minHeight: "80vh", background: "var(--ivory)" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--sapphire) 0%, #0c2540 100%)",
          color: "#ffffff",
          padding: "80px 0 60px",
          borderBottom: "1px solid rgba(197,160,89,0.2)",
        }}
      >
        <div className="container">
          <nav
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "12px",
              marginBottom: "20px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>
              {language === "hi" ? "होम" : "Home"}
            </Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>
              {language === "hi" ? "थोक व्यापार" : "Wholesale & B2B"}
            </span>
          </nav>

          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(197,160,89,0.15)",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {language === "hi" ? "थोक एवं संस्थागत आपूर्ति" : "Direct Bulk Supply"}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            {language === "hi" ? "BHAYA INDIA थोक व्यापार (Wholesale & B2B)" : "BHAYA INDIA Wholesale & B2B Supply"}
          </h1>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid var(--gold)",
              padding: "20px",
              maxWidth: "700px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "17px",
                color: "#ffffff",
                lineHeight: 1.7,
                margin: 0,
                fontWeight: 500,
              }}
            >
              थोक दरों पर गुणवत्तापूर्ण उत्पाद • सीधा फैक्ट्री से सोर्सिंग • आसान ऑर्डरिंग
            </p>
          </div>

          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
            {language === "hi"
              ? "दुकानदारों, होटल, कॉरपोरेट उपहार और थोक पुनर्विक्रेताओं के लिए विशेष वॉल्यूम डिस्काउंट एवं व्यक्तिगत परामर्श।"
              : "Dedicated volume pricing, tiered commercial quotes, and dedicated account managers for businesses."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <section style={{ padding: "70px 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "48px",
              alignItems: "start",
            }}
          >
            {/* Wholesale Details */}
            <div>
              <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {language === "hi" ? "B2B सुविधाएं" : "B2B Advantages"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 600,
                  color: "var(--sapphire)",
                  marginTop: "8px",
                  marginBottom: "24px",
                }}
              >
                {language === "hi" ? "थोक व्यापार में स्पष्टता और विश्वसनीयता" : "Reliability at Commercial Scale"}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "32px" }}>
                {[
                  {
                    title: language === "hi" ? "सीधा फैक्ट्री सोर्सिंग रेट" : "Tiered Volume Discounts",
                    desc: language === "hi"
                      ? "बड़ी मात्रा में खरीद पर सीधे निर्माता से प्राप्त सर्वोत्तम थोक मूल्य।"
                      : "Direct factory pricing brackets starting from small bulk batches to full freight shipments.",
                  },
                  {
                    title: language === "hi" ? "जीएसटी इनवॉइस एवं बिलिंग" : "Compliant GST Invoicing",
                    desc: language === "hi"
                      ? "व्यवसाय के लिए 100% कानूनी पक्के बिल एवं इनपुट टैक्स क्रेडिट सुविधा।"
                      : "Official GST tax invoices with HSN codes allowing complete input tax credit claims.",
                  },
                  {
                    title: language === "hi" ? "व्हाट्सऐप त्वरित कोटेशन" : "Instant WhatsApp Quote Assistance",
                    desc: language === "hi"
                      ? "औपचारिक कोटेशन या नमूनों की जानकारी तुरंत हमारे थोक डेस्क से प्राप्त करें।"
                      : "Request catalog sheets, test samples, and custom price lists directly on WhatsApp.",
                  },
                ].map((col) => (
                  <div
                    key={col.title}
                    style={{
                      padding: "20px",
                      background: "var(--white)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "4px",
                    }}
                  >
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--sapphire)", marginBottom: "6px" }}>
                      ✓ {col.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                      {col.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Instant WhatsApp Card */}
              <div
                style={{
                  background: "rgba(37,211,102,0.08)",
                  border: "1px solid rgba(37,211,102,0.3)",
                  borderRadius: "4px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <strong style={{ color: "#128C7E", fontSize: "16px" }}>
                    {language === "hi" ? "तत्काल थोक व्हाट्सऐप परामर्श" : "Direct WhatsApp Wholesale Desk"}
                  </strong>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "hi"
                    ? "फॉर्म भरने का समय नहीं है? सीधे हमारे व्हाट्सऐप नंबर पर अपनी आवश्यकता भेजें:"
                    : "Need immediate quotation? Chat directly with our B2B commercial desk:"}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    background: "#25D366",
                    color: "white",
                    display: "inline-flex",
                    justifyContent: "center",
                    gap: "8px",
                    fontWeight: 600,
                  }}
                >
                  {language === "hi" ? "व्हाट्सऐप पर कोटेशन मांगें" : "Chat on WhatsApp Now"}
                </a>
              </div>
            </div>

            {/* B2B Enquiry Form */}
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border-medium)",
                borderRadius: "4px",
                padding: "36px",
                boxShadow: "0 8px 24px rgba(18,52,86,0.06)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "var(--sapphire)",
                  marginBottom: "8px",
                }}
              >
                {language === "hi" ? "थोक / B2B कोटेशन अनुरोध" : "Wholesale B2B Quote Request"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                {language === "hi"
                  ? "अपनी व्यावसायिक आवश्यकता नीचे दर्ज करें। हमारी B2B टीम आपको औपचारिक कोटेशन भेजेगी।"
                  : "Submit your requirement specifications. Our wholesale representative will provide formal quotes."}
              </p>

              {submitted ? (
                <div
                  style={{
                    background: "rgba(22,163,74,0.08)",
                    border: "1px solid rgba(22,163,74,0.3)",
                    borderRadius: "4px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ color: "#15803d", fontSize: "18px", marginTop: "4px", marginBottom: "8px" }}>
                    {language === "hi" ? "कोटेशन अनुरोध प्राप्त हुआ!" : "Quote Request Successfully Submitted!"}
                  </h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                    {language === "hi"
                      ? "धन्यवाद! हमारे B2B सेल्स मैनेजर शीघ्र ही मूल्य सूची एवं उपलब्धता के साथ संपर्क करेंगे।"
                      : "Thank you! Our wholesale sales manager will reach out with pricing tiers and terms."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {errorMsg && <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{errorMsg}</p>}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "आपका पूरा नाम" : "Contact Person Name"} *
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Anand Mehra"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "व्यापार / कंपनी का नाम" : "Business / Firm Name"} *
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Mehra Enterprises"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "मोबाइल नंबर (व्हाट्सऐप)" : "Mobile (WhatsApp)"} *
                      </label>
                      <input
                        type="tel"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "डिलीवरी स्थान (शहर, राज्य)" : "Delivery Location"} *
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Indore, MP"
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "उत्पाद / सामग्री" : "Product Required"} *
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={productInterested}
                        onChange={(e) => setProductInterested(e.target.value)}
                        placeholder="e.g. Cotton Bed Linen / Brass Utensils"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "अपेक्षित मात्रा" : "Expected Quantity"} *
                      </label>
                      <input
                        type="text"
                        required
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 200 pcs / 10 cartons"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "विस्तृत आवश्यकता या विशेष विनिर्देश" : "Detailed Requirement / Specifications"}
                    </label>
                    <textarea
                      rows={3}
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Specify sizes, colors, timeline, custom branding, or packaging needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ marginTop: "8px", width: "100%", justifyContent: "center" }}
                  >
                    {loading
                      ? language === "hi" ? "जमा हो रहा है..." : "Submitting..."
                      : language === "hi" ? "थोक कोटेशन अनुरोध जमा करें →" : "Request Wholesale Quotation →"}
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
