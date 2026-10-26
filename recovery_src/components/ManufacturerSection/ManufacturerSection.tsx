"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ManufacturerSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

export default function ManufacturerSection() {
  const { t, language } = useLanguage();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // 8 Manufacturer Dossier Fields
  const mfrFields = [
    {
      id: "company-profile",
      name: t("mfrFieldCompanyProfile"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18"/>
          <path d="M9 8h1"/>
          <path d="M9 12h1"/>
          <path d="M9 16h1"/>
          <path d="M14 8h1"/>
          <path d="M14 12h1"/>
          <path d="M14 16h1"/>
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
        </svg>
      ),
    },
    {
      id: "product",
      name: t("mfrFieldProduct"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/>
          <path d="M12 22V12"/>
        </svg>
      ),
    },
    {
      id: "manufacturing-capacity",
      name: t("mfrFieldCapacity"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20"/>
          <path d="M5 20V8l5 4V8l5 4V4h4v16"/>
        </svg>
      ),
    },
    {
      id: "moq",
      name: t("mfrFieldMoq"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
    },
    {
      id: "price",
      name: t("mfrFieldPrice"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: "location",
      name: t("mfrFieldLocation"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
    {
      id: "contact",
      name: t("mfrFieldContact"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
    },
    {
      id: "documents",
      name: t("mfrFieldDocuments"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
  ];

  // 3 Future Business Models
  const futureModels = [
    {
      id: "bhaya-partnership",
      name: t("mfrModelPartnership"),
      tag: t("comingSoonBadge"),
      desc: language === "hi"
        ? "भाया इंडिया ब्रांड के तहत सह-ब्रांडेड निर्माण और विशेष राष्ट्रव्यापी वितरण।"
        : "Co-branded manufacturing and exclusive nationwide retail distribution under Bhaya India.",
    },
    {
      id: "private-label",
      name: t("mfrModelPrivateLabel"),
      tag: t("futureVisionBadge"),
      desc: language === "hi"
        ? "उच्च गुणवत्ता वाले भारतीय विनिर्माण उत्पादों के लिए समर्पित प्राइवेट लेबल अनुबंध।"
        : "Turnkey private label production contracts for premium Indian manufactured goods.",
    },
    {
      id: "brand-licensing",
      name: t("mfrModelLicensing"),
      tag: t("futureVisionBadge"),
      desc: language === "hi"
        ? "सत्यापित विनिर्माण इकाइयों के लिए लाइसेंसिंग और गुणवत्ता आश्वासन प्रमाणीकरण।"
        : "Authorized trademark licensing and structured quality assurance certification.",
    },
  ];

  return (
    <>
      <section className={styles.section} aria-labelledby="mfr-heading">
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                {t("phase2Badge")} • {language === "hi" ? "फैक्ट्री पार्टनरशिप" : "Factory Partnership"}
              </span>
            </div>

            <h2 className={styles.title} id="mfr-heading">
              {t("mfrTitle")}
            </h2>

            <p className={styles.subtitle}>
              {t("mfrSubtitle")}
            </p>

            <p className={styles.message}>
              {t("mfrMessage")}
            </p>
          </div>

          {/* Split Layout: Dossier on Left, Future Models on Right */}
          <div className={styles.splitGrid}>
            {/* Dossier Fields */}
            <div className={styles.dossierBox}>
              <h3 className={styles.dossierTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {t("mfrFieldsTitle")}
              </h3>

              <div className={styles.fieldsGrid}>
                {mfrFields.map((field) => (
                  <div key={field.id} className={styles.fieldItem} id={`mfr-field-${field.id}`}>
                    <div className={styles.fieldIcon} aria-hidden="true">
                      {field.icon}
                    </div>
                    <span className={styles.fieldName}>{field.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Business Models */}
            <div className={styles.futureModelsBox}>
              <div>
                <h3 className={styles.futureModelsTitle}>
                  {t("mfrFutureModelsTitle")}
                </h3>

                <div className={styles.modelsList}>
                  {futureModels.map((model) => (
                    <div key={model.id} className={styles.modelCard} id={`mfr-model-${model.id}`}>
                      <div className={styles.modelHeader}>
                        <h4 className={styles.modelName}>{model.name}</h4>
                        <span className={styles.modelTag}>{model.tag}</span>
                      </div>
                      <p className={styles.modelDesc}>{model.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.ctaCluster}>
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className="btn btn-primary"
                  id="mfr-partner-cta-btn"
                >
                  {t("mfrCta")}
                </button>
                <Link href="/manufacturers" className="btn btn-secondary">
                  {language === "hi" ? "पंजीकरण विवरण" : "Registration Dossier"} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="Manufacturer & Brand Partner Registration"
      />
    </>
  );
}
