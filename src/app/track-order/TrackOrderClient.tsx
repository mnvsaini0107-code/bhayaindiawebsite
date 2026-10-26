"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Truck, MessageCircle, ExternalLink } from "lucide-react";
import type { Order } from "@/lib/types";
import styles from "./track-order.module.css";

const STEPS = [
  { id: "placed", label: "Order Placed", minStatus: "Order Placed" },
  { id: "processing", label: "Processing", minStatus: "Processing" },
  { id: "shipped", label: "Shipped", minStatus: "Shipped" },
  { id: "delivered", label: "Delivered", minStatus: "Delivered" },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "Order Placed":
    case "New":
      return 0;
    case "Processing":
      return 1;
    case "Shipped":
      return 2;
    case "Delivered":
    case "Completed":
      return 3;
    default:
      return 0;
  }
}

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const fetchOrder = async (searchId: string, searchPhone: string) => {
    if (!searchId.trim() || !searchPhone.trim()) {
      setError("Please enter both Order ID and registered Phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: searchId.trim(), phone: searchPhone.trim() }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(
          data.error ||
            "No matching order found. Please verify your Order ID and phone number, or contact BHAYA INDIA desk."
        );
      }
    } catch (err) {
      console.error("Order lookup error:", err);
      setError("Network error while connecting to tracking desk. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialPhone) {
      fetchOrder(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, phone);
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <span className={styles.badge}>Live Tracking Desk</span>
        <h1 className={styles.title}>Track Your Consignment</h1>
        <p className={styles.subtitle}>
          Enter your Order ID and 10-digit registered mobile number to view live fulfillment milestones,
          courier carrier details, and real-time delivery status.
        </p>
      </div>

      <div className={styles.lookupCard}>
        <form onSubmit={handleSubmit} className={styles.lookupForm}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Order ID</label>
            <input
              type="text"
              required
              placeholder="e.g. ORD-108273"
              className={styles.input}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Registered Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <Search size={16} />
            <span>{loading ? "Verifying..." : "Track Order"}</span>
          </button>
        </form>

        {error && <div className={styles.alertError}>{error}</div>}
      </div>

      {order && (
        <div className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.orderHeaderLeft}>
              <span className={styles.orderIdBadge}>{order.id}</span>
              <span className={styles.orderDate}>
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
              </span>
            </div>
            <span className={styles.statusTag}>{order.orderStatus}</span>
          </div>

          <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
              {STEPS.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                  <div
                    key={step.id}
                    className={`${styles.stepItem} ${
                      isCompleted ? styles.stepItemCompleted : isActive ? styles.stepItemActive : ""
                    }`}
                  >
                    <div className={styles.stepDot}>
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {order.carrier && (
            <div className={styles.dispatchInfo}>
              <div className={styles.dispatchMeta}>
                <Truck size={20} color="#123456" />
                <div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>
                    Logistics Partner:
                  </span>
                  <span className={styles.carrierName}>{order.carrier}</span>
                  {order.trackingNumber && (
                    <span className={styles.trackingCode}> AWB #{order.trackingNumber}</span>
                  )}
                </div>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trackCarrierBtn}
                >
                  <span>Courier Live Tracking</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          <div className={styles.detailsGrid}>
            <div className={styles.sectionBox}>
              <h4>Consignee & Shipping Destination</h4>
              <p style={{ fontWeight: 700, color: "var(--navy, #123456)", marginBottom: 4 }}>
                {order.customerName}
              </p>
              <p style={{ color: "#4a5568", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {order.address}, {order.city}, {order.state} — {order.pincode}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 6 }}>
                Phone: {order.phone}
              </p>
            </div>

            <div className={styles.sectionBox}>
              <h4>Items in Consignment</h4>
              <div className={styles.itemList}>
                {order.items.map((it, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <span>
                      <span className={styles.itemQty}>{it.quantity}×</span> {it.name}
                    </span>
                    <strong>₹{(it.price * it.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                ))}
                <div className={styles.totalRow}>
                  <span>Total Consignment Value:</span>
                  <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>
                  Payment Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                </div>
              </div>
            </div>
          </div>

          <div className={styles.supportActions}>
            <span style={{ fontSize: "0.85rem", color: "#4a5568" }}>
              Need urgent delivery assistance or bulk rescheduling?
            </span>
            <Link
              href={`https://wa.me/918726690926?text=${encodeURIComponent(
                `Namaskar BHAYA INDIA, tracking query regarding Order ${order.id} (Phone: ${order.phone})`
              )}`}
              target="_blank"
              className={styles.supportBtn}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Priority Support</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
