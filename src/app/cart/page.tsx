"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/context/CartContext";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalCount } = useCart();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.headerArea}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Shopping Bag</span>
            </div>
            <h1 className={styles.title}>Your Shopping Bag</h1>
            <p className={styles.subtitle}>
              {totalCount > 0
                ? `${totalCount} item${totalCount > 1 ? "s" : ""} selected for delivery across India`
                : "Your shopping bag is currently empty."}
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
              <h2 className={styles.emptyTitle}>Your bag is waiting for quality pieces</h2>
              <p className={styles.emptyDesc}>
                Discover handcrafted silks, genuine leather stationery, curated gift hampers, and artisanal homeware.
              </p>
              <Link href="/products" className="btn btn-primary">
                Explore Catalogue
              </Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              <div className={styles.itemList}>
                <div className={styles.listHeader}>
                  <span>Product</span>
                  <span className={styles.hideMobile}>Quantity</span>
                  <span>Total</span>
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
                        <span className={styles.unitPrice}>₹{item.price.toLocaleString("en-IN")} each</span>
                        <button
                          className={styles.removeBtnMobile}
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
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
                      >
                        Remove
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
                    Clear All Items
                  </button>
                  <Link href="/products" className={styles.continueLink}>
                    ← Continue Browsing
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Pan-India Delivery</span>
                  <span className={styles.freeShipping}>Complimentary</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>GST (Inclusive)</span>
                  <span className={styles.inclusiveText}>Included in price</span>
                </div>

                <div className={styles.summaryDivider} />

                <div className={styles.totalRow}>
                  <span>Estimated Total</span>
                  <span className={styles.grandTotal}>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>

                <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`}>
                  Proceed to Checkout →
                </Link>

                <div className={styles.trustHighlights}>
                  <div className={styles.trustItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>100% Authentic Indian Craftsmanship</span>
                  </div>
                  <div className={styles.trustItem}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span>Inspected Dispatch & Insured Transit</span>
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
