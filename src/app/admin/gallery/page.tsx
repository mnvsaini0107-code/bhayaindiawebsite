"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/types";
import styles from "./gallery.module.css";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("Products");
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) setItems(data.gallery);
    } catch (e) {
      console.error("Fetch gallery error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.gallery);
      })
      .catch((e) => console.error("Fetch gallery error", e))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setUrl(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      alert("Please upload or enter an image URL");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, caption, url }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setTitle("");
        setCaption("");
        setUrl("");
        fetchGallery();
      }
    } catch (err) {
      console.error("Save gallery error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchGallery();
    } catch (e) {
      console.error("Delete gallery error", e);
    }
  };

  const filtered = items.filter(
    (it) => activeCategory === "all" || it.category === activeCategory
  );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Visual Gallery Management</h1>
          <p className={styles.subTitle}>
            Upload and categorize authentic photos of production workshops, artisanal looms, products, and company milestones.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          + Upload Gallery Photo
        </button>
      </div>

      <div className={styles.filterPills}>
        {["all", "Products", "Company", "Projects", "Business"].map((cat) => (
          <button
            key={cat}
            className={`${styles.pill} ${activeCategory === cat ? styles.pillActive : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "all" ? "All Photos" : cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p className={styles.loading}>Loading gallery...</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.imgWrapper}>
                <Image src={item.url} alt={item.title} width={360} height={240} className={styles.img} />
                <span className={styles.catBadge}>{item.category}</span>
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                {item.caption && <p className={styles.itemCaption}>{item.caption}</p>}
                <div className={styles.cardFooter}>
                  <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                    Delete Photo
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Upload to Gallery</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Photo Title *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Master Weavers in Varanasi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryItem["category"])}
                >
                  <option value="Products">Product Images</option>
                  <option value="Company">Company Images</option>
                  <option value="Projects">Work / Project Images</option>
                  <option value="Business">Other Business Images</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Upload File</label>
                <input
                  type="file"
                  ref={fileRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={styles.uploadBtn}
                  disabled={uploading}
                >
                  {uploading ? "Uploading File..." : "📁 Choose Image File"}
                </button>
                {url && (
                  <div className={styles.preview}>
                    <span>Uploaded: {url}</span>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Caption / Context</label>
                <textarea
                  rows={3}
                  className={styles.textarea}
                  placeholder="Short editorial caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving || !url} className={styles.saveBtn}>
                  {saving ? "Saving..." : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
