"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function BhayaIndia2Client() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("retailer");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: mobile,
          businessName,
          city,
          type: "seller",
          message: `BHAYA INDIA 2.0 Early Access Registration. Role: ${role}. City: ${city}. Business: ${businessName}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "80vh", background: "var(--ivory)" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--sapphire) 0%, #081726 100%)",
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
            <span style={{ color: "rgba(255,255,255,0.8)" }}>BHAYA INDIA 2.0</span>
          </nav>

          <span
            style={{
              display: "inline-block",
              padding: "5px 14px",
              background: "rgba(197,160,89,0.15)",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "16px",
              borderRadius: "2px",
            }}
          >
            {language === "hi" ? "आगामी विज़न — विकास प्रक्रिया जारी" : "Upcoming Vision — In Active Development"}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              lineHeight: 1.15,
            }}
          >
            BHAYA INDIA 2.0
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              color: "var(--gold)",
              fontWeight: 500,
              marginBottom: "20px",
            }}
          >
            एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.8,
              maxWidth: "680px",
            }}
          >
            {language === "hi"
              ? "BHAYA INDIA 2.0 भारत के खुदरा दुकानदारों, थोक व्यापारियों और स्थानीय निर्माताओं को एक आधुनिक हाइपरलोकल डिजिटल ईकोसिस्टम में ला रहा है।"
              : "BHAYA INDIA 2.0 is our next-generation hyperlocal ecosystem, connecting verified neighborhood shopkeepers and manufacturers to empower local Indian commerce."}
          </p>
        </div>
      </div>

      {/* Honest Status Notice */}
      <div
        style={{
          background: "rgba(197,160,89,0.08)",
          borderBottom: "1px solid rgba(197,160,89,0.25)",
          padding: "16px 0",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--sapphire)", fontWeight: 500 }}>
            <strong>{language === "hi" ? "पारदर्शी घोषणा:" : "Transparent Notice:"}</strong>{" "}
            {language === "hi"
              ? "BHAYA INDIA 2.0 वर्तमान में तकनीकी आर्किटेक्चर एवं विक्रेता ऑनबोर्डिंग चरण में है। मल्टी-वेंडर हाइपरलोकल मॉड्यूल सक्रिय रूप से तैयार किया जा रहा है।"
              : "BHAYA INDIA 2.0 is currently in technical architecture and merchant onboarding phase. Multi-vendor hyperlocal dispatch is actively being developed."}
          </p>
        </div>
      </div>

      {/* Future Ecosystem Architecture */}
      <section style={{ padding: "60px 0 40px", background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 40px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(197,160,89,0.12)", border: "1px solid var(--gold)", padding: "4px 14px", borderRadius: "20px", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--sapphire)", textTransform: "uppercase" }}>
                {language === "hi" ? "भावी ईकोसिस्टम (Phase 3)" : "Future Ecosystem (Phase 3)"}
              </span>
              <span style={{ fontSize: "10px", background: "var(--gold)", color: "var(--sapphire)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                {language === "hi" ? "भविष्य की परिकल्पना" : "Future Vision"}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                color: "var(--sapphire)",
                marginBottom: "12px",
              }}
            >
              {language === "hi"
                ? "संपूर्ण वाणिज्य तंत्र — एक एकीकृत प्लेटफॉर्म"
                : "One Platform Connecting the Entire Indian Commerce Spectrum"}
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {language === "hi"
                ? "ग्राहकों, विक्रेताओं, निर्माताओं, खुदरा व्यापारियों, वितरकों एवं लॉजिस्टिक्स पार्टनर्स को जोड़ने वाला आधुनिक मंच।"
                : "One platform connecting customers, vendors, manufacturers, retailers, distributors and logistics partners."}
            </p>
          </div>

          {/* 7 Ecosystem Participants Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "14px",
              marginBottom: "48px",
            }}
          >
            {[
              { id: "customer", en: "Customer", hi: "ग्राहक", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
              { id: "vendor", en: "Vendor", hi: "विक्रेता", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
              { id: "manufacturer", en: "Manufacturer", hi: "निर्माता", icon: "M2 20h20 M5 20V8l5 4V8l5 4V4h4v16" },
              { id: "retailer", en: "Retailer", hi: "खुदरा व्यापारी", icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" },
              { id: "distributor", en: "Distributor", hi: "वितरक", icon: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" },
              { id: "logistics", en: "Logistics", hi: "लॉजिस्टिक्स", icon: "M1 3h15v13H1z M16 8l4 3v5h-4z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
              { id: "bhaya-platform", en: "Bhaya Platform", hi: "भाया प्लेटफॉर्म", icon: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5", isCore: true },
            ].map((node) => (
              <div
                key={node.id}
                style={{
                  background: node.isCore ? "linear-gradient(135deg, var(--sapphire), #071523)" : "var(--white)",
                  color: node.isCore ? "#ffffff" : "var(--sapphire)",
                  border: node.isCore ? "1px solid var(--gold)" : "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "20px 14px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: node.isCore ? "0 8px 20px rgba(12,37,64,0.2)" : "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: node.isCore ? "rgba(197,160,89,0.2)" : "rgba(18,52,86,0.06)",
                    color: node.isCore ? "var(--gold)" : "var(--sapphire)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={node.icon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>
                    {language === "hi" ? node.hi : node.en}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.7 }}>
                    {language === "hi" ? node.en : node.hi}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Marketplace Transaction Flow */}
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "8px",
              padding: "36px 28px",
              boxShadow: "0 6px 24px rgba(18,52,86,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div>
                <span style={{ color: "var(--gold)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {language === "hi" ? "वाणिज्य चक्र" : "Commerce Lifecycle Flow"}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, color: "var(--sapphire)", margin: "4px 0 0" }}>
                  {language === "hi" ? "विक्रेता से निपटान तक का प्रवाह" : "Vendor-to-Settlement Flow"}
                </h3>
              </div>
              <span
                style={{
                  background: "rgba(197,160,89,0.15)",
                  color: "var(--sapphire)",
                  border: "1px solid var(--gold)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {language === "hi" ? "आगामी तकनीक • Coming Soon" : "Upcoming Technology • Coming Soon"}
              </span>
            </div>

            {/* 6 Steps Linear Flow */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {[
                { step: "01", en: "Vendor", hi: "विक्रेता", subEn: "Catalog & Stock", subHi: "कैटलॉग एवं स्टॉक" },
                { step: "02", en: "Bhaya Platform", hi: "भाया प्लेटफॉर्म", subEn: "Discovery & Trust", subHi: "सत्यापन एवं प्रदर्शन" },
                { step: "03", en: "Customer", hi: "ग्राहक", subEn: "Browse & Order", subHi: "चयन एवं ऑर्डर" },
                { step: "04", en: "Payment", hi: "भुगतान", subEn: "Secure Gateway", subHi: "सुरक्षित गेटवे" },
                { step: "05", en: "Delivery", hi: "डिलीवरी", subEn: "Hyperlocal Dispatch", subHi: "त्वरित डिस्पैच" },
                { step: "06", en: "Vendor Settlement", hi: "विक्रेता सेटलमेंट", subEn: "Direct Remittance", subHi: "प्रत्यक्ष भुगतान" },
              ].map((item, idx, arr) => (
                <div
                  key={item.step}
                  style={{
                    background: "var(--ivory)",
                    border: "1px solid rgba(18,52,86,0.08)",
                    borderRadius: "6px",
                    padding: "16px 12px",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "10px",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "rgba(197,160,89,0.6)",
                    }}
                  >
                    {item.step}
                  </span>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--sapphire)", marginBottom: "4px" }}>
                    {language === "hi" ? item.hi : item.en}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 600, marginBottom: "4px" }}>
                    {language === "hi" ? item.en : item.hi}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    {language === "hi" ? item.subHi : item.subEn}
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        right: "-10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        display: "none",
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "20px", marginBottom: 0, textAlign: "center" }}>
              {language === "hi"
                ? "* स्वचालित ऑर्डर विभाजन, कमीशन गणना और डायरेक्ट सेलर सेटलमेंट वर्तमान में विकास के अधीन है। वर्तमान में ऑर्डर ग्राहक डेस्क एवं प्रत्यक्ष सत्यापन द्वारा प्रबंधित होते हैं।"
                : "* Automated multi-seller order splitting, commission deduction, and digital vendor settlements are in technical roadmap. Current orders are processed through active direct customer desk."}
            </p>
          </div>
        </div>
      </section>

      {/* Early Access Onboarding Form */}
      <section style={{ padding: "80px 0", background: "var(--ivory-warm)", borderTop: "1px solid rgba(18,52,86,0.06)" }}>
        <div className="container">
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              background: "var(--white)",
              border: "1px solid var(--border-medium)",
              borderRadius: "4px",
              padding: "40px",
              boxShadow: "0 8px 24px rgba(18,52,86,0.05)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{ color: "var(--gold)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {language === "hi" ? "विक्रेता एवं पार्टनर पंजीकरण" : "Early Access Registration"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--sapphire)",
                  marginTop: "6px",
                }}
              >
                {language === "hi" ? "BHAYA INDIA 2.0 अर्ली एक्सेस में शामिल हों" : "Join the BHAYA INDIA 2.0 Network"}
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
                {language === "hi"
                  ? "यदि आप दुकानदार, डिस्ट्रीब्यूटर या निर्माता हैं, तो अपना विवरण दर्ज करें। हमारी ऑनबोर्डिंग टीम आपसे संपर्क करेगी।"
                  : "If you are a shopkeeper, distributor, or manufacturer, register below for priority onboarding."}
              </p>
            </div>

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
                <h3 style={{ color: "#15803d", fontSize: "18px", marginTop: "4px", marginBottom: "8px" }}>
                  {language === "hi" ? "पंजीकरण अनुरोध प्राप्त हुआ!" : "Early Registration Received!"}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "hi"
                    ? "धन्यवाद! हमारी मर्चेंट ऑनबोर्डिंग टीम 24-48 घंटों के भीतर आपसे संपर्क करेगी।"
                    : "Thank you! Our merchant onboarding team will connect with you within 24-48 hours."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {errorMsg && (
                  <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{errorMsg}</p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {language === "hi" ? "आपका नाम" : "Contact Person Name"} *
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
                    placeholder="e.g. Sunil Agarwal"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
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
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. 8726690926"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "शहर / कस्बा" : "City / Town"} *
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Jaipur, Delhi, Surat"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "दुकान / कंपनी का नाम" : "Shop / Business Name"} *
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
                      placeholder="e.g. Shree Krishna Textiles"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "व्यापार प्रकार" : "Business Category"}
                    </label>
                    <select
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                        background: "white",
                      }}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="retailer">{language === "hi" ? "खुदरा दुकानदार" : "Retail Shopkeeper"}</option>
                      <option value="wholesaler">{language === "hi" ? "थोक व्यापारी" : "Wholesaler / Distributor"}</option>
                      <option value="manufacturer">{language === "hi" ? "निर्माता" : "Manufacturer / Factory"}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ marginTop: "10px", width: "100%", justifyContent: "center" }}
                >
                  {submitting
                    ? language === "hi" ? "सबमिट हो रहा है..." : "Submitting..."
                    : language === "hi" ? "अर्ली एक्सेस के लिए रजिस्टर करें →" : "Register for Early Access →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
