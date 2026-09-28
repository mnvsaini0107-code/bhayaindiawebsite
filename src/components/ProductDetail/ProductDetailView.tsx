"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Product } from "@/lib/types";
import type { BhayaShopifyProduct } from "@/lib/shopify/types";
import {
  getLanguageAwareProductImage,
  getLocalizedProductName,
  getLocalizedProductDescription,
  getLocalizedProductTagline,
  getLocalizedProductCategory,
  getLocalizedProductSubcategory,
  getLocalizedFeatures,
  getLocalizedBenefits,
  getLocalizedSpecs,
} from "@/lib/shopify/utils";
import styles from "./ProductDetailClient.module.css";

interface Props {
  product: BhayaShopifyProduct | Product;
  whatsappNumber: string;
  phone: string;
  relatedProducts: (BhayaShopifyProduct | Product)[];
}

export default function ProductDetailView({
  product,
  whatsappNumber,
  phone,
  relatedProducts,
}: Props) {
  const { language, t } = useLanguage();
  const activeProductImage = useMemo(
    () => getLanguageAwareProductImage(product, language),
    [product, language]
  );
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);
  const [prevLanguage, setPrevLanguage] = useState(language);

  if (prevLanguage !== language) {
    setPrevLanguage(language);
    setUserSelectedImage(null);
  }

  const selectedImage = userSelectedImage || activeProductImage;

  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (activeProductImage) list.push(activeProductImage);
    (product.images || []).forEach((img) => {
      if (!list.includes(img)) list.push(img);
    });
    return list.length > 0 ? list : ["/assets/category-textiles.jpg"];
  }, [activeProductImage, product.images]);
  const [added, setAdded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const displayName = getLocalizedProductName(product, language);
  const displayDesc = getLocalizedProductDescription(product, language);
  const displayTagline = getLocalizedProductTagline(product, language);
  const displayCategory = getLocalizedProductCategory(product, language);
  const displaySubcategory = getLocalizedProductSubcategory(product, language);
  const displayFeatures = getLocalizedFeatures(product, language);
  const displayBenefits = getLocalizedBenefits(product, language);
  const displaySpecs = getLocalizedSpecs(product, language);

  // Quantity and enquiry form state
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    language === "hi"
      ? `नमस्ते BHAYA INDIA, मुझे "${displayName}" खरीदने में रुचि है। कृपया उपलब्धता और डिस्पैच समय बताएं।`
      : `Hello BHAYA INDIA, I am interested in purchasing "${displayName}". Please provide availability and dispatch timeline.`
  );

  const hasPrice = product.price !== null && product.price > 0;
  const compPrice =
    product.compareAtPrice && product.compareAtPrice > (product.price || 0)
      ? product.compareAtPrice
      : hasPrice
      ? Math.round(product.price! * 1.25)
      : null;
  const discount =
    hasPrice && compPrice
      ? Math.round(((compPrice - product.price!) / compPrice) * 100)
      : 0;
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 24;

  const parsedQty = Math.max(1, Number(quantity) || 1);

  const handleAddToCart = () => {
    if (!hasPrice) {
      setEnquiryOpen(true);
      return;
    }
    const variantId = "variantId" in product ? product.variantId : product.id;
    addItem(
      {
        id: product.id,
        variantId,
        name: displayName,
        slug: product.slug,
        price: product.price!,
        image: selectedImage,
        category: displayCategory,
      },
      parsedQty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!hasPrice) {
      setEnquiryOpen(true);
      return;
    }
    const variantId = "variantId" in product ? product.variantId : product.id;
    addItem(
      {
        id: product.id,
        variantId,
        name: displayName,
        slug: product.slug,
        price: product.price!,
        image: selectedImage,
        category: displayCategory,
      },
      parsedQty
    );
    router.push("/checkout");
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          productName: product.name,
          productId: product.id,
          quantity: Number(quantity) || 1,
          type: "product",
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
        setTimeout(() => {
          setEnquirySuccess(false);
          setEnquiryOpen(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Enquiry submit error", err);
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Section 8 Mandatory Exact WhatsApp format
  const whatsappText = language === "hi"
    ? `नमस्कार, मुझे BHAYA INDIA के इस product के बारे में जानकारी चाहिए:\n\nProduct Name: ${displayName}\nQuantity: ${parsedQty}`
    : `Hello, I would like to enquire about this BHAYA INDIA product:\n\nProduct Name: ${displayName}\nQuantity: ${parsedQty}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  return (
    <>
      {/* Breadcrumb Bar */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">{t("navHome")}</Link>
            <span className={styles.sep}>/</span>
            <Link href="/products">{t("navProducts")}</Link>
            <span className={styles.sep}>/</span>
            <Link href={`/products?category=${product.categorySlug}`}>
              {displayCategory}
            </Link>
            <span className={styles.sep}>/</span>
            <span aria-current="page">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Details */}
      <div className="container">
        <div className={styles.productLayout}>
          {/* Gallery Area */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageContainer}>
              <Image
                src={selectedImage}
                alt={displayName}
                fill
                priority
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className={styles.badgeOverlay}>
                {discount > 0 && (
                  <span className={styles.discountBadge}>
                    {t("offDiscount", { discount })}
                  </span>
                )}
                {product.isNew && (
                  <span className={styles.newBadge}>{t("newArrival")}</span>
                )}
              </div>
            </div>

            {galleryImages && galleryImages.length > 1 && (
              <div className={styles.thumbStrip}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumbBtn} ${
                      selectedImage === img ? styles.thumbActive : ""
                    }`}
                    onClick={() => setUserSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`View ${i + 1}`}
                      width={68}
                      height={68}
                      className={styles.thumbImg}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Assurances Under Gallery */}
            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✓</span>
                <span>{language === "hi" ? "100% प्रामाणिक गुणवत्ता" : "100% Authentic Quality"}</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✦</span>
                <span>{language === "hi" ? "सीधे निर्माता से" : "Direct Sourced"}</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡</span>
                <span>{language === "hi" ? "सुरक्षित ऑल-इंडिया डिलीवरी" : "Secure All-India Delivery"}</span>
              </div>
            </div>
          </div>

          {/* Product Meta & Actions Area */}
          <div className={styles.infoCol}>
            <div className={styles.infoKicker}>
              <Link
                href={`/products?category=${product.categorySlug}`}
                className={styles.categoryLink}
              >
                {displayCategory}
              </Link>
              {displaySubcategory && (
                <>
                  <span className={styles.dot}>·</span>
                  <span className={styles.subcategory}>{displaySubcategory}</span>
                </>
              )}
              <span className={styles.dot}>·</span>
              <span className={styles.sku}>SKU: {product.sku}</span>
            </div>

            <h1 className={styles.productName}>{displayName}</h1>

            {/* Rating Box */}
            <div className={styles.ratingRow}>
              <div className={styles.ratingBox}>
                <span style={{ color: "#FFB300", fontSize: "1rem" }}>★</span>
                <span className={styles.ratingVal}>{rating}</span>
                <span className={styles.reviewsText}>
                  ({reviewsCount} {language === "hi" ? "समीक्षाएं" : "reviews"})
                </span>
              </div>
              <span className={styles.inStockBadge}>
                {language === "hi" ? "स्टॉक में उपलब्ध" : "In Stock & Ready"}
              </span>
            </div>

            {displayTagline && (
              <p className={styles.productTagline}>{displayTagline}</p>
            )}

            {/* Pricing Box */}
            <div className={styles.pricingBox}>
              {hasPrice ? (
                <div className={styles.priceWrap}>
                  <span className={styles.currentPrice}>
                    ₹{product.price!.toLocaleString("en-IN")}
                  </span>
                  {compPrice && (
                    <span className={styles.comparePrice}>
                      ₹{compPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className={styles.savingPill}>
                      {t("offDiscount", { discount })}
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.quoteWrap}>
                  <span className={styles.quotePrice}>
                    {t("customQuoteWholesale")}
                  </span>
                  <span className={styles.quoteNote}>
                    {language === "hi"
                      ? "मात्रा के अनुसार विशेष थोक मूल्य उपलब्ध"
                      : "Volume discounts available upon request"}
                  </span>
                </div>
              )}
              <p className={styles.taxNotice}>
                {language === "hi" ? "सभी कर एवं जीएसटी शामिल" : "Inclusive of all taxes & GST"}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>{t("quantity")}:</span>
              <div className={styles.qtyControls}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    setQuantity(String(Math.max(1, (Number(quantity) || 1) - 1)))
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    setQuantity(String((Number(quantity) || 1) + 1))
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons Strip */}
            <div className={styles.actionsContainer}>
              <div className={styles.mainButtonsRow}>
                {hasPrice ? (
                  <>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={styles.addBagBtn}
                      id={`btn-add-cart-${product.sku}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      {added ? t("addedToBag") : t("addToBag")}
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className={styles.buyNowBtn}
                      id={`btn-buy-now-${product.sku}`}
                    >
                      {t("buyNow")}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEnquiryOpen(true)}
                    className={styles.buyNowBtn}
                  >
                    {t("getQuote")}
                  </button>
                )}
              </div>

              <div className={styles.secondaryButtonsRow}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  id={`btn-whatsapp-${product.sku}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z" />
                  </svg>
                  {t("whatsAppEnquiry")}
                </a>

                <a href={`tel:${phone}`} className={styles.callBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.35 5.35l.92-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.93l.02.99z" />
                  </svg>
                  {language === "hi" ? "कॉल करें" : "Call Desk"}
                </a>

                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className={styles.quoteInquiryBtn}
                >
                  {t("enquireNow")}
                </button>
              </div>
            </div>

            {/* Description Paragraph */}
            <p className={styles.descriptionText}>{displayDesc}</p>

            {/* Key Features */}
            {displayFeatures && displayFeatures.length > 0 && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionBlockTitle}>
                  {language === "hi" ? "मुख्य विशेषताएं एवं शिल्प कौशल" : "Key Features & Craftsmanship"}
                </h2>
                <ul className={styles.featureList}>
                  {displayFeatures.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Purpose */}
            {displayBenefits && displayBenefits.length > 0 && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionBlockTitle}>
                  {language === "hi" ? "लाभ एवं उद्देश्य" : "Benefits & Purpose"}
                </h2>
                <ul className={styles.featureList}>
                  {displayBenefits.map((b, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.goldBullet}>✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specifications */}
            {displaySpecs && displaySpecs.length > 0 && (
              <div className={styles.sectionBlock}>
                <h2 className={styles.sectionBlockTitle}>
                  {language === "hi" ? "तकनीकी विवरण" : "Technical Specifications"}
                </h2>
                <div className={styles.specsTableWrap}>
                  <table className={styles.specTable}>
                    <tbody>
                      {displaySpecs.map((spec, i) => (
                        <tr key={i} className={styles.specRow}>
                          <th className={styles.specLabel}>{spec.label}</th>
                          <td className={styles.specValue}>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>
                {language === "hi" ? "संबंधित उत्पाद" : "You May Also Appreciate"}
              </h2>
              <div className={styles.goldLine} />
            </div>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rp) => {
                const rpName = getLocalizedProductName(rp, language);
                return (
                  <Link
                    key={rp.id}
                    href={`/products/${rp.slug}`}
                    className={styles.relatedCard}
                    id={`related-${rp.sku}`}
                  >
                    <div className={styles.relatedImageWrap}>
                      <Image
                        src={getLanguageAwareProductImage(rp, language)}
                        alt={rpName}
                        fill
                        className={styles.relatedImage}
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{rpName}</p>
                      <p className={styles.relatedPrice}>
                        {rp.price ? `₹${rp.price.toLocaleString("en-IN")}` : t("customQuoteWholesale")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Real Enquiry Modal */}
      {enquiryOpen && (
        <div className={styles.modalOverlay} onClick={() => setEnquiryOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalEyebrow}>
                  {language === "hi" ? "सीधी पूछताछ" : "DIRECT INQUIRY"}
                </span>
                <h3>
                  {language === "hi"
                    ? `${displayName} के बारे में पूछताछ`
                    : `Enquire About ${displayName}`}
                </h3>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setEnquiryOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {enquirySuccess ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>✓</span>
                <h4>{language === "hi" ? "पूछताछ प्राप्त हुई" : "Enquiry Received"}</h4>
                <p>
                  {language === "hi"
                    ? "हमारी टीम जल्द ही आपसे व्हाट्सएप या फोन के माध्यम से संपर्क करेगी।"
                    : "Our client desk will reach out via WhatsApp / phone with quotes and delivery timelines."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className={styles.enquiryForm}>
                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>
                    {t("fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder={language === "hi" ? "उदा. रामेश्वर शर्मा" : "e.g. Rameshwar Sharma"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.formLabel}>
                      {t("mobileNumber")} *
                    </label>
                    <input
                      type="tel"
                      required
                      className={styles.formInput}
                      placeholder="+91 87266 90926"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.formLabel}>
                      {language === "hi" ? "अनुमानित मात्रा" : "Estimated Quantity"}
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={styles.formInput}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>
                    {language === "hi" ? "संदेश / विवरण *" : "Message / Customization Details *"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    className={styles.formTextarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {enquiryLoading
                      ? language === "hi"
                        ? "भेजा जा रहा है..."
                        : "Submitting..."
                      : language === "hi"
                      ? "पूछताछ भेजें →"
                      : "Submit Inquiry →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
