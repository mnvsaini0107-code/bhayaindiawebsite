"use client";

import { useState, useEffect } from "react";
import type { Testimonial } from "@/lib/types";
import styles from "./testimonials.module.css";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (e) {
      console.error("Fetch reviews error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTestimonials(data.testimonials);
      })
      .catch((e) => console.error("Fetch reviews error", e))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setCustomerName("");
    setRole("");
    setCompany("");
    setReview("");
    setRating(5);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingItem(t);
    setCustomerName(t.customerName);
    setRole(t.role);
    setCompany(t.company);
    setReview(t.review);
    setRating(t.rating);
    setIsPublished(t.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { customerName, role, company, review, rating, isPublished };

    try {
      if (editingItem) {
        const res = await fetch(`/api/testimonials/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchReviews();
        }
      } else {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchReviews();
        }
      }
    } catch (err) {
      console.error("Save review error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchReviews();
    } catch (e) {
      console.error("Delete review error", e);
    }
  };

  const togglePublish = async (t: Testimonial) => {
    try {
      await fetch(`/api/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      });
      fetchReviews();
    } catch (e) {
      console.error("Toggle publish error", e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Customer Testimonials & Reviews</h1>
          <p className={styles.subTitle}>
            Manage verified client reviews displayed on homepage and testimonials section.
          </p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>
          + Add Testimonial
        </button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p className={styles.loading}>Loading testimonials...</p>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.ratingStars}>
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </div>
              <p className={styles.reviewText}>&ldquo;{t.review}&rdquo;</p>
              <div className={styles.authorMeta}>
                <strong>{t.customerName}</strong>
                <span>{t.role} · {t.company}</span>
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => togglePublish(t)}
                  className={`${styles.statusBtn} ${t.isPublished ? styles.pub : styles.unpub}`}
                >
                  {t.isPublished ? "Live on Site" : "Hidden / Draft"}
                </button>
                <button onClick={() => openEdit(t)} className={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingItem ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Customer Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Rameshwar Kulkarni"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Role / Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Director of Procurement"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company / Location</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Kulkarni Retail, Pune"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Star Rating (1 to 5)</label>
                <select
                  className={styles.select}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Customer Review Statement *</label>
                <textarea
                  rows={4}
                  required
                  className={styles.textarea}
                  placeholder="Review text..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
