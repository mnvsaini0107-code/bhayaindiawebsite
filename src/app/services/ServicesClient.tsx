"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesClient() {
  const { language } = useLanguage();

  const activeServices = [
    {
      id: "svc-01",
      title: language === "hi" ? "उत्पाद सोर्सिंग एवं सत्यापन" : "Product Sourcing & Quality Verification",
      badge: language === "hi" ? "सक्रिय सेवा" : "Currently Active",
      desc: language === "hi"
        ? "अपनी विशिष्ट आवश्यकता हमें बताएं। हम अपने सत्यापित भारतीय निर्माताओं के नेटवर्क से सही उत्पाद, प्रतिस्पर्धी मूल्य और गुणवत्ता आश्वासन के साथ उपलब्ध कराएंगे।"
        : "Tell us your specific requirements. We locate verified Indian manufacturing sources, verify sample quality, and negotiate transparent bulk pricing.",
      items: [
        language === "hi" ? "विनिर्देश आधारित सोर्सिंग" : "Specification-based sourcing",
        language === "hi" ? "नमूना (Sample) निरीक्षण" : "Physical sample inspection",
        language === "hi" ? "फैक्टरी मूल्य सत्यापन" : "Direct factory pricing validation",
        language === "hi" ? "गुणवत्ता रिपोर्टिंग" : "Transparent quality verification",
      ],
      ctaText: language === "hi" ? "सोर्सिंग अनुरोध भेजें →" : "Request Sourcing →",
      ctaLink: "/contact",
    },
    {
      id: "svc-02",
      title: language === "hi" ? "थोक आपूर्ति एवं B2B वितरण" : "Wholesale Supply & B2B Distribution",
      badge: language === "hi" ? "सक्रिय सेवा" : "Currently Active",
      desc: language === "hi"
        ? "खुदरा विक्रेताओं, पुनर्विक्रेताओं और व्यावसायिक संस्थानों के लिए सीधी थोक आपूर्ति। टियर-आधारित वॉल्यूम डिस्काउंट और पक्के जीएसटी बिल।"
        : "Direct commercial supply for retailers, corporate entities, and institutions with tiered volume pricing and official GST invoices.",
      items: [
        language === "hi" ? "वॉल्यूम आधारित छूट स्लैब" : "Tiered volume discounts",
        language === "hi" ? "100% अनुपालन जीएसटी बिलिंग" : "100% compliant GST invoicing",
        language === "hi" ? "नियमित आपूर्ति अनुबंध" : "Contractual recurring dispatch",
        language === "hi" ? "समर्पित खाता प्रबंधक" : "Dedicated account management",
      ],
      ctaText: language === "hi" ? "थोक पूछताछ करें →" : "Wholesale Enquiry →",
      ctaLink: "/wholesale",
    },
    {
      id: "svc-03",
      title: language === "hi" ? "कॉरपोरेट उपहार (Corporate Gifting)" : "Corporate & Festival Gifting",
      badge: language === "hi" ? "सक्रिय सेवा" : "Currently Active",
      desc: language === "hi"
        ? "त्योहारों, सम्मेलनों और कर्मचारी सम्मान के लिए विशेष रूप से तैयार किए गए प्रीमियम उपहार सेट और कस्टम ब्रांडिंग।"
        : "Curated lifestyle and ceremonial hampers for corporate milestones, festivals, and employee appreciation.",
      items: [
        language === "hi" ? "कस्टम हैम्पर क्यूरेशन" : "Customized gift curation",
        language === "hi" ? "लोगो एवं ब्रांड प्रिंटिंग" : "Brand logo printing & personalization",
        language === "hi" ? "आकर्षक प्रीमियम पैकेजिंग" : "Bespoke gift box packaging",
        language === "hi" ? "बैच डिलीवरी समन्वय" : "Coordinated batch deliveries",
      ],
      ctaText: language === "hi" ? "उपहार कोटेशन मांगें →" : "Request Gifting Quote →",
      ctaLink: "/contact",
    },
    {
      id: "svc-04",
      title: language === "hi" ? "कस्टम ब्रांडिंग एवं पैकेजिंग" : "Custom Packaging & Brand Identity",
      badge: language === "hi" ? "सक्रिय सेवा" : "Currently Active",
      desc: language === "hi"
        ? "अपने व्यवसाय के नाम से प्रीमियम बॉक्स प्रिंटिंग, लेबल डिजाइनिंग और कस्टम पैकेजिंग समाधान।"
        : "Custom-printed boxes, branded tags, and high-finish packaging for businesses looking to enhance their market presentation.",
      items: [
        language === "hi" ? "कस्टम बॉक्स एवं बैग प्रिंटिंग" : "Rigid & corrugated box printing",
        language === "hi" ? "टैग एवं लेबलिंग समाधान" : "Woven label and swing tag design",
        language === "hi" ? "लचीली न्यूनतम ऑर्डर मात्रा" : "Accessible minimum order quantities",
        language === "hi" ? "डिज़ाइन परामर्श सहायता" : "Packaging design consultation",
      ],
      ctaText: language === "hi" ? "पैकेजिंग समाधान जानें →" : "Explore Packaging →",
      ctaLink: "/contact",
    },
  ];

  const upcomingServices = [
    {
      id: "svc-fut-01",
      title: language === "hi" ? "हाइपरलोकल मर्चेंट डिलीवरी नेटवर्क" : "Hyperlocal Merchant Delivery Network",
      badge: language === "hi" ? "विज़न 2.0 — आगामी" : "Vision 2.0 — Coming Soon",
      desc: language === "hi"
        ? "ग्राहकों को उनके स्थानीय पड़ोस के सत्यापित खुदरा दुकानदारों से जोड़ने वाला स्मार्ट रूटिंग प्लेटफॉर्म।"
        : "Smart routing platform connecting households to nearby verified neighborhood shops for express same-day fulfillment.",
      link: "/bhaya-india-2",
    },
    {
      id: "svc-fut-02",
      title: language === "hi" ? "स्वचालित वेंडर डैशबोर्ड" : "Automated Vendor Self-Service Portal",
      badge: language === "hi" ? "विज़न 2.0 — आगामी" : "Vision 2.0 — Coming Soon",
      desc: language === "hi"
        ? "दुकानदारों और निर्माताओं के लिए लाइव इन्वेंटरी प्रबंधन, ऑर्डर ट्रैकिंग और स्वचालित भुगतान रिपोर्ट।"
        : "Digital portal enabling merchant partners to manage live inventory, track incoming orders, and review settlements seamlessly.",
      link: "/become-a-seller",
    },
  ];

  return (
    <main>
      <div
        style={{
          background: "var(--sapphire)",
          padding: "80px 0 64px",
          borderBottom: "1px solid rgba(197,160,89,0.15)",
        }}
      >
        <div className="container">
          <nav
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "12px",
              marginBottom: "24px",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.03em",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)" }}>
              {language === "hi" ? "होम" : "Home"}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              {language === "hi" ? "सेवाएं" : "Services"}
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
            {language === "hi" ? "व्यावसायिक एवं ई-कॉमर्स समाधान" : "End-to-End Business Solutions"}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            {language === "hi" ? "हमारी व्यावसायिक सेवाएं" : "Our Business Services"}
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 300,
              maxWidth: "600px",
            }}
          >
            {language === "hi"
              ? "केवल उत्पाद नहीं — हम व्यापारियों, संस्थानों और ग्राहकों के लिए संपूर्ण व्यापारिक समाधान प्रदान करते हैं।"
              : "Beyond retail products — we provide end-to-end sourcing, wholesale, and logistics coordination for enterprises and merchants."}
          </p>
        </div>
      </div>

      {/* Active Services */}
      <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 600,
                color: "var(--sapphire)",
              }}
            >
              {language === "hi" ? "वर्तमान में उपलब्ध मुख्य सेवाएं" : "Currently Active Services"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
              {language === "hi"
                ? "हमारी समर्पित बिजनेस टीम इन सेवाओं के लिए तत्काल संपर्क में है।"
                : "Operational services backed by our dedicated sourcing and logistics desk."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px",
            }}
          >
            {activeServices.map((svc) => (
              <div
                key={svc.id}
                id={svc.id}
                style={{
                  padding: "36px",
                  border: "1px solid rgba(18,52,86,0.08)",
                  background: "var(--white)",
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#15803d",
                      background: "rgba(22,163,74,0.1)",
                      padding: "3px 8px",
                      borderRadius: "2px",
                      marginBottom: "14px",
                    }}
                  >
                    ● {svc.badge}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 600,
                      color: "var(--sapphire)",
                      marginBottom: "12px",
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--gray-500)",
                      lineHeight: 1.7,
                      marginBottom: "20px",
                    }}
                  >
                    {svc.desc}
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", padding: 0, listStyle: "none" }}>
                    {svc.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span style={{ color: "var(--gold)", fontWeight: "bold" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={svc.ctaLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--sapphire)",
                    fontWeight: 600,
                    fontSize: "13px",
                    textDecoration: "underline",
                  }}
                >
                  {svc.ctaText}
                </Link>
              </div>
            ))}
          </div>

          {/* Upcoming Services Section */}
          <div style={{ marginTop: "80px" }}>
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 36px" }}>
              <span
                style={{
                  color: "var(--gold)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {language === "hi" ? "भविष्य की रूपरेखा" : "Platform Roadmap"}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  fontWeight: 600,
                  color: "var(--sapphire)",
                  marginTop: "6px",
                }}
              >
                {language === "hi" ? "आगामी सेवाएं (BHAYA INDIA 2.0)" : "Upcoming Services (BHAYA INDIA 2.0)"}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {upcomingServices.map((usvc) => (
                <div
                  key={usvc.id}
                  style={{
                    padding: "32px",
                    border: "1px dashed rgba(197,160,89,0.5)",
                    background: "rgba(197,160,89,0.04)",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--gold)",
                      background: "rgba(197,160,89,0.15)",
                      padding: "3px 8px",
                      borderRadius: "2px",
                      marginBottom: "12px",
                    }}
                  >
                    ⏳ {usvc.badge}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--sapphire)",
                      marginBottom: "10px",
                    }}
                  >
                    {usvc.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "16px" }}>
                    {usvc.desc}
                  </p>
                  <Link
                    href={usvc.link}
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--sapphire)",
                      textDecoration: "underline",
                    }}
                  >
                    {language === "hi" ? "विवरण देखें →" : "Learn More →"}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div
            style={{
              marginTop: "64px",
              padding: "48px",
              background: "var(--sapphire)",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "white",
                marginBottom: "16px",
                letterSpacing: "-0.01em",
              }}
            >
              {language === "hi"
                ? "क्या आपकी कोई विशिष्ट व्यावसायिक आवश्यकता है?"
                : "Have a Custom Business Requirement?"}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 300,
                marginBottom: "32px",
                maxWidth: "500px",
                margin: "0 auto 32px",
              }}
            >
              {language === "hi"
                ? "हमारी अनुभवी B2B कंसल्टेंसी टीम आपकी सहायता के लिए सदैव उपलब्ध है।"
                : "Our commercial advisory desk is ready to assist your organization with tailored solutions."}
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
            >
              {language === "hi" ? "हमसे संपर्क करें →" : "Get in Touch →"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
