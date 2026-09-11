"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./BrandSplash.module.css";

export default function BrandSplash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("bhaya_splash_shown");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeenSplash || prefersReducedMotion) {
      return;
    }

    // Schedule visibility to avoid synchronous cascading renders within the effect body
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 10);

    // Keep visible for ~2 seconds, then trigger smooth fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("bhaya_splash_shown", "true");
      }, 800);
      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.splashOverlay} ${fadeOut ? styles.fadeOut : ""}`}
      aria-hidden={!visible}
    >
      <div className={styles.splashCard}>
        <div className={styles.logoWrapper}>
          <Image
            src="/assets/bhaya-india-logo.png"
            alt="Bhaya India"
            width={120}
            height={120}
            priority
            className={styles.logoImage}
          />
        </div>

        <div className={styles.brandTitle}>
          BHAYA <span className={styles.brandAccent}>INDIA</span>
        </div>

        <p className={`${styles.tagline} font-devanagari`}>
          जहाँ भाया, वहाँ भरोसा
        </p>
      </div>
    </div>
  );
}
