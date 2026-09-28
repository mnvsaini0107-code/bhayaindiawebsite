"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import type { Order } from "@/lib/types";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, checkoutUrl } = useCart();
  const { t, language } = useLanguage();
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

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError(language === "hi" ? "आपका कार्ट खाली है।" : "Your cart is empty. Please add products before checking out.");
      return;
    }
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setError(language === "hi" ? "कृपया सभी आवश्यक पते के फ़ील्ड भरें।" : "Please complete all required address fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
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
        setError(data.error || (language === "hi" ? "ऑर्डर जमा नहीं हो सका। कृपया पुनः प्रयास करें।" : "Order could not be submitted. Please try again."));
      }
    } catch (err) {
      console.error("Checkout submit error:", err);
      setError(language === "hi" ? "नेटवर्क त्रुटि हुई। कृपया पुनः प्रयास करें।" : "A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkoutUrl) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className="container" style={{ padding: "40px 0" }}>
            <div className={styles.successCard} style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <div className={styles.checkIcon} style={{ background: "var(--sapphire)", color: "#fff" }}>✓</div>
              <span className={styles.successEyebrow}>SHOPIFY SECURE COMMERCE</span>
              <h1 className={styles.successTitle}>
                {language === "hi" ? "Shopify चेकआउट पर भेजा जा रहा है" : "Redirecting to Shopify Checkout"}
              </h1>
              <p className={styles.successDesc}>
                {language === "hi"
                  ? "आपको सुरक्षित Shopify पेमेंट पोर्टल (UPI, कार्ड, नेट बैंकिंग) पर ले जाया जा रहा है।"
                  : "Taking you to the official Shopify checkout portal with UPI, Debit/Credit Cards, and Net Banking."}
              </p>
              <div style={{ marginTop: "24px" }}>
                <a href={checkoutUrl} className="btn btn-primary" style={{ padding: "14px 28px" }}>
                  {language === "hi" ? "Shopify चेकआउट पर आगे बढ़ें →" : "Proceed to Shopify Checkout Now →"}
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {orderComplete ? (
            <div className={styles.successCard}>
              <div className={styles.checkIcon}>✓</div>
              <span className={styles.successEyebrow}>
                {language === "hi" ? "ऑर्डर सफलतापूर्वक प्राप्त हुआ" : "ORDER RECEIVED SUCCESSFULLY"}
              </span>
              <h1 className={styles.successTitle}>
                {language === "hi" ? `ऑर्डर स्वीकृत #${orderComplete.id}` : `Order Confirmed #${orderComplete.id}`}
              </h1>
              <p className={styles.successDesc}>
                {language === "hi"
                  ? `हमें आपके ${orderComplete.items.length} उत्पादों का ऑर्डर (कुल राशि ₹${orderComplete.totalAmount.toLocaleString("en-IN")}) प्राप्त हो गया है। मोबाइल ${orderComplete.phone} पर पुष्टि दर्ज कर ली गई है।`
                  : `We have received your order for ${orderComplete.items.length} item(s) totaling ₹${orderComplete.totalAmount.toLocaleString("en-IN")}. A confirmation has been registered for ${orderComplete.phone}.`}
              </p>

              <div className={styles.receiptBox}>
                <div className={styles.receiptRow}>
                  <span>{t("orderId")}</span>
                  <strong>{orderComplete.id}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>{t("orderStatus")}</span>
                  <strong style={{ color: "var(--sapphire)" }}>
                    {language === "hi" ? "ऑर्डर दर्ज" : orderComplete.orderStatus || "Order Placed"}
                  </strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>{language === "hi" ? "भुगतान स्थिति" : "Payment Status"}</span>
                  <span>{orderComplete.paymentMethod} ({language === "hi" ? "सत्यापन लंबित" : "Pending Verification"})</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>{language === "hi" ? "डिलीवरी पता" : "Shipping Address"}</span>
                  <span>{orderComplete.address}, {orderComplete.city}, {orderComplete.state} — {orderComplete.pincode}</span>
                </div>
              </div>

              <div className={styles.successActions}>
                <Link href="/account" className="btn btn-primary" id="btn-track-order">
                  {language === "hi" ? "खाते में ट्रैक करें" : "Track in My Account"}
                </Link>
                <Link href="/products" className="btn btn-secondary">
                  {t("continueShopping")}
                </Link>
                <Link
                  href={`https://wa.me/918726690926?text=${encodeURIComponent(`Hi BHAYA INDIA, regarding my order ${orderComplete.id}`)}`}
                  className="btn btn-secondary"
                  target="_blank"
                >
                  {t("whatsAppEnquiry")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.headerArea}>
                <div className={styles.breadcrumb}>
                  <Link href="/cart">{t("navCart")}</Link>
                  <span className={styles.sep}>/</span>
                  <span>{t("proceedToCheckout")}</span>
                </div>
                <h1 className={styles.title}>
                  {language === "hi" ? "अपना ऑर्डर पूरा करें" : "Complete Your Order"}
                </h1>
                <p className={styles.subtitle}>
                  {language === "hi"
                    ? "डिलीवरी विवरण दर्ज करें और अपनी पसंदीदा भुगतान विधि चुनें।"
                    : "Enter delivery details and select your preferred payment gateway method."}
                </p>
              </div>

              {items.length === 0 ? (
                <div className={styles.emptyNotice}>
                  <p>{t("cartEmptyTitle")}</p>
                  <Link href="/products" className="btn btn-primary">
                    {t("exploreProducts")}
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
                  <div className={styles.formColumn}>
                    {error && <div className={styles.errorAlert}>{error}</div>}

                    {/* Step 1: Customer Contact & Address */}
                    <div className={styles.sectionCard}>
                      <h2 className={styles.sectionHeading}>1. {t("billingDetails")}</h2>
                      <div className={styles.formGrid}>
                        <div className={styles.fieldFull}>
                          <label className={styles.label}>{t("fullName")} *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className={styles.input}
                            placeholder={language === "hi" ? "उदा. रामेश्वर कुलकर्णी" : "e.g. Rameshwar Kulkarni"}
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldHalf}>
                          <label className={styles.label}>{t("mobileNumber")} *</label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            className={styles.input}
                            placeholder="+91 87266 90926"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldHalf}>
                          <label className={styles.label}>{t("emailAddress")}</label>
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
                          <label className={styles.label}>{t("streetAddress")} *</label>
                          <input
                            type="text"
                            name="address"
                            required
                            className={styles.input}
                            placeholder={language === "hi" ? "मकान नं., बिल्डिंग, सड़क का नाम" : "Flat/House No., Building Name, Street"}
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldThird}>
                          <label className={styles.label}>{t("city")} *</label>
                          <input
                            type="text"
                            name="city"
                            required
                            className={styles.input}
                            placeholder={t("city")}
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>

                        <div className={styles.fieldThird}>
                          <label className={styles.label}>{t("state")} *</label>
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
                          <label className={styles.label}>{t("pincode")} *</label>
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
                      <h2 className={styles.sectionHeading}>2. {t("selectPaymentMethod")}</h2>
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
                          {language === "hi" ? "सत्यापित भारतीय ई-कॉमर्स पेमेंट" : "Verified Payment Security"}
                        </strong>
                        <span>
                          {t("paymentPendingNotice")}
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
                            <strong>{t("upiPayment")}</strong>
                            <span>Google Pay, PhonePe, Paytm, BHIM UPI</span>
                          </div>
                        </label>

                        {formData.paymentMethod === "UPI" && (
                          <div className={styles.upiSubField}>
                            <label className={styles.label}>{language === "hi" ? "अपना UPI ID / VPA दर्ज करें" : "Enter your UPI ID / VPA"}</label>
                            <input
                              type="text"
                              name="upiId"
                              className={styles.input}
                              placeholder="e.g. yourname@okhdfcbank"
                              value={formData.upiId}
                              onChange={handleChange}
                            />
                            <span className={styles.fieldHint}>
                              {language === "hi" ? "आपके UPI ऐप पर भुगतान अनुरोध भेजा जाएगा।" : "A secure UPI payment request will be sent to your UPI app."}
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
                            <strong>{t("cardPayment")}</strong>
                            <span>Visa, MasterCard, RuPay</span>
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
                            <strong>{t("netBanking")}</strong>
                            <span>{language === "hi" ? "सभी प्रमुख भारतीय बैंक समर्थित" : "All major Indian banks supported"}</span>
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
                            <strong>{t("codPayment")}</strong>
                            <span>{language === "hi" ? "डिलीवरी पर सत्यापन के साथ भुगतान" : "Pay upon verified delivery or invoice"}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Summary Column */}
                  <div className={styles.summaryColumn}>
                    <div className={styles.orderCard}>
                      <h3 className={styles.orderCardHeading}>
                        {language === "hi" ? `ऑर्डर किए गए उत्पाद (${items.length})` : `Order Items (${items.length})`}
                      </h3>

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
                              <span className={styles.itemQty}>{t("quantity")}: {item.quantity}</span>
                            </div>
                            <span className={styles.itemPrice}>
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.calcDivider} />

                      <div className={styles.calcRow}>
                        <span>{t("subtotal")}</span>
                        <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className={styles.calcRow}>
                        <span>{t("delivery")}</span>
                        <span className={styles.freeBadge}>{t("complimentary")}</span>
                      </div>
                      <div className={styles.calcRow}>
                        <span>{t("taxesIncluded")}</span>
                        <span>{t("priceInclusiveTaxes")}</span>
                      </div>

                      <div className={styles.calcDivider} />

                      <div className={styles.finalTotalRow}>
                        <span>{t("totalAmount")}</span>
                        <span className={styles.payableAmount}>
                          ₹{totalPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-primary ${styles.submitOrderBtn}`}
                      >
                        {loading
                          ? t("loadingText")
                          : (language === "hi"
                              ? `अभी भुगतान करें: ₹${totalPrice.toLocaleString("en-IN")} →`
                              : `Pay ₹${totalPrice.toLocaleString("en-IN")} Now →`)}
                      </button>

                      <p className={styles.securityNote}>
                        {language === "hi" ? "256-बिट सुरक्षित एन्क्रिप्टेड भुगतान प्रणाली" : "256-Bit SSL Encrypted & Certified Secure Commerce."}
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
