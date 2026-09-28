"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SellerSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

export default function SellerSection() {
  const { t, language } = useLanguage();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  // 9 Vendor capabilities
  const vendorCapabilities = [
    {
      id: "register",
      title: t("sellerCapRegister"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
      ),
    },
    {
      id: "kyc",
      title: t("sellerCapKyc"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
    },
    {
      id: "product-upload",
      title: t("sellerCapProductUpload"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      ),
    },
    {
      id: "set-price",
      title: t("sellerCapSetPrice"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: "manage-stock",
      title: t("sellerCapManageStock"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      ),
    },
    {
      id: "view-orders",
      title: t("sellerCapViewOrders"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
    {
      id: "view-sales",
      title: t("sellerCapViewSales"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
    {
      id: "view-payments",
      title: t("sellerCapViewPayments"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
    },
    {
      id: "view-commission",
      title: t("sellerCapViewCommission"),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m10 15 5-3-5-3v6Z"/>
        </svg>
      ),
    },
  ];

  // 6 Step Flow
  const flowSteps = [
    { num: "1", label: t("sellerFlowStep1") },
    { num: "2", label: t("sellerFlowStep2") },
    { num: "3", label: t("sellerFlowStep3") },
    { num: "4", label: t("sellerFlowStep4") },
    { num: "5", label: t("sellerFlowStep5") },
    { num: "6", label: t("sellerFlowStep6") },
  ];

  return (
    <>
      <section className={styles.section} aria-labelledby="seller-heading">
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.badgeRow}>
              <span className={styles.phaseBadge}>
                {t("phase3Badge")}
              </span>
              <span className={styles.futureVisionBadge}>
                {t("futureVisionBadge")}
              </span>
            </div>

            <h2 className={styles.title} id="seller-heading">
              {t("sellerTitle")}
            </h2>

            <p className={styles.subtitle}>
              {t("sellerSubtitle")}
            </p>
          </div>

          {/* Visual Fulfillment Flow */}
          <div className={styles.flowContainer}>
            <div className={styles.flowHeader}>
              <h3 className={styles.flowTitle}>{t("sellerFlowTitle")}</h3>
              <span className={styles.flowStatus}>{t("futureVisionBadge")}</span>
            </div>

            <div className={styles.flowTrack}>
              {flowSteps.map((step, idx) => (
                <div key={step.num} style={{ display: "contents" }}>
                  <div className={styles.flowStep} id={`seller-flow-step-${step.num}`}>
                    <div className={styles.stepIcon}>{step.num}</div>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <div className={styles.flowArrow} aria-hidden="true">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className={styles.capabilitiesSection}>
            <h3 className={styles.capHeading}>{t("sellerCapabilitiesTitle")}</h3>
            <div className={styles.capabilitiesGrid}>
              {vendorCapabilities.map((cap) => (
                <div key={cap.id} className={styles.capCard} id={`vendor-cap-${cap.id}`}>
                  <div className={styles.capIconWrap} aria-hidden="true">
                    {cap.icon}
                  </div>
                  <div>
                    <h4 className={styles.capName}>{cap.title}</h4>
                    <p className={styles.capStatus}>{t("comingSoonBadge")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className={styles.ctaRow}>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="btn btn-primary"
              id="seller-onboarding-cta-btn"
            >
              {t("sellerCtaBtn")}
            </button>
            <Link href="/become-a-seller" className="btn btn-secondary">
              {language === "hi" ? "विक्रेता विवरण देखें" : "Seller Overview"} →
            </Link>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="Vendor & Seller Network Registration"
      />
    </>
  );
}
