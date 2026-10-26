"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer({ settings = DEFAULT_SITE_SETTINGS }: { settings?: SiteSettings }) {
  const { t, language } = useLanguage();
  const customerDeskNumber = "+91 87266 90926";
  const whatsappUrl = `https://wa.me/918726690926?text=${encodeURIComponent("Hi BHAYA INDIA, I would like to enquire about your products and services.")}`;

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div className={styles.footerLogo}>
              <Link href="/" aria-label="Bhaya India" className={styles.brandLogoRow}>
                <Image
                  src="/assets/bhaya-india-logo.png"
                  alt="Bhaya India Logo"
                  width={40}
                  height={40}
                  className={styles.footerLogoImg}
                />
                <span className={styles.footerLogoName}>
                  BHAYA <span className={styles.footerLogoAccent}>INDIA</span>
                </span>
              </Link>
              <span className={`${styles.footerTagline} font-devanagari`}>
                जहाँ भाया, वहाँ भरोसा
              </span>
            </div>
            <p className={styles.footerDesc}>
              {t("footerDesc")}
            </p>
            <div className={styles.socialLinks}>
              <a href={settings.socialLinks.instagram} className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href={settings.socialLinks.facebook} className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={whatsappUrl} className={styles.socialLink} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Core Business Verticals & Packaging Column */}
          <div>
            <p className={styles.colTitle}>
              {language === "hi" ? "व्यावसायिक दिशाएं" : "Business Directions"}
            </p>
            <ul className={styles.linkList}>
              {[
                { label: language === "hi" ? "1. त्योहार (Festival)" : "1. Festival", href: "/products?category=festival" },
                { label: language === "hi" ? "2. खुदरा (Retail)" : "2. Retail", href: "/products?category=retail" },
                { label: language === "hi" ? "3. कृषि (Agro)" : "3. Agro", href: "/products?category=agro" },
                { label: language === "hi" ? "4. विनिर्माण (Manufacturing)" : "4. Manufacturing", href: "/products?category=manufacturing" },
                { label: language === "hi" ? "5. लॉजिस्टिक्स (Logistics)" : "5. Logistics", href: "/services" },
                { label: language === "hi" ? "6. निर्यात (Exports)" : "6. Exports", href: "/wholesale" },
                { label: language === "hi" ? "7. ई-कॉमर्स (E-commerce)" : "7. E-commerce", href: "/products" },
                { label: language === "hi" ? "8. पैकेजिंग एवं पेपर उत्पाद" : "8. Packaging & Paper Products", href: "/products?category=packaging" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem & Company Links */}
          <div>
            <p className={styles.colTitle}>{t("footerCompanyTitle")}</p>
            <ul className={styles.linkList}>
              {[
                { label: t("navAbout"), href: "/about" },
                { label: "BHAYA INDIA 2.0", href: "/bhaya-india-2" },
                { label: language === "hi" ? "कंपनी का विज़न" : "Company Vision", href: "/company-profile" },
                { label: language === "hi" ? "भाया इंडिया क्यों चुनें?" : "Why Bhaya India", href: "/why-choose-us" },
                { label: language === "hi" ? "बी2बी एवं थोक पोर्टल" : "B2B & Wholesale", href: "/wholesale" },
                { label: language === "hi" ? "विक्रेता बनें" : "Sell on Bhaya India", href: "/become-a-seller" },
                { label: language === "hi" ? "निर्माता पार्टनर" : "Become a Partner", href: "/manufacturers" },
                { label: language === "hi" ? "ग्राहक समीक्षाएं" : "Customer Reviews", href: "/testimonials" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Customer Desk */}
          <div>
            <p className={styles.colTitle}>{t("footerHelpTitle")}</p>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>{t("footerCustomerDesk")}</span>
                <a href={`tel:${customerDeskNumber.replace(/\s+/g, "")}`} className={styles.contactValue} style={{ fontWeight: 700, color: "var(--gold-light, #deb86d)" }}>
                  {customerDeskNumber}
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>{t("footerWhatsappInquiry")}</span>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                  {customerDeskNumber}
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>{t("footerEmailContact")}</span>
                <a href={`mailto:${settings.email}`} className={styles.contactValue}>
                  {settings.email}
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>{t("footerRegisteredOffice")}</span>
                <span className={styles.contactValueAddress}>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} BHAYA INDIA. {t("footerRights")}
          </p>
          <div className={styles.legalLinks}>
            <Link href="/faq" className={styles.legalLink}>{t("navFaq")}</Link>
            <span className={styles.legalSep}>·</span>
            <Link href="/privacy-policy" className={styles.legalLink}>{t("footerPrivacy")}</Link>
            <span className={styles.legalSep}>·</span>
            <Link href="/terms-conditions" className={styles.legalLink}>{t("footerTerms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
