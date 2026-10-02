"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  X,
} from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Fetch blogs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost({
      title: "",
      titleHi: "",
      slug: "",
      excerpt: "",
      excerptHi: "",
      content: "",
      contentHi: "",
      author: "BHAYA INDIA Editorial Desk",
      publishedAt: new Date().toISOString(),
      featuredImage: "/assets/hero-editorial.jpg",
      category: "Festive Heritage",
      tags: ["Heritage", "Crafts"],
      status: "Published",
      seoTitle: "",
      seoDescription: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;

    setSaving(true);
    try {
      const isNew = !editingPost.id;
      const res = await fetch("/api/blog", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPost),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Article "${editingPost.title}" saved successfully!`);
        setIsModalOpen(false);
        setEditingPost(null);
        await fetchBlogs();
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save blog error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete publication "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
        setNotice("Article deleted.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Delete blog error:", err);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Publications & Blog CMS
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
            Publish editorial stories, artisan spotlights, B2B wholesale guides, and festival traditions with clean /blog/[slug] URLs.
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
          <span>New Publication</span>
        </button>
      </div>

      {notice && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "6px", fontSize: "0.875rem" }}>
          {notice}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.45rem 0.85rem", width: "320px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search articles by title, category, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.85rem", width: "100%" }}
          />
        </div>
        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
          <strong>{filteredBlogs.length}</strong> publications
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Article</th>
                <th style={{ padding: "0.85rem 1rem" }}>Category</th>
                <th style={{ padding: "0.85rem 1rem" }}>Author / Date</th>
                <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    Loading publications...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                    No articles found. Click New Publication above.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", position: "relative", background: "#f1f5f9" }}>
                          <Image src={b.featuredImage || "/assets/hero-editorial.jpg"} alt={b.title} fill style={{ objectFit: "cover" }} sizes="48px" />
                        </div>
                        <div>
                          <strong style={{ color: "var(--navy)", display: "block", fontSize: "0.9rem" }}>{b.title}</strong>
                          <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#64748b" }}>/blog/{b.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, color: "var(--navy)" }}>
                        {b.category}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ display: "block", fontWeight: 500 }}>{b.author}</span>
                      <time style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {new Date(b.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: b.status === "Published" ? "#dcfce7" : "#f1f5f9",
                          color: b.status === "Published" ? "#166534" : "#475569",
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "4px", color: "#334155", display: "inline-flex", alignItems: "center" }}
                          title="View Live Article"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "var(--navy)" }}
                          title="Edit Article"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.title)}
                          style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", color: "#b91c1c" }}
                          title="Delete Article"
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
      {isModalOpen && editingPost && (
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
              maxWidth: "750px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "1.2rem", margin: 0, color: "var(--navy)" }}>
                {editingPost.id ? "Edit Publication" : "Create New Publication"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPost.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");
                    setEditingPost({
                      ...editingPost,
                      title,
                      slug: editingPost.id ? editingPost.slug : autoSlug,
                    });
                  }}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    URL Slug (e.g. art-of-gifting) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Category
                  </label>
                  <select
                    value={editingPost.category || "Festive Heritage"}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="Festive Heritage">Festive Heritage</option>
                    <option value="Business & Industry">Business & Industry</option>
                    <option value="Craft & Culture">Craft & Culture</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                  Full Content (Supports paragraphs, ## Subheadings, and bullet lists) *
                </label>
                <textarea
                  rows={7}
                  required
                  value={editingPost.content || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem", lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Author
                  </label>
                  <input
                    type="text"
                    value={editingPost.author || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={editingPost.featuredImage || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    Status
                  </label>
                  <select
                    value={editingPost.status || "Published"}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as "Published" | "Draft" })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem" }}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)", marginBottom: "0.25rem" }}>
                    SEO Meta Title (Optional Override)
                  </label>
                  <input
                    type="text"
                    value={editingPost.seoTitle || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                    placeholder="Defaults to article title"
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
                  {saving ? "Saving..." : "Save Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
