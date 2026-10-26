"use client";

import { useState, useEffect } from "react";
import type { ActivityLogItem } from "@/lib/types";
import { Search, User, RefreshCw } from "lucide-react";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/activity-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Fetch activity logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      query === "" ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.object.toLowerCase().includes(query.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(query.toLowerCase()));

    const matchesAction = actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesAction;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Activity & Security Audit Logs
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Immutable audit record of administrative actions, SEO updates, media uploads, and content modifications.
          </p>
        </div>
        <button
          onClick={fetchLogs}
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
          <RefreshCw size={15} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.45rem 0.85rem", width: "320px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search by action, object, or details..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.85rem", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "SEO", "Media", "Service", "Publication"].map((f) => (
            <button
              key={f}
              onClick={() => setActionFilter(f)}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                background: actionFilter === f ? "var(--navy)" : "#ffffff",
                color: actionFilter === f ? "#ffffff" : "#475569",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f === "all" ? "All Logs" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 1rem" }}>User</th>
                <th style={{ padding: "0.85rem 1rem" }}>Action</th>
                <th style={{ padding: "0.85rem 1rem" }}>Target Object</th>
                <th style={{ padding: "0.85rem 1rem" }}>Details</th>
                <th style={{ padding: "0.85rem 1rem" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                    No activity logs match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 600, color: "var(--navy)" }}>
                        <User size={13} color="#64748b" />
                        <span>{log.user}</span>
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, color: "#334155" }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, color: "var(--navy)" }}>{log.object}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#475569", fontSize: "0.8rem" }}>{log.details || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem", color: "#94a3b8", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {new Date(log.timestamp).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
