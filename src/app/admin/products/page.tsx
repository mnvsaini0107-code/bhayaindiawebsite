"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Product, Category, ProductSpec } from "@/lib/types";
import styles from "./products.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<"fixed" | "quote">("fixed");
  const [price, setPrice] = useState<string>("");
  const [priceNote, setPriceNote] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [sku, setSku] = useState("");
  const [specs, setSpecs] = useState<ProductSpec[]>([
    { label: "Material", value: "" },
    { label: "Dimensions", value: "" },
  ]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalogue = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (prodData.success) setProducts(prodData.products);
      if (catData.success) setCategories(catData.categories);
    } catch (e) {
      console.error("Fetch catalogue error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetch("/api/products"), fetch("/api/categories")])
      .then(async ([prodRes, catRes]) => {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      })
      .catch((e) => console.error("Fetch catalogue error", e))
      .finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategorySlug(categories[0]?.slug || "textiles-fabrics");
    setSubcategory("");
    setTagline("");
    setDescription("");
    setPriceType("fixed");
    setPrice("");
    setPriceNote("Per piece (Inclusive of Taxes)");
    setImages([]);
    setIsFeatured(false);
    setIsPublished(true);
    setIsNew(true);
    setInStock(true);
    setSku(`BI-${Date.now().toString().slice(-4)}`);
    setSpecs([
      { label: "Material", value: "" },
      { label: "Dimensions", value: "" },
    ]);
    setFeatures([""]);
    setBenefits([""]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategorySlug(p.categorySlug);
    setSubcategory(p.subcategory);
    setTagline(p.tagline || "");
    setDescription(p.description);
    setPriceType(p.price === null ? "quote" : "fixed");
    setPrice(p.price ? p.price.toString() : "");
    setPriceNote(p.priceNote || "");
    setImages(p.images || []);
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setIsNew(Boolean(p.isNew));
    setInStock(p.inStock);
    setSku(p.sku);
    setSpecs(p.specs && p.specs.length > 0 ? p.specs : [{ label: "Material", value: "" }]);
    setFeatures(p.features && p.features.length > 0 ? p.features : [""]);
    setBenefits(p.benefits && p.benefits.length > 0 ? p.benefits : [""]);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, data.url]);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Error uploading file");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    setSpecs((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { label: "", value: "" }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const categoryObj = categories.find((c) => c.slug === categorySlug);
    const catName = categoryObj ? categoryObj.name : "General";

    const payload = {
      name,
      category: catName,
      categorySlug,
      subcategory: subcategory || "General",
      tagline,
      description,
      price: priceType === "quote" ? null : Number(price) || 0,
      priceNote,
      images: images.length > 0 ? images : ["/assets/category-textiles.jpg"],
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      features: features.filter((f) => f.trim()),
      benefits: benefits.filter((b) => b.trim()),
      isFeatured,
      isPublished,
      isNew,
      inStock,
      sku,
      seoTitle: `${name} — Bhaya India`,
      seoDescription: description.slice(0, 160),
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCatalogue();
        } else {
          alert(data.error || "Failed to update product");
        }
      } else {
        // Create
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCatalogue();
        } else {
          alert(data.error || "Failed to create product");
        }
      }
    } catch (err) {
      console.error("Save product error", err);
      alert("An unexpected error occurred while saving product.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCatalogue();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (e) {
      console.error("Delete error", e);
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !p.isPublished }),
      });
      fetchCatalogue();
    } catch (e) {
      console.error("Toggle publish error", e);
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !p.isFeatured }),
      });
      fetchCatalogue();
    } catch (e) {
      console.error("Toggle featured error", e);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === "all" || p.categorySlug === selectedCat;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Product Catalogue Management</h1>
          <p className={styles.subTitle}>
            Manage all {products.length} products, add specifications, prices, and upload gallery images.
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Product
        </button>
      </div>

      {/* Shopify Integration Status Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0d233a 0%, #123456 100%)",
        border: "1px solid #C5A059",
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(197, 160, 89, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: "#C5A059"
          }}>
            🛍️
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <strong style={{ fontSize: "1rem", color: "#FDFDFD" }}>Shopify Live Catalog Backend Connected</strong>
              <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "12px", background: "#2E7D32", color: "#fff", fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#C2CBD4" }}>
              All product titles, descriptions, images, prices, variants (sizes, colors), inventory, and collections can be managed directly in Shopify Admin. Changes reflect automatically on the customer storefront.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="https://admin.shopify.com/store/a3g0h2-ss/products"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#C5A059",
              color: "#123456",
              fontWeight: 700,
              fontSize: "0.85rem",
              padding: "0.6rem 1.1rem",
              borderRadius: "5px",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(197, 160, 89, 0.3)"
            }}
          >
            Open Shopify Products Admin ↗
          </a>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by name, SKU or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.catSelect}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <p className={styles.loadingText}>Loading catalogue...</p>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumbWrapper}>
                          <Image
                            src={p.images[0] || "/assets/category-textiles.jpg"}
                            alt={p.name}
                            width={48}
                            height={48}
                            className={styles.thumb}
                          />
                        </div>
                        <div>
                          <strong>{p.name}</strong>
                          <span className={styles.skuText}>SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span>{p.category}</span>
                      <span className={styles.subCatText}>{p.subcategory}</span>
                    </td>
                    <td>
                      <strong>
                        {p.price !== null ? `₹${p.price.toLocaleString("en-IN")}` : "Get Quote"}
                      </strong>
                    </td>
                    <td>
                      <span className={p.inStock ? styles.badgeInStock : styles.badgeOutOfStock}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`${styles.toggleBtn} ${p.isFeatured ? styles.toggleActive : ""}`}
                        title="Click to toggle featured status on homepage"
                      >
                        {p.isFeatured ? "★ Featured" : "☆ Standard"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`${styles.statusPill} ${p.isPublished ? styles.published : styles.draft}`}
                      >
                        {p.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => openEditModal(p)}
                          className={styles.editBtn}
                          title="Edit Product"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className={styles.deleteBtn}
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className={styles.form}>
              <div className={styles.formGrid}>
                {/* Title */}
                <div className={styles.colFull}>
                  <label className={styles.label}>Product Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    placeholder="e.g. Handcrafted Banarasi Pure Silk Saree"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Tagline */}
                <div className={styles.colFull}>
                  <label className={styles.label}>Tagline / Short Hook</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Heritage weave, contemporary grace"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                {/* Category & Subcategory */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Category *</label>
                  <select
                    className={styles.select}
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>Subcategory</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Sarees, Notebooks, Corporate Gifts"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  />
                </div>

                {/* Pricing & SKU */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Pricing Model</label>
                  <select
                    className={styles.select}
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as "fixed" | "quote")}
                  >
                    <option value="fixed">Fixed Price (INR)</option>
                    <option value="quote">Get Quote / Wholesale Inquiry</option>
                  </select>
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>
                    {priceType === "fixed" ? "Price (₹ INR) *" : "Quote Note"}
                  </label>
                  {priceType === "fixed" ? (
                    <input
                      type="number"
                      required
                      min="1"
                      className={styles.input}
                      placeholder="e.g. 3800"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Custom quotation based on volume"
                      value={priceNote}
                      onChange={(e) => setPriceNote(e.target.value)}
                    />
                  )}
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>SKU Identifier</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>Price Note / Unit</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Per piece (Inclusive of Taxes)"
                    value={priceNote}
                    onChange={(e) => setPriceNote(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className={styles.colFull}>
                  <label className={styles.label}>Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    className={styles.textarea}
                    placeholder="Describe craftsmanship, heritage, materials, and occasion suitability..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Image Upload Section */}
                <div className={styles.colFull}>
                  <label className={styles.label}>Product Images</label>
                  <div className={styles.imageUploadArea}>
                    <div className={styles.imageThumbnails}>
                      {images.map((imgUrl, idx) => (
                        <div key={idx} className={styles.uploadedThumb}>
                          <Image src={imgUrl} alt="Thumbnail" width={64} height={64} className={styles.thumbImg} />
                          <button
                            type="button"
                            className={styles.removeThumbBtn}
                            onClick={() => handleRemoveImage(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    <button
                      type="button"
                      className={styles.uploadBtn}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? "Uploading Image..." : "📷 Upload Product Image"}
                    </button>
                    <span className={styles.uploadHint}>
                      Supports JPG, PNG, WEBP. Uploaded directly to your website server.
                    </span>
                  </div>
                </div>

                {/* Specifications Builder */}
                <div className={styles.colFull}>
                  <div className={styles.sectionHeaderFlex}>
                    <label className={styles.label}>Technical Specifications</label>
                    <button type="button" onClick={addSpecRow} className={styles.addSmallBtn}>
                      + Add Specification Row
                    </button>
                  </div>
                  <div className={styles.specRows}>
                    {specs.map((spec, idx) => (
                      <div key={idx} className={styles.specRow}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Spec Label (e.g. Material)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                        />
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Spec Value (e.g. Pure Silk)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.rowDeleteBtn}
                          onClick={() => removeSpecRow(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className={styles.colFull}>
                  <div className={styles.toggleRow}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <span>Publish Live Immediately</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                      />
                      <span>Feature on Homepage</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                      />
                      <span>In Stock</span>
                    </label>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                      />
                      <span>Mark as New Arrival</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={styles.saveBtn}
                >
                  {formLoading ? "Saving Product..." : editingProduct ? "Save Changes" : "Publish Product →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
