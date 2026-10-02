"use client";

import { useState, useEffect } from "react";
import type { Order } from "@/lib/types";
import { Phone, MapPin } from "lucide-react";
import styles from "./orders.module.css";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
    orderStatus?: Order["orderStatus"],
    paymentStatus?: Order["paymentStatus"]
  ) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
      }
    } catch (e) {
      console.error("Order update error", e);
    }
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
            Review customer orders, update dispatch timelines (Order Placed &rarr; Processing &rarr; Shipped &rarr; Delivered), and record payment status.
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
                  <th>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className={styles.orderId}>{order.id}</strong>
                        <span className={styles.dateStr}>{dateStr}</span>
                        <span className={styles.methodTag}>{order.paymentMethod}</span>
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <span className={styles.phoneStr} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Phone size={12} />
                          <span>{order.phone}</span>
                        </span>
                        <span className={styles.addressStr} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} />
                          <span>{order.address}, {order.city} ({order.pincode})</span>
                        </span>
                      </td>
                      <td>
                        <div className={styles.itemsList}>
                          {order.items.map((it, idx) => (
                            <div key={idx} className={styles.itemRow}>
                              <span>{it.name} × {it.quantity}</span>
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
                            handleUpdate(order.id, undefined, e.target.value as Order["paymentStatus"])
                          }
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleUpdate(order.id, e.target.value as Order["orderStatus"])
                          }
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
