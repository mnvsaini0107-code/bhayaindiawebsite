"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./B2BSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

export default function B2BSection() {
  const { t, language } = useLanguage();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const b2bPurposes = [
    {
      id: "wholesale",
      title: t("b2bWholesale"),
      desc: language === "hi"
        ? "थोक दरों पर गुणवत्तापूर्ण भारतीय उत्पादों का सीधा आवंटन एवं आपूर्ति।"
        : "Direct allocation and bulk supply of verified Indian goods at wholesale pricing.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      ),
    },
    {
      id: "bulk-order",
      title: t("b2bBulkOrder"),
      desc: language === "hi"
        ? "बड़ी मात्रा में त्योहारों, आयोजनों और कॉर्पोरेट उपहारों के लिए विशेष ऑर्डर।"
        : "High-volume consignments for festivals, ceremonial celebrations, and corporate programs.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
    },
    {
      id: "retailer",
      title: t("b2bRetailer"),
      desc: language === "hi"
        ? "क्षेत्रीय खुदरा दुकानदारों के लिए विश्वसनीय इन्वेंट्री और नियमित स्टॉक आपूर्ति।"
        : "Consistent stock replenishment and inventory security for regional shopkeepers.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: "distributor",
      title: t("b2bDistributor"),
      desc: language === "hi"
        ? "जिले और राज्य स्तर पर थोक वितरण नेटवर्क और लॉजिस्टिक्स साझेदारी।"
        : "District and state-level distribution networks and logistics channel allocations.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      ),
    },
    {
      id: "manufacturer",
      title: t("b2bManufacturer"),
      desc: language === "hi"
        ? "कारखानों और शिल्पकारों के लिए सीधे खरीदारों तक पहुंचने का पारदर्शी मंच।"
        : "Transparent platform for workshops and factories to connect directly with bulk buyers.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20"/>
          <path d="M5 20V8l5 4V8l5 4V4h4v16"/>
        </svg>
      ),
    },
    {
      id: "institutional-buyer",
      title: t("b2bInstitutionalBuyer"),
      desc: language === "hi"
        ? "सरकारी, अर्ध-सरकारी, शैक्षणिक एवं कॉर्पोरेट संस्थानों के लिए अनुबंधित आपूर्ति।"
        : "Contracted supply for government, corporate, educational, and hospitality institutions.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className={styles.section} aria-labelledby="b2b-heading">
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.badgeRow}>
              <span className={styles.separationTag}>
                {language === "hi" ? "व्यावसायिक एवं थोक अनुभाग" : "Commercial & Wholesale Division"}
              </span>
              <span className={styles.comingSoonTag}>
                {t("phase2Badge")}
              </span>
            </div>

            <h2 className={styles.title} id="b2b-heading">
              {t("b2bTitle")}
            </h2>

            <p className={styles.subtitle}>
              {t("b2bSubtitle")}
            </p>

            <p className={styles.desc}>
              {t("b2bDesc")}
            </p>
          </div>

          {/* 6 Purposes Grid */}
          <div className={styles.grid}>
            {b2bPurposes.map((p) => (
              <div key={p.id} className={styles.purposeCard} id={`b2b-purpose-${p.id}`}>
                <div className={styles.iconWrap} aria-hidden="true">
                  {p.icon}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notice & CTA Strip */}
          <div className={styles.workflowNotice}>
            <div className={styles.workflowInfo}>
              <h4 className={styles.workflowHeading}>
                <span>{t("b2bAdvancedWorkflow")}</span>
                <span className={styles.workflowStatus}>{t("b2bComingSoon")}</span>
              </h4>
              <p className={styles.workflowText}>
                {language === "hi"
                  ? "स्वचालित बी2बी क्रेडिट पोर्टल और डिजिटल इनवॉइसिंग सिस्टम विकास के अधीन है। इस बीच, हमारी समर्पित बी2बी सहायता डेस्क सक्रिय है।"
                  : "Automated B2B credit terms and bulk digital invoice processing are in preparation. Our direct commercial desk is fully operational for enquiries and custom quotations."}
              </p>
            </div>

            <div className={styles.ctaCluster}>
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="btn btn-primary"
                id="b2b-enquiry-cta-btn"
              >
                {t("b2bEnquiryCta")}
              </button>
              <Link href="/wholesale" className="btn btn-secondary">
                {language === "hi" ? "थोक पोर्टल देखें" : "View Wholesale Desk"} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="B2B & Wholesale Institutional Procurement"
      />
    </>
  );
}
