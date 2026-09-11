"use client";

import { useState, useEffect } from "react";
import type { PageContent } from "@/lib/types";
import styles from "./content.module.css";

export default function AdminContentPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setContent(d.content);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHeroChange = (field: keyof PageContent["hero"], val: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: { ...content.hero, [field]: val },
    });
  };

  const handleStoryChange = (field: keyof PageContent["brandStory"], val: PageContent["brandStory"][keyof PageContent["brandStory"]]) => {
    if (!content) return;
    setContent({
      ...content,
      brandStory: { ...content.brandStory, [field]: val },
    });
  };

  const handleSellerChange = (field: keyof PageContent["sellerCta"], val: string) => {
    if (!content) return;
    setContent({
      ...content,
      sellerCta: { ...content.sellerCta, [field]: val },
    });
  };

  const handleBhaya2Change = (field: keyof PageContent["bhaya2"], val: string) => {
    if (!content) return;
    setContent({
      ...content,
      bhaya2: { ...content.bhaya2, [field]: val },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Homepage content updated successfully! Public homepage will reflect these updates.");
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (err) {
      console.error("Save content error", err);
      setMessage("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return <p className={styles.loading}>Loading homepage CMS content...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Homepage & Editorial Content CMS</h1>
          <p className={styles.subTitle}>
            Edit hero headlines, brand story narrative, value proposition points, and partner calls-to-action.
          </p>
        </div>
        <button type="submit" form="content-form" disabled={saving} className={styles.saveBtnTop}>
          {saving ? "Saving CMS..." : "Publish Website Content →"}
        </button>
      </div>

      {message && <div className={styles.successBanner}>{message}</div>}

      <form id="content-form" onSubmit={handleSave} className={styles.formLayout}>
        {/* Section 1: Hero */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>1. Hero Banner Content</h2>
          <div className={styles.field}>
            <label className={styles.label}>Eyebrow Label (Small top tag)</label>
            <input
              type="text"
              className={styles.input}
              value={content.hero.eyebrow}
              onChange={(e) => handleHeroChange("eyebrow", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Primary Headline</label>
            <input
              type="text"
              className={styles.input}
              value={content.hero.headline}
              onChange={(e) => handleHeroChange("headline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Supporting Subheadline / Paragraph</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={content.hero.subheadline}
              onChange={(e) => handleHeroChange("subheadline", e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Primary CTA Button Text</label>
              <input
                type="text"
                className={styles.input}
                value={content.hero.ctaPrimaryText}
                onChange={(e) => handleHeroChange("ctaPrimaryText", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Secondary CTA Button Text</label>
              <input
                type="text"
                className={styles.input}
                value={content.hero.ctaSecondaryText}
                onChange={(e) => handleHeroChange("ctaSecondaryText", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Local to Online Brand Story */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>2. Local to Online Storytelling Section</h2>
          <div className={styles.field}>
            <label className={styles.label}>Story Section Eyebrow</label>
            <input
              type="text"
              className={styles.input}
              value={content.brandStory.eyebrow}
              onChange={(e) => handleStoryChange("eyebrow", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Story Headline</label>
            <input
              type="text"
              className={styles.input}
              value={content.brandStory.headline}
              onChange={(e) => handleStoryChange("headline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Paragraph 1 (Origins & Values)</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={content.brandStory.paragraph1}
              onChange={(e) => handleStoryChange("paragraph1", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Paragraph 2 (Digital Growth & Pan-India Reach)</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={content.brandStory.paragraph2}
              onChange={(e) => handleStoryChange("paragraph2", e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Become a Seller / Business Partner */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>3. Become a Seller / Business Partner Section</h2>
          <div className={styles.field}>
            <label className={styles.label}>Partner Headline</label>
            <input
              type="text"
              className={styles.input}
              value={content.sellerCta.headline}
              onChange={(e) => handleSellerChange("headline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Short Description for Sellers / Manufacturers</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={content.sellerCta.body}
              onChange={(e) => handleSellerChange("body", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Partner CTA Button Label</label>
            <input
              type="text"
              className={styles.input}
              value={content.sellerCta.ctaText}
              onChange={(e) => handleSellerChange("ctaText", e.target.value)}
            />
          </div>
        </div>

        {/* Section 4: Bhaya India 2.0 Future Vision */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>4. Bhaya India 2.0 Vision Section</h2>
          <div className={styles.field}>
            <label className={styles.label}>2.0 Vision Headline</label>
            <input
              type="text"
              className={styles.input}
              value={content.bhaya2.headline}
              onChange={(e) => handleBhaya2Change("headline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Subheadline</label>
            <input
              type="text"
              className={styles.input}
              value={content.bhaya2.subheadline}
              onChange={(e) => handleBhaya2Change("subheadline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Body Copy / Marketplace Vision</label>
            <textarea
              rows={3}
              className={styles.textarea}
              value={content.bhaya2.body}
              onChange={(e) => handleBhaya2Change("body", e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
