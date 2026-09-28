"use client";

import Link from "next/link";
import styles from "./FounderStory.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function FounderStory() {
  const { t, language } = useLanguage();

  const corePillars = [
    {
      id: "what-is",
      title: t("aboutWhatTitle"),
      body: t("aboutWhatText"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      ),
    },
    {
      id: "why-started",
      title: t("aboutWhyStartedTitle"),
      body: t("aboutWhyStartedText"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      id: "purpose",
      title: t("aboutPurposeTitle"),
      body: t("aboutPurposeText"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
    },
    {
      id: "future-vision",
      title: t("aboutVisionTitle"),
      body: t("aboutVisionText"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
    {
      id: "meaning-motto",
      title: t("aboutMottoTitle"),
      body: t("aboutMottoText"),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="founder-story-heading">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            {language === "hi" ? "संस्थापक एवं विज़न" : "FOUNDER & HERITAGE"}
          </div>

          <h2 className={styles.title} id="founder-story-heading">
            {t("founderStoryTitle")}
          </h2>

          <p className={styles.subtitle}>
            {t("founderStorySubtitle")}
          </p>
        </div>

        {/* Main Grid: Founder Story Card on Left, 5 About Dimensions on Right */}
        <div className={styles.mainGrid}>
          {/* Founder Story Left Card */}
          <div className={styles.storyCard}>
            <div className={styles.storyEyebrow}>
              <span className={styles.verifiedBadge}>
                {language === "hi" ? "सत्यापित विवरण" : "VERIFIED FACTS"}
              </span>
              <span className={styles.originTag}>
                {language === "hi" ? "बलरामपुर, उत्तर प्रदेश" : "Balrampur, Uttar Pradesh"}
              </span>
            </div>

            <p className={styles.narrativeText}>
              {t("founderStoryVerifiedText")}
            </p>

            <div className={styles.pullQuoteBox}>
              <span className={`${styles.pullQuoteText} font-devanagari`}>
                “जहाँ भाया, वहाँ भरोसा।”
              </span>
              <p className={styles.pullQuoteNote}>
                {language === "hi"
                  ? "पारंपरिक विश्वास और आधुनिक वाणिज्य का सेतु — लोकल टू ऑनलाइन, लोकल टू इंडिया।"
                  : "Bridging time-honored integrity with modern digital trade — Local to Online, Local to India."}
              </p>
            </div>

            {/* Strict Truthful Policy Placeholder for unverified personal biography */}
            <div className={styles.placeholderBox}>
              <div className={styles.placeholderHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{t("founderStoryPlaceholder")}</span>
              </div>
              <p className={styles.placeholderText}>
                {t("founderStoryPlaceholderNote")}
              </p>
            </div>

            <div className={styles.actionRow}>
              <Link href="/about" className="btn btn-primary" id="founder-about-readmore-btn">
                {language === "hi" ? "विस्तृत यात्रा पढ़ें" : "Read Full Story"} →
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                {language === "hi" ? "डेस्क से संपर्क करें" : "Contact Founder Desk"}
              </Link>
            </div>
          </div>

          {/* Right Column: 5 Structural Dimensions */}
          <div className={styles.pillarsCol}>
            {corePillars.map((p) => (
              <div key={p.id} className={styles.pillarCard} id={`about-pillar-${p.id}`}>
                <div className={styles.pillarHeader}>
                  <div className={styles.pillarIcon} aria-hidden="true">
                    {p.icon}
                  </div>
                  <h3 className={styles.pillarHeading}>{p.title}</h3>
                </div>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
