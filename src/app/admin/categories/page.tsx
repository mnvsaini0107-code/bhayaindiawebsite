"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Category } from "@/lib/types";
import styles from "./categories.module.css";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/assets/category-textiles.jpg");
  const [subcategoriesStr, setSubcategoriesStr] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch((err) => console.error("Fetch categories error", err))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("/assets/category-textiles.jpg");
    setSubcategoriesStr("");
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingCat(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImage(c.image);
    setSubcategoriesStr(c.subcategories.join(", "));
    setIsModalOpen(true);
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
        }
      }
    } catch (err) {
      console.error("Save category error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCategories();
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
            Manage homepage showcase categories, subcategories, descriptions and banner photos.
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
                <span className={styles.countBadge}>{c.productCount} Products</span>
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

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingCat ? `Edit Category: ${editingCat.name}` : "Create New Category"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Textiles & Fabrics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Slug (URL identifier)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. textiles-fabrics"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Short Description</label>
                <textarea
                  rows={3}
                  className={styles.textarea}
                  placeholder="Appears on homepage category cards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Cover Image Path / URL</label>
                <input
                  type="text"
                  className={styles.input}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Subcategories (Comma-separated)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Sarees, Silk Dupattas, Handloom Shawls"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
