"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalCount, checkoutUrl, isLoading } = useCart();
  const { t, language } = useLanguage();

  const cartWaMsg = `नमस्कार, मुझे BHAYA INDIA के इन products के बारे में जानकारी चाहिए:

${items.map((i, idx) => `${idx + 1}. Product Name: ${i.name}\nQuantity: ${i.quantity}\nPrice: ₹${(i.price * i.quantity).toLocaleString("en-IN")}`).join('\n\n')}

Total Amount: ₹${totalPrice.toLocaleString("en-IN")}`;

  const cartWaUrl = `https://wa.me/919876543210?text=${encodeURIComponent(cartWaMsg)}`;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.headerArea}>
            <div className={styles.breadcrumb}>
              <Link href="/">{t("navHome")}</Link>
              <span className={styles.sep}>/</span>
              <span>{t("navCart")}</span>
            </div>
            <h1 className={styles.title}>{t("cartTitle")}</h1>
            <p className={styles.subtitle}>
              {totalCount > 0
                ? (language === "hi"
                    ? `${totalCount} उत्पाद पूरे भारत में डिलीवरी के लिए चुने गए हैं`
                    : `${totalCount} item${totalCount > 1 ? "s" : ""} selected for delivery across India`)
                : t("cartEmptyTitle")}
            </p>
          </div>

          {items.length === 0 ? (
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>{t("cartEmptyTitle")}</h2>
              <p className={styles.emptyDesc}>
                {t("cartEmptyDesc")}
              </p>
              <Link href="/products" className="btn btn-primary">
                {t("exploreProducts")}
              </Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              <div className={styles.itemList}>
                <div className={styles.listHeader}>
                  <span>{t("navProducts")}</span>
                  <span className={styles.hideMobile}>{t("quantity")}</span>
                  <span>{t("price")}</span>
                </div>

                {items.map((item) => (
                  <div key={item.id} className={styles.cartRow}>
                    <div className={styles.productCell}>
                      <div className={styles.imageBox}>
                        <Image
                          src={item.image || "/assets/category-textiles.jpg"}
                          alt={item.name}
                          width={88}
                          height={88}
                          className={styles.itemImg}
                        />
                      </div>
                      <div className={styles.productMeta}>
                        <span className={styles.categoryLabel}>{item.category}</span>
                        <Link href={`/products/${item.slug}`} className={styles.itemName}>
                          {item.name}
                        </Link>
                        <span className={styles.unitPrice}>₹{item.price.toLocaleString("en-IN")} {language === "hi" ? "प्रति नग" : "each"}</span>
                        <button
                          className={styles.removeBtnMobile}
                          onClick={() => removeItem(item.id)}
                          aria-label={t("remove")}
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </div>

                    <div className={styles.quantityCell}>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeBtnDesktop}
                        onClick={() => removeItem(item.id)}
                        aria-label={t("remove")}
                      >
                        {t("remove")}
                      </button>
                    </div>

                    <div className={styles.totalCell}>
                      <span className={styles.rowTotal}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}

                <div className={styles.tableFooter}>
                  <button className={styles.clearBtn} onClick={clearCart}>
                    {t("clearFilters")}
                  </button>
                  <Link href="/products" className={styles.continueLink}>
                    ← {t("continueShopping")}
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>{language === "hi" ? "ऑर्डर का विवरण" : "Order Summary"}</h3>

                <div className={styles.summaryRow}>
                  <span>{t("subtotal")}</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t("delivery")}</span>
                  <span className={styles.freeShipping}>{t("complimentary")}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t("taxesIncluded")}</span>
                  <span className={styles.inclusiveText}>{t("priceInclusiveTaxes")}</span>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.totalRow}>
                  <span>{t("totalAmount")}</span>
                  <span className={styles.grandTotal}>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.25rem 0" }}>
                  <a
                    href={checkoutUrl || "/checkout"}
                    className={`btn btn-primary ${styles.checkoutBtn}`}
                    id="cart-checkout-btn"
                  >
                    {isLoading ? t("loadingText") : `${t("proceedToCheckout")} →`}
                  </a>
                  <a
                    href={cartWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    id="cart-whatsapp-btn"
                    style={{ width: "100%", fontSize: "0.875rem" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                    </svg>
                    {t("whatsAppEnquiry")}
                  </a>
                </div>

                <div className={styles.trustHighlights}>
                  <div className={styles.trustItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{language === "hi" ? "100% प्रामाणिक भारतीय उत्पाद" : "100% Authentic Indian Craftsmanship"}</span>
                  </div>
                  <div className={styles.trustItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span>{language === "hi" ? "जांची गई गुणवत्ता एवं सुरक्षित परिवहन" : "Inspected Dispatch & Insured Transit"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
