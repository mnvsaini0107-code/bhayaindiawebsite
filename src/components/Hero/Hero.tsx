"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";
import { useLanguage } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

interface HeroSlide {
  id: number;
  eyebrowEn: string;
  eyebrowHi: string;
  headlineEn: string;
  headlineHi: string;
  subheadlineEn: string;
  subheadlineHi: string;
  image: string;
  tagEn: string;
  tagHi: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    eyebrowEn: "BHAYA INDIA — A TRUSTED INDIAN COMMERCE PLATFORM",
    eyebrowHi: "BHAYA INDIA — भारत का अपना भरोसेमंद व्यापारिक मंच",
    headlineEn: "Quality Products. Honest Business. Genuine Trust.",
    headlineHi: "उत्कृष्ट उत्पाद। सच्चा व्यापार। अटूट भरोसा।",
    subheadlineEn: "Connecting customers, regional retailers, and verified manufacturers through authentic sourcing, fair pricing, and dependable e-commerce across India.",
    subheadlineHi: "ग्राहकों, स्थानीय व्यापारियों और सत्यापित निर्माताओं को प्रामाणिक सोर्सिंग, उचित मूल्य और भरोसेमंद ई-कॉमर्स के साथ जोड़ना।",
    image: "/assets/hero-editorial.jpg",
    tagEn: "Heritage Collection",
    tagHi: "विरासत संग्रह",
  },
  {
    id: 2,
    eyebrowEn: "AUTHENTIC TEXTILES & LUXURY HANDLOOMS",
    eyebrowHi: "प्रामाणिक वस्त्र एवं शुद्ध हैंडलूम",
    headlineEn: "Pure Silk Sarees & Heirloom Weaves",
    headlineHi: "शुद्ध बनारसी सिल्क एवं पारंपरिक बुनाई",
    subheadlineEn: "Handwoven by master artisans across Varanasi and regional clusters with Silk Mark purity assurance.",
    subheadlineHi: "वाराणसी और प्रमुख भारतीय बुनकर केंद्रों के कुशल कारीगरों द्वारा हस्तनिर्मित शुद्ध वस्त्र।",
    image: "/assets/category-textiles.jpg",
    tagEn: "Silk & Handlooms",
    tagHi: "शुद्ध सिल्क वस्त्र",
  },
  {
    id: 3,
    eyebrowEn: "EXECUTIVE OFFICE & CURATED GIFTING",
    eyebrowHi: "कॉर्पोरेट स्टेशनरी एवं विशेष उपहार",
    headlineEn: "Refined Leather Journals & Bespoke Hampers",
    headlineHi: "उत्कृष्ट लेदर जर्नल्स एवं कॉर्पोरेट हैंपर्स",
    subheadlineEn: "Bespoke gifting solutions for corporate celebrations, festivals, and discerning professionals.",
    subheadlineHi: "कॉर्पोरेट आयोजनों, उत्सवों और विचारकों के लिए विशेष रूप से तैयार किए गए प्रीमियम उपहार।",
    image: "/assets/category-stationery.jpg",
    tagEn: "Stationery & Gifting",
    tagHi: "स्टेशनरी व उपहार",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { t, language } = useLanguage();

  // Auto-advance hero slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <>
      <section className={styles.heroSection} aria-label="Welcome to Bhaya India">
        <div className="container">
          <div className={styles.heroLayout}>
            {/* Editorial Copy Column */}
            <div className={styles.heroCopy}>
              <div className="eyebrow eyebrow--gold">
                <span className="eyebrow-line" />
                {language === "hi" ? slide.eyebrowHi : slide.eyebrowEn}
              </div>

              <h1 className={styles.heroHeading}>
                {language === "hi" ? slide.headlineHi : slide.headlineEn}
              </h1>

              <p className={styles.heroSubtext}>
                {language === "hi" ? slide.subheadlineHi : slide.subheadlineEn}
              </p>

              <div className={styles.heroCtas}>
                <Link
                  href="/products"
                  className="btn btn-primary"
                  id="hero-explore-products-btn"
                >
                  {t("heroExploreCta")}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className="btn btn-secondary"
                  id="hero-enquire-btn"
                >
                  {t("heroEnquireCta")}
                </button>
              </div>

              <div className={styles.heroNote}>
                <span className={styles.heroNoteDot} />
                <span className="font-devanagari">जहाँ भाया, वहाँ भरोसा</span>
                <span className={styles.heroNoteSep}>·</span>
                <span>{language === "hi" ? "लोकल टू ऑनलाइन • लोकल टू इंडिया" : "Local to Online • Local to India"}</span>
              </div>
            </div>

            {/* Editorial Visual Column with Slider Controls */}
            <div className={styles.heroVisualCol}>
              <div className={styles.imageFrame}>
                <Image
                  src={slide.image}
                  alt={slide.headlineEn}
                  fill
                  priority
                  className={styles.heroImage}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className={styles.imageOverlay} />

                {/* Floating Tag */}
                <div className={styles.floatingTag}>
                  <span className={styles.tagDot} />
                  <span>{language === "hi" ? slide.tagHi : slide.tagEn}</span>
                </div>

                {/* Slider Arrow Controls */}
                <div className={styles.sliderArrows}>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className={styles.arrowBtn}
                    aria-label={t("previous")}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className={styles.arrowBtn}
                    aria-label={t("next")}
                  >
                    ›
                  </button>
                </div>

                {/* Slider Dots */}
                <div className={styles.sliderDots} role="tablist" aria-label="Hero carousel navigation">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      onClick={() => setCurrentSlide(idx)}
                      className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ""}`}
                      aria-label={`Slide ${idx + 1}`}
                      aria-selected={idx === currentSlide}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="Wholesale & Commerce Consultation"
      />
    </>
  );
}
