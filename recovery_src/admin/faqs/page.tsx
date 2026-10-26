"use client";

import { useState, useEffect } from "react";
import type { FAQ } from "@/lib/types";
import { X } from "lucide-react";
import styles from "./faqs.module.css";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<FAQ["category"]>("Product");
  const [sortOrder, setSortOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) setFaqs(data.faqs);
    } catch (e) {
      console.error("Fetch faqs error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFaqs(data.faqs);
      })
      .catch((e) => console.error("Fetch faqs error", e))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("Product");
    setSortOrder(faqs.length + 1);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEdit = (f: FAQ) => {
    setEditingFaq(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setSortOrder(f.sortOrder || 1);
    setIsPublished(f.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { question, answer, category, sortOrder, isPublished };

    try {
      if (editingFaq) {
        const res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchFaqs();
        }
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchFaqs();
        }
      }
    } catch (err) {
      console.error("Save faq error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFaqs();
    } catch (e) {
      console.error("Delete faq error", e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>FAQ & Customer Knowledge Base</h1>
          <p className={styles.subTitle}>
            Edit questions and answers shown in accordion sections on the FAQ page and product detail pages.
          </p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>
          + Add FAQ Question
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.loading}>Loading FAQs...</p>
        ) : (
          faqs.map((f) => (
            <div key={f.id} className={styles.faqCard}>
              <div className={styles.cardHeader}>
                <span className={styles.catBadge}>{f.category}</span>
                <span className={styles.orderBadge}>Order: {f.sortOrder}</span>
              </div>
              <h3 className={styles.questionText}>{f.question}</h3>
              <p className={styles.answerText}>{f.answer}</p>
              <div className={styles.cardActions}>
                <span className={`${styles.statusDot} ${f.isPublished ? styles.pubDot : styles.unpubDot}`} />
                <span className={styles.statusText}>{f.isPublished ? "Live" : "Draft"}</span>
                <div className={styles.btnGroup}>
                  <button onClick={() => openEdit(f)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(f.id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingFaq ? "Edit FAQ" : "Add FAQ Question"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FAQ["category"])}
                  >
                    <option value="Product">Product Questions</option>
                    <option value="Service">Service & Bulk Sourcing</option>
                    <option value="Payment">Payment & Invoicing</option>
                    <option value="Delivery">Delivery & Logistics</option>
                    <option value="General">General Business</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sort Order Priority</label>
                  <input
                    type="number"
                    min="1"
                    className={styles.input}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Question *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Do you deliver to all pincodes in India?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Answer *</label>
                <textarea
                  rows={4}
                  required
                  className={styles.textarea}
                  placeholder="Comprehensive answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <span>Publish immediately to FAQ page</span>
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
