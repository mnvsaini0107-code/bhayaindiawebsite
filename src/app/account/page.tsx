"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./account.module.css";
import type { Order } from "@/lib/types";

export default function AccountPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        const clean = phone.replace(/[^0-9]/g, "");
        const matched = data.orders.filter(
          (o: Order) =>
            o.phone.replace(/[^0-9]/g, "").includes(clean) ||
            o.id.toLowerCase() === phone.trim().toLowerCase()
        );
        setOrders(matched);
      }
    } catch (e) {
      console.error("Order lookup error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Client Account</span>
            </div>
            <h1 className={styles.title}>Customer Account & Order Tracking</h1>
            <p className={styles.subtitle}>
              Track recent order dispatches, download invoices, or connect with your personal client concierge.
            </p>
          </div>
        </div>

        <div className="container">
          <div className={styles.layout}>
            <div className={styles.lookupCard}>
              <h2 className={styles.cardHeading}>Look Up Your Orders</h2>
              <p className={styles.cardDesc}>
                Enter your registered mobile number or Order ID (e.g. ORD-9012) to view dispatch status.
              </p>

              <form onSubmit={handleLookup} className={styles.form}>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Enter 10-digit mobile or Order ID..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Searching..." : "Track Orders →"}
                </button>
              </form>
            </div>

            {searched && (
              <div className={styles.resultsArea}>
                <h3 className={styles.resultsHeading}>
                  Order History for &ldquo;{phone}&rdquo; ({orders.length} found)
                </h3>

                {orders.length === 0 ? (
                  <div className={styles.noOrders}>
                    <p>No active orders found matching this phone number or ID.</p>
                    <span>Need help? Contact our support team on WhatsApp.</span>
                  </div>
                ) : (
                  <div className={styles.orderCardsList}>
                    {orders.map((o) => (
                      <div key={o.id} className={styles.orderCard}>
                        <div className={styles.orderTop}>
                          <div>
                            <strong>Order #{o.id}</strong>
                            <span className={styles.orderDate}>
                              Placed on {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                            </span>
                          </div>
                          <span className={`${styles.statusBadge} ${styles.statusProcessing}`}>
                            {o.orderStatus}
                          </span>
                        </div>

                        <div className={styles.itemsBlock}>
                          {o.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                              <span>{item.name} × {item.quantity}</span>
                              <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                            </div>
                          ))}
                        </div>

                        <div className={styles.orderBottom}>
                          <div>
                            <span>Delivery To:</span>
                            <p>{o.customerName}, {o.city} ({o.pincode})</p>
                          </div>
                          <div className={styles.totalBlock}>
                            <span>Total Paid:</span>
                            <strong>₹{o.totalAmount.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.adminAccessBox}>
              <div>
                <strong>Store Owner or Administrator?</strong>
                <p>Access the central CMS to manage catalogue items, prices, and leads.</p>
              </div>
              <Link href="/admin/login" className={styles.adminBtn}>
                Sign In to Admin Panel →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
