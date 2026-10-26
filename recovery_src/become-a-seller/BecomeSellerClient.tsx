"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function BecomeSellerClient() {
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("Home & Living");
  const [businessType, setBusinessType] = useState("Retailer");
  const [notes, setNotes] = useState("");

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
          city,
          type: "seller",
          message: `Seller Onboarding Enquiry. Business Type: ${businessType}, State: ${state}, Category: ${category}. Notes: ${notes}`,
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
              {language === "hi" ? "विक्रेता बनें" : "Become a Seller"}
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
            {language === "hi" ? "व्यापारी भागीदारी" : "Merchant Partnership"}
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
            {language === "hi" ? "BHAYA INDIA के साथ विक्रेता बनें" : "Sell on BHAYA INDIA"}
          </h1>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid var(--gold)",
              padding: "20px",
              maxWidth: "680px",
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
              क्या आप दुकानदार या manufacturer हैं?
              <br />
              BHAYA INDIA के साथ जुड़कर अपने व्यापार को ऑनलाइन और पूरे भारत में पहुँचाएं।
            </p>
          </div>

          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
            {language === "hi"
              ? "पारदर्शी कमीशन, शून्य छिपे हुए शुल्क और सीधे ग्राहकों व थोक खरीदारों से जुड़ाव।"
              : "Fair commission models, zero hidden fees, and genuine direct access to consumers and wholesale buyers."}
          </p>
        </div>
      </div>

      {/* Honest Status Note */}
      <div
        style={{
          background: "rgba(197,160,89,0.08)",
          borderBottom: "1px solid rgba(197,160,89,0.25)",
          padding: "16px 0",
        }}
      >
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--sapphire)", fontWeight: 500 }}>
            <strong>Vendor Marketplace — Coming Soon:</strong>{" "}
            {language === "hi"
              ? "हमारा ऑटोमेटेड सेलर डैशबोर्ड विकसित हो रहा है। वर्तमान में विक्रेताओं का सत्यापन एवं ऑनबोर्डिंग व्यक्तिगत रूप से हमारी टीम द्वारा की जा रही है।"
              : "Our automated seller dashboard is currently under active development. Meanwhile, merchant verification and onboarding are handled directly by our dedicated merchant desk."}
          </p>
        </div>
      </div>

      {/* Content & Form */}
      <section style={{ padding: "70px 0" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            alignItems: "start",
          }}
        >
          {/* Why Sell With Us */}
          <div>
            <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {language === "hi" ? "व्यापारियों के लिए लाभ" : "Why Partner With Us"}
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
              {language === "hi" ? "व्यापारियों के हित में तैयार किया गया मंच" : "Commerce Built For Merchant Prosperity"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                {
                  title: language === "hi" ? "स्थानीय पहचान, राष्ट्रीय पहुंच" : "Preserve Your Brand Identity",
                  desc: language === "hi"
                    ? "आपकी दुकान और उत्पादों की पहचान बनी रहती है। ग्राहक जानते हैं कि वे असली स्थानीय व्यापारियों से खरीद रहे हैं।"
                    : "Your business identity is highlighted. Customers know they are supporting authentic Indian retailers.",
                },
                {
                  title: language === "hi" ? "व्हाट्सऐप एवं डायरेक्ट ऑर्डर्स" : "Direct WhatsApp & Digital Enquiries",
                  desc: language === "hi"
                    ? "जटिल सिस्टम के बजाय सीधे व्हाट्सऐप एवं फोन द्वारा ग्राहक प्रश्नों और बल्क ऑर्डर्स को पूरा करें।"
                    : "Connect directly with verified leads via WhatsApp and phone without complicated intermediate layers.",
                },
                {
                  title: language === "hi" ? "उचित एवं पारदर्शी व्यापार" : "Zero Unfair Penalties",
                  desc: language === "hi"
                    ? "बड़े मार्केटप्लेस की तरह अकारण पेनल्टी या भारी रिटर्न कटौती नहीं। हम आपसी सम्मान पर काम करते हैं।"
                    : "No arbitrary algorithm bans, hidden deductions, or one-sided penalty structures.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "20px",
                    background: "var(--white)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                  }}
                >
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--sapphire)", marginBottom: "6px" }}>
                    ✓ {item.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Vendor Portal Capabilities (Phase 3 Roadmap) */}
            <div style={{ marginTop: "32px", background: "rgba(197,160,89,0.06)", border: "1px solid rgba(197,160,89,0.25)", borderRadius: "6px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--sapphire)", margin: 0 }}>
                  {language === "hi" ? "आगामी विक्रेता पोर्टल सुविधाएं" : "Upcoming Vendor Portal Capabilities"}
                </h4>
                <span style={{ fontSize: "10px", background: "var(--gold)", color: "var(--sapphire)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                  {language === "hi" ? "शीघ्र उपलब्ध • Coming Soon" : "Coming Soon"}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { en: "Register", hi: "पंजीकरण" },
                  { en: "KYC", hi: "KYC" },
                  { en: "Product Upload", hi: "उत्पाद अपलोड" },
                  { en: "Set Price", hi: "कीमत दर्ज करें" },
                  { en: "Manage Stock", hi: "स्टॉक प्रबंधित करें" },
                  { en: "View Orders", hi: "ऑर्डर देखें" },
                  { en: "View Sales", hi: "बिक्री देखें" },
                  { en: "View Payments", hi: "भुगतान देखें" },
                  { en: "View Commission", hi: "कमीशन देखें" },
                ].map((cap) => (
                  <div
                    key={cap.en}
                    style={{
                      background: "var(--white)",
                      border: "1px solid rgba(18,52,86,0.08)",
                      borderRadius: "4px",
                      padding: "10px 8px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--sapphire)",
                    }}
                  >
                    <div>{language === "hi" ? cap.hi : cap.en}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {language === "hi" ? cap.en : cap.hi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
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
              {language === "hi" ? "विक्रेता ऑनबोर्डिंग आवेदन" : "Seller Onboarding Application"}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
              {language === "hi"
                ? "कृपया नीचे दी गई जानकारी भरें। हमारी पार्टनर टीम 24 घंटों में आपसे संपर्क करेगी।"
                : "Fill in your business details below. Our merchant coordinator will connect with you within 24 hours."}
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
                  {language === "hi" ? "आवेदन सफलतापूर्वक प्राप्त हुआ!" : "Application Successfully Received!"}
                </h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "hi"
                    ? "धन्यवाद! हमारे विक्रेता प्रबंधक जल्द ही आपसे संपर्क करेंगे।"
                    : "Thank you for joining hands with BHAYA INDIA. Our team will contact you shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {errorMsg && <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{errorMsg}</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {language === "hi" ? "दुकान / कंपनी का नाम" : "Business / Shop Name"} *
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
                    placeholder="e.g. Radhe Textiles"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "संपर्क व्यक्ति का नाम" : "Contact Person"} *
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
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
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
                      placeholder="e.g. 8726690926"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "शहर" : "City"} *
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
                      placeholder="e.g. Jaipur"
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "राज्य" : "State"} *
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
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Rajasthan"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "उत्पाद श्रेणी" : "Product Category"}
                    </label>
                    <select
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                        background: "white",
                      }}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Home & Living">Home & Living</option>
                      <option value="Textiles & Apparel">Textiles & Apparel</option>
                      <option value="Handicrafts & Decor">Handicrafts & Decor</option>
                      <option value="Lifestyle Goods">Lifestyle Goods</option>
                      <option value="Kitchen & Utensils">Kitchen & Utensils</option>
                      <option value="Other">Other Category</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "व्यापार का प्रकार" : "Business Type"}
                    </label>
                    <select
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                        background: "white",
                      }}
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                    >
                      <option value="Retailer">Retail Shop / Store</option>
                      <option value="Wholesaler">Wholesaler / Distributor</option>
                      <option value="Manufacturer">Manufacturer / Mill</option>
                      <option value="Artisan">Artisan / Small Producer</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {language === "hi" ? "अतिरिक्त विवरण / प्रश्न (वैकल्पिक)" : "Notes or Questions (Optional)"}
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about your products or current monthly sales..."
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
                    : language === "hi" ? "विक्रेता आवेदन जमा करें →" : "Submit Seller Application →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
