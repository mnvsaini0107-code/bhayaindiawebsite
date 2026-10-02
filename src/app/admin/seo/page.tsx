"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GlobalSeoSettings, PageSeoRecord, RedirectRule, Product } from "@/lib/types";
import {
  Globe,
  FileCheck,
  Search,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Trash2,
  Sliders,
  Check,
  Package,
} from "lucide-react";
import styles from "./seo.module.css";

export default function SeoControlCenterPage() {
  const [activeTab, setActiveTab] = useState<"pages" | "global" | "audit" | "products" | "redirects">("pages");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [globalSeo, setGlobalSeo] = useState<GlobalSeoSettings | null>(null);
  const [pagesSeo, setPagesSeo] = useState<Record<string, PageSeoRecord>>({});
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // New redirect form state
  const [newRedirect, setNewRedirect] = useState({ source: "", destination: "", statusCode: 301 as const });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [seoRes, redirRes, prodRes] = await Promise.all([
        fetch("/api/seo"),
        fetch("/api/redirects"),
        fetch("/api/products"),
      ]);

      const [seoData, redirData, prodData] = await Promise.all([
        seoRes.json(),
        redirRes.json(),
        prodRes.json(),
      ]);

      if (seoData.success) {
        setGlobalSeo(seoData.global);
        setPagesSeo(seoData.pages || {});
      }
      if (redirData.success) {
        setRedirects(redirData.redirects || []);
      }
      if (prodData.success) {
        setProducts(prodData.products || []);
      }
    } catch (err) {
      console.error("Failed to load SEO data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentPage = pagesSeo[selectedPath];

  const handlePageFieldChange = (field: keyof PageSeoRecord, value: unknown) => {
    if (!currentPage) return;
    setPagesSeo({
      ...pagesSeo,
      [selectedPath]: {
        ...currentPage,
        [field]: value,
      },
    });
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setSaving(true);
    setNotice("");

    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page",
          path: selectedPath,
          seo: currentPage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Page SEO for "${currentPage.pageName}" saved successfully!`);
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save page SEO error:", err);
      setNotice("Failed to save page SEO.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGlobalSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSeo) return;
    setSaving(true);
    setNotice("");

    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "global",
          settings: globalSeo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice("Global SEO settings updated successfully!");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save global SEO error:", err);
      setNotice("Failed to save global SEO.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRedirect.source || !newRedirect.destination) return;

    try {
      const res = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect),
      });
      const data = await res.json();
      if (data.success) {
        setRedirects([data.redirect, ...redirects]);
        setNewRedirect({ source: "", destination: "", statusCode: 301 });
        setNotice("301 Redirect added successfully.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Add redirect error:", err);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    try {
      const res = await fetch(`/api/redirects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRedirects(redirects.filter((r) => r.id !== id));
        setNotice("Redirect deleted.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Delete redirect error:", err);
    }
  };

  if (loading) {
    return <p style={{ color: "#64748b", padding: "2rem" }}>Loading SEO configuration...</p>;
  }

  const pageKeys = Object.keys(pagesSeo);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>SEO Control Center</h1>
          <p className={styles.subtitle}>
            Manage homepage metadata, route-level SEO tags, structured schemas, Open Graph previews, and 301 redirects without code changes.
          </p>
        </div>
      </div>

      {notice && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          onClick={() => setActiveTab("pages")}
          className={`${styles.tabBtn} ${activeTab === "pages" ? styles.tabBtnActive : ""}`}
        >
          <Sliders size={16} />
          <span>Page SEO Editor</span>
          <span className={styles.badge}>{pageKeys.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("global")}
          className={`${styles.tabBtn} ${activeTab === "global" ? styles.tabBtnActive : ""}`}
        >
          <Globe size={16} />
          <span>Global Defaults & Console</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`${styles.tabBtn} ${activeTab === "audit" ? styles.tabBtnActive : ""}`}
        >
          <FileCheck size={16} />
          <span>Page SEO Audit</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`${styles.tabBtn} ${activeTab === "products" ? styles.tabBtnActive : ""}`}
        >
          <Package size={16} />
          <span>Product SEO Audit</span>
          <span className={styles.badge}>{products.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("redirects")}
          className={`${styles.tabBtn} ${activeTab === "redirects" ? styles.tabBtnActive : ""}`}
        >
          <Share2 size={16} />
          <span>301 Redirects</span>
          <span className={styles.badge}>{redirects.length}</span>
        </button>
      </div>

      {/* TAB 1: PAGE SEO EDITOR */}
      {activeTab === "pages" && currentPage && (
        <div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Page-Level SEO Customizer</h2>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Select an indexable page from the dropdown to configure its custom title, description, and preview.
                </span>
              </div>
              <button
                type="submit"
                form="page-seo-form"
                disabled={saving}
                className={styles.saveBtn}
              >
                <Check size={16} />
                <span>{saving ? "Saving Changes..." : "Save Page SEO"}</span>
              </button>
            </div>

            {/* Page Selector */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className={styles.label}>Select Page to Configure:</label>
              <select
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                className={styles.select}
                style={{ width: "100%", maxWidth: "450px", fontWeight: 600, color: "var(--navy)" }}
              >
                {pageKeys.map((path) => (
                  <option key={path} value={path}>
                    {pagesSeo[path].pageName} ({path})
                  </option>
                ))}
              </select>
            </div>

            <form id="page-seo-form" onSubmit={handleSavePageSeo} className={styles.formGrid}>
              {/* Title */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  <span>SEO Title Tag</span>
                  <span
                    className={`${styles.charCount} ${
                      currentPage.seoTitle.length >= 45 && currentPage.seoTitle.length <= 65
                        ? styles.charGood
                        : styles.charWarning
                    }`}
                  >
                    {currentPage.seoTitle.length} / 60 recommended characters
                  </span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentPage.seoTitle}
                  onChange={(e) => handlePageFieldChange("seoTitle", e.target.value)}
                  required
                />
                <span className={styles.hint}>
                  Recommended: 45–65 characters. Keep brand name at the end separated by &quot;—&quot; or &quot;|&quot;.
                </span>
              </div>

              {/* Meta Description */}
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  <span>Meta Description</span>
                  <span
                    className={`${styles.charCount} ${
                      currentPage.metaDescription.length >= 120 && currentPage.metaDescription.length <= 160
                        ? styles.charGood
                        : styles.charWarning
                    }`}
                  >
                    {currentPage.metaDescription.length} / 155 recommended characters
                  </span>
                </label>
                <textarea
                  className={styles.textarea}
                  value={currentPage.metaDescription}
                  onChange={(e) => handlePageFieldChange("metaDescription", e.target.value)}
                  required
                />
                <span className={styles.hint}>
                  Recommended: 120–160 characters. A concise, factual summary of the page without keyword stuffing.
                </span>
              </div>

              {/* Canonical URL */}
              <div className={styles.field}>
                <label className={styles.label}>Canonical URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentPage.canonicalUrl}
                  onChange={(e) => handlePageFieldChange("canonicalUrl", e.target.value)}
                />
                <span className={styles.hint}>Preferred public canonical address (no tracking parameters).</span>
              </div>

              {/* Robots */}
              <div className={styles.field}>
                <label className={styles.label}>Robots Indexing Policy</label>
                <select
                  className={styles.select}
                  value={currentPage.robots}
                  onChange={(e) => handlePageFieldChange("robots", e.target.value)}
                >
                  <option value="index, follow">index, follow (Standard indexable)</option>
                  <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Complete block)</option>
                </select>
              </div>

              {/* Schema Type */}
              <div className={styles.field}>
                <label className={styles.label}>Primary Schema.org Structured Data</label>
                <select
                  className={styles.select}
                  value={currentPage.schemaType}
                  onChange={(e) => handlePageFieldChange("schemaType", e.target.value)}
                >
                  <option value="Organization">Organization (Corporate / Brand pages)</option>
                  <option value="WebSite">WebSite (General portal pages)</option>
                  <option value="Article">Article (Editorial publications)</option>
                  <option value="FAQPage">FAQPage (Client help desk)</option>
                  <option value="LocalBusiness">LocalBusiness (Direct merchant desk)</option>
                  <option value="Product">Product (Catalogues)</option>
                </select>
              </div>

              {/* OG Image */}
              <div className={styles.field}>
                <label className={styles.label}>Open Graph & Social Share Image URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentPage.ogImage}
                  onChange={(e) => handlePageFieldChange("ogImage", e.target.value)}
                />
                <span className={styles.hint}>Recommended: 1200 × 630 px JPEG or PNG.</span>
              </div>

              {/* OG Title & Description */}
              <div className={styles.field}>
                <label className={styles.label}>Open Graph Title (Optional Override)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentPage.ogTitle}
                  onChange={(e) => handlePageFieldChange("ogTitle", e.target.value)}
                  placeholder="Defaults to SEO Title if empty"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Open Graph Description (Optional Override)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={currentPage.ogDescription}
                  onChange={(e) => handlePageFieldChange("ogDescription", e.target.value)}
                  placeholder="Defaults to Meta Description if empty"
                />
              </div>
            </form>
          </div>

          {/* LIVE GOOGLE SERP & SOCIAL PREVIEWS */}
          <div className={styles.previewLayout}>
            {/* Google SERP Preview */}
            <div className={styles.card}>
              <h3 style={{ fontSize: "1rem", color: "var(--navy)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Search size={16} />
                <span>Google Search Result Preview</span>
              </h3>
              <div className={styles.serpCard}>
                <div className={styles.serpUrl}>
                  <Globe size={12} color="#5f6368" />
                  <span>https://bhayaindia.com{currentPage.path === "/" ? "" : currentPage.path}</span>
                </div>
                <div className={styles.serpTitle}>
                  {currentPage.seoTitle || "BHAYA INDIA — Page Title"}
                </div>
                <div className={styles.serpDesc}>
                  {currentPage.metaDescription || "Configure a descriptive meta description to see how your snippet appears in Google Search results."}
                </div>
              </div>
            </div>

            {/* Social Share (Open Graph) Preview */}
            <div className={styles.card}>
              <h3 style={{ fontSize: "1rem", color: "var(--navy)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Share2 size={16} />
                <span>Social Share (Open Graph) Preview</span>
              </h3>
              <div className={styles.socialCard}>
                <div className={styles.socialImageWrapper}>
                  <Image
                    src={currentPage.ogImage || "/assets/hero-editorial.jpg"}
                    alt={currentPage.seoTitle}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="400px"
                  />
                </div>
                <div className={styles.socialBody}>
                  <div className={styles.socialDomain}>bhayaindia.com</div>
                  <div className={styles.socialTitle}>{currentPage.ogTitle || currentPage.seoTitle}</div>
                  <div className={styles.socialDesc}>{currentPage.ogDescription || currentPage.metaDescription}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL SEO DEFAULTS */}
      {activeTab === "global" && globalSeo && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Global SEO & Verification Control</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Default metadata applied across pages without explicit overrides, and search engine verification tags.
              </span>
            </div>
            <button
              type="submit"
              form="global-seo-form"
              disabled={saving}
              className={styles.saveBtn}
            >
              <Check size={16} />
              <span>{saving ? "Saving..." : "Save Global SEO"}</span>
            </button>
          </div>

          <form id="global-seo-form" onSubmit={handleSaveGlobalSeo} className={styles.formGrid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Homepage Title</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.homepageTitle}
                onChange={(e) => setGlobalSeo({ ...globalSeo, homepageTitle: e.target.value })}
                required
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Homepage Meta Description</label>
              <textarea
                className={styles.textarea}
                value={globalSeo.homepageDescription}
                onChange={(e) => setGlobalSeo({ ...globalSeo, homepageDescription: e.target.value })}
                required
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Homepage Business Topics & Core Keywords</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.homepageKeywords}
                onChange={(e) => setGlobalSeo({ ...globalSeo, homepageKeywords: e.target.value })}
              />
              <span className={styles.hint}>CMS metadata covering verified business pillars.</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Default Fallback SEO Title</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.defaultTitle}
                onChange={(e) => setGlobalSeo({ ...globalSeo, defaultTitle: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Default Canonical Root</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.defaultCanonical}
                onChange={(e) => setGlobalSeo({ ...globalSeo, defaultCanonical: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Brand / Site Name</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.siteName}
                onChange={(e) => setGlobalSeo({ ...globalSeo, siteName: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Organization Name</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.organizationName}
                onChange={(e) => setGlobalSeo({ ...globalSeo, organizationName: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Default Open Graph Image</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.defaultOgImage}
                onChange={(e) => setGlobalSeo({ ...globalSeo, defaultOgImage: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Default Twitter/X Image</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.defaultTwitterImage}
                onChange={(e) => setGlobalSeo({ ...globalSeo, defaultTwitterImage: e.target.value })}
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Google Search Console Verification Tag</label>
              <input
                type="text"
                className={styles.input}
                value={globalSeo.googleVerificationTag || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, googleVerificationTag: e.target.value })}
                placeholder="e.g. googled6a8f1b2c3d4e5f6 or verification meta content code"
              />
              <span className={styles.hint}>
                Rendered automatically in HTML head as &lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;
              </span>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: PAGE SEO AUDIT TABLE */}
      {activeTab === "audit" && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Complete Page SEO Audit</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Audited indexability, title lengths, descriptions, canonical URLs, and schema markup across all 19 core platform routes.
              </span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Page Name</th>
                  <th>Route / Canonical</th>
                  <th>SEO Title</th>
                  <th>Schema</th>
                  <th>Indexable</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageKeys.map((path) => {
                  const p = pagesSeo[path];
                  const titleOk = p.seoTitle.length >= 35 && p.seoTitle.length <= 70;
                  const descOk = p.metaDescription.length >= 80;

                  return (
                    <tr key={path}>
                      <td>
                        <strong>{p.pageName}</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                          {p.pageNameHi || ""}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--navy)" }}>{path}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{p.seoTitle}</span>
                        <span style={{ display: "block", fontSize: "0.72rem", color: "#94a3b8" }}>
                          {p.seoTitle.length} chars
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                          {p.schemaType}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", color: p.isIndexable ? "#166534" : "#94a3b8" }}>
                          {p.isIndexable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        {titleOk && descOk ? (
                          <span className={styles.statusPass}>
                            <CheckCircle2 size={12} />
                            <span>Optimized</span>
                          </span>
                        ) : (
                          <span className={styles.statusWarning}>
                            <AlertTriangle size={12} />
                            <span>Needs review</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedPath(path);
                            setActiveTab("pages");
                          }}
                          className={styles.editRowBtn}
                        >
                          Edit SEO
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT SEO AUDIT */}
      {activeTab === "products" && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Shopify Product SEO Audit</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Displays product search metadata. Product titles and descriptions inherit from Shopify Storefront API with optional CMS overrides.
              </span>
            </div>
            <Link
              href="/admin/products"
              className={styles.saveBtn}
              style={{ textDecoration: "none" }}
            >
              <span>Manage Products</span>
              <ExternalLink size={15} />
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU / Price</th>
                  <th>SEO Title</th>
                  <th>Meta Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <strong>{prod.name}</strong>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                        Category: {prod.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{prod.sku}</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>
                        {prod.price ? `₹${prod.price}` : "Get Quote"}
                      </span>
                    </td>
                    <td>
                      <span>{prod.seoTitle || `${prod.name} — ${prod.category} | BHAYA INDIA`}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                        {prod.seoDescription || prod.description.slice(0, 100) + "..."}
                      </span>
                    </td>
                    <td>
                      <span className={styles.statusPass}>
                        <CheckCircle2 size={12} />
                        <span>Shopify Synced</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: 301 REDIRECTS */}
      {activeTab === "redirects" && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>301 Permanent Redirects Manager</h2>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Prevent broken links, 404 errors, and preserve search engine ranking equity when old URLs change.
              </span>
            </div>
          </div>

          {/* New Redirect Form */}
          <form
            onSubmit={handleAddRedirect}
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-end",
              background: "#f8fafc",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "0.775rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                Old URL / Source Path
              </label>
              <input
                type="text"
                placeholder="/old-page or /shop/item"
                value={newRedirect.source}
                onChange={(e) => setNewRedirect({ ...newRedirect, source: e.target.value })}
                className={styles.input}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "0.775rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                New URL / Destination Path
              </label>
              <input
                type="text"
                placeholder="/products or /wholesale"
                value={newRedirect.destination}
                onChange={(e) => setNewRedirect({ ...newRedirect, destination: e.target.value })}
                className={styles.input}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div style={{ width: "130px" }}>
              <label style={{ display: "block", fontSize: "0.775rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                Type
              </label>
              <select className={styles.select} style={{ width: "100%" }} disabled>
                <option value="301">301 Permanent</option>
              </select>
            </div>

            <button type="submit" className={styles.saveBtn} style={{ padding: "0.6rem 1.25rem" }}>
              <Plus size={16} />
              <span>Add Redirect</span>
            </button>
          </form>

          {/* Redirects Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Old URL (Source)</th>
                  <th>New URL (Destination)</th>
                  <th>HTTP Code</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {redirects.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
                      No redirects defined. Add rules above to preserve legacy URL equity.
                    </td>
                  </tr>
                ) : (
                  redirects.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontFamily: "monospace", color: "#e11d48", fontWeight: 600 }}>{r.source}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", color: "#059669", fontWeight: 600 }}>{r.destination}</span>
                      </td>
                      <td>
                        <span style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                          {r.statusCode}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteRedirect(r.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Delete redirect"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
