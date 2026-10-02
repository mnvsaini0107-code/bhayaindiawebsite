"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ManufacturersClient() {
  const { language } = useLanguage();

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [capacity, setCapacity] = useState("");
  const [moq, setMoq] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [documents, setDocuments] = useState("");
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
          name: contactPerson,
          phone,
          businessName: companyName,
          city: location,
          type: "manufacturer",
          message: `Manufacturer Partnership Form. Company: ${companyName}, Profile: ${companyProfile}, Capacity: ${capacity}, MOQ: ${moq}, Price: ${priceRange}, Location: ${location}, Documents/Reg: ${documents}. Products: ${productDetails}`,
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
          background: "linear-gradient(135deg, #0c2540 0%, var(--sapphire) 100%)",
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
              {language === "hi" ? "निर्माताओं के लिए" : "For Manufacturers"}
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
            {language === "hi" ? "फैक्टरी एवं निर्माण साझेदारी" : "Direct Factory Sourcing"}
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
            {language === "hi" ? "भाया इंडिया पार्टनर बनें" : "Become a Bhaya India Partner"}
          </h1>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid var(--gold)",
              padding: "20px",
              maxWidth: "720px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "17px",
                color: "#ffffff",
                lineHeight: 1.8,
                margin: 0,
                fontWeight: 500,
              }}
            >
              BHAYA INDIA निर्माताओं को सीधे थोक खरीदारों, खुदरा विक्रेताओं और अंतिम ग्राहकों से जोड़ता है।
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "var(--gold)",
                fontWeight: 600,
                marginTop: "8px",
                margin: 0,
              }}
            >
              बिना बिचौलियों के सीधा व्यापार • बेहतर मार्जिन • पूरे भारत में मांग
            </p>
          </div>
        </div>
      </div>

      {/* Pillars */}
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
            {/* Info */}
            <div>
              <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {language === "hi" ? "सीधा संबंध" : "Direct Engagement"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 600,
                  color: "var(--sapphire)",
                  marginTop: "8px",
                  marginBottom: "20px",
                }}
              >
                {language === "hi" ? "फैक्टरी से सीधे बाजार तक" : "Factory Direct to Retail Market"}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--gray-500)", lineHeight: 1.8, marginBottom: "24px" }}>
                {language === "hi"
                  ? "पारंपरिक वितरण में 3 से 4 स्तर के बिचौलिये होते हैं, जिससे निर्माता का वास्तविक मुनाफा घट जाता है। BHAYA INDIA आधुनिक डिजिटल प्लेटफॉर्म के जरिए आपको सीधे थोक और खुदरा मांग से जोड़ता है।"
                  : "Traditional supply chains bleed margins through cascading middlemen. BHAYA INDIA provides a direct pipeline connecting your production line to high-volume buyers nationwide."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  {
                    title: language === "hi" ? "थोक एवं बी2बी खरीदारों तक सीधी पहुँच" : "Direct Access to Bulk Buyers",
                    desc: language === "hi"
                      ? "होटल, संस्थाएं, बड़े खुदरा व्यापारी और वितरक सीधे आपसे कोटेशन प्राप्त कर सकते हैं।"
                      : "Verified institutional buyers, retailers, and corporate clients source directly from your factory.",
                  },
                  {
                    title: language === "hi" ? "समय पर भुगतान एवं पारदर्शी शर्तें" : "Transparent Terms & Prompt Invoicing",
                    desc: language === "hi"
                      ? "पारदर्शी व्यापारिक नीतियां और सुरक्षित भुगतान प्रक्रिया से व्यवसाय बिना किसी अनिश्चितता के चलता है।"
                      : "Clear purchase order agreements and direct settlement timelines keep cash flows healthy.",
                  },
                  {
                    title: language === "hi" ? "कैटलॉग प्रदर्शन एवं ब्रांड सुरक्षा" : "Catalogue Spotlight & Quality Trust",
                    desc: language === "hi"
                      ? "आपके उत्पादों को हमारे सत्यापित कैटलॉग और भाया 2.0 नेटवर्क में प्रमुखता मिलती है।"
                      : "Showcase your manufacturing craftsmanship to buyers across India with verified merchant accreditation.",
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

              {/* Future Concepts Card */}
              <div style={{ marginTop: "24px", background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.3)", borderRadius: "6px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--sapphire)", margin: 0 }}>
                    {language === "hi" ? "भावी साझेदारी मॉडल" : "Future Partnership Models"}
                  </h4>
                  <span style={{ fontSize: "10px", background: "var(--gold)", color: "var(--sapphire)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                    {language === "hi" ? "भविष्य की परिकल्पना • Future Vision" : "Future Vision"}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    {
                      title: language === "hi" ? "भाया ब्रांड साझेदारी (Bhaya Brand Partnership)" : "Bhaya Brand Partnership",
                      desc: language === "hi" ? "प्रमाणित निर्माताओं के साथ सह-ब्रांडेड उत्पाद वितरण।" : "Co-branded national distribution with certified producers.",
                    },
                    {
                      title: language === "hi" ? "प्राइवेट लेबल (Private Label)" : "Private Label Manufacturing",
                      desc: language === "hi" ? "BHAYA INDIA विशिष्ट विनिर्देशों के अनुसार विशेष उत्पाद निर्माण।" : "Custom OEM production meeting verified Bhaya India design standards.",
                    },
                    {
                      title: language === "hi" ? "ब्रांड लाइसेंसिंग (Brand Licensing)" : "Brand Licensing",
                      desc: language === "hi" ? "मानकीकृत गुणवत्ता के साथ क्षेत्रीय लाइसेंसिंग व्यवस्था।" : "Regional production franchising under standardized quality protocols.",
                    },
                  ].map((m) => (
                    <div key={m.title} style={{ background: "var(--white)", border: "1px solid rgba(18,52,86,0.06)", borderRadius: "4px", padding: "12px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--sapphire)" }}>{m.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{m.desc}</div>
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
                {language === "hi" ? "भाया इंडिया पार्टनर आवेदन फॉर्म" : "Become a Partner — Application Form"}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                {language === "hi"
                  ? "अपनी निर्माण इकाई का प्रोफ़ाइल, क्षमता एवं उत्पाद विवरण दर्ज करें। हमारी B2B सोर्सिंग टीम आपसे संपर्क करेगी।"
                  : "Submit your factory profile, production capacity, and catalogue. Our industrial sourcing team will contact you."}
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
                    {language === "hi" ? "जानकारी सफलतापूर्वक प्राप्त हुई!" : "Factory Inquiry Logged!"}
                  </h4>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
                    {language === "hi"
                      ? "धन्यवाद! हमारे सोर्सिंग डायरेक्टर 24-48 घंटों के भीतर आपकी इकाई से संपर्क करेंगे।"
                      : "Thank you! Our head of manufacturing partnerships will contact you within 24-48 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {errorMsg && <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{errorMsg}</p>}

                  {/* Company Profile */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "कंपनी प्रोफ़ाइल / इकाई का नाम (Company Profile)" : "Company Profile / Factory Name"} *
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
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Industrial Polymers Pvt Ltd"
                    />
                  </div>

                  {/* Contact Person & Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "संपर्क व्यक्ति (Contact Person)" : "Contact Person"} *
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
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="e.g. Vikram Singh"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "संपर्क नंबर / व्हाट्सऐप (Contact Phone)" : "Contact (WhatsApp)"} *
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

                  {/* Location & Capacity */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "स्थान - शहर, राज्य (Location)" : "Location (City, State)"} *
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
                        placeholder="e.g. Surat, Gujarat"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "उत्पादन क्षमता (Manufacturing Capacity)" : "Manufacturing Capacity"} *
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
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="e.g. 10,000 units / month"
                      />
                    </div>
                  </div>

                  {/* MOQ & Price */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "न्यूनतम ऑर्डर मात्रा (MOQ)" : "MOQ (Min Order Qty)"} *
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
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        placeholder="e.g. 100 units or 1 Pallet"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {language === "hi" ? "कीमत / एक्स-फैक्ट्री दर (Price / Target Price)" : "Price / Ex-Factory Range"}
                      </label>
                      <input
                        type="text"
                        style={{
                          padding: "10px 14px",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "2px",
                          fontSize: "14px",
                        }}
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        placeholder="e.g. ₹150 - ₹450 / unit"
                      />
                    </div>
                  </div>

                  {/* Products */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "उत्पाद विवरण एवं विशेषताएं (Product)" : "Product Details & Specifications"} *
                    </label>
                    <textarea
                      rows={2}
                      required
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                      value={productDetails}
                      onChange={(e) => setProductDetails(e.target.value)}
                      placeholder="List key product types, materials, packaging types, and categories..."
                    />
                  </div>

                  {/* Documents */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {language === "hi" ? "दस्तावेज़ / पंजीकरण विवरण (Documents - GST/MSME/Certifications)" : "Documents (GST / MSME / Certificates)"}
                    </label>
                    <input
                      type="text"
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "2px",
                        fontSize: "14px",
                      }}
                      value={documents}
                      onChange={(e) => setDocuments(e.target.value)}
                      placeholder="GSTIN, MSME Reg, ISO certification details..."
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
                      : language === "hi" ? "पार्टनर आवेदन जमा करें →" : "Submit Partner Application →"}
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
