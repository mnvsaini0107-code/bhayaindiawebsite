"use client";

import { useState, useEffect } from "react";
import type { GlobalSeoSettings } from "@/lib/types";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [leadsStats, setLeadsStats] = useState<{ total: number; wholesale: number; seller: number; manufacturer: number; general: number }>({
    total: 0,
    wholesale: 0,
    seller: 0,
    manufacturer: 0,
    general: 0,
  });

  useEffect(() => {
    Promise.all([fetch("/api/seo"), fetch("/api/enquiries")])
      .then(async ([seoRes, enqRes]) => {
        const seoData = await seoRes.json();
        const enqData = await enqRes.json();
        if (seoData.success) {
          setGlobalSeo(seoData.global);
        }
        if (enqData.success && Array.isArray(enqData.enquiries)) {
          const list = enqData.enquiries;
          setLeadsStats({
            total: list.length,
            wholesale: list.filter((e: { type?: string }) => e.type === "wholesale").length,
            seller: list.filter((e: { type?: string }) => e.type === "seller").length,
            manufacturer: list.filter((e: { type?: string }) => e.type === "manufacturer").length,
            general: list.filter((e: { type?: string }) => !e.type || e.type === "general" || e.type === "product").length,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
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
        setNotice("Analytics configuration saved successfully!");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save analytics error:", err);
    } finally {
      setSaving(false);
    }
  };

  const isGa4Active = Boolean(globalSeo?.ga4MeasurementId && globalSeo.ga4MeasurementId.trim().startsWith("G-"));

  if (loading || !globalSeo) {
    return <p style={{ color: "#64748b", padding: "2rem" }}>Loading analytics configuration...</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
          Analytics & Measurement Center
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
          Configure Google Analytics 4, Tag Manager, consent mode parameters, and review B2B lead conversion channels.
        </p>
      </div>

      {notice && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.875rem" }}>
          {notice}
        </div>
      )}

      {/* Connection Status Card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              background: isGa4Active ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)",
              color: isGa4Active ? "#059669" : "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isGa4Active ? <CheckCircle2 size={26} /> : <AlertCircle size={26} />}
          </div>
          <div>
            <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", color: "var(--navy)" }}>
              {isGa4Active ? "Google Analytics 4 Active" : "Analytics Ready (Pending Measurement ID)"}
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
              {isGa4Active
                ? `Tracking ID ${globalSeo.ga4MeasurementId} configured. Scripts initialize on public routes with consent check.`
                : "Enter your valid G-XXXXXXXXXX Measurement ID below to activate tracking without modifying codebase."}
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "9999px",
            background: isGa4Active ? "#dcfce7" : "#fef3c7",
            color: isGa4Active ? "#166534" : "#92400e",
          }}
        >
          {isGa4Active ? "ACTIVE" : "STANDBY"}
        </span>
      </div>

      {/* Lead Channel Performance */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={18} />
          <span>Real B2B Lead Conversion Breakdown</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Total Inquiries</span>
            <strong style={{ display: "block", fontSize: "1.6rem", color: "var(--navy)" }}>{leadsStats.total}</strong>
            <span style={{ fontSize: "0.75rem", color: "#059669" }}>All captured leads</span>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Wholesale & B2B</span>
            <strong style={{ display: "block", fontSize: "1.6rem", color: "#2563eb" }}>{leadsStats.wholesale}</strong>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>/wholesale channel</span>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Seller Registrations</span>
            <strong style={{ display: "block", fontSize: "1.6rem", color: "#d97706" }}>{leadsStats.seller}</strong>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>/become-a-seller</span>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Factory Partners</span>
            <strong style={{ display: "block", fontSize: "1.6rem", color: "#7c3aed" }}>{leadsStats.manufacturer}</strong>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>/manufacturers</span>
          </div>
        </div>
      </div>

      {/* Analytics Settings Form */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", margin: "0 0 1.25rem" }}>Measurement Credentials</h3>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.35rem" }}>
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              placeholder="e.g. G-ABC123XYZ0"
              value={globalSeo.ga4MeasurementId || ""}
              onChange={(e) => setGlobalSeo({ ...globalSeo, ga4MeasurementId: e.target.value.trim() })}
              style={{ width: "100%", maxWidth: "450px", padding: "0.6rem 0.85rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
            />
            <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
              Enter your GA4 Property Measurement ID starting with G-. Stored securely server-side.
            </span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.35rem" }}>
              Google Tag Manager ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GTM-XXXXXX"
              value={globalSeo.gtmId || ""}
              onChange={(e) => setGlobalSeo({ ...globalSeo, gtmId: e.target.value.trim() })}
              style={{ width: "100%", maxWidth: "450px", padding: "0.6rem 0.85rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.5rem" }}>
            <input
              type="checkbox"
              id="consent"
              checked={globalSeo.cookieConsentEnabled}
              onChange={(e) => setGlobalSeo({ ...globalSeo, cookieConsentEnabled: e.target.checked })}
            />
            <label htmlFor="consent" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)", cursor: "pointer" }}>
              Enable User Consent Mode & Privacy Protection
            </label>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "var(--navy)",
                color: "#ffffff",
                border: "1px solid var(--gold)",
                padding: "9px 22px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                cursor: "pointer",
              }}
            >
              <Save size={16} />
              <span>{saving ? "Saving..." : "Save Analytics Configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
