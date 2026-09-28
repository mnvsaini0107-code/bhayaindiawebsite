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

      {/* How It Works - The Flow */}
      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 56px" }}>
            <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {language === "hi" ? "हाइपरलोकल कार्यप्रणाली" : "Hyperlocal Flow"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 600,
                color: "var(--sapphire)",
                letterSpacing: "-0.02em",
                marginTop: "8px",
              }}
            >
              {language === "hi" ? "ग्राहक ➔ BHAYA INDIA ➔ स्थानीय दुकानदार" : "Customer ➔ BHAYA INDIA ➔ Local Merchant"}
            </h2>
            <p style={{ fontSize: "15px", color: "var(--gray-500)", marginTop: "12px", lineHeight: 1.7 }}>
              {language === "hi"
                ? "ऑनलाइन ऑर्डर मिलने पर BHAYA INDIA सिस्टम ग्राहक के सबसे निकटतम सत्यापित दुकानदार या निर्माता से संपर्क करेगा, जिससे तेज़ डिलीवरी और स्थानीय विश्वास सुनिश्चित होगा।"
                : "When an order is placed, BHAYA INDIA routes the request to the nearest verified neighborhood retailer or supplier, securing swift delivery and authentic local reliability."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              position: "relative",
            }}
          >
            {[
              {
                step: "01",
                title: language === "hi" ? "ग्राहक ऑर्डर" : "Customer Places Order",
                desc: language === "hi"
                  ? "ग्राहक BHAYA INDIA वेबसाइट या ऐप पर उत्पाद चुनकर ऑर्डर या व्हाट्सऐप इंक्वायरी भेजते हैं।"
                  : "Customer browses verified catalogue items and places an order or WhatsApp enquiry.",
              },
              {
                step: "02",
                title: language === "hi" ? "स्मार्ट रूटिंग" : "Smart Local Routing",
                desc: language === "hi"
                  ? "सिस्टम ग्राहक के पिनकोड और निकटता के आधार पर सबसे उपयुक्त सत्यापित मर्चेंट को ऑर्डर सौंपता है।"
                  : "The system matches and routes the fulfillment request to the closest verified merchant partner.",
              },
              {
                step: "03",
                title: language === "hi" ? "गुणवत्ता जांच एवं डिस्पैच" : "Inspection & Swift Dispatch",
                desc: language === "hi"
                  ? "स्थानीय दुकानदार उत्पाद तैयार कर BHAYA INDIA के पैकेजिंग और गुणवत्ता मानकों के अनुसार भेजता है।"
                  : "The local merchant prepares the goods under strict BHAYA INDIA quality standards for prompt dispatch.",
              },
              {
                step: "04",
                title: language === "hi" ? "सुरक्षित डिलीवरी" : "Trusted Delivery",
                desc: language === "hi"
                  ? "ग्राहक को तेज डिलीवरी मिलती है और स्थानीय व्यापारी को बिना किसी अनुचित कमीशन के सीधा व्यापार मिलता है।"
                  : "Customer receives trusted goods faster, while the local retailer grows with fair margins.",
              },
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  background: "var(--ivory)",
                  border: "1px solid rgba(18,52,86,0.08)",
                  borderRadius: "4px",
                  padding: "32px 24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "36px",
                    fontWeight: 700,
                    color: "rgba(197,160,89,0.35)",
                    marginBottom: "12px",
                  }}
                >
                  {st.step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--sapphire)",
                    marginBottom: "10px",
                  }}
                >
                  {st.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7, margin: 0 }}>{st.desc}</p>
              </div>
            ))}
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
