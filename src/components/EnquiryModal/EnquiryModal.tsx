"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./EnquiryModal.module.css";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId?: string;
}

const WHATSAPP_NUMBER = "919876543210";

export default function EnquiryModal({
  isOpen,
  onClose,
  productName = "General Product Inquiry",
  productId,
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    quantity: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    setSuccess(false);
    setError("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          productName: productName,
          productId: productId,
          quantity: formData.quantity ? parseInt(formData.quantity, 10) : undefined,
          message: formData.message || `Inquiry regarding ${productName}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hello Bhaya India, I would like to enquire regarding "${productName}". My name is ${formData.name || "a prospective client"}.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div className={styles.overlay} onClick={handleClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <span className="eyebrow eyebrow--gold">
            <span className="eyebrow-line" />
            Direct Concierge Desk
          </span>
          <h2 className={styles.title}>Commercial & Product Inquiry</h2>
          <p className={styles.subtitle}>
            Connect directly with Bhaya India&rsquo;s client desk for bespoke orders, bulk allocations, and certified catalogue pieces.
          </p>
          {productName && (
            <div className={styles.productBadge}>
              <span className={styles.badgeLabel}>Subject / Piece:</span>
              <strong className={styles.badgeValue}>{productName}</strong>
            </div>
          )}
        </div>

        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>Enquiry Received Successfully</h3>
            <p className={styles.successDesc}>
              Thank you, <strong>{formData.name}</strong>. Our client relationship manager will review your request and connect via phone/email shortly.
            </p>
            <div className={styles.successActions}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-secondary ${styles.whatsappContinue}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                </svg>
                Continue via WhatsApp Desk
              </a>
              <button onClick={handleClose} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="enquiry-name">
                  Full Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Vikramaditya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="enquiry-mobile">
                  Mobile Phone <span className={styles.required}>*</span>
                </label>
                <input
                  id="enquiry-mobile"
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="enquiry-email">
                  Email Address
                </label>
                <input
                  id="enquiry-email"
                  type="email"
                  className={styles.input}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="enquiry-qty">
                  Approx. Quantity / Volume
                </label>
                <input
                  id="enquiry-qty"
                  type="number"
                  min="1"
                  className={styles.input}
                  placeholder="e.g. 1, 50, 500 units"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="enquiry-message">
                Specific Specifications or Requirements
              </label>
              <textarea
                id="enquiry-message"
                rows={3}
                className={styles.textarea}
                placeholder="Share material preferences, custom monogramming, delivery timelines, or target pricing..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className={styles.footerRow}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappSubtleLink}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                </svg>
                Chat on WhatsApp instead
              </a>

              <div className={styles.btnRow}>
                <button type="button" onClick={handleClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? "Registering..." : "Submit Enquiry"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
