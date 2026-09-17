"use client";

import { useState, useEffect } from "react";
import type { Enquiry } from "@/lib/types";
import styles from "./enquiries.module.css";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetch("/api/enquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEnquiries(data.enquiries);
      })
      .catch((err) => console.error("Fetch enquiries error", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: Enquiry["status"]) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err) {
      console.error("Update status error", err);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const matchType = filterType === "all" || (e.type || "general") === filterType;
    return matchStatus && matchType;
  });

  const enquiryTypes = [
    { label: "All Types", value: "all" },
    { label: "Wholesale (B2B)", value: "wholesale" },
    { label: "Seller Onboarding", value: "seller" },
    { label: "Manufacturer", value: "manufacturer" },
    { label: "Product Inquiries", value: "product" },
    { label: "General", value: "general" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Leads & Customer Inquiries</h1>
          <p className={styles.subTitle}>
            Review B2B wholesale requests, seller applications, factory submissions, and product inquiries.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
          {/* Status filter */}
          <div className={styles.filterPills}>
            {["all", "New", "In Progress", "Closed"].map((st) => (
              <button
                key={st}
                className={`${styles.pill} ${filterStatus === st ? styles.pillActive : ""}`}
                onClick={() => setFilterStatus(st)}
              >
                {st === "all" ? `All (${enquiries.length})` : st}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {enquiryTypes.map((t) => (
              <button
                key={t.value}
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-medium)",
                  background: filterType === t.value ? "var(--sapphire)" : "white",
                  color: filterType === t.value ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
                onClick={() => setFilterType(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p className={styles.loading}>Loading leads...</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No leads found under this filter.</p>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date & Type</th>
                  <th>Customer & Business</th>
                  <th>Product / Category</th>
                  <th>Qty / Location</th>
                  <th>Message / Scope</th>
                  <th>Lead Status</th>
                  <th>Direct Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enq) => {
                  const dateStr = new Date(enq.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });
                  const cleanPhone = (enq.mobile || "").replace(/[^0-9]/g, "");
                  const badgeColor =
                    enq.type === "wholesale"
                      ? "#854d0e"
                      : enq.type === "seller"
                      ? "#1e40af"
                      : enq.type === "manufacturer"
                      ? "#15803d"
                      : "#475569";
                  const badgeBg =
                    enq.type === "wholesale"
                      ? "#fef9c3"
                      : enq.type === "seller"
                      ? "#dbeafe"
                      : enq.type === "manufacturer"
                      ? "#dcfce7"
                      : "#f1f5f9";

                  return (
                    <tr key={enq.id}>
                      <td className={styles.dateCell}>
                        <span>{dateStr}</span>
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: "6px",
                            padding: "2px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            borderRadius: "10px",
                            color: badgeColor,
                            background: badgeBg,
                            textTransform: "capitalize",
                          }}
                        >
                          {enq.type || "General"}
                        </span>
                      </td>
                      <td>
                        <strong className={styles.customerName}>{enq.name}</strong>
                        {enq.businessName && (
                          <span style={{ fontSize: "12px", color: "var(--sapphire)", display: "block", fontWeight: 600 }}>
                            🏢 {enq.businessName}
                          </span>
                        )}
                        <span className={styles.contactLine}>📱 {enq.mobile}</span>
                        {enq.email && <span className={styles.emailLine}>✉️ {enq.email}</span>}
                      </td>
                      <td>
                        <strong>{enq.productName || "General / Catalogue"}</strong>
                      </td>
                      <td>
                        <div>
                          <span>{enq.quantity ? `Qty: ${enq.quantity}` : "—"}</span>
                          {enq.city && (
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                              📍 {enq.city}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.messageCell}>
                        <p>{enq.message}</p>
                      </td>
                      <td>
                        <select
                          className={`${styles.statusSelect} ${
                            enq.status === "New"
                              ? styles.selectNew
                              : enq.status === "In Progress"
                              ? styles.selectProgress
                              : styles.selectClosed
                          }`}
                          value={enq.status}
                          onChange={(e) =>
                            handleStatusChange(enq.id, e.target.value as Enquiry["status"])
                          }
                        >
                          <option value="New">New Lead</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed / Converted</option>
                        </select>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                              enq.name
                            )}%2C%20thank%20you%20for%20contacting%20BHAYA%20INDIA%20regarding%20${encodeURIComponent(
                              enq.productName || "your enquiry"
                            )}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.waBtn}
                            title="Chat on WhatsApp"
                          >
                            💬 WhatsApp
                          </a>
                          <a
                            href={`tel:${enq.mobile}`}
                            className={styles.callBtn}
                            title="Call customer"
                          >
                            📞 Call
                          </a>
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
    </div>
  );
}
