"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/types";
import { Plus, Trash2, Edit3, X } from "lucide-react";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.success) {
        setTeam(data.team || []);
      }
    } catch (err) {
      console.error("Fetch team error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember({
      name: "",
      nameHi: "",
      role: "",
      roleHi: "",
      bio: "",
      bioHi: "",
      image: "/assets/bhaya-india-logo.png",
      order: team.length + 1,
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role) return;

    setSaving(true);
    try {
      const isNew = !editingMember.id;
      const res = await fetch("/api/team", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Team member "${editingMember.name}" saved!`);
        setIsModalOpen(false);
        setEditingMember(null);
        await fetchTeam();
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save team error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`Remove team member "${name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTeam(team.filter((t) => t.id !== id));
        setNotice("Team member removed.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Delete team error:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Creators & Team CMS
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Manage merchant advisory desks, quality specialists, and artisan cluster liaisons.
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
          <span>Add Team Member</span>
        </button>
      </div>

      {notice && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.875rem" }}>
          {notice}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Member</th>
                <th style={{ padding: "0.85rem 1rem" }}>Role & Responsibility</th>
                <th style={{ padding: "0.85rem 1rem" }}>Order</th>
                <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    Loading team members...
                  </td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    No team members found. Click Add Team Member above.
                  </td>
                </tr>
              ) : (
                team.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
                          <Image src={m.image || "/assets/bhaya-india-logo.png"} alt={m.name} fill style={{ objectFit: "cover" }} sizes="38px" />
                        </div>
                        <div>
                          <strong style={{ color: "var(--navy)", display: "block" }}>{m.name}</strong>
                          {m.nameHi && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.nameHi}</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontWeight: 600, color: "#334155" }}>{m.role}</span>
                      {m.roleHi && <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>{m.roleHi}</span>}
                    </td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>#{m.order}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: m.status === "Active" ? "#dcfce7" : "#f1f5f9",
                          color: m.status === "Active" ? "#166534" : "#475569",
                        }}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "var(--navy)" }}
                          title="Edit Member"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.name)}
                          style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "#b91c1c" }}
                          title="Delete Member"
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

      {/* Modal */}
      {isModalOpen && editingMember && (
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
              maxWidth: "580px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "1.2rem", margin: 0, color: "var(--navy)" }}>
                {editingMember.id ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Name (हिन्दी)
                </label>
                <input
                  type="text"
                  value={editingMember.nameHi || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, nameHi: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Role / Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Role / Title (हिन्दी)
                </label>
                <input
                  type="text"
                  value={editingMember.roleHi || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, roleHi: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Bio / Responsibilities (English)
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Avatar / Photo URL
                </label>
                <input
                  type="text"
                  value={editingMember.image || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Status
                  </label>
                  <select
                    value={editingMember.status || "Active"}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as "Active" | "Inactive" })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingMember.order || 1}
                    onChange={(e) => setEditingMember({ ...editingMember, order: Number(e.target.value) })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
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
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
