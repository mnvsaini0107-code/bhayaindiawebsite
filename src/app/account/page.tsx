"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./account.module.css";
import { useLanguage } from "@/context/LanguageContext";
import type { Order, CustomerUser, CustomerAddress } from "@/lib/types";

export default function AccountPage() {
  const { language } = useLanguage();

  // Auth & Session state
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [authMode, setAuthMode] = useState<"login" | "register" | "lookup">("login");

  // Form states
  const [loginPhone, setLoginPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [lookupQuery, setLookupQuery] = useState("");

  // Address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState("Home");
  const [addrFullName, setAddrFullName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchOrders = async (identifier: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        const clean = identifier.replace(/[^0-9]/g, "");
        const matched = data.orders.filter((o: Order) => {
          const orderCleanPhone = (o.phone || "").replace(/[^0-9]/g, "");
          return (
            (clean.length >= 6 && orderCleanPhone.includes(clean)) ||
            o.id.toLowerCase() === identifier.trim().toLowerCase()
          );
        });
        setOrders(matched);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bhaya_customer_user");
      if (stored) {
        const parsed: CustomerUser = JSON.parse(stored);
        const timer = setTimeout(() => {
          setUser(parsed);
          setProfileName(parsed.name || "");
          setProfileEmail(parsed.email || "");
          fetchOrders(parsed.phone);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore parse error
    }
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", identifier: loginPhone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setProfileName(data.user.name || "");
        setProfileEmail(data.user.email || "");
        localStorage.setItem("bhaya_customer_user", JSON.stringify(data.user));
        fetchOrders(data.user.phone);
      } else {
        setFeedback({ type: "error", msg: data.error || "Login failed. Please verify credentials." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: regName,
          phone: regPhone,
          email: regEmail,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setProfileName(data.user.name || "");
        setProfileEmail(data.user.email || "");
        localStorage.setItem("bhaya_customer_user", JSON.stringify(data.user));
        fetchOrders(data.user.phone);
      } else {
        setFeedback({ type: "error", msg: data.error || "Registration failed." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error. Please try again." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery) return;
    setFeedback(null);
    fetchOrders(lookupQuery);
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem("bhaya_customer_user");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          userId: user.id,
          name: profileName,
          email: profileEmail,
          phone: user.phone,
          addresses: user.addresses,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("bhaya_customer_user", JSON.stringify(data.user));
        setFeedback({
          type: "success",
          msg: language === "hi" ? "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!" : "Profile updated successfully!",
        });
      }
    } catch {
      setFeedback({ type: "error", msg: "Could not update profile." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);
    setAuthLoading(true);

    const newAddr: CustomerAddress = {
      id: "addr-" + Date.now(),
      label: addrLabel,
      fullName: addrFullName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
    };

    try {
      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_address",
          userId: user.id,
          address: newAddr,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("bhaya_customer_user", JSON.stringify(data.user));
        setShowAddAddress(false);
        setAddrFullName("");
        setAddrStreet("");
        setAddrCity("");
        setAddrState("");
        setAddrPincode("");
        setFeedback({
          type: "success",
          msg: language === "hi" ? "पता सफलतापूर्वक जोड़ दिया गया।" : "Address added successfully.",
        });
      }
    } catch {
      setFeedback({ type: "error", msg: "Could not add address." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_address",
          userId: user.id,
          addressId,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("bhaya_customer_user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const timelineSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

  const getLocalizedStatus = (status: string) => {
    switch (status) {
      case "Order Placed": return language === "hi" ? "ऑर्डर दर्ज" : "Order Placed";
      case "Processing": return language === "hi" ? "प्रगति पर" : "Processing";
      case "Shipped": return language === "hi" ? "भेज दिया गया" : "Shipped";
      case "Delivered": return language === "hi" ? "वितरित" : "Delivered";
      case "Cancelled": return language === "hi" ? "रद्द" : "Cancelled";
      default: return status;
    }
  };

  const getStepIndex = (status: string) => {
    if (status === "Delivered") return 3;
    if (status === "Shipped") return 2;
    if (status === "Processing") return 1;
    return 0; // "Order Placed"
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">{language === "hi" ? "होम" : "Home"}</Link>
              <span className={styles.sep}>/</span>
              <span>{language === "hi" ? "ग्राहक खाता" : "Customer Account"}</span>
            </div>
            <h1 className={styles.title}>
              {language === "hi" ? "ग्राहक खाता एवं ऑर्डर ट्रैकिंग" : "Customer Account & Order Tracking"}
            </h1>
            <p className={styles.subtitle}>
              {language === "hi"
                ? "अपने हालिया ऑर्डर्स की स्थिति ट्रैक करें, पते प्रबंधित करें और कस्टमर सपोर्ट से जुड़ें।"
                : "Track order status, manage delivery addresses, and connect directly with customer support."}
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            {/* Authenticated View */}
            {user ? (
              <>
                <div className={styles.sessionBar}>
                  <div className={styles.greetingWrap}>
                    <span className={styles.greeting}>
                      {language === "hi" ? `नमस्ते, ${user.name}!` : `Welcome back, ${user.name}!`}
                    </span>
                    <span className={styles.userPhone}>
                      {user.phone} {user.email ? `• ${user.email}` : ""}
                    </span>
                  </div>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    {language === "hi" ? "लॉग आउट" : "Sign Out"}
                  </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabsRow}>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "orders" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    {language === "hi" ? "मेरे ऑर्डर्स" : "My Orders"} ({orders.length})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("addresses")}
                  >
                    {language === "hi" ? "सहेजे गए पते" : "Saved Addresses"} ({user.addresses?.length || 0})
                  </button>
                  <button
                    className={`${styles.tabBtn} ${activeTab === "profile" ? styles.tabBtnActive : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    {language === "hi" ? "मेरी प्रोफ़ाइल" : "Profile Settings"}
                  </button>
                </div>

                {feedback && (
                  <p className={feedback.type === "success" ? styles.successText : styles.errorText}>
                    {feedback.msg}
                  </p>
                )}

                {/* TAB 1: ORDERS */}
                {activeTab === "orders" && (
                  <div className={styles.ordersSection}>
                    {loadingOrders ? (
                      <p style={{ color: "var(--text-muted)", padding: "2rem 0" }}>
                        {language === "hi" ? "ऑर्डर्स लोड हो रहे हैं..." : "Loading your orders..."}
                      </p>
                    ) : orders.length === 0 ? (
                      <div className={styles.authCard} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "1.1rem", color: "var(--sapphire)", marginBottom: "0.5rem" }}>
                          {language === "hi" ? "कोई सक्रिय ऑर्डर नहीं मिला।" : "No recent orders found."}
                        </p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                          {language === "hi"
                            ? "हमारे व्यापक संग्रह से उत्पाद ऑर्डर करें।"
                            : "Browse our collections and place your first order today."}
                        </p>
                        <Link href="/products" className="btn btn-primary">
                          {language === "hi" ? "उत्पाद देखें →" : "Explore Products →"}
                        </Link>
                      </div>
                    ) : (
                      orders.map((o) => {
                        const activeIdx = getStepIndex(o.orderStatus);
                        const isCancelled = o.orderStatus === "Cancelled";

                        return (
                          <div key={o.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                              <div>
                                <span className={styles.orderId}>
                                  {language === "hi" ? "ऑर्डर #" : "Order #"}{o.id}
                                </span>
                                <span className={styles.orderDate}>
                                  {language === "hi" ? "तारीख:" : "Placed on"}{" "}
                                  {new Date(o.createdAt).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", {
                                    dateStyle: "long",
                                  })}
                                </span>
                              </div>
                              <span
                                className={`${styles.statusBadge} ${
                                  o.orderStatus === "Delivered"
                                    ? styles.statusDelivered
                                    : o.orderStatus === "Shipped"
                                    ? styles.statusShipped
                                    : o.orderStatus === "Cancelled"
                                    ? styles.statusCancelled
                                    : o.orderStatus === "Processing"
                                    ? styles.statusProcessing
                                    : styles.statusPlaced
                                }`}
                              >
                                {getLocalizedStatus(o.orderStatus)}
                              </span>
                            </div>

                            {/* Status Timeline */}
                            {!isCancelled ? (
                              <div className={styles.timeline}>
                                {timelineSteps.map((step, idx) => (
                                  <div key={step} className={styles.timelineStep}>
                                    <div
                                      className={`${styles.stepDot} ${
                                        idx <= activeIdx ? styles.stepDotActive : ""
                                      }`}
                                    />
                                    <span className={styles.stepLabel}>{getLocalizedStatus(step)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: "0.75rem 0" }}>
                                {language === "hi"
                                  ? "यह ऑर्डर रद्द कर दिया गया है।"
                                  : "This order was cancelled. Please contact support for questions."}
                              </p>
                            )}

                            {/* Items */}
                            <div className={styles.itemsList}>
                              {o.items.map((item, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </div>

                            <div className={styles.orderFooter}>
                              <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                                  {language === "hi" ? "डिलीवरी पता:" : "Delivering to:"}
                                </span>
                                <p style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                                  {o.customerName}, {o.address}, {o.city} ({o.pincode})
                                </p>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                                  {language === "hi" ? "कुल राशि:" : "Total Amount:"}
                                </span>
                                <span className={styles.totalAmount}>
                                  ₹{o.totalAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 2: ADDRESSES */}
                {activeTab === "addresses" && (
                  <div className={styles.addressesSection}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "1.2rem", color: "var(--sapphire)" }}>
                        {language === "hi" ? "आपके सुरक्षित पते" : "Your Saved Addresses"}
                      </h3>
                      <button
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="btn btn-primary"
                        style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                      >
                        {showAddAddress
                          ? language === "hi" ? "रद्द करें" : "Cancel"
                          : language === "hi" ? "+ नया पता जोड़ें" : "+ Add New Address"}
                      </button>
                    </div>

                    {showAddAddress && (
                      <form onSubmit={handleAddAddress} className={styles.authCard} style={{ maxWidth: "600px" }}>
                        <h4 style={{ color: "var(--sapphire)", marginBottom: "1rem" }}>
                          {language === "hi" ? "नया डिलीवरी पता दर्ज करें" : "Add New Delivery Address"}
                        </h4>
                        <div className={styles.authForm}>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>{language === "hi" ? "पता प्रकार (जैसे Home, Office)" : "Address Label"}</label>
                            <input
                              className={styles.input}
                              type="text"
                              required
                              value={addrLabel}
                              onChange={(e) => setAddrLabel(e.target.value)}
                              placeholder="Home / Office / Warehouse"
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>{language === "hi" ? "पूरा नाम" : "Full Name"}</label>
                            <input
                              className={styles.input}
                              type="text"
                              required
                              value={addrFullName}
                              onChange={(e) => setAddrFullName(e.target.value)}
                              placeholder="Full Name"
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>{language === "hi" ? "सड़क / मकान संख्या" : "Street / House No."}</label>
                            <input
                              className={styles.input}
                              type="text"
                              required
                              value={addrStreet}
                              onChange={(e) => setAddrStreet(e.target.value)}
                              placeholder="Address line 1 & 2"
                            />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>{language === "hi" ? "शहर" : "City"}</label>
                              <input
                                className={styles.input}
                                type="text"
                                required
                                value={addrCity}
                                onChange={(e) => setAddrCity(e.target.value)}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>{language === "hi" ? "राज्य" : "State"}</label>
                              <input
                                className={styles.input}
                                type="text"
                                required
                                value={addrState}
                                onChange={(e) => setAddrState(e.target.value)}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>{language === "hi" ? "पिनकोड" : "Pincode"}</label>
                              <input
                                className={styles.input}
                                type="text"
                                required
                                value={addrPincode}
                                onChange={(e) => setAddrPincode(e.target.value)}
                              />
                            </div>
                          </div>
                          <button type="submit" disabled={authLoading} className="btn btn-primary">
                            {authLoading
                              ? language === "hi" ? "सहेज रहे हैं..." : "Saving..."
                              : language === "hi" ? "पता सहेजें" : "Save Address"}
                          </button>
                        </div>
                      </form>
                    )}

                    {(!user.addresses || user.addresses.length === 0) && !showAddAddress && (
                      <p style={{ color: "var(--text-muted)" }}>
                        {language === "hi"
                          ? "अभी तक कोई पता सहेजा नहीं गया है।"
                          : "No saved addresses yet. Click '+ Add New Address' above."}
                      </p>
                    )}

                    <div className={styles.addressGrid}>
                      {user.addresses?.map((addr) => (
                        <div key={addr.id} className={styles.addressCard}>
                          <div>
                            <div className={styles.addressTitle}>
                              <span>{addr.label}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className={styles.deleteBtn}
                              >
                                {language === "hi" ? "हटाएं" : "Delete"}
                              </button>
                            </div>
                            <p className={styles.addressText} style={{ marginTop: "0.5rem" }}>
                              <strong>{addr.fullName}</strong>
                              <br />
                              {addr.street}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: PROFILE */}
                {activeTab === "profile" && (
                  <div className={styles.profileCard}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--sapphire)", marginBottom: "1.25rem" }}>
                      {language === "hi" ? "व्यक्तिगत जानकारी" : "Personal Information"}
                    </h3>
                    <form onSubmit={handleSaveProfile} className={styles.authForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{language === "hi" ? "पूरा नाम" : "Full Name"}</label>
                        <input
                          className={styles.input}
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{language === "hi" ? "मोबाइल नंबर (स्थायी)" : "Mobile Number (Verified)"}</label>
                        <input className={styles.input} type="text" disabled value={user.phone} />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>{language === "hi" ? "ईमेल पता" : "Email Address"}</label>
                        <input
                          className={styles.input}
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="name@example.com"
                        />
                      </div>
                      <button type="submit" disabled={authLoading} className="btn btn-primary">
                        {authLoading
                          ? language === "hi" ? "सहेज रहे हैं..." : "Updating..."
                          : language === "hi" ? "बदलाव सहेजें" : "Update Profile"}
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              /* Guest View: Sign In / Register / Quick Order Lookup */
              <div className={styles.authCard}>
                <div
                  style={{
                    padding: "1rem",
                    background: "rgba(18, 52, 86, 0.04)",
                    border: "1px solid rgba(197, 160, 89, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <strong style={{ color: "var(--sapphire)", display: "block", fontSize: "0.95rem" }}>
                      Shopify Customer Account
                    </strong>
                    <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                      {language === "hi"
                        ? "आधिकारिक Shopify अकाउंट से लॉगिन करें या नीचे तुरंत ट्रैक करें।"
                        : "Sign in with your official Shopify account or track your order below."}
                    </span>
                  </div>
                  <a
                    href="/api/auth/shopify"
                    className="btn btn-secondary"
                    style={{ fontSize: "0.825rem", padding: "8px 16px" }}
                  >
                    Shopify Portal →
                  </a>
                </div>

                <div className={styles.authTabs}>
                  <button
                    className={`${styles.authTab} ${authMode === "login" ? styles.authTabActive : ""}`}
                    onClick={() => {
                      setAuthMode("login");
                      setFeedback(null);
                    }}
                  >
                    {language === "hi" ? "साइन इन" : "Sign In"}
                  </button>
                  <button
                    className={`${styles.authTab} ${authMode === "register" ? styles.authTabActive : ""}`}
                    onClick={() => {
                      setAuthMode("register");
                      setFeedback(null);
                    }}
                  >
                    {language === "hi" ? "नया खाता बनाएं" : "Create Account"}
                  </button>
                  <button
                    className={`${styles.authTab} ${authMode === "lookup" ? styles.authTabActive : ""}`}
                    onClick={() => {
                      setAuthMode("lookup");
                      setFeedback(null);
                    }}
                  >
                    {language === "hi" ? "त्वरित ऑर्डर खोज" : "Track Order"}
                  </button>
                </div>

                {feedback && (
                  <p className={feedback.type === "success" ? styles.successText : styles.errorText} style={{ marginBottom: "1rem" }}>
                    {feedback.msg}
                  </p>
                )}

                {/* SIGN IN FORM */}
                {authMode === "login" && (
                  <form onSubmit={handleLogin} className={styles.authForm}>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                      {language === "hi"
                        ? "ऑर्डर इतिहास और सहेजे गए पते देखने के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें।"
                        : "Enter your registered 10-digit mobile number to access orders and addresses."}
                    </p>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}</label>
                      <input
                        className={styles.input}
                        type="tel"
                        required
                        placeholder="e.g. 8726690926"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                      />
                    </div>
                    <button type="submit" disabled={authLoading} className={`btn btn-primary ${styles.authSubmitBtn}`}>
                      {authLoading
                        ? language === "hi" ? "जाँच हो रही है..." : "Signing in..."
                        : language === "hi" ? "साइन इन करें →" : "Sign In →"}
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
                {authMode === "register" && (
                  <form onSubmit={handleRegister} className={styles.authForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{language === "hi" ? "आपका पूरा नाम" : "Full Name"}</label>
                      <input
                        className={styles.input}
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{language === "hi" ? "मोबाइल नंबर" : "Mobile Number"}</label>
                      <input
                        className={styles.input}
                        type="tel"
                        required
                        placeholder="e.g. 8726690926"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{language === "hi" ? "ईमेल (वैकल्पिक)" : "Email (Optional)"}</label>
                      <input
                        className={styles.input}
                        type="email"
                        placeholder="name@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" disabled={authLoading} className={`btn btn-primary ${styles.authSubmitBtn}`}>
                      {authLoading
                        ? language === "hi" ? "खाता बन रहा है..." : "Registering..."
                        : language === "hi" ? "खाता बनाएं →" : "Register Account →"}
                    </button>
                  </form>
                )}

                {/* QUICK ORDER LOOKUP */}
                {authMode === "lookup" && (
                  <div>
                    <form onSubmit={handleQuickLookup} className={styles.authForm}>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                        {language === "hi"
                          ? "बिना लॉगिन किए तुरंत अपने ऑर्डर की स्थिति जानने के लिए अपना ऑर्डर ID (जैसे ORD-9012) या मोबाइल नंबर दर्ज करें।"
                          : "Enter your Order ID (e.g. ORD-9012) or mobile number to track status instantly without logging in."}
                      </p>
                      <div className={styles.formGroup}>
                        <input
                          className={styles.input}
                          type="text"
                          required
                          placeholder="ORD-XXXX or Mobile number"
                          value={lookupQuery}
                          onChange={(e) => setLookupQuery(e.target.value)}
                        />
                      </div>
                      <button type="submit" disabled={loadingOrders} className={`btn btn-primary ${styles.authSubmitBtn}`}>
                        {loadingOrders
                          ? language === "hi" ? "खोज रहे हैं..." : "Searching..."
                          : language === "hi" ? "ऑर्डर ट्रैक करें →" : "Track Order Status →"}
                      </button>
                    </form>

                    {orders.length > 0 && (
                      <div style={{ marginTop: "2rem" }}>
                        <h4 style={{ color: "var(--sapphire)", marginBottom: "1rem" }}>
                          {language === "hi" ? "मिले हुए ऑर्डर्स:" : "Found Orders:"}
                        </h4>
                        {orders.map((o) => (
                          <div key={o.id} className={styles.orderCard} style={{ marginBottom: "1rem" }}>
                            <div className={styles.orderHeader}>
                              <div>
                                <span className={styles.orderId}>
                                  {language === "hi" ? "ऑर्डर #" : "Order #"}{o.id}
                                </span>
                                <span className={styles.orderDate}>
                                  {new Date(o.createdAt).toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { dateStyle: "long" })}
                                </span>
                              </div>
                              <span className={`${styles.statusBadge} ${styles.statusPlaced}`}>
                                {getLocalizedStatus(o.orderStatus)}
                              </span>
                            </div>
                            <div className={styles.itemsList}>
                              {o.items.map((item, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                  <span>{item.name} × {item.quantity}</span>
                                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </div>
                            <div className={styles.orderFooter}>
                              <div>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                  {language === "hi" ? "डिलीवरी पता:" : "Delivery to:"}
                                </span>
                                <p style={{ fontSize: "0.875rem" }}>{o.customerName}, {o.city} ({o.pincode})</p>
                              </div>
                              <span className={styles.totalAmount}>₹{o.totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin Access Box */}
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-sm)",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <strong style={{ color: "var(--sapphire)", display: "block" }}>
                  {language === "hi" ? "व्यापारी अथवा एडमिन लॉगिन?" : "Store Owner or Administrator?"}
                </strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  {language === "hi"
                    ? "कैटलॉग, ऑर्डर्स और व्यावसायिक लीड्स प्रबंधित करने के लिए एडमिन पोर्टल पर जाएं।"
                    : "Access the central management portal to manage catalogue items, orders, and inquiries."}
                </p>
              </div>
              <Link href="/admin/login" className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>
                {language === "hi" ? "एडमिन पैनल खोलें →" : "Admin Sign In →"}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
