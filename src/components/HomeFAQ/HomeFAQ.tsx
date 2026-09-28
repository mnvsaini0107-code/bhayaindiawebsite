"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./HomeFAQ.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  id: string;
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    qEn: "What is BHAYA INDIA?",
    qHi: "BHAYA INDIA क्या है?",
    aEn: "BHAYA INDIA is a trusted Indian business and e-commerce platform connecting customers, regional retailers, and verified manufacturers through transparent sourcing and genuine trust.",
    aHi: "BHAYA INDIA एक भारतीय Business & E-commerce Platform है, जो स्थानीय खुदरा व्यापारियों, थोक विक्रेताओं और निर्माताओं को आधुनिक डिजिटल कॉमर्स से जोड़ता है।",
  },
  {
    id: "faq-2",
    qEn: "What does 'जहाँ भाया, वहाँ भरोसा' mean?",
    qHi: "'जहाँ भाया, वहाँ भरोसा' का क्या अर्थ है?",
    aEn: "It represents our foundational motto: wherever there is Bhaya, there is unwavering trust, genuine value, and honest Indian commerce.",
    aHi: "यह हमारा मूल संकल्प है — जहाँ भाया का नाम है, वहाँ प्रामाणिक गुणवत्ता, उचित व्यापार और अटूट ग्राहक विश्वास की गारंटी है।",
  },
  {
    id: "faq-3",
    qEn: "How does BHAYA INDIA 2.0 work?",
    qHi: "BHAYA INDIA 2.0 कैसे कार्य करेगा?",
    aEn: "BHAYA INDIA 2.0 is our upcoming unified marketplace ecosystem that will seamlessly link customers, local shopkeepers, manufacturers, and logistics under one platform.",
    aHi: "BHAYA INDIA 2.0 हमारा भावी डिजिटल इकोसिस्टम है जो ग्राहकों, स्थानीय दुकानदारों, निर्माताओं और लॉजिस्टिक्स को एक साझा मंच से जोड़ेगा।",
  },
  {
    id: "faq-4",
    qEn: "How can retailers buy wholesale or in bulk?",
    qHi: "रिटेलर या व्यापारी थोक में सामान कैसे खरीद सकते हैं?",
    aEn: "Retailers can explore our dedicated B2B section, request direct wholesale quotes, or connect with our merchant desk via phone or WhatsApp at +91 87266 90926.",
    aHi: "व्यापारी हमारे समर्पित बी2बी अनुभाग में जाकर, थोक कोटेशन का अनुरोध करके, या हमारे फोन/व्हाट्सएप +91 87266 90926 पर सीधे संपर्क कर सकते हैं।",
  },
  {
    id: "faq-5",
    qEn: "How can manufacturers partner with BHAYA INDIA?",
    qHi: "निर्माता (Manufacturer) पार्टनर कैसे बन सकते हैं?",
    aEn: "Manufacturers can submit their company profile, capacity, and catalog on our dedicated 'Become a Partner' section to connect directly with nationwide buyers.",
    aHi: "निर्माता 'पार्टनर बनें' अनुभाग में अपनी कंपनी प्रोफ़ाइल, उत्पाद और उत्पादन क्षमता दर्ज करके देशव्यापी खरीदारों से जुड़ सकते हैं।",
  },
];

export default function HomeFAQ() {
  const { language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.section} aria-labelledby="home-faq-heading">
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {language === "hi" ? "जिज्ञासा एवं समाधान" : "FREQUENTLY ASKED QUESTIONS"}
          </div>

          <h2 className={styles.title} id="home-faq-heading">
            {language === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          </h2>

          <p className={styles.subtitle}>
            {language === "hi"
              ? "भाया इंडिया, उत्पाद श्रेणियों, थोक व्यापार और हमारी भावी योजनाओं से संबंधित प्रमुख उत्तर।"
              : "Clear answers regarding Bhaya India, our product categories, B2B procurement, and future plans."}
          </p>
        </div>

        <div className={styles.accordion}>
          {FAQS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
                <button
                  type="button"
                  className={styles.trigger}
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  id={`home-faq-trigger-${item.id}`}
                >
                  <span className={styles.question}>
                    {language === "hi" ? item.qHi : item.qEn}
                  </span>
                  <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className={styles.answer}>
                    {language === "hi" ? item.aHi : item.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.actionRow}>
          <Link href="/faq" className="btn btn-secondary">
            {language === "hi" ? "सभी सवाल एवं उत्तर देखें" : "View All Questions & Answers"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
