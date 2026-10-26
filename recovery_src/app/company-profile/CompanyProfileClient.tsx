"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import styles from "./company-profile.module.css";

export default function CompanyProfileClient() {
  const { language, t } = useLanguage();
  const whatsappNumber = "918726690926";

  const visionPillars = [
    {
      badge: language === "hi" ? "1. भाया इंडिया क्या है" : "1. What Bhaya India Is",
      title: language === "hi" ? "भारतीय व्यापार एवं ई-कॉमर्स मंच" : "Pan-India Business & E-Commerce Platform",
      desc: language === "hi"
        ? "BHAYA INDIA एक बहु-श्रेणी भारतीय व्यावसायिक एवं ई-कॉमर्स मंच है, जो स्थानीय खुदरा व्यापारियों, कारीगरों, थोक विक्रेताओं और विनिर्माण इकाइयों को आधुनिक डिजिटल कॉमर्स से जोड़ता है।"
        : "BHAYA INDIA is a multi-category Indian business and e-commerce platform connecting local retail shopkeepers, artisans, wholesalers, and manufacturers with modern digital commerce.",
    },
    {
      badge: language === "hi" ? "2. शुरुआत का कारण" : "2. Why It Started",
      title: language === "hi" ? "जमीनी व्यापारिक चुनौतियों का समाधान" : "Solving Grassroots Merchant Friction",
      desc: language === "hi"
        ? "भारत के लाखों छोटे और मध्यम व्यवसायी असाधारण उत्पाद बनाते हैं, किंतु जटिल तकनीक, बिचौलियों के शोषण और भारी प्लेटफॉर्म कमीशन के कारण ऑनलाइन व्यापार में पीछे छूट जाते हैं। BHAYA INDIA इसी दूरी को मिटाने के लिए अस्तित्व में आया।"
        : "Millions of Indian MSMEs and artisans produce exceptional goods but have historically faced technical hurdles, exploitative middlemen, and prohibitive platform commissions. BHAYA INDIA was established to eliminate this divide.",
    },
    {
      badge: language === "hi" ? "3. मूल उद्देश्य" : "3. Foundational Purpose",
      title: language === "hi" ? "लोकल टू ऑनलाइन • लोकल टू इंडिया" : "Local to Online • Local to India",
      desc: language === "hi"
        ? "हमारा उद्देश्य हर भारतीय व्यापारी को निष्पक्ष डिजिटल शक्ति प्रदान करना और ग्राहकों को प्रामाणिक, गुणवत्तापूर्ण एवं उचित मूल्य पर उत्पाद उपलब्ध कराना है। 'जहाँ भाया, वहाँ भरोसा' हमारा सर्वोच्च मार्गदर्शक सिद्धांत है।"
        : "Our foundational purpose is empowering every Indian merchant with equitable digital access while providing consumers direct access to genuine, quality-tested goods at honest pricing. 'जहाँ भाया, वहाँ भरोसा' guides every relationship.",
    },
    {
      badge: language === "hi" ? "4. दीर्घकालिक दिशा" : "4. Long-Term Direction",
      title: language === "hi" ? "विश्वसनीय राष्ट्रव्यापी वितरण नेटवर्क" : "Dependable Pan-India Distribution",
      desc: language === "hi"
        ? "पारंपरिक विश्वास को आधुनिक आपूर्ति श्रृंखला के साथ जोड़कर भारत के 700 से अधिक जिलों में विश्वसनीय लॉजिस्टिक्स, गोदाम और B2B थोक पूर्ति बुनियादी ढांचे का विस्तार करना।"
        : "Bridging time-honored commercial integrity with modern fulfillment to expand transparent logistics, warehousing, and B2B wholesale distribution across Indian commercial corridors.",
    },
  ];

  const capabilities = language === "hi"
    ? [
        {
          title: "त्योहार एवं उत्सव आपूर्ति",
          desc: "पूजा सामग्री, पीतल के दीये, तोरण, विवाह संस्कार सामग्री एवं भव्य त्योहार उपहार हैम्पर्स।",
        },
        {
          title: "खुदरा एवं घरेलू सामान",
          desc: "दैनिक उपयोग, रसोई बर्तन, तांबे की बोतलें, होम टेक्सटाइल्स एवं जनरल स्टोर आपूर्ति।",
        },
        {
          title: "विनिर्माण एवं कारीगर क्लस्टर्स",
          desc: "मेड इन इंडिया उत्पाद, वाराणसी हथकरघा सिल्क, पीतल शिल्प एवं फैक्ट्री उत्पाद।",
        },
        {
          title: "पैकेजिंग एवं पेपर उत्पाद",
          desc: "पर्यावरण-अनुकूल पेपर बैग, गत्ते के कार्टन बॉक्स, उपहार पैकेजिंग एवं कस्टम प्रिंटिंग।",
        },
      ]
    : [
        {
          title: "Festival & Auspicious Gifting",
          desc: "Pure puja samagri, brassware diyas, torans, marriage ceremony essentials, and celebratory gift trunks.",
        },
        {
          title: "Retail & Household Goods",
          desc: "Everyday essentials, copper drinkware, kitchen utilities, home textiles, and general store merchandise.",
        },
        {
          title: "Manufacturing & Artisan Clusters",
          desc: "Certified Made in India goods, Varanasi handloom silks, Moradabad brasscraft, and factory production.",
        },
        {
          title: "Packaging & Paper Products",
          desc: "Eco-friendly kraft paper bags, corrugated shipping cartons, gift presentation boxes, and custom branded print.",
        },
      ];

  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
            <span className={styles.sep}>/</span>
            <span>{language === "hi" ? "कंपनी का विज़न" : "Company Vision"}</span>
          </div>
          <span className={styles.eyebrow}>
            {language === "hi" ? "कॉर्पोरेट परिचय एवं विज़न" : "CORPORATE DOSSIER & VISION"}
          </span>
          <h1 className={styles.title}>
            {language === "hi" ? "कंपनी का विज़न — BHAYA INDIA" : "Bhaya India Commercial Profile & Vision"}
          </h1>
          <p className={`${styles.tagline} font-devanagari`}>
            “जहाँ भाया, वहाँ भरोसा।”
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {visionPillars.map((vp, idx) => (
            <div key={idx} className={styles.card}>
              <span className={styles.badge}>{vp.badge}</span>
              <h2>{vp.title}</h2>
              <p>{vp.desc}</p>
            </div>
          ))}

          {/* Future Ecosystem: Bhaya India 2.0 */}
          <div className={styles.cardFull}>
            <span className={styles.badge}>
              {language === "hi" ? "भाया इंडिया 2.0 का भविष्य तंत्र" : "FUTURE ECOSYSTEM: BHAYA INDIA 2.0"}
            </span>
            <h2>
              {language === "hi"
                ? "एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा"
                : "One Platform — Thousands of Shops — One Trust"}
            </h2>
            <p style={{ marginBottom: "20px" }}>
              {language === "hi"
                ? "BHAYA INDIA 2.0 के अंतर्गत हम ग्राहक, विक्रेता, निर्माता, रिटेलर, डिस्ट्रीब्यूटर और लॉजिस्टिक्स पार्टनर्स को एक पारदर्शी डिजिटल इकोसिस्टम में ला रहे हैं। (भविष्य विज़न / आगामी चरण)"
                : "Under BHAYA INDIA 2.0, we are engineering a unified digital ecosystem connecting Customers, Vendors, Manufacturers, Retailers, Distributors, and Logistics partners under verifiable standards of trust. (Future Vision / Coming Soon)"}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
                padding: "16px",
                background: "rgba(18,52,86,0.04)",
                borderRadius: "6px",
              }}
            >
              {[
                language === "hi" ? "विक्रेता" : "Vendor",
                "→",
                language === "hi" ? "भाया प्लेटफॉर्म" : "Bhaya Platform",
                "→",
                language === "hi" ? "ग्राहक" : "Customer",
                "→",
                language === "hi" ? "सुरक्षित भुगतान" : "Secure Payment",
                "→",
                language === "hi" ? "डिलीवरी" : "Delivery",
                "→",
                language === "hi" ? "विक्रेता सेटलमेंट" : "Vendor Settlement",
              ].map((step, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    fontWeight: step === "→" ? 400 : 700,
                    color: step === "→" ? "var(--gold)" : "var(--sapphire)",
                    fontSize: "13px",
                  }}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className={styles.cardFull}>
            <span className={styles.badge}>
              {language === "hi" ? "प्रमुख व्यापारिक दिशाएँ" : "CORE CAPABILITIES"}
            </span>
            <h2>
              {language === "hi" ? "व्यावसायिक आपूर्ति एवं वितरण" : "Commercial Supply & Distribution"}
            </h2>
            <div className={styles.capsGrid}>
              {capabilities.map((cap, cIdx) => (
                <div key={cIdx} className={styles.capBox}>
                  <h3>{cap.title}</h3>
                  <p>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact / Enquiries Block */}
          <div className={styles.cardFull}>
            <div className={styles.contactBlock}>
              <div>
                <h2>
                  {language === "hi"
                    ? "व्यावसायिक पूछताछ एवं संस्थागत अनुबंध"
                    : "Corporate Enquiries & Institutional Contracting"}
                </h2>
                <p>
                  {language === "hi"
                    ? "थोक ऑर्डर, संस्थागत आपूर्ति या साझेदारी के लिए हमारी समर्पित डेस्क से संपर्क करें।"
                    : "For wholesale quotas, institutional tenders, or strategic brand partnerships, connect directly with our commercial desk."}
                </p>
              </div>
              <div className={styles.contactActions}>
                <Link href="/contact" className="btn btn-primary">
                  {language === "hi" ? "डेस्क से संपर्क करें" : "Contact Commercial Team"}
                </Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    language === "hi"
                      ? "नमस्ते, मैं BHAYA INDIA के कंपनी विज़न एवं थोक व्यापार के संबंध में जानकारी चाहता हूँ।"
                      : "Hello Bhaya India, I would like to enquire about your company profile and commercial supplies."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  {language === "hi" ? "व्हाट्सऐप पूछताछ" : "Direct WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CredibilityStrip />
    </main>
  );
}
