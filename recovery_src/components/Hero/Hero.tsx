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
    image: "/assets/products/shubh-vivah-soop-okhali-set.jpg",
    tagEn: "Heritage Collection",
    tagHi: "विरासत संग्रह",
  },
  {
    id: 2,
    eyebrowEn: "SACRED PUJA & FESTIVE ESSENTIALS",
    eyebrowHi: "पवित्र पूजा एवं उत्सव सामग्री",
    headlineEn: "Handcrafted Moti Kalash & Beaded Vessels",
    headlineHi: "हस्तनिर्मित मोती कलश एवं मांगलिक पात्र",
    subheadlineEn: "Adorned with auspicious pearls, emerald crystals, and gold chain filigree — preserving sacred traditions for Griha Pravesh, Diwali, and wedding rituals.",
    subheadlineHi: "शुभ मोती, पन्ना नग और स्वर्ण जरी से अलंकृत — गृह प्रवेश, दीपावली और विवाह संस्कारों के लिए पावन परंपरा।",
    image: "/assets/products/auspicious-moti-kalash.jpg",
    tagEn: "Puja & Kalash",
    tagHi: "पूजा कलश",
  },
  {
    id: 3,
    eyebrowEn: "CEREMONIAL DECOR & MEHNDI ACCESSORIES",
    eyebrowHi: "मांगलिक उत्सव व मेहंदी समारोह संग्रह",
    headlineEn: "Festive Mehndi Ceremony Thaal & Platters",
    headlineHi: "सजीव मेहंदी समारोह थाल एवं उत्सव सूप",
    subheadlineEn: "Handcrafted dual-bowl ceremonial platters with floral arches and auspicious decorations, curated especially for Haldi and Mehndi celebrations.",
    subheadlineHi: "पुष्प मेहराब और पारंपरिक अलंकरण से सजे दोहरी कटोरी थाल — हल्दी और मेहंदी उत्सव के लिए विशेष रूप से निर्मित।",
    image: "/assets/products/mehndi-ceremony-thaal.jpg",
    tagEn: "Mehndi Ceremony",
    tagHi: "मेहंदी समारोह",
  },
  {
    id: 4,
    eyebrowEn: "TRADITIONAL RITUALS & BRIDAL HERITAGE",
    eyebrowHi: "पारंपरिक रस्में एवं विवाह संस्कार",
    headlineEn: "Hand-Painted Wooden Okhali & Musal Sets",
    headlineHi: "पारंपरिक नक्काशीदार लकड़ी की ओखली एवं मूसल सेट",
    subheadlineEn: "Custom-carved wooden ceremonial sets with auspicious peacock motifs and vivid ritual dyes for Vivah and Haldi sanskars.",
    subheadlineHi: "विवाह और हल्दी संस्कार के लिए मयूर आकृतियों व मांगलिक रंगों से हस्त-चित्रित प्रामाणिक काष्ठ ओखली।",
    image: "/assets/products/handpainted-wooden-okhali.jpg",
    tagEn: "Wedding Rituals",
    tagHi: "विवाह संस्कार",
  },
  {
    id: 5,
    eyebrowEn: "BHAGWAN JAYMALA & FESTIVE GARLANDS",
    eyebrowHi: "भगवान जयमाला एवं उत्सव वरमाला",
    headlineEn: "Artisan Fabric Marigold & Velvet Jaymala",
    headlineHi: "कारीगरी फैब्रिक गेंदा एवं वेलवेट जयमाला",
    subheadlineEn: "Handcrafted festive garlands combining rich marigold blossoms, velvet rosebuds, and golden beads for deities, weddings, and sacred celebrations.",
    subheadlineHi: "भगवान पूजा, विवाह समारोह और पावन अवसरों के लिए तैयार की गई सुंदर गेंदा व मखमली फूलों की मालाएं।",
    image: "/assets/products/bhagwan-jaymala-marigold-maroon.jpg",
    tagEn: "Festive Garlands",
    tagHi: "उत्सव वरमाला",
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
                  {t("exploreProducts")}
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
                  {t("enquireNow")}
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
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className={styles.arrowBtn}
                    aria-label="Next slide"
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
