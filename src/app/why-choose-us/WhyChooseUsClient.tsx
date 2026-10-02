"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import Testimonials from "@/components/Testimonials/Testimonials";
import styles from "./why-choose-us.module.css";

export default function WhyChooseUsClient() {
  const { language, t } = useLanguage();

  const trustPillars = [
    { title: t("trustPillar1"), desc: t("trustPillar1Desc") },
    { title: t("trustPillar2"), desc: t("trustPillar2Desc") },
    { title: t("trustPillar3"), desc: t("trustPillar3Desc") },
    { title: t("trustPillar4"), desc: t("trustPillar4Desc") },
    { title: t("trustPillar5"), desc: t("trustPillar5Desc") },
    { title: t("trustPillar6"), desc: t("trustPillar6Desc") },
    { title: t("trustPillar7"), desc: t("trustPillar7Desc") },
    { title: t("trustPillar8"), desc: t("trustPillar8Desc") },
  ];

  const comparisons = language === "hi"
    ? [
        {
          attr: "सोर्सिंग प्रामाणिकता",
          generic: "असत्यापित तृतीय-पक्ष और बिचौलिए",
          bhaya: "सीधे कारीगर क्लस्टर्स, मिलें और सत्यापित निर्माता",
        },
        {
          attr: "गुणवत्ता परीक्षण",
          generic: "बिना किसी इन-हाउस जांच के अंधाधुंध प्रेषण",
          bhaya: "प्रेषण से पूर्व आंतरिक बहु-स्तरीय गुणवत्ता निरीक्षण",
        },
        {
          attr: "मूल्य सत्यनिष्ठा",
          generic: "अत्यधिक कमीशन और छुपे शुल्क",
          bhaya: "पारदर्शी फैक्टरी दरें एवं स्पष्ट वॉल्यूम छूट",
        },
        {
          attr: "कस्टम निर्माण एवं पैकेजिंग",
          generic: "सीमित स्टॉक, कोई अनुकूलन सुविधा नहीं",
          bhaya: "कस्टम फॉयल स्टैम्पिंग, कढ़ाई, कॉर्पोरेट बॉक्स एवं हैम्पर्स",
        },
        {
          attr: "ग्राहक सेवा",
          generic: "स्वचालित एआई बॉट्स और अनसुलझी टिकटिंग प्रणाली",
          bhaya: "समर्पित वास्तविक प्रतिनिधि — सीधी कॉल एवं व्हाट्सऐप सहायता",
        },
      ]
    : [
        {
          attr: "Sourcing Authenticity",
          generic: "Unverified third-party dropshippers & middlemen",
          bhaya: "Direct artisan clusters, certified mills & verified makers",
        },
        {
          attr: "Quality Inspection",
          generic: "Dispatched blindly by unverified sellers",
          bhaya: "In-house multi-point quality check before dispatch",
        },
        {
          attr: "Pricing Integrity",
          generic: "Inflated markup with hidden platform commissions",
          bhaya: "Transparent factory rates with clear volume discounts",
        },
        {
          attr: "Corporate Customization",
          generic: "Rigid catalog stock with zero custom branding",
          bhaya: "Bespoke foil stamping, custom embroidery & gift boxes",
        },
        {
          attr: "Customer Service",
          generic: "Automated AI bots and impersonal ticketing",
          bhaya: "Dedicated human account concierge on call & WhatsApp",
        },
      ];

  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
            <span className={styles.sep}>/</span>
            <span>{language === "hi" ? "भाया इंडिया क्यों चुनें?" : "Why Choose Us"}</span>
          </div>
          <span className={styles.eyebrow}>
            {language === "hi" ? "व्यापारिक सत्यनिष्ठा का मानक" : "THE BHAYA INDIA STANDARD"}
          </span>
          <h1 className={styles.title}>
            {language === "hi" ? "भाया इंडिया क्यों चुनें?" : "WHY BHAYA INDIA?"}
          </h1>
          <p className={`${styles.tagline} font-devanagari`}>
            “जहाँ भाया, वहाँ भरोसा।”
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.pillarsGrid}>
          {trustPillars.map((pillar, i) => (
            <div key={i} className={styles.pillarCard}>
              <div className={styles.pillarNumber}>0{i + 1}</div>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDesc}>{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.comparisonBox}>
          <div className={styles.compHeader}>
            <span className={styles.compEyebrow}>
              {language === "hi" ? "भाया इंडिया की विशिष्टता" : "THE BHAYA INDIA DISTINCTION"}
            </span>
            <h2>
              {language === "hi"
                ? "हम सामान्य ऑनलाइन पोर्टल्स से कैसे भिन्न हैं"
                : "How We Differ From Mass Marketplace Portals"}
            </h2>
          </div>

          <div className={styles.compTableWrapper}>
            <table className={styles.compTable}>
              <thead>
                <tr>
                  <th>{language === "hi" ? "विशेषताएँ" : "Attributes"}</th>
                  <th>{language === "hi" ? "सामान्य ऑनलाइन पोर्टल्स" : "Generic Online Marketplaces"}</th>
                  <th className={styles.highlightHeader}>
                    {language === "hi" ? "भाया इंडिया एंटरप्राइज" : "Bhaya India Enterprise"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={i}>
                    <td>{row.attr}</td>
                    <td>{row.generic}</td>
                    <td className={styles.highlightCol}>{row.bhaya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CredibilityStrip />
      <Testimonials />
    </main>
  );
}
