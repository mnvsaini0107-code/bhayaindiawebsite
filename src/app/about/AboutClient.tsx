"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import FounderStory from "@/components/FounderStory/FounderStory";

export default function AboutClient() {
  const { language, t } = useLanguage();

  return (
    <main>
      {/* Hero */}
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
              {language === "hi" ? "हमारे बारे में" : "About"}
            </span>
          </nav>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(197,160,89,0.15)",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            {language === "hi" ? "भारत का अपना व्यापारिक मंच" : "India's Trusted Business Platform"}
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
            {t("aboutTitle")}
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 300,
              maxWidth: "640px",
            }}
          >
            {t("aboutSubtitle")}
          </p>
        </div>
      </div>

      {/* Primary Mission & Core Dimensions */}
      <section style={{ padding: "80px 0", background: "var(--ivory)" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "60px",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                width: "40px",
                height: "2px",
                background: "var(--gold)",
                marginBottom: "20px",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 600,
                color: "var(--sapphire)",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              {language === "hi"
                ? "स्थानीय व्यापार से राष्ट्रीय विश्वास तक"
                : "From Local Roots to Nationwide Trust"}
            </h2>

            {/* Approved Brand Box */}
            <div
              style={{
                background: "var(--white)",
                borderLeft: "4px solid var(--gold)",
                padding: "24px",
                borderRadius: "4px",
                boxShadow: "0 4px 16px rgba(18,52,86,0.05)",
                marginBottom: "28px",
              }}
            >
              <p
                style={{
                  fontSize: "17px",
                  color: "var(--sapphire)",
                  lineHeight: 1.8,
                  fontWeight: 500,
                  marginBottom: "14px",
                }}
              >
                {language === "hi"
                  ? "BHAYA INDIA एक भारतीय Business & E-commerce Platform है, जो स्थानीय खुदरा व्यापारियों, थोक विक्रेताओं और निर्माताओं को आधुनिक डिजिटल कॉमर्स से जोड़ता है।"
                  : "BHAYA INDIA is a premier Indian Business & E-commerce Platform connecting local retailers, wholesalers, and manufacturers with modern digital commerce."}
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--gray-600)",
                  lineHeight: 1.8,
                  fontWeight: 400,
                  marginBottom: "16px",
                }}
              >
                {language === "hi"
                  ? "हमारा लक्ष्य हर भारतीय व्यापारी को डिजिटल शक्ति देना और ग्राहकों को विश्वसनीय, गुणवत्तापूर्ण उत्पाद सीधे उपलब्ध कराना है।"
                  : "Our mission is to empower every Indian merchant with digital commerce capability while delivering authentic, quality-tested products directly to consumers."}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  paddingTop: "12px",
                  borderTop: "1px dashed rgba(197,160,89,0.4)",
                  color: "var(--sapphire)",
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "var(--gold)", letterSpacing: "0.05em", fontSize: "14px" }}>
                  LOCAL TO ONLINE • LOCAL TO INDIA
                </span>
                <span style={{ fontSize: "16px" }}>
                  जहाँ भाया, वहाँ भरोसा
                </span>
              </div>
            </div>

            <p style={{ fontSize: "15px", color: "var(--gray-500)", lineHeight: 1.8, marginBottom: "16px" }}>
              {language === "hi"
                ? "BHAYA INDIA की शुरुआत जमीनी व्यापारिक जरूरतों को समझने से हुई। भारत के लाखों छोटे और मध्यम व्यवसायी बेहतरीन उत्पाद बनाते और बेचते हैं, लेकिन जटिल तकनीक और भारी कमीशन के कारण ऑनलाइन व्यापार में पीछे रह जाते हैं। BHAYA INDIA इस दूरी को मिटाने के लिए प्रतिबद्ध है।"
                : "BHAYA INDIA was founded upon deep grassroots understanding of Indian commerce. Millions of local artisans, manufacturers, and retailers produce exceptional goods but have historically faced technical friction and heavy platform commissions. BHAYA INDIA bridges this divide with integrity, transparent operations, and equitable partnership."}
            </p>
          </div>

          <div
            style={{
              position: "relative",
              overflow: "hidden",
              aspectRatio: "4/3",
              background: "var(--ivory-warm)",
              borderRadius: "4px",
              boxShadow: "0 12px 32px rgba(18,52,86,0.1)",
            }}
          >
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

      {/* Expanded Founder Story Section (Includes 6 core dimensions & strict verified facts) */}
      <FounderStory />

      {/* Business Model: B2C, B2B & Hyperlocal Vision */}
      <section style={{ padding: "80px 0", background: "var(--ivory-warm)", borderTop: "1px solid rgba(18,52,86,0.06)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 48px" }}>
            <span style={{ color: "var(--gold)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {language === "hi" ? "व्यावसायिक मॉडल" : "Our Business Model"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 600,
                color: "var(--sapphire)",
                letterSpacing: "-0.02em",
                marginTop: "8px",
              }}
            >
              {language === "hi" ? "तीन स्तंभों पर आधारित विकास" : "Built on Three Pillars of Commerce"}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
            {[
              {
                title: language === "hi" ? "1. खुदरा ई-कॉमर्स" : "1. Retail E-commerce (B2C)",
                desc: language === "hi"
                  ? "ग्राहकों को सीधे सत्यापित उत्पादों का आसान और पारदर्शी कैटलॉग, स्पष्ट मूल्य और व्हाट्सऐप सहायता के साथ उपलब्ध कराना।"
                  : "Providing end consumers direct access to verified lifestyle and home goods with honest pricing and direct WhatsApp enquiry support.",
              },
              {
                title: language === "hi" ? "2. थोक एवं व्यापक आपूर्ति" : "2. Wholesale & Bulk Supply (B2B)",
                desc: language === "hi"
                  ? "खुदरा दुकानदारों और संस्थागत खरीदारों के लिए थोक दर, सीधे निर्माताओं से सोर्सिंग और पारदर्शी कोटेशन प्रक्रिया।"
                  : "Connecting shop owners, institutions, and bulk buyers directly with manufacturers for tiered quantity pricing and reliable dispatch.",
              },
              {
                title: language === "hi" ? "3. हाइपरलोकल विज़न" : "3. Hyperlocal Vision (Bhaya 2.0)",
                desc: language === "hi"
                  ? "आगामी चरण में पड़ोस के स्थानीय व्यापारियों को डिजिटल बनाकर आस-पास के ग्राहकों तक तेजी से सेवा पहुंचाना।"
                  : "Empowering trusted neighborhood shopkeepers with digital storefronts to serve nearby households with lightning-fast delivery.",
              },
            ].map((col) => (
              <div
                key={col.title}
                style={{
                  padding: "36px 28px",
                  background: "var(--white)",
                  border: "1px solid rgba(18,52,86,0.08)",
                  borderRadius: "4px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--sapphire)",
                    marginBottom: "12px",
                  }}
                >
                  {col.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7 }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 0", background: "var(--white)" }}>
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 600,
              color: "var(--sapphire)",
              letterSpacing: "-0.02em",
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            {language === "hi" ? "हमारे मूलभूत सिद्धांत एवं मूल्य" : "Our Core Values & Principles"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px" }}>
            {[
              {
                title: language === "hi" ? "विश्वसनीयता एवं सत्यनिष्ठा" : "Honesty & Integrity",
                text: language === "hi"
                  ? "हम किसी भी झूठे वादे, नकली समीक्षाओं या भ्रामक दावों से दूर रहते हैं। व्यापार की नींव आपसी विश्वास है।"
                  : "We reject false claims, fake reviews, and inflated promises. Every relationship is anchored in truth.",
              },
              {
                title: language === "hi" ? "गुणवत्ता सर्वप्रथम" : "Quality First",
                text: language === "hi"
                  ? "हर उत्पाद का चयन उसकी गुणवत्ता और टिकाऊपन के आधार पर किया जाता है, न कि केवल कम कीमत पर।"
                  : "Every product in our collection is curated for quality, durability, and customer satisfaction.",
              },
              {
                title: language === "hi" ? "भारतीय व्यापारी सशक्तीकरण" : "Empowering Indian Merchants",
                text: language === "hi"
                  ? "हम स्थानीय भारतीय निर्माताओं, कारीगरों और छोटे व्यापारियों को राष्ट्रीय मंच पर लाने के लिए समर्पित हैं।"
                  : "Dedicated to championing local Indian artisans, MSMEs, and retailers on a national platform.",
              },
              {
                title: language === "hi" ? "सच्ची ग्राहक सेवा" : "Personal Concierge Support",
                text: language === "hi"
                  ? "कस्टमर केयर केवल बॉट्स तक सीमित नहीं है — हमारे वास्तविक प्रतिनिधि व्हाट्सऐप और फोन पर आपकी मदद करते हैं।"
                  : "No robotic walls. Genuine human representatives assist you via WhatsApp and direct call.",
              },
            ].map((v) => (
              <div
                key={v.title}
                style={{
                  padding: "32px",
                  background: "var(--ivory)",
                  border: "1px solid rgba(18,52,86,0.06)",
                  borderRadius: "4px",
                }}
              >
                <div style={{ width: "28px", height: "2px", background: "var(--gold)", marginBottom: "16px" }} />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--sapphire)",
                    marginBottom: "10px",
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision 2.0 CTA */}
      <section style={{ padding: "80px 0", background: "var(--sapphire)" }}>
        <div className="container">
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                padding: "5px 14px",
                border: "1px solid rgba(197,160,89,0.35)",
                color: "var(--gold)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              {language === "hi" ? "आगामी विज़न — BHAYA INDIA 2.0" : "Upcoming Vision — BHAYA INDIA 2.0"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              {language === "hi" ? "एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा" : "One Platform — Thousands of Shops — One Trust"}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: "32px",
              }}
            >
              {language === "hi"
                ? "हम भारत भर के खुदरा व्यापारियों, कारीगरों और निर्माताओं को एक एकीकृत डिजिटल नेटवर्क में ला रहे हैं। BHAYA INDIA 2.0 से जुड़ने के लिए आज ही संपर्क करें।"
                : "We are actively engineering a unified digital network uniting retailers, artisans, and manufacturers across India. Connect with our partnership team today."}
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/bhaya-india-2" className="btn btn-primary">
                {language === "hi" ? "BHAYA INDIA 2.0 जानें →" : "Explore BHAYA INDIA 2.0 →"}
              </Link>
              <Link
                href="/become-a-seller"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  border: "1px solid rgba(197,160,89,0.3)",
                  color: "var(--gold)",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {language === "hi" ? "विक्रेता बनें" : "Become a Seller"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
