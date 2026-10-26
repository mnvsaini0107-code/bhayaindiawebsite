"use client";

import { useState, useEffect } from "react";
import type { ExtendedSiteSettings } from "@/lib/types";
import {
  Building,
  Globe,
  BarChart3,
  Mail,
  Share2,
  Languages,
  ShoppingBag,
  Shield,
  Save,
} from "lucide-react";
import styles from "./settings.module.css";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "seo" | "analytics" | "smtp" | "social" | "localization" | "commerce" | "security"
  >("general");
  const [settings, setSettings] = useState<ExtendedSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof ExtendedSiteSettings, val: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: val });
  };

  const handleSocialChange = (key: keyof ExtendedSiteSettings["socialLinks"], val: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      socialLinks: { ...settings.socialLinks, [key]: val },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setNotice("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setNotice("Platform settings saved successfully!");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save settings error:", err);
      setNotice("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p style={{ color: "#64748b", padding: "2rem" }}>Loading platform settings...</p>;
  }

  const tabs = [
    { id: "general", label: "General & Brand", icon: Building },
    { id: "seo", label: "Global SEO", icon: Globe },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "smtp", label: "SMTP Mail", icon: Mail },
    { id: "social", label: "Social", icon: Share2 },
    { id: "localization", label: "Localization", icon: Languages },
    { id: "commerce", label: "Commerce", icon: ShoppingBag },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Global Platform Settings</h1>
          <p className={styles.subTitle}>
            Configure corporate brand identity, helpline channels, localization, SMTP mail, commerce rules, and security controls.
          </p>
        </div>
        <button
          type="submit"
          form="global-settings-form"
          disabled={saving}
          className={styles.saveBtnTop}
          style={{
            background: "var(--navy)",
            color: "#ffffff",
            padding: "9px 20px",
            borderRadius: "6px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            border: "1px solid var(--gold)",
            cursor: "pointer",
          }}
        >
          <Save size={16} />
          <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
        </button>
      </div>

      {notice && <div className={styles.successBanner}>{notice}</div>}

      {/* Tabs Bar */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "0.75rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: isActive ? "var(--navy)" : "#64748b",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form id="global-settings-form" onSubmit={handleSubmit} className={styles.formGrid}>
        {/* TAB 1: GENERAL & BRAND */}
        {activeTab === "general" && (
          <>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>1. Brand Identity</h2>
              <div className={styles.field}>
                <label className={styles.label}>Brand Legal Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Official Tagline (Motto)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Brand Logo Path</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.logo || "/assets/bhaya-india-logo.png"}
                  onChange={(e) => handleChange("logo", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Favicon Path</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.favicon || "/favicon.ico"}
                  onChange={(e) => handleChange("favicon", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>2. Contact Helpline & Location</h2>
              <div className={styles.field}>
                <label className={styles.label}>Customer Helpline Phone</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Official WhatsApp Number (With country code)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contact Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Business Hours</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.businessHours}
                  onChange={(e) => handleChange("businessHours", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Official Business Address</label>
                <textarea
                  className={styles.textarea}
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: GLOBAL SEO */}
        {activeTab === "seo" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Global SEO Management</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Global search metadata, default social share images, and verification codes are centrally managed in the SEO Control Center.
            </p>
            <a
              href="/admin/seo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--navy)",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.85rem",
              }}
            >
              <Globe size={16} />
              <span>Open SEO Control Center →</span>
            </a>
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Analytics & Measurement</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Manage Google Analytics 4 Measurement IDs and privacy consent controls in the dedicated Analytics Center.
            </p>
            <a
              href="/admin/analytics"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "var(--navy)",
                color: "#ffffff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.85rem",
              }}
            >
              <BarChart3 size={16} />
              <span>Open Analytics Center →</span>
            </a>
          </div>
        )}

        {/* TAB 4: SMTP MAIL */}
        {activeTab === "smtp" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>SMTP Mail Server Configuration</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Credentials used for sending order confirmation emails and B2B inquiry notifications.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>SMTP Host</label>
                <input
                  type="text"
                  placeholder="e.g. smtp.gmail.com or mail.bhayaindia.com"
                  className={styles.input}
                  value={settings.smtpHost || ""}
                  onChange={(e) => handleChange("smtpHost", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>SMTP Port</label>
                <input
                  type="text"
                  placeholder="587 or 465"
                  className={styles.input}
                  value={settings.smtpPort || "587"}
                  onChange={(e) => handleChange("smtpPort", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>SMTP Username / Account</label>
                <input
                  type="text"
                  placeholder="notifications@bhayaindia.com"
                  className={styles.input}
                  value={settings.smtpUser || ""}
                  onChange={(e) => handleChange("smtpUser", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sender From Address</label>
                <input
                  type="text"
                  placeholder="BHAYA INDIA <orders@bhayaindia.com>"
                  className={styles.input}
                  value={settings.smtpSenderEmail || ""}
                  onChange={(e) => handleChange("smtpSenderEmail", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL */}
        {activeTab === "social" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Official Social Profiles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Instagram Profile URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleSocialChange("instagram", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Facebook Page URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>YouTube Channel URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.socialLinks.youtube}
                  onChange={(e) => handleSocialChange("youtube", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>LinkedIn Corporate URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: LOCALIZATION */}
        {activeTab === "localization" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Localization & Language Preferences</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Primary Supported Languages</label>
                <input type="text" className={styles.input} value="English (en-IN), हिन्दी (hi-IN)" readOnly />
                <span className={styles.hint}>Scalable dictionary architecture ready for Bengali, Marathi, Gujarati, etc.</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Currency Unit</label>
                <input type="text" className={styles.input} value="INR (₹) — Indian Rupee" readOnly />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COMMERCE */}
        {activeTab === "commerce" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Commerce Rules & Compliance</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Tax / GST Identification Number</label>
                <input
                  type="text"
                  placeholder="e.g. 24AAAAA0000A1Z5"
                  className={styles.input}
                  value={settings.taxGst || ""}
                  onChange={(e) => handleChange("taxGst", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Minimum Order Value (INR)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.minimumOrderValue || 0}
                  onChange={(e) => handleChange("minimumOrderValue", Number(e.target.value))}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Shipping & Delivery Terms</label>
                <textarea
                  className={styles.textarea}
                  value={settings.shippingNotes || ""}
                  onChange={(e) => handleChange("shippingNotes", e.target.value)}
                  placeholder="Standard nationwide delivery timeline: 4–7 business days. Express dispatch available for corporate hampers."
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SECURITY */}
        {activeTab === "security" && (
          <div className={styles.card} style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.cardTitle}>Platform Security & Access</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.field}>
                <label className={styles.label}>Admin Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={settings.sessionTimeoutMinutes || 60}
                  onChange={(e) => handleChange("sessionTimeoutMinutes", Number(e.target.value))}
                  style={{ maxWidth: "200px" }}
                />
              </div>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px", fontSize: "0.85rem", color: "#475569" }}>
                <strong>Server-Side Secret Hygiene:</strong>
                <p style={{ margin: "0.25rem 0 0" }}>
                  All Shopify Admin API tokens, Storefront tokens, and administrative credentials remain strictly inside server-side environment variables (.env.local). No private credentials leak into client bundles.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
