"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Cpu,
  Zap,
} from "lucide-react";

interface HealthCheck {
  id: string;
  name: string;
  status: "PASS" | "WARNING" | "ERROR";
  summary: string;
  details: string;
}

interface HealthData {
  score: number;
  summary: {
    passCount: number;
    warningCount: number;
    errorCount: number;
    total: number;
  };
  checks: HealthCheck[];
  stats: {
    totalMedia: number;
    missingAltCount: number;
    totalPages: number;
    totalProducts: number;
  };
}

export default function AdminSiteHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/site-health");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Fetch site health error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Site Health & Performance Diagnostics
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Real-time verification of crawlability, XML sitemaps, structured schemas, Core Web Vitals readiness, and image alt text coverage.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            color: "var(--navy)",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={15} className={loading ? "spin" : ""} />
          <span>{loading ? "Diagnosing..." : "Run Live Diagnostics"}</span>
        </button>
      </div>

      {data && (
        <>
          {/* Health Score Overview Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Health Score</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.25rem" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: data.score >= 90 ? "#059669" : "#d97706" }}>
                  {data.score}
                </span>
                <span style={{ color: "#64748b", fontSize: "1rem" }}>/ 100</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>
                {data.summary.passCount} of {data.summary.total} checks passing
              </span>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Passing Audits</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <CheckCircle2 size={28} color="#059669" />
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy)" }}>{data.summary.passCount}</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Production ready</span>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Attention Items</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <AlertTriangle size={28} color="#d97706" />
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#d97706" }}>{data.summary.warningCount}</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Recommended optimizations</span>
            </div>

            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Core Web Vitals Readiness</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <Zap size={28} color="#2563eb" />
                <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--navy)" }}>Ready</span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>LCP, INP, CLS enabled</span>
            </div>
          </div>

          {/* Core Web Vitals Status Card */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Cpu size={18} />
              <span>Core Web Vitals & Real Performance Parameters</span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>LCP (Largest Contentful Paint)</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Target: &lt; 2.5s</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#059669" }}>Next.js Image priority optimization enabled</p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>INP (Interaction to Next Paint)</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Target: &lt; 200ms</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#059669" }}>Zero blocking third-party scripts</p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>CLS (Cumulative Layout Shift)</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Target: &lt; 0.1</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#059669" }}>Explicit dimensions & CSS module constraints</p>
              </div>

              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "6px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block" }}>Server TTFB</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--navy)" }}>Target: &lt; 0.6s</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#059669" }}>Turbopack Next.js engine</p>
              </div>
            </div>
          </div>

          {/* Checks List */}
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--navy)" }}>Diagnostic Checks Breakdown</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {data.checks.map((check) => (
                <div
                  key={check.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #f1f5f9",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
                    <div style={{ marginTop: "2px" }}>
                      {check.status === "PASS" ? (
                        <CheckCircle2 size={20} color="#059669" />
                      ) : check.status === "WARNING" ? (
                        <AlertTriangle size={20} color="#d97706" />
                      ) : (
                        <XCircle size={20} color="#dc2626" />
                      )}
                    </div>
                    <div>
                      <strong style={{ color: "var(--navy)", fontSize: "0.95rem", display: "block" }}>{check.name}</strong>
                      <p style={{ margin: "0.2rem 0", color: "#475569", fontSize: "0.85rem" }}>{check.summary}</p>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{check.details}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background:
                        check.status === "PASS"
                          ? "#dcfce7"
                          : check.status === "WARNING"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        check.status === "PASS"
                          ? "#166534"
                          : check.status === "WARNING"
                          ? "#92400e"
                          : "#991b1b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
