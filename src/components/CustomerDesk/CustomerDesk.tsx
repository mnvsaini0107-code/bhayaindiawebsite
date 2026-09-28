"use client";

import Link from "next/link";
import styles from "./CustomerDesk.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerDesk() {
  const { t, language } = useLanguage();

  const phoneDisplay = "+91 87266 90926";
  const phoneTel = "tel:+918726690926";
  const whatsappUrl = `https://wa.me/918726690926?text=${encodeURIComponent(
    language === "hi"
      ? "नमस्कार BHAYA INDIA, मुझे आपके उत्पादों एवं व्यापारिक सेवाओं के संबंध में जानकारी चाहिए।"
      : "Hi BHAYA INDIA, I would like to enquire about your products and business solutions."
  )}`;

  return (
    <section className={styles.section} aria-labelledby="customer-desk-heading">
      <div className="container">
        <div className={styles.inner}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {t("localToOnlineTagline")}
          </div>

          <h2 className={styles.title} id="customer-desk-heading">
            {t("customerDeskTitle")}
          </h2>

          <div className={`${styles.motto} font-devanagari`}>
            “जहाँ भाया, वहाँ भरोसा।”
          </div>

          <p className={styles.desc}>
            {language === "hi"
              ? "हमारे ग्राहक सहायता एवं व्यापारिक परामर्श केंद्र से सीधे संपर्क करें। खुदरा खरीदारी, थोक पूछताछ, या साझेदारी के लिए हम सदैव आपकी सेवा में तत्पर हैं।"
              : "Connect directly with our customer concierge and commercial advisory desk. We are here to assist with retail orders, wholesale quotations, and partnership inquiries."}
          </p>

          <div className={styles.contactGrid}>
            {/* Phone Desk */}
            <div className={styles.contactCard} id="customer-desk-phone-card">
              <div className={styles.cardIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span className={styles.cardLabel}>{t("footerCustomerDesk")}</span>
              <a href={phoneTel} className={styles.cardValue}>
                {phoneDisplay}
              </a>
              <p className={styles.cardNote}>{t("customerDeskHours")}</p>
            </div>

            {/* WhatsApp Inquiries */}
            <div className={styles.contactCard} id="customer-desk-whatsapp-card">
              <div className={styles.cardIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                </svg>
              </div>
              <span className={styles.cardLabel}>{t("whatsappInquiryTitle")}</span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.cardValue}>
                {phoneDisplay}
              </a>
              <p className={styles.cardNote}>{language === "hi" ? "त्वरित उत्तर व्हाट्सएप पर" : "Fastest response on WhatsApp"}</p>
            </div>

            {/* Email Support */}
            <div className={styles.contactCard} id="customer-desk-email-card">
              <div className={styles.cardIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <span className={styles.cardLabel}>{t("footerEmailContact")}</span>
              <a href="mailto:contact@bhayaindia.com" className={styles.cardValue} style={{ fontSize: "1.05rem" }}>
                contact@bhayaindia.com
              </a>
              <p className={styles.cardNote}>{language === "hi" ? "24 घंटे में उत्तर" : "Response within 24 hours"}</p>
            </div>
          </div>

          <div className={styles.actionRow}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              id="customer-desk-chat-btn"
            >
              {t("whatsappInquiryAction")} →
            </a>
            <Link href="/contact" className="btn btn-secondary">
              {language === "hi" ? "संपर्क फॉर्म भरें" : "Open Contact Page"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
