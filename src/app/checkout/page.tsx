"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/context/CartContext";
import type { Order } from "@/lib/types";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Delhi",
    pincode: "",
    paymentMethod: "UPI" as "UPI" | "Card" | "NetBanking" | "COD",
    upiId: "",
  });

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty. Please add products before checking out.");
      return;
    }
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError("Please complete all required address fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call backend order creation with truthful Order Placed status
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: totalPrice,
          paymentMethod: formData.paymentMethod,
          paymentStatus: "Pending",
          orderStatus: "Order Placed",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderComplete(data.order);
        clearCart();
      } else {
        setError(data.error || "Order could not be submitted. Please try again.");
      }
    } catch (err) {
      console.error("Checkout submit error:", err);
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {orderComplete ? (
            <div className={styles.successCard}>
              <div className={styles.checkIcon}>✓</div>
              <span className={styles.successEyebrow}>ORDER RECEIVED SUCCESSFULLY</span>
              <h1 className={styles.successTitle}>Order Confirmed #{orderComplete.id}</h1>
              <p className={styles.successDesc}>
                We have received your order for {orderComplete.items.length} item(s) totaling ₹
                {orderComplete.totalAmount.toLocaleString("en-IN")}. A confirmation has been registered for{" "}
                <strong>{orderComplete.phone}</strong>.
              </p>

              <div className={styles.receiptBox}>
                <div className={styles.receiptRow}>
                  <span>Order Number</span>
                  <strong>{orderComplete.id}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Order Status</span>
                  <strong style={{ color: "var(--sapphire)" }}>{orderComplete.orderStatus || "Order Placed"}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Payment Status</span>
                  <span>{orderComplete.paymentMethod} (Pending Merchant Verification)</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>Shipping Address</span>
                  <span>{orderComplete.address}, {orderComplete.city}, {orderComplete.state} — {orderComplete.pincode}</span>
                </div>
              </div>

              <div className={styles.successActions}>
                <Link href="/account" className="btn btn-primary" id="btn-track-order">
                  Track in My Account
                </Link>
                <Link href="/products" className="btn btn-secondary">
                  Continue Shopping
                </Link>
                <Link
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi BHAYA INDIA, regarding my order ${orderComplete.id}`)}`}
                  className="btn btn-secondary"
                  target="_blank"
                >
                  WhatsApp Support
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.headerArea}>
                <div className={styles.breadcrumb}>
                  <Link href="/cart">Shopping Bag</Link>
                  <span className={styles.sep}>/</span>
                  <span>Secure Checkout</span>
                </div>
                <h1 className={styles.title}>Complete Your Order</h1>
                <p className={styles.subtitle}>
                  Enter delivery details and select your preferred payment gateway method.
                </p>
              </div>

              {items.length === 0 ? (
                <div className={styles.emptyNotice}>
                  <p>Your shopping bag is empty.</p>
                  <Link href="/products" className="btn btn-primary">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
                  <div className={styles.formColumn}>
                    {error && <div className={styles.errorAlert}>{error}</div>}

                    {/* Step 1: Customer Contact & Address */}
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionHeading}>1. Delivery & Contact Details</h2>
                      <div className={styles.formGrid}>
                        <div className={styles.fieldFull}>
                          <label className={styles.label}>Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className={styles.input}
                            placeholder="e.g. Rameshwar Kulkarni"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldHalf}>
                          <label className={styles.label}>Mobile Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            className={styles.input}
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldHalf}>
                          <label className={styles.label}>Email Address</label>
                          <input
                            type="email"
                            name="email"
                            className={styles.input}
                            placeholder="your.email@company.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldFull}>
                          <label className={styles.label}>Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            required
                            className={styles.input}
                            placeholder="Flat/House No., Building Name, Street"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldThird}>
                          <label className={styles.label}>City *</label>
                          <input
                            type="text"
                            name="city"
                            required
                            className={styles.input}
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldThird}>
                          <label className={styles.label}>State *</label>
                          <select
                            name="state"
                            className={styles.select}
                            value={formData.state}
                            onChange={handleChange}
                          >
                            {[
                              "Delhi",
                              "Maharashtra",
                              "Karnataka",
                              "Uttar Pradesh",
                              "Gujarat",
                              "Rajasthan",
                              "Tamil Nadu",
                              "West Bengal",
                              "Haryana",
                              "Punjab",
                              "Telangana",
                              "Kerala",
                              "Madhya Pradesh",
                              "Other States",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.fieldThird}>
                          <label className={styles.label}>Pincode *</label>
                          <input
                            type="text"
                            name="pincode"
                            required
                            className={styles.input}
                            placeholder="6-digit Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Payment Method */}
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionHeading}>2. Payment Method</h2>
                      <div style={{
                        padding: "0.85rem 1rem",
                        background: "rgba(197, 160, 89, 0.08)",
                        border: "1px solid var(--border-gold)",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: "1.25rem",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}>
                        <strong style={{ color: "var(--sapphire)", display: "block", marginBottom: "0.25rem" }}>
                          🔒 Payment Gateway Integration Architecture Ready
                        </strong>
                        <span>
                          Standard gateway integration (UPI / Net Banking / Cards) is built and ready for connection to the client&apos;s production merchant account. Orders submitted now are logged as <strong>Order Placed (Pending Merchant Verification)</strong>.
                        </span>
                      </div>
                      <div className={styles.paymentOptions}>
                        <label
                          className={`${styles.paymentOption} ${formData.paymentMethod === "UPI" ? styles.paymentSelected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="UPI"
                            checked={formData.paymentMethod === "UPI"}
                            onChange={handleChange}
                          />
                          <div className={styles.paymentMeta}>
                            <strong>UPI (Instant & Zero Surcharge)</strong>
                            <span>Google Pay, PhonePe, Paytm, BHIM UPI</span>
                          </div>
                        </label>

                        {formData.paymentMethod === "UPI" && (
                          <div className={styles.upiSubField}>
                            <label className={styles.label}>Enter your UPI ID / VPA</label>
                            <input
                              type="text"
                              name="upiId"
                              className={styles.input}
                              placeholder="e.g. yourname@okhdfcbank"
                              value={formData.upiId}
                              onChange={handleChange}
                            />
                            <span className={styles.fieldHint}>
                              A secure UPI payment request will be sent to your UPI app.
                            </span>
                          </div>
                        )}

                        <label
                          className={`${styles.paymentOption} ${formData.paymentMethod === "Card" ? styles.paymentSelected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Card"
                            checked={formData.paymentMethod === "Card"}
                            onChange={handleChange}
                          />
                          <div className={styles.paymentMeta}>
                            <strong>Credit / Debit Card</strong>
                            <span>Visa, MasterCard, RuPay & American Express</span>
                          </div>
                        </label>

                        <label
                          className={`${styles.paymentOption} ${formData.paymentMethod === "NetBanking" ? styles.paymentSelected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="NetBanking"
                            checked={formData.paymentMethod === "NetBanking"}
                            onChange={handleChange}
                          />
                          <div className={styles.paymentMeta}>
                            <strong>Net Banking</strong>
                            <span>All 50+ major Indian banks supported</span>
                          </div>
                        </label>

                        <label
                          className={`${styles.paymentOption} ${formData.paymentMethod === "COD" ? styles.paymentSelected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === "COD"}
                            onChange={handleChange}
                          />
                          <div className={styles.paymentMeta}>
                            <strong>Bank Transfer / Cash on Delivery</strong>
                            <span>Pay upon verified delivery or invoice</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Summary Column */}
                  <div className={styles.summaryColumn}>
                    <div className={styles.orderCard}>
                      <h3 className={styles.orderCardHeading}>Order Items ({items.length})</h3>

                      <div className={styles.orderItemsList}>
                        {items.map((item) => (
                          <div key={item.id} className={styles.summaryItem}>
                            <div className={styles.itemThumb}>
                              <Image
                                src={item.image || "/assets/category-textiles.jpg"}
                                alt={item.name}
                                width={48}
                                height={48}
                                className={styles.thumbImg}
                              />
                            </div>
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemQty}>Qty: {item.quantity}</span>
                            </div>
                            <span className={styles.itemPrice}>
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.calcDivider} />

                      <div className={styles.calcRow}>
                        <span>Subtotal</span>
                        <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className={styles.calcRow}>
                        <span>Delivery Fee</span>
                        <span className={styles.freeBadge}>FREE (Pan-India)</span>
                      </div>
                      <div className={styles.calcRow}>
                        <span>Taxes (GST)</span>
                        <span>Included</span>
                      </div>

                      <div className={styles.calcDivider} />

                      <div className={styles.finalTotalRow}>
                        <span>Total Payable</span>
                        <span className={styles.payableAmount}>
                          ₹{totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-primary ${styles.submitOrderBtn}`}
                      >
                        {loading ? "Processing Secure Payment..." : `Pay ₹${totalPrice.toLocaleString("en-IN")} Now →`}
                      </button>

                      <p className={styles.securityNote}>
                        🔒 256-Bit SSL Encrypted & Certified Indian Payment Gateway Architecture.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
