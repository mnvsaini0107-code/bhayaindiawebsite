"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./SearchModal.module.css";
import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  getLanguageAwareProductImage,
  getLocalizedProductName,
  getLocalizedProductCategory,
  getLocalizedProductSubcategory,
} from "@/lib/shopify/utils";

interface MatchedCategory {
  slug: string;
  name_en: string;
  name_hi: string;
}

interface MatchedSubcategory {
  slug: string;
  name_en: string;
  name_hi: string;
  parentSlug: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BhayaShopifyProduct[]>([]);
  const [matchedCategory, setMatchedCategory] = useState<MatchedCategory | null>(null);
  const [matchedSubcategories, setMatchedSubcategories] = useState<MatchedSubcategory[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    setMatchedCategory(null);
    setMatchedSubcategories([]);
    setRelatedSearches([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setMatchedCategory(null);
      setMatchedSubcategories([]);
      setRelatedSearches([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products.slice(0, 6));
          setMatchedCategory(data.matchedCategory || null);
          setMatchedSubcategories(data.matchedSubcategories || []);
          setRelatedSearches(data.relatedSearches || []);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularTags =
    language === "hi"
      ? [
          "करवा चौथ",
          "पूजा सामग्री",
          "दिवाली",
          "होली",
          "गणेश पूजा",
          "नवरात्र",
          "शादी",
          "पैकेजिंग",
          "उपहार हैम्पर्स",
          "बनारसी सिल्क",
        ]
      : [
          "Karwa Chauth",
          "Puja Items",
          "Diwali",
          "Holi",
          "Ganesh Puja",
          "Navratri",
          "Wedding",
          "Packaging",
          "Festival Hampers",
          "Banarasi Silk",
        ];

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.inputWrapper}>
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.input}
              placeholder={
                language === "hi"
                  ? "त्योहार, करवा चौथ, पूजा सामग्री, पैकेजिंग, उत्पाद खोजें..."
                  : "Search festival, Karwa Chauth, puja items, packaging, products..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              id="global-search-input"
            />
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close search">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {loading && (
            <p className={styles.statusText}>
              {language === "hi" ? "सटीक खोज एवं संदर्भ पहचान जारी है..." : "Analyzing search intent & catalogue..."}
            </p>
          )}

          {/* Category Discovery Pill */}
          {matchedCategory && (
            <div className={styles.discoveryBlock}>
              <div className={styles.discoveryTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/>
                </svg>
                {language === "hi" ? "संबंधित मुख्य श्रेणी" : "Related Category"}
              </div>
              <div className={styles.pillsCluster}>
                <Link
                  href={`/products?category=${matchedCategory.slug}`}
                  className={styles.categoryPill}
                  onClick={onClose}
                >
                  <span>{language === "hi" ? matchedCategory.name_hi : matchedCategory.name_en}</span>
                  <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>→</span>
                </Link>
              </div>
            </div>
          )}

          {/* Subcategory Suggestions */}
          {matchedSubcategories.length > 0 && (
            <div className={styles.discoveryBlock}>
              <div className={styles.discoveryTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {language === "hi" ? "संबंधित उप-श्रेणियाँ" : "Subcategory Suggestions"}
              </div>
              <div className={styles.pillsCluster}>
                {matchedSubcategories.slice(0, 6).map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/products?category=${sub.parentSlug}&subcat=${sub.slug}`}
                    className={styles.subcatPill}
                    onClick={onClose}
                  >
                    {language === "hi" ? sub.name_hi : sub.name_en}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Searches (Synonyms & Transliterations) */}
          {relatedSearches.length > 0 && (
            <div className={styles.discoveryBlock}>
              <div className={styles.discoveryTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21 21-4.35-4.35"/>
                  <circle cx="11" cy="11" r="8"/>
                </svg>
                {language === "hi" ? "संबंधित खोज" : "Related Searches"}
              </div>
              <div className={styles.pillsCluster}>
                {relatedSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.synonymPill}
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && query && results.length === 0 && (
            <div className={styles.emptyState}>
              <p>
                {language === "hi"
                  ? `"${query}" के लिए कोई उत्पाद नहीं मिला`
                  : `No products found for "${query}"`}
              </p>
              <span>
                {language === "hi"
                  ? "करवा चौथ, पूजा सामग्री, उपहार या पैकेजिंग खोज कर देखें"
                  : "Try searching for Karwa Chauth, Puja Items, Hampers, or Packaging"}
              </span>
            </div>
          )}

          {/* Ranked Product Results */}
          {results.length > 0 && (
            <div className={styles.resultsList}>
              <p className={styles.resultsHeading}>
                {language === "hi"
                  ? `खोज परिणाम (${results.length})`
                  : `Search Results (${results.length})`}
              </p>
              {results.map((product) => {
                const prodName = getLocalizedProductName(product, language);
                const prodCat = getLocalizedProductCategory(product, language);
                const prodSubcat = getLocalizedProductSubcategory(product, language);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className={styles.resultItem}
                    onClick={onClose}
                  >
                    <div className={styles.thumbWrapper}>
                      <Image
                        src={getLanguageAwareProductImage(product, language)}
                        alt={prodName}
                        fill
                        className={styles.thumb}
                        sizes="52px"
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{prodName}</h4>
                      <span className={styles.itemCat}>
                        {prodCat}
                        {prodSubcat ? ` · ${prodSubcat}` : ""}
                      </span>
                    </div>
                    <div className={styles.itemPrice}>
                      {product.price ? `₹${product.price.toLocaleString("en-IN")}` : t("customQuoteWholesale")}
                    </div>
                  </Link>
                );
              })}
              <div className={styles.viewAllFooter}>
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  className={styles.viewAllLink}
                  onClick={onClose}
                >
                  {language === "hi"
                    ? `"${query}" के सभी उत्पाद परिणाम देखें →`
                    : `View all results for "${query}" →`}
                </Link>
              </div>
            </div>
          )}

          {/* Initial Popular Suggestions */}
          {!query && (
            <div className={styles.popularTags}>
              <p className={styles.popularHeading}>
                {language === "hi" ? "सुझाए गए खोज विषय" : "Suggested Searches"}
              </p>
              <div className={styles.tagGroup}>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={styles.tagBtn}
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
