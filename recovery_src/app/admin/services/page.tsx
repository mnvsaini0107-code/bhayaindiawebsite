"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ServiceItem } from "@/lib/types";
import {
  Plus,
  Trash2,
  Edit3,
  X,
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error("Fetch services error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService({
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
      category: "Sourcing & Supply Chain",
      image: "/assets/hero-editorial.jpg",
      featured: true,
      status: "Published",
      order: services.length + 1,
      seoTitle: "",
      seoDescription: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title) return;

    setSaving(true);
    try {
      const isNew = !editingService.id;
      const res = await fetch("/api/services", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Service "${editingService.title}" saved successfully!`);
        setIsModalOpen(false);
        setEditingService(null);
        await fetchServices();
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save service error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete service "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setServices(services.filter((s) => s.id !== id));
        setNotice("Service deleted.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Delete service error:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Services & Solutions CMS
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Manage client-facing business solutions, authentic cluster sourcing, corporate hampers, and packaging services.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{
            background: "var(--navy)",
            color: "#ffffff",
            padding: "9px 18px",
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
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      {notice && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.875rem" }}>
          {notice}
        </div>
      )}

      {/* Services Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Service</th>
                <th style={{ padding: "0.85rem 1rem" }}>Category</th>
                <th style={{ padding: "0.85rem 1rem" }}>Featured</th>
                <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    No services found. Click Add New Service above.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
                          <Image src={srv.image || "/assets/hero-editorial.jpg"} alt={srv.title} fill style={{ objectFit: "cover" }} sizes="40px" />
                        </div>
                        <div>
                          <strong style={{ color: "var(--navy)", display: "block" }}>{srv.title}</strong>
                          {srv.titleHi && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{srv.titleHi}</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{srv.category}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: srv.featured ? "#059669" : "#64748b" }}>
                        {srv.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: srv.status === "Published" ? "#dcfce7" : "#f1f5f9",
                          color: srv.status === "Published" ? "#166534" : "#475569",
                        }}
                      >
                        {srv.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "var(--navy)" }}
                          title="Edit Service"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id, srv.title)}
                          style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "#b91c1c" }}
                          title="Delete Service"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingService && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              maxWidth: "650px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "1.2rem", margin: 0, color: "var(--navy)" }}>
                {editingService.id ? "Edit Service" : "Add New Service"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Service Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Service Title (हिन्दी)
                </label>
                <input
                  type="text"
                  value={editingService.titleHi || ""}
                  onChange={(e) => setEditingService({ ...editingService, titleHi: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Category
                </label>
                <input
                  type="text"
                  value={editingService.category || ""}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Description (English)
                </label>
                <textarea
                  rows={3}
                  value={editingService.description || ""}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Description (हिन्दी)
                </label>
                <textarea
                  rows={3}
                  value={editingService.descriptionHi || ""}
                  onChange={(e) => setEditingService({ ...editingService, descriptionHi: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingService.image || ""}
                  onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Status
                  </label>
                  <select
                    value={editingService.status || "Published"}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as "Published" | "Draft" })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
                  <input
                    type="checkbox"
                    id="feat"
                    checked={editingService.featured ?? false}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                  />
                  <label htmlFor="feat" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--navy)" }}>
                    Featured Service
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: "var(--navy)", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
                >
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
