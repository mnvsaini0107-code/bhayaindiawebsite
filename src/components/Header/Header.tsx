"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { useCart } from "@/context/CartContext";
import { useLanguage, IndianLanguageCode } from "@/context/LanguageContext";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";
import type { SearchSuggestionItem } from "@/lib/search/types";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { totalCount } = useCart();
  const { locale, language, selectLanguage, availableLanguages, t } = useLanguage();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t("navHome"), href: "/" },
    { label: t("navAbout"), href: "/about" },
    { label: language === "hi" ? "दुकान" : "Shop", href: "/products" },
    { label: t("catFestival"), href: "/products?category=festival" },
    { label: t("catRetail"), href: "/products?category=retail" },
    { label: t("catAgro"), href: "/products?category=agro" },
    { label: t("catManufacturing"), href: "/products?category=manufacturing" },
    { label: t("catLogistics"), href: "/services" },
    { label: t("catExports"), href: "/wholesale" },
    { label: t("catEcommerce"), href: "/products" },
    { label: t("catPackaging"), href: "/products?category=packaging" },
    { label: "B2B", href: "/wholesale" },
    { label: language === "hi" ? "भाया इंडिया पर बेचें" : "Sell on Bhaya India", href: "/become-a-seller" },
    { label: language === "hi" ? "पार्टनर बनें" : "Become a Partner", href: "/manufacturers" },
    { label: "BHAYA INDIA 2.0", href: "/bhaya-india-2" },
    { label: t("navContact"), href: "/contact" },
  ];

  const categoryLinks = [
    { label: t("catFestival"), href: "/products?category=festival" },
    { label: t("catRetail"), href: "/products?category=retail" },
    { label: t("catAgro"), href: "/products?category=agro" },
    { label: t("catManufacturing"), href: "/products?category=manufacturing" },
    { label: t("catLogistics"), href: "/services" },
    { label: t("catExports"), href: "/wholesale" },
    { label: t("catEcommerce"), href: "/products" },
    { label: t("catPackaging"), href: "/products?category=packaging" },
  ];

  const searchPlaceholder =
    language === "hi"
      ? "उत्पाद खोजें..."
      : "Search Products...";

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

  // Click outside to close language dropdown and search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
        // keep open unless tapped outside header
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search suggestions fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?type=suggestions&q=${encodeURIComponent(searchQuery.trim())}&lang=${language}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error("Suggestions fetch error:", err);
      }
    }, 200);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, language]);

  const handleSearchSubmit = (e?: React.FormEvent, directUrl?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (directUrl) {
      router.push(directUrl);
      setMobileOpen(false);
      setMobileSearchOpen(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSearchSubmit(undefined, suggestions[selectedIndex].url);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
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
                  className={styles.logoImage}
                  priority
                />
                <div className={styles.brandText}>
                  <span className={styles.brandTitle}>
                    BHAYA <span className={styles.brandTitleAccent}>INDIA</span>
                  </span>
                  <span className={`${styles.brandTagline} font-devanagari`}>
                    जहाँ भाया, वहाँ भरोसा
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center: Professional Intent Search Bar */}
            <div className={styles.searchContainer} ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                <span className={styles.searchIconLeft}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className={styles.searchInput}
                  id="header-inline-search-input"
                  autoComplete="off"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={styles.clearBtn}
                    aria-label={t("clearSearch")}
                    title={t("clearSearch")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
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

              {/* Autocomplete Suggestions Flyout */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown} role="listbox">
                  <div className={styles.suggestionSectionTitle}>
                    {language === "hi" ? "सुझाव एवं श्रेणियाँ" : "Suggestions & Categories"}
                  </div>
                  {suggestions.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    if (item.type === "product") {
                      return (
                        <Link
                          key={item.id}
                          href={item.url}
                          className={`${styles.suggestionProductItem} ${isSelected ? styles.suggestionItemActive : ""}`}
                          onClick={() => setShowSuggestions(false)}
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={36}
                              height={36}
                              className={styles.suggestionProductThumb}
                            />
                          )}
                          <div className={styles.suggestionProductInfo}>
                            <span className={styles.suggestionProductName}>{item.title}</span>
                            <span className={styles.suggestionProductPrice}>{item.subtitle}</span>
                          </div>
                          {item.categoryTag && (
                            <span className={styles.suggestionTag}>{item.categoryTag}</span>
                          )}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.suggestionItem} ${isSelected ? styles.suggestionItemActive : ""}`}
                        onClick={() => handleSearchSubmit(undefined, item.url)}
                      >
                        <div className={styles.suggestionTitleGroup}>
                          <span className={styles.suggestionIcon}>
                            {item.type === "category" || item.type === "subcategory" ? (
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                              </svg>
                            )}
                          </span>
                          <span className={styles.suggestionText}>{item.title}</span>
                        </div>
                        {item.categoryTag && (
                          <span className={styles.suggestionTag}>{item.categoryTag}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Actions Cluster */}
            <div className={styles.utilActions}>
              {/* Mobile Search Icon Button */}
              <button
                type="button"
                className={styles.mobileSearchToggleBtn}
                onClick={() => setMobileSearchOpen((prev) => !prev)}
                aria-label={t("searchButton")}
                id="header-mobile-search-toggle"
                title={language === "hi" ? "उत्पाद खोजें" : "Search Products"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Indian Multi-Language Switcher */}
              <div ref={langDropdownRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  className={styles.langSwitcher}
                  onClick={() => setLangDropdownOpen((prev) => !prev)}
                  aria-label="Select Language"
                  id="header-lang-btn"
                  title="Select Language / भाषा चुनें"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className={styles.langOptionActive}>
                    {locale === "hi" ? "हिन्दी" : "English"}
                  </span>
                  <span style={{ fontSize: "9px", opacity: 0.6 }}>▼</span>
                </button>

                {langDropdownOpen && (
                  <div className={styles.langDropdownMenu} role="menu">
                    <div style={{ padding: "6px 10px 8px", borderBottom: "1px solid #eee", fontSize: "11px", fontWeight: 700, color: "var(--gold-dark)" }}>
                      SELECT LANGUAGE / भाषा चुनें
                    </div>
                    {availableLanguages.map((lang) => {
                      const isActive = locale === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          className={`${styles.langDropdownItem} ${isActive ? styles.langItemActive : ""}`}
                          onClick={() => {
                            selectLanguage(lang.code as IndianLanguageCode);
                            setLangDropdownOpen(false);
                          }}
                        >
                          <span>{lang.nativeName} ({lang.name})</span>
                          {lang.status === "live" ? (
                            <span className={styles.langIsoTag}>{lang.isoCode}</span>
                          ) : (
                            <span className={styles.langTagSoon}>Soon</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

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

          {/* Mobile Search Expandable Bar */}
          {mobileSearchOpen && (
            <div className={styles.mobileSearchRow} ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                <span className={styles.searchIconLeft}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={styles.searchInput}
                  id="mobile-expanded-search-input"
                  autoFocus
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={styles.clearBtn}
                    aria-label={t("clearSearch")}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.searchBtn}
                  aria-label={t("searchButton")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </form>

              {/* Autocomplete Dropdown on Mobile */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown}>
                  {suggestions.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => handleSearchSubmit(undefined, item.url)}
                    >
                      <span className={styles.suggestionText}>{item.title}</span>
                      {item.categoryTag && <span className={styles.suggestionTag}>{item.categoryTag}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Menu Navigation Strip */}
        <div className={styles.categoryBar}>
          <div className="container">
            <div className={styles.categoryBarInner}>
              <Link href="/products" className={styles.categoryAllLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
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
        <form onSubmit={handleSearchSubmit} className={styles.mobileSearchBar}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className={styles.mobileSearchInput}
          />
          {searchQuery.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={styles.clearBtn}
              aria-label={t("clearSearch")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button type="submit" className={styles.mobileSearchBtn} aria-label={t("searchButton")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Mobile Language Switcher */}
        <div style={{ padding: "0 1.25rem 0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <button
              type="button"
              className={`${styles.langSwitcher} ${locale === "hi" ? styles.langOptionActive : ""}`}
              onClick={() => selectLanguage("hi")}
              style={{ justifyContent: "center", padding: "0.5rem" }}
            >
              हिन्दी (HI)
            </button>
            <button
              type="button"
              className={`${styles.langSwitcher} ${locale === "en" ? styles.langOptionActive : ""}`}
              onClick={() => selectLanguage("en")}
              style={{ justifyContent: "center", padding: "0.5rem" }}
            >
              English (EN)
            </button>
          </div>

          <details style={{ fontSize: "12px", color: "var(--gray-600)" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--gold-dark)" }}>
              More Indian Languages (क्षेत्रीय भाषाएँ)
            </summary>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px", marginTop: "8px" }}>
              {availableLanguages.filter(l => l.code !== "en" && l.code !== "hi").map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => selectLanguage(lang.code as IndianLanguageCode)}
                  style={{
                    padding: "4px 8px",
                    textAlign: "left",
                    background: "#f4f6f8",
                    border: "1px solid #e1e4e8",
                    borderRadius: "4px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  {lang.nativeName} <span style={{ opacity: 0.6 }}>({lang.isoCode})</span>
                </button>
              ))}
            </div>
          </details>
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
          {categoryLinks.map((cat, i) => (
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
