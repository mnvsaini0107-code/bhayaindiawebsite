"use client";

import { useState, useEffect } from "react";
import type { SiteSettings } from "@/lib/types";
import styles from "./settings.module.css";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof SiteSettings, val: SiteSettings[keyof SiteSettings]) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: val });
  };

  const handleSocialChange = (key: keyof SiteSettings["socialLinks"], val: string) => {
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
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Business settings updated successfully!");
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (err) {
      console.error("Save settings error", err);
      setMessage("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <p className={styles.loading}>Loading business settings...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Business Contact & Location Settings</h1>
          <p className={styles.subTitle}>
            Configure core identity, official phone numbers, WhatsApp contact link, physical address, and social links.
          </p>
        </div>
        <button type="submit" form="settings-form" disabled={saving} className={styles.saveBtnTop}>
          {saving ? "Saving Changes..." : "Save Settings →"}
        </button>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}

      <form id="settings-form" onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Identity */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>1. Brand & Tagline</h2>
          <div className={styles.field}>
            <label className={styles.label}>Business Legal Name</label>
            <input
              type="text"
              className={styles.input}
              value={settings.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Official Tagline</label>
            <input
              type="text"
              className={styles.input}
              value={settings.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
            />
          </div>
        </div>

        {/* Contact Numbers */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>2. Phone & WhatsApp Links</h2>
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
            <label className={styles.label}>Official WhatsApp Number (Country code + number, e.g. 919876543210)</label>
            <input
              type="text"
              className={styles.input}
              value={settings.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
            />
            <span className={styles.hint}>Used dynamically on all product enquiry buttons</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Official Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        {/* Address & Operating Hours */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>3. Physical Office & Operating Hours</h2>
          <div className={styles.field}>
            <label className={styles.label}>Business Street Address</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Business Working Hours</label>
            <input
              type="text"
              className={styles.input}
              value={settings.businessHours}
              onChange={(e) => handleChange("businessHours", e.target.value)}
            />
          </div>
        </div>

        {/* Social Media */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>4. Official Social Media Channels</h2>
          <div className={styles.field}>
            <label className={styles.label}>Instagram URL</label>
            <input
              type="text"
              className={styles.input}
              value={settings.socialLinks.instagram}
              onChange={(e) => handleSocialChange("instagram", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Facebook URL</label>
            <input
              type="text"
              className={styles.input}
              value={settings.socialLinks.facebook}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>YouTube URL</label>
            <input
              type="text"
              className={styles.input}
              value={settings.socialLinks.youtube}
              onChange={(e) => handleSocialChange("youtube", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>LinkedIn URL</label>
            <input
              type="text"
              className={styles.input}
              value={settings.socialLinks.linkedin}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
