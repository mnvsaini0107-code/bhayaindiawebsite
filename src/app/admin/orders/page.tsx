"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/lib/types";
import { Phone, MapPin, Truck, ExternalLink, MessageCircle, X } from "lucide-react";
import styles from "./orders.module.css";

const CARRIERS = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "India Post",
  "Trackon",
  "Shadowfax",
  "Ecom Express",
  "Self / Local Delivery",
  "Other",
];

function getCarrierDefaultUrl(carrier: string, trackingNumber: string): string {
  const cleanAwb = trackingNumber.trim();
  switch (carrier) {
    case "Delhivery":
      return cleanAwb ? `https://www.delhivery.com/track/package/${cleanAwb}` : "https://www.delhivery.com/tracking";
    case "Blue Dart":
      return "https://www.bluedart.com/tracking";
    case "DTDC":
      return "https://www.dtdc.in/tracking.asp";
    case "India Post":
      return "https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx";
    case "Trackon":
      return "https://trackon.in/";
    case "Shadowfax":
      return "https://tracker.shadowfax.in/";
    case "Ecom Express":
      return cleanAwb ? `https://ecomexpress.in/tracking/?awb_number=${cleanAwb}` : "https://ecomexpress.in/";
    default:
      return "";
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Modal editing state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [modalCarrier, setModalCarrier] = useState("");
  const [modalTrackingNumber, setModalTrackingNumber] = useState("");
  const [modalTrackingUrl, setModalTrackingUrl] = useState("");
  const [modalOrderStatus, setModalOrderStatus] = useState<Order["orderStatus"]>("Order Placed");
  const [modalInternalNotes, setModalInternalNotes] = useState("");
  const [savingDispatch, setSavingDispatch] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.orders);
      })
      .catch((e) => console.error("Fetch orders error", e))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (
    id: string,
    updates: {
      orderStatus?: Order["orderStatus"];
      paymentStatus?: Order["paymentStatus"];
      carrier?: string;
      trackingNumber?: string;
      trackingUrl?: string;
      internalNotes?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
        return data.order;
      }
    } catch (e) {
      console.error("Order update error", e);
    }
    return null;
  };

  const openDispatchModal = (order: Order) => {
    setEditingOrder(order);
    setModalCarrier(order.carrier || "Delhivery");
    setModalTrackingNumber(order.trackingNumber || "");
    setModalTrackingUrl(order.trackingUrl || getCarrierDefaultUrl(order.carrier || "Delhivery", order.trackingNumber || ""));
    setModalOrderStatus(order.orderStatus || "Processing");
    setModalInternalNotes(order.internalNotes || "");
  };

  const handleCarrierChange = (newCarrier: string) => {
    setModalCarrier(newCarrier);
    if (!modalTrackingUrl || modalTrackingUrl.includes("track")) {
      setModalTrackingUrl(getCarrierDefaultUrl(newCarrier, modalTrackingNumber));
    }
  };

  const handleSaveDispatch = async () => {
    if (!editingOrder) return;
    setSavingDispatch(true);
    await handleUpdate(editingOrder.id, {
      carrier: modalCarrier,
      trackingNumber: modalTrackingNumber,
      trackingUrl: modalTrackingUrl,
      orderStatus: modalOrderStatus,
      internalNotes: modalInternalNotes,
    });
    setSavingDispatch(false);
    setEditingOrder(null);
  };

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    return o.orderStatus === filter;
  });

  const stages: Order["orderStatus"][] = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Orders & Fulfillment Management</h1>
          <p className={styles.subTitle}>
            Standalone Order Control: Review customer orders, update dispatch timelines (Order Placed &rarr; Processing &rarr; Shipped &rarr; Delivered), assign courier carriers, record AWB tracking, and notify customers.
          </p>
        </div>

        <div className={styles.filterPills}>
          {["all", ...stages].map((st) => (
            <button
              key={st}
              className={`${styles.pill} ${filter === st ? styles.pillActive : ""}`}
              onClick={() => setFilter(st)}
            >
              {st === "all" ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p className={styles.loading}>Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No orders found under this filter.</p>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order Details</th>
                  <th>Customer & Shipping</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Fulfillment & Dispatch</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  const cleanPhone = (order.phone || "").replace(/[^0-9]/g, "");
                  const whatsappPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                  const trackingLink = `https://bhayaindia.com/track-order?orderId=${encodeURIComponent(order.id)}`;
                  const waText = encodeURIComponent(
                    `Namaste ${order.customerName},\nYour BHAYA INDIA order #${order.id} is currently: *${order.orderStatus}*.\n` +
                    (order.carrier ? `Courier: ${order.carrier}\n` : "") +
                    (order.trackingNumber ? `Tracking / AWB: ${order.trackingNumber}\n` : "") +
                    `\nYou can track live status anytime here:\n${trackingLink}\n\nThank you for choosing BHAYA INDIA!`
                  );

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className={styles.orderId}>{order.id}</strong>
                        <span className={styles.dateStr}>{dateStr}</span>
                        <span className={styles.methodTag}>{order.paymentMethod || "COD"}</span>
                        {order.orderType && (
                          <span className={styles.methodTag} style={{ marginLeft: "4px" }}>
                            {order.orderType}
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <span className={styles.phoneStr}>
                          <Phone size={12} />
                          <span>{order.phone}</span>
                        </span>
                        <span className={styles.addressStr}>
                          <MapPin size={12} style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>
                            {order.address}, {order.city} {order.pincode ? `(${order.pincode})` : ""}
                          </span>
                        </span>
                        {cleanPhone.length >= 10 && (
                          <a
                            href={`https://wa.me/${whatsappPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.whatsappNotifyBtn}
                            title="Send status update to customer on WhatsApp"
                          >
                            <MessageCircle size={11} />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}
                      </td>
                      <td>
                        <div className={styles.itemsList}>
                          {order.items.map((it, idx) => (
                            <div key={idx} className={styles.itemRow}>
                              <span>
                                {it.name} × {it.quantity}
                              </span>
                              <strong>₹{(it.price * it.quantity).toLocaleString("en-IN")}</strong>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className={styles.amount}>
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </strong>
                      </td>
                      <td>
                        <select
                          className={`${styles.badgeSelect} ${
                            order.paymentStatus === "Paid"
                              ? styles.paid
                              : order.paymentStatus === "Pending"
                              ? styles.pending
                              : styles.failed
                          }`}
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handleUpdate(order.id, {
                              paymentStatus: e.target.value as Order["paymentStatus"],
                            })
                          }
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <div className={styles.trackingCell}>
                          <select
                            className={styles.statusSelect}
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleUpdate(order.id, {
                                orderStatus: e.target.value as Order["orderStatus"],
                              })
                            }
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {order.carrier && (
                            <div className={styles.carrierBadge}>
                              <Truck size={12} />
                              <span>{order.carrier}</span>
                            </div>
                          )}

                          {order.trackingNumber && (
                            <div style={{ fontSize: "0.74rem", color: "#334155" }}>
                              AWB: <strong>{order.trackingNumber}</strong>
                            </div>
                          )}

                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.trackingLink}
                            >
                              <span>Track AWB</span>
                              <ExternalLink size={10} />
                            </a>
                          )}

                          <button
                            type="button"
                            className={styles.manageDispatchBtn}
                            onClick={() => openDispatchModal(order)}
                          >
                            <Truck size={12} />
                            <span>{order.carrier ? "Edit Carrier & AWB" : "Assign Courier / AWB"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DISPATCH / TRACKING MODAL */}
      {editingOrder && (
        <div className={styles.modalBackdrop} onClick={() => setEditingOrder(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Dispatch & Tracking: Order #{editingOrder.id}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setEditingOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Fulfillment Stage</label>
                <select
                  className={styles.formSelect}
                  value={modalOrderStatus}
                  onChange={(e) => setModalOrderStatus(e.target.value as Order["orderStatus"])}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Courier / Carrier Partner</label>
                <select
                  className={styles.formSelect}
                  value={modalCarrier}
                  onChange={(e) => handleCarrierChange(e.target.value)}
                >
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tracking / AWB Number</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. 143289045763 or DTDC8902"
                  value={modalTrackingNumber}
                  onChange={(e) => {
                    const num = e.target.value;
                    setModalTrackingNumber(num);
                    if (modalCarrier) {
                      setModalTrackingUrl(getCarrierDefaultUrl(modalCarrier, num));
                    }
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Courier Tracking URL</label>
                <input
                  type="url"
                  className={styles.formInput}
                  placeholder="https://..."
                  value={modalTrackingUrl}
                  onChange={(e) => setModalTrackingUrl(e.target.value)}
                />
                <span className={styles.formHelp}>
                  Customers clicking &quot;Track Package&quot; in the order tracker will be directed to this URL.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Internal Dispatch Notes</label>
                <textarea
                  className={styles.formTextarea}
                  rows={2}
                  placeholder="e.g. Dispatched via morning Delhivery surface batch, securely bubble-wrapped."
                  value={modalInternalNotes}
                  onChange={(e) => setModalInternalNotes(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                disabled={savingDispatch}
                onClick={handleSaveDispatch}
              >
                {savingDispatch ? "Saving..." : "Save Tracking Info"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
