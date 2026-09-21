"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { totalCount } = useCart();
  const { locale, toggleLocale, t } = useLanguage();

  const navLinks = [
    { label: t("navHome"), href: "/" },
    { label: t("navAbout"), href: "/about" },
    { label: t("navProducts"), href: "/products" },
    { label: t("navServices"), href: "/services" },
    { label: t("navWholesale"), href: "/wholesale" },
    { label: t("navBhaya2"), href: "/bhaya-india-2" },
    { label: t("navFaq"), href: "/faq" },
    { label: t("navContact"), href: "/contact" },
  ];

  const categoryLinks = [
    { label: t("catFestival"), href: "/products?category=gift-hampers" },
    { label: t("catRetail"), href: "/products" },
    { label: t("catAgro"), href: "/contact?type=agro" },
    { label: t("catManufacturing"), href: "/manufacturers" },
    { label: t("catLogistics"), href: "/services" },
    { label: t("catExports"), href: "/wholesale" },
    { label: t("catEcommerce"), href: "/products" },
    { label: t("catTextiles"), href: "/products?category=textiles-fabrics" },
    { label: t("catStationery"), href: "/products?category=stationery-office" },
  ];

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        {/* Main Header Bar */}
        <div className="container">
          <div className={styles.mainRow}>
            {/* Logo Area */}
            <div className={styles.logoArea}>
              <Link href="/" className={styles.logoLink} aria-label="Bhaya India — Home">
                <Image
                  src="/assets/bhaya-india-logo.png"
                  alt="BHAYA INDIA Logo"
                  width={44}
                  height={44}
                  className={styles.logoImg}
                  priority
                />
                <div className={styles.logoBrand}>
                  <span className={styles.logoName}>
                    BHAYA <span className={styles.logoNameAccent}>INDIA</span>
                  </span>
                  <span className={`${styles.logoTagline} font-devanagari`}>
                    जहाँ भाया, वहाँ भरोसा
                  </span>
                </div>
              </Link>
            </div>

            {/* Inline Search Bar */}
            <form onSubmit={handleSearch} className={styles.searchBar} role="search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className={styles.searchInput}
                aria-label={t("searchPlaceholder")}
                id="header-inline-search-input"
              />
              <button
                type="submit"
                className={styles.searchBtn}
                aria-label={t("searchButton")}
                id="header-inline-search-submit"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>

            {/* Right Actions Cluster */}
            <div className={styles.utilActions}>
              {/* Language Switcher Pill */}
              <button
                type="button"
                className={styles.langSwitcher}
                onClick={toggleLocale}
                aria-label="Toggle language between Hindi and English"
                id="header-lang-btn"
                title="Switch Language / भाषा बदलें"
              >
                <span className={`${styles.langOption} ${locale === "hi" ? styles.langOptionActive : ""}`}>
                  🇮🇳 हिन्दी
                </span>
                <span className={styles.langDivider}>|</span>
                <span className={`${styles.langOption} ${locale === "en" ? styles.langOptionActive : ""}`}>
                  English 🇬🇧
                </span>
              </button>

              {/* Account / Login Link */}
              <Link
                href="/account"
                className={styles.accountBtn}
                aria-label={t("navSignInRegister")}
                id="header-account-btn"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className={styles.accountLabel}>{t("navSignInRegister")}</span>
              </Link>

              {/* Shopping Bag Link */}
              <Link
                href="/cart"
                className={`${styles.utilBtn} ${styles.cartBtn}`}
                aria-label={t("navCart")}
                id="header-cart-btn"
                title={t("navCart")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalCount > 0 && <span className={styles.cartCount}>{totalCount}</span>}
              </Link>

              {/* Enquiry Desk CTA */}
              <button
                type="button"
                className={styles.ctaEnquireBtn}
                id="header-enquire-btn"
                onClick={() => setEnquiryOpen(true)}
              >
                {t("enquireNow")}
              </button>

              {/* Mobile Drawer Trigger */}
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileOpen(true)}
                aria-label={t("menu")}
                id="mobile-menu-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Menu Navigation Strip */}
        <div className={styles.categoryBar}>
          <div className="container">
            <div className={styles.categoryBarInner}>
              <Link href="/products" className={styles.categoryAllLink}>
                <span className={styles.menuIcon}>☰</span>
                <span>{t("navAllCategories")}</span>
              </Link>
              <nav className={styles.categoryNav} aria-label="Category navigation">
                {categoryLinks.map((cat, idx) => (
                  <Link key={idx} href={cat.href} className={styles.categoryItem}>
                    <span className={styles.catLabel}>{cat.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.open : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ""}`}
        aria-label="Mobile navigation drawer"
        aria-hidden={!mobileOpen}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.logoBrand}>
            <span className={styles.logoName}>
              BHAYA <span className={styles.logoNameAccent}>INDIA</span>
            </span>
            <span className={`${styles.logoTagline} font-devanagari`}>
              जहाँ भाया, वहाँ भरोसा
            </span>
          </div>
          <button
            className={styles.drawerClose}
            onClick={() => setMobileOpen(false)}
            aria-label={t("close")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className={styles.mobileSearchBar}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className={styles.mobileSearchInput}
          />
          <button type="submit" className={styles.mobileSearchBtn} aria-label={t("searchButton")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Mobile Language Switcher */}
        <div style={{ padding: "0 1.25rem 0.75rem" }}>
          <button
            type="button"
            className={styles.langSwitcher}
            onClick={toggleLocale}
            style={{ width: "100%", justifyContent: "center", padding: "0.6rem" }}
          >
            <span className={`${styles.langOption} ${locale === "hi" ? styles.langOptionActive : ""}`}>
              🇮🇳 हिन्दी
            </span>
            <span className={styles.langDivider}>|</span>
            <span className={`${styles.langOption} ${locale === "en" ? styles.langOptionActive : ""}`}>
              English 🇬🇧
            </span>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className={styles.drawerNav}>
          <div className={styles.drawerGroupTitle}>{t("allPieces")}</div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.drawerNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className={styles.drawerDivider} />
          <div className={styles.drawerGroupTitle}>{t("categoriesTitle")}</div>
          {categoryLinks.slice(0, 7).map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className={styles.drawerCatLink}
              onClick={() => setMobileOpen(false)}
            >
              <span>{cat.label}</span>
            </Link>
          ))}

          <div className={styles.drawerDivider} />
          <Link
            href="/account"
            className={styles.drawerNavLink}
            onClick={() => setMobileOpen(false)}
          >
            {t("navAccount")}
          </Link>
          <Link
            href="/cart"
            className={styles.drawerNavLink}
            onClick={() => setMobileOpen(false)}
          >
            {t("navCart")} ({totalCount})
          </Link>
        </div>

        <div className={styles.drawerActions}>
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              setMobileOpen(false);
              setEnquiryOpen(true);
            }}
          >
            {t("enquireNow")}
          </button>
        </div>
      </nav>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
