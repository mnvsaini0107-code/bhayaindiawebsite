"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./SearchModal.module.css";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  getLanguageAwareProductImage,
  getLocalizedProductName,
  getLocalizedProductCategory,
  getLocalizedProductSubcategory,
} from "@/lib/shopify/utils";

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
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
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products.slice(0, 6));
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularTags = language === "hi"
    ? ["बनारसी सिल्क", "लेदर नोटबुक", "उत्सव हैंपर", "पीतल की उरली", "यूनिफ़ॉर्म फैब्रिक", "दुपट्टा"]
    : ["Banarasi Silk", "Leather Notebook", "Festival Hamper", "Brass Urli", "Uniform Fabric", "Dupatta"];

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
                  ? "उत्पाद, वस्त्र, स्टेशनरी, उपहार हैम्पर्स खोजें..."
                  : "Search products, fabrics, stationery, gift hampers..."
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setResults([]);
              }}
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
              {language === "hi" ? "कैटलॉग में खोज रहे हैं..." : "Searching catalogue..."}
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <div className={styles.emptyState}>
              <p>
                {language === "hi"
                  ? `"${query}" के लिए कोई उत्पाद नहीं मिला`
                  : `No products found for "${query}"`}
              </p>
              <span>
                {language === "hi"
                  ? "साड़ी, नोटबुक, हैंपर्स या पीतल के बर्तन खोज कर देखें"
                  : "Try searching for sarees, notebooks, hampers, or brassware"}
              </span>
            </div>
          )}

          {results.length > 0 && (
            <div className={styles.resultsList}>
              <p className={styles.resultsHeading}>
                {language === "hi"
                  ? `मिलते-जुलते उत्पाद (${results.length})`
                  : `Matching Products (${results.length})`}
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
                        width={52}
                        height={52}
                        className={styles.thumb}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{prodName}</h4>
                      <span className={styles.itemCat}>
                        {prodCat}{prodSubcat ? ` · ${prodSubcat}` : ""}
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
                    ? `"${query}" के सभी परिणाम देखें →`
                    : `View all results for "${query}" →`}
                </Link>
              </div>
            </div>
          )}

          {!query && (
            <div className={styles.popularTags}>
              <p className={styles.popularHeading}>
                {language === "hi" ? "सुझाए गए खोज" : "Suggested Searches"}
              </p>
              <div className={styles.tagGroup}>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
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
