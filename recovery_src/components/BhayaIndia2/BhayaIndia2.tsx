"use client";

import Link from "next/link";
import styles from "./BhayaIndia2.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function BhayaIndia2() {
  const { t, language } = useLanguage();

  const roadmapPillars = [
    {
      num: "01",
      title: language === "hi" ? "दुकानदार एवं विक्रेता नेटवर्क" : "Shopkeeper & Retailer Network",
      text: language === "hi"
        ? "स्थानीय खुदरा व्यापारियों और दुकानदारों को BHAYA INDIA डिजिटल तंत्र से जोड़ना।"
        : "Enabling verified local shopkeepers and retail merchants to join the BHAYA INDIA digital ecosystem.",
    },
    {
      num: "02",
      title: language === "hi" ? "प्रत्यक्ष निर्माता सहयोग" : "Direct Manufacturer Partnerships",
      text: language === "hi"
        ? "क्षेत्रीय निर्माताओं को सीधे देश भर के ग्राहकों और व्यावसायिक खरीदारों से जोड़ना।"
        : "Connecting regional manufacturers directly with customers and institutional buyers across India.",
    },
    {
      num: "03",
      title: language === "hi" ? "थोक एवं B2B आपूर्ति हब" : "Wholesale & B2B Supply Hub",
      text: language === "hi"
        ? "पारदर्शी उत्पाद सोर्सिंग, थोक आवंटन और अनुकूलित कॉर्पोरेट पूछताछ की सुविधा।"
        : "Facilitating transparent product sourcing, bulk allocation, and customized corporate enquiries.",
    },
    {
      num: "04",
      title: language === "hi" ? "एकीकृत लॉजिस्टिक्स एवं मार्केटप्लेस" : "Integrated Logistics & Marketplace",
      text: language === "hi"
        ? "एक ही भरोसेमंद नाम के तहत संपूर्ण पूर्ति, डिजिटल स्टोरफ्रंट और मल्टी-सेलर टूल्स का निर्माण।"
        : "Building end-to-end fulfillment, digital storefronts, and multi-seller tools under one trusted umbrella.",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="bi2-heading">
      <div className="container">
        <div className={styles.inner}>
          {/* Top Editorial Row */}
          <div className={styles.headerRow}>
            <div className={styles.copyCol}>
              <div className="eyebrow eyebrow--gold">
                <span className="eyebrow-line" />
                {t("bhaya2Eyebrow")}
              </div>

              <h2 className={styles.heading} id="bi2-heading">
                {t("bhaya2Headline")}
              </h2>

              <p className={styles.subheading}>
                {t("bhaya2Subheadline")}
              </p>

              <p className={styles.desc}>
                {t("bhaya2Desc")}
              </p>

              <div className={styles.actionRow}>
                <Link href="/bhaya-india-2" className={`btn ${styles.btnGold}`} id="bi2-vision-link">
                  {t("bhaya2Cta")}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Roadmap Pillars */}
            <div className={styles.pillarsCol}>
              {roadmapPillars.map((p) => (
                <div key={p.num} className={styles.pillar}>
                  <span className={styles.pillarNumber}>{p.num}</span>
                  <div className={styles.pillarContent}>
                    <h3 className={styles.pillarTitle}>{p.title}</h3>
                    <p className={styles.pillarText}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
