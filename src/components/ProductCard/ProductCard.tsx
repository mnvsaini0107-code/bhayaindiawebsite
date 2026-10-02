"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import {
  getLanguageAwareProductImage,
  getLocalizedProductName,
  getLocalizedProductCategory,
} from "@/lib/shopify/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

function getWhatsAppUrl(
  product: BhayaShopifyProduct,
  whatsappNumber: string,
  language: string = "hi"
) {
  const prodName = getLocalizedProductName(product, language as "en" | "hi");
  const msg =
    language === "hi"
      ? `नमस्कार, मुझे BHAYA INDIA के इस product के बारे में जानकारी चाहिए:

Product Name: ${prodName}
Quantity: 1`
      : `Hello, I would like to enquire about this BHAYA INDIA product:

Product Name: ${prodName}
Quantity: 1`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

interface ProductCardProps {
  product: BhayaShopifyProduct;
  whatsappNumber: string;
}

export default function ProductCard({
  product,
  whatsappNumber,
}: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addItem, checkoutUrl } = useCart();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const currentImage = getLanguageAwareProductImage(product, language);
  const displayName = getLocalizedProductName(product, language as "en" | "hi");
  const displayCategory = getLocalizedProductCategory(product, language as "en" | "hi");

  const hasPrice = product.price !== null && product.price > 0;
  const comparePrice =
    product.compareAtPrice && product.compareAtPrice > (product.price || 0)
      ? product.compareAtPrice
      : hasPrice
      ? Math.round(product.price! * 1.25)
      : null;

  const discountPercent =
    hasPrice && comparePrice
      ? Math.round(((comparePrice - product.price!) / comparePrice) * 100)
      : 0;

  const rating = product.rating;
  const reviewsCount = product.reviewsCount;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasPrice) {
      router.push(`/products/${product.slug}`);
      return;
    }
    await addItem(
      {
        id: product.id,
        variantId: product.variantId,
        name: displayName,
        slug: product.slug,
        price: product.price!,
        image: currentImage,
        category: displayCategory,
      },
      1
    );
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasPrice) {
      router.push(`/products/${product.slug}`);
      return;
    }
    await addItem(
      {
        id: product.id,
        variantId: product.variantId,
        name: displayName,
        slug: product.slug,
        price: product.price!,
        image: currentImage,
        category: displayCategory,
      },
      1
    );

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      router.push("/checkout");
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className={styles.card} id={`product-card-${product.sku}`}>
      {/* Image Container with Badges and Wishlist */}
      <div className={styles.imageWrap}>
        <Link href={`/products/${product.slug}`} className={styles.imageLink}>
          <Image
            src={currentImage}
            alt={displayName}
            fill
            className={styles.productImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className={styles.badgeCluster}>
          {discountPercent > 0 && (
            <span className={styles.badgeDiscount}>
              {t("offDiscount", { discount: discountPercent })}
            </span>
          )}
          {product.isNew && (
            <span className={styles.badgeNew}>
              {t("newArrival")}
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={toggleWishlist}
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
          aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
          title={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#E53935" : "none"}
            stroke={isWishlisted ? "#E53935" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Product Details Body */}
      <div className={styles.cardBody}>
        {/* Category & Rating Row */}
        <div className={styles.metaRow}>
          <span className={styles.categoryEyebrow}>{displayCategory}</span>
          {rating ? (
            <div className={styles.ratingWrap} title={`${rating} / 5`}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.ratingNumber}>{rating}</span>
              {reviewsCount ? (
                <span className={styles.reviewsCount}>({reviewsCount})</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Product Title */}
        <h3 className={styles.cardName}>
          <Link href={`/products/${product.slug}`}>{displayName}</Link>
        </h3>

        {/* Pricing Row with Compare-At Price */}
        <div className={styles.priceRow}>
          {hasPrice ? (
            <div className={styles.priceWrap}>
              <span className={styles.priceCurrent}>
                ₹{product.price!.toLocaleString("en-IN")}
              </span>
              {comparePrice && (
                <span className={styles.priceCompare}>
                  ₹{comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          ) : (
            <span className={styles.priceQuote}>
              {t("customQuoteWholesale")}
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Bag, Buy Now & WhatsApp */}
        <div className={styles.cardActions}>
          {product.inStock ? (
            <div className={styles.commerceBtnRow}>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`${styles.btnAddBag} ${addedSuccess ? styles.btnAdded : ""}`}
                id={`add-bag-${product.sku}`}
              >
                {addedSuccess ? t("addedToBag") : t("addToBag")}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className={styles.btnBuyNow}
                id={`buy-now-${product.sku}`}
              >
                {t("buyNow")}
              </button>
            </div>
          ) : (
            <div className={styles.btnOutOfStock}>
              {t("outOfStock")}
            </div>
          )}

          <a
            href={getWhatsAppUrl(product, whatsappNumber, language)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
            id={`enquire-wa-${product.sku}`}
            title={t("whatsAppEnquiry")}
            aria-label={t("whatsAppEnquiry")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z" />
            </svg>
            <span>{t("whatsAppEnquiry")}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
