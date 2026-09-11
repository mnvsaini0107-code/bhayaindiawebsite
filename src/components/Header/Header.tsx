"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import { useCart } from "@/context/CartContext";
import SearchModal from "@/components/SearchModal/SearchModal";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { totalCount } = useCart();

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

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.mainRow}>
            {/* Logo Area */}
            <div className={styles.logoArea}>
              <Link href="/" className={styles.logoLink} aria-label="Bhaya India — Home">
                <Image
                  src="/assets/bhaya-india-logo.png"
                  alt="Bhaya India"
                  width={38}
                  height={38}
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

            {/* Desktop Nav */}
            <nav className={styles.nav} aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Utility Cluster & Primary CTA */}
            <div className={styles.utilActions}>
              <button
                className={styles.utilBtn}
                aria-label="Search catalogue"
                id="header-search-btn"
                onClick={() => setSearchOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              <Link
                href="/account"
                className={styles.utilBtn}
                aria-label="My Account & Tracking"
                id="header-account-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              <Link
                href="/cart"
                className={`${styles.utilBtn} ${styles.cartBtn}`}
                aria-label="Shopping Cart"
                id="header-cart-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalCount > 0 && <span className={styles.cartCount}>{totalCount}</span>}
              </Link>

              <button
                type="button"
                className={styles.ctaEnquireBtn}
                id="header-enquire-btn"
                onClick={() => setEnquiryOpen(true)}
              >
                Enquire Now
              </button>

              {/* Mobile Toggle */}
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                id="mobile-menu-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="16" y2="17" />
                </svg>
              </button>
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

      {/* Mobile Drawer */}
      <nav
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ""}`}
        aria-label="Mobile navigation"
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
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerNav}>
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
          <Link
            href="/products"
            className={styles.drawerNavLink}
            onClick={() => setMobileOpen(false)}
          >
            All Products Catalogue
          </Link>
          <Link
            href="/account"
            className={styles.drawerNavLink}
            onClick={() => setMobileOpen(false)}
          >
            My Account & Orders
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
            Enquire Now
          </button>
        </div>
      </nav>

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
