"use client";

import { useState, useEffect } from "react";
import type { Enquiry } from "@/lib/types";
import styles from "./enquiries.module.css";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

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

  const filtered = enquiries.filter(
    (e) => filterStatus === "all" || e.status === filterStatus
  );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Leads & Customer Inquiries</h1>
          <p className={styles.subTitle}>
            Review inquiries submitted from product pages and contact forms. Track lead resolution pipeline.
          </p>
        </div>

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
                  <th>Date & Time</th>
                  <th>Customer Info</th>
                  <th>Product Requested</th>
                  <th>Qty</th>
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
                  const cleanPhone = enq.mobile.replace(/[^0-9]/g, "");

                  return (
                    <tr key={enq.id}>
                      <td className={styles.dateCell}>{dateStr}</td>
                      <td>
                        <strong className={styles.customerName}>{enq.name}</strong>
                        <span className={styles.contactLine}>{enq.mobile}</span>
                        {enq.email && <span className={styles.emailLine}>{enq.email}</span>}
                      </td>
                      <td>
                        <strong>{enq.productName}</strong>
                      </td>
                      <td>{enq.quantity || "—"}</td>
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
                            )}%2C%20thank%20you%20for%20contacting%20Bhaya%20India%20regarding%20${encodeURIComponent(
                              enq.productName
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
