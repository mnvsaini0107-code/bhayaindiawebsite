"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Category, MediaAsset } from "@/lib/types";
import { X, Upload, ImageIcon } from "lucide-react";
import styles from "./categories.module.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/assets/image-coming-soon.svg");
  const [subcategoriesStr, setSubcategoriesStr] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [coverAltText, setCoverAltText] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Media Library Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Fetch categories error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setMediaAssets(data.assets || []);
      }
    } catch (e) {
      console.error("Fetch media error", e);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("/assets/image-coming-soon.svg");
    setSubcategoriesStr("");
    setSeoTitle("");
    setSeoDescription("");
    setCoverAltText("");
    setSortOrder(categories.length);
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImage(c.image);
    setSubcategoriesStr(c.subcategories.join(", "));
    setSeoTitle(c.seoTitle || `${c.name} — Bhaya India Catalogue`);
    setSeoDescription(c.seoDescription || c.description.slice(0, 160));
    setCoverAltText(c.coverAltText || `${c.name} Collection — Bhaya India`);
    setSortOrder(c.sortOrder || 0);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading cover image");
    } finally {
      setUploadLoading(false);
    }
  };

  const openMediaPicker = () => {
    setIsMediaPickerOpen(true);
    setSelectedMediaUrl(image);
    fetchMedia();
  };

  const handleConfirmMedia = () => {
    if (selectedMediaUrl) {
      setImage(selectedMediaUrl);
    }
    setIsMediaPickerOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const subcategories = subcategoriesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      image,
      subcategories,
      seoTitle: seoTitle || `${name} — Bhaya India Catalogue`,
      seoDescription: seoDescription || description.slice(0, 160),
      coverAltText: coverAltText || `${name} — Bhaya India`,
      sortOrder: Number(sortOrder) || 0,
      isPublished: true,
      status: "published",
    };

    try {
      if (editingCat) {
        const res = await fetch(`/api/categories/${editingCat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(data.error || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(data.error || "Failed to create category");
        }
      }
    } catch (err) {
      console.error("Save category error", err);
      alert("An unexpected error occurred while saving category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (e) {
      console.error("Delete category error", e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Category & Subcategory Taxonomy</h1>
          <p className={styles.subTitle}>
            Manage homepage showcase categories, subcategories, verified authentic cover photos, and dynamic product counts.
          </p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>
          + Create Category
        </button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p className={styles.loading}>Loading categories...</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className={styles.catCard}>
              <div className={styles.cardCover}>
                <Image src={c.image} alt={c.name} width={400} height={180} className={styles.coverImg} />
                <span className={styles.countBadge} title="Real published products count">
                  {c.productCount} {c.productCount === 1 ? "Product" : "Products"}
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.catName}>{c.name}</h3>
                <span className={styles.catSlug}>slug: /{c.slug}</span>
                <p className={styles.catDesc}>{c.description}</p>

                <div className={styles.subCatArea}>
                  <strong className={styles.subCatTitle}>Subcategories:</strong>
                  <div className={styles.subCatTags}>
                    {c.subcategories.map((sub, i) => (
                      <span key={i} className={styles.subTag}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button onClick={() => openEdit(c)} className={styles.editBtn}>
                    Edit Category
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Media Picker Modal */}
      {isMediaPickerOpen && (
        <div className={styles.mediaPickerOverlay} onClick={() => setIsMediaPickerOpen(false)}>
          <div className={styles.mediaPickerModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Select Category Cover from Media Library</h2>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                  Pick an authentic photo representing this category showcase.
                </p>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsMediaPickerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e2e8f0" }}>
              <input
                type="text"
                className={styles.input}
                placeholder="Search media assets..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
              />
            </div>

            <div className={styles.mediaGrid}>
              {mediaLoading ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                  Loading Media Assets...
                </p>
              ) : (
                mediaAssets
                  .filter(
                    (m) =>
                      !mediaSearch ||
                      m.filename.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                      (m.title && m.title.toLowerCase().includes(mediaSearch.toLowerCase()))
                  )
                  .map((m) => (
                    <div
                      key={m.id}
                      className={`${styles.mediaItemCard} ${
                        selectedMediaUrl === m.url ? styles.mediaItemCardSelected : ""
                      }`}
                      onClick={() => setSelectedMediaUrl(m.url)}
                    >
                      <Image
                        src={m.url}
                        alt={m.title || m.filename || "Media"}
                        width={130}
                        height={90}
                        className={styles.mediaItemThumb}
                      />
                      <span className={styles.mediaItemLabel}>{m.title || m.filename}</span>
                    </div>
                  ))
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsMediaPickerOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                disabled={!selectedMediaUrl}
                onClick={handleConfirmMedia}
              >
                Apply as Cover Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Puja Samagri & Ritual Essentials"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Slug (URL identifier)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. puja-samagri"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Short Description</label>
                <textarea
                  rows={3}
                  className={styles.textarea}
                  placeholder="Appears on homepage category cards and search filters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Cover Image with Preview, Upload & Media Picker */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Image path or URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />

                <div className={styles.coverPreviewBox}>
                  <Image
                    src={image || "/assets/image-coming-soon.svg"}
                    alt="Cover preview"
                    width={90}
                    height={60}
                    className={styles.coverThumb}
                  />
                  <div className={styles.coverActions}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLoading}
                    >
                      <Upload size={14} />
                      {uploadLoading ? "Uploading..." : "Upload File"}
                    </button>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={openMediaPicker}
                    >
                      <ImageIcon size={14} />
                      Choose from Media Library
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subcategories (Comma-separated)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Puja Thali, Kalash Sets, Diyas, Sacred Bells"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image Alt Text (SEO)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Authentic Handcrafted Puja Samagri by Bhaya India"
                  value={coverAltText}
                  onChange={(e) => setCoverAltText(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>SEO Page Title</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Authentic Puja Samagri & Ritual Essentials — Bhaya India"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : editingCat ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
