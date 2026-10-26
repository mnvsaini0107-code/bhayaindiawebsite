"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { PageContent } from "@/lib/types";

interface Props {
  founderContent?: PageContent["founder"];
}

export default function FounderProfileClient({ founderContent }: Props = {}) {
  const { t, language } = useLanguage();

  const founderName = (language === "hi" && founderContent?.name) ? founderContent.name : t("founderName");
  const founderTitle = (language === "hi" && founderContent?.title) ? founderContent.title : t("founderTitle");
  const founderTagline = (language === "hi" && founderContent?.tagline) ? founderContent.tagline : t("founderTagline");
  const founderHeading = (language === "hi" && founderContent?.heading) ? founderContent.heading : t("founderSectionHeading");
  const founderPortrait = founderContent?.portraitUrl || "/ram-ji-bhaya-founder.jpg";
  const founderClosingMotto = founderContent?.closingMotto || t("founderClosingMotto");

  const principles = [
    {
      num: "01",
      title: t("founderPrinciple1") || "विश्वास करो, पर विवेक के साथ।",
      sub: language === "hi" ? "सत्यनिष्ठा एवं विवेकपूर्ण निर्णय" : "Trust with discernment",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
    },
    {
      num: "02",
      title: t("founderPrinciple2") || "प्रेम करो, पर मर्यादा के साथ।",
      sub: language === "hi" ? "पारस्परिक सम्मान एवं मर्यादा" : "Love with dignity & respect",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
    {
      num: "03",
      title: t("founderPrinciple3") || "जिम्मेदारी दो, पर उत्तरदायित्व भी तय करो।",
      sub: language === "hi" ? "दायित्व एवं स्पष्ट उत्तरदायित्व" : "Responsibility with accountability",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="founder-profile-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="founder-profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
          <span className="breadcrumb-sep">/</span>
          <span aria-current="page">{founderName} — {founderTitle}</span>
        </nav>

        {/* Hero */}
        <div className="founder-profile-hero">
          <div className="founder-profile-visual">
            <div className="founder-profile-portrait-card">
              <Image
                src={founderPortrait}
                alt={`${founderName} — ${founderTitle}`}
                fill
                priority
                style={{ objectFit: "cover", objectPosition: "center 15%" }}
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div className="founder-profile-badge">
                <span className="badge-title font-devanagari">{founderName}</span>
                <span className="badge-subtitle">{founderTitle}</span>
                <span className="badge-origin">बलरामपुर, उत्तर प्रदेश</span>
              </div>
            </div>
          </div>

          <div className="founder-profile-intro">
            <div className="eyebrow eyebrow--gold">
              <span className="eyebrow-line" />
              <span>{founderHeading.toUpperCase()}</span>
            </div>

            <h1 className="founder-profile-title font-devanagari">
              {founderName}
            </h1>

            <div className="founder-profile-designation">
              {founderTitle}
            </div>

            <blockquote className="founder-profile-pullquote">
              <span className="pullquote-text font-devanagari">
                {founderTagline}
              </span>
              <span className="pullquote-sub">आधारभूत मंत्र &bull; BHAYA INDIA</span>
            </blockquote>

            <div className="founder-profile-body">
              <p>{t("founderProfileBio1")}</p>
              <p>{t("founderProfileBio2")}</p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="founder-profile-vision-card">
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            <span>COMPANY VISION</span>
          </div>
          <h2 className="vision-card-heading font-devanagari">
            {t("founderVisionHeading")}
          </h2>
          <p className="vision-card-text" style={{ marginBottom: "1rem" }}>
            {t("founderVisionText1")}
          </p>
          <p className="vision-card-text">
            {t("founderVisionText2")}
          </p>
        </div>

        {/* Guiding Principles / हमारी सोच */}
        <div className="founder-profile-philosophy">
          <div className="text-center" style={{ textAlign: "center" }}>
            <div className="eyebrow eyebrow--gold" style={{ justifyContent: "center" }}>
              <span className="eyebrow-line" />
              <span>PHILOSOPHY & ETHOS</span>
              <span className="eyebrow-line" />
            </div>
            <h2 className="philosophy-heading font-devanagari">
              {t("founderPhilosophyHeading")}
            </h2>
            <p className="philosophy-subheading font-devanagari" style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--sapphire)" }}>
              {t("founderPhilosophyFaithTitle")}
            </p>
          </div>

          <div className="philosophy-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {principles.map((p) => (
              <div key={p.num} className="philosophy-card" style={{ borderTop: "3px solid var(--gold)" }}>
                <div className="philosophy-card-num">{p.num}</div>
                <div className="philosophy-card-icon">{p.icon}</div>
                <h3 className="philosophy-card-title font-devanagari" style={{ fontSize: "1.15rem", lineHeight: 1.4 }}>
                  {p.title}
                </h3>
                <p className="philosophy-card-desc">{p.sub}</p>
              </div>
            ))}
          </div>

          <div style={{
            maxWidth: "760px",
            margin: "2rem auto 0",
            padding: "1.25rem 1.75rem",
            background: "var(--ivory-warm)",
            borderLeft: "4px solid var(--gold)",
            borderRadius: "0 8px 8px 0"
          }}>
            <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
              {t("founderPhilosophyText")}
            </p>
          </div>
        </div>

        {/* Future Goal / आगे का लक्ष्य */}
        <div className="founder-profile-future-box">
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" style={{ background: "var(--gold)" }} />
            <span style={{ color: "var(--gold)" }}>LONG-TERM VISION</span>
          </div>
          <h2 className="future-box-heading font-devanagari">
            {t("founderGoalHeading")}
          </h2>
          <p className="future-box-text">
            {t("founderGoalText")}
          </p>

          <div className="future-verticals-tags">
            <span className="vtag">Festival &amp; Puja</span>
            <span className="vtag">Retail Commerce</span>
            <span className="vtag">Agro Trade</span>
            <span className="vtag">Manufacturing</span>
            <span className="vtag">Logistics &amp; Supply</span>
            <span className="vtag">Global Exports</span>
          </div>
        </div>

        {/* Closing Banner with Supplied Motto */}
        <div className="founder-profile-closing">
          <div className="closing-badge">
            <div style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              background: "rgba(197, 160, 89, 0.15)",
              border: "1px solid rgba(197, 160, 89, 0.4)",
              borderRadius: "999px",
              color: "var(--sapphire)",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              marginBottom: "1rem"
            }}>
              BHAYA INDIA
            </div>
            <div className="closing-motto font-devanagari" style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)", fontWeight: 700, color: "var(--sapphire)", letterSpacing: "0.02em" }}>
              {founderClosingMotto}
            </div>
            <p style={{ fontStyle: "italic", color: "var(--gold-dark)", fontWeight: 600, fontSize: "1.1rem", margin: "0.5rem 0 0" }}>
              {founderTagline}
            </p>
          </div>

          <div className="founder-profile-actions">
            <Link href="/products" className="btn btn-primary" id="founder-cta-explore">
              {t("viewProduct")}
            </Link>
            <Link href="/wholesale" className="btn btn-secondary" id="founder-cta-wholesale">
              {t("heroEnquireCta")}
            </Link>
            <Link href="/contact" className="btn btn-outline" id="founder-cta-contact">
              {language === "hi" ? "संपर्क करें" : "Contact Bhaya India"}
            </Link>
          </div>

          <div className="founder-profile-contact-info">
            <span>{language === "hi" ? "फोन" : "Phone"}: <a href="tel:+918726690926">+91 87266 90926</a></span>
            <span className="bullet">&bull;</span>
            <span>{language === "hi" ? "ईमेल" : "Email"}: <a href="mailto:support@bhayaindia.com">support@bhayaindia.com</a></span>
            <span className="bullet">&bull;</span>
            <span>{language === "hi" ? "समय: सोम - शनि (9:30 AM - 7:00 PM IST)" : "Hours: Mon - Sat (9:30 AM - 7:00 PM IST)"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
