"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Product, Category, ProductSpec, MediaAsset } from "@/lib/types";
import {
  Upload,
  X,
  ArrowLeft,
  ArrowRight,
  Star,
  Trash2,
  ImageIcon,
} from "lucide-react";
import styles from "./products.module.css";

type StatusTab = "all" | "approved" | "needs_review" | "draft" | "archived";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");

  // Media Library state & Lightbox
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

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
  const [compareAtPrice, setCompareAtPrice] = useState<string>("");
  const [priceNote, setPriceNote] = useState("");
  const [stockQuantity, setStockQuantity] = useState<string>("50");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");
  const [reviewStatus, setReviewStatus] = useState<"Approved" | "Needs Review" | "Unpublished">("Approved");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
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
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalogue = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products?scope=admin"),
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

  const fetchMediaAssets = async () => {
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
    fetchCatalogue();
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
    setCompareAtPrice("");
    setPriceNote("Per piece (Inclusive of Taxes)");
    setStockQuantity("50");
    setStatus("published");
    setReviewStatus("Approved");
    setImageUrlInput("");
    setImages([]);
    setAltText("");
    setWhatsappMessage("");
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
    setFaqs([]);
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
    setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : "");
    setPriceNote(p.priceNote || "");
    setStockQuantity(
      p.stockQuantity !== undefined ? p.stockQuantity.toString() : p.inStock ? "50" : "0"
    );
    setStatus(
      p.status === "archived" ? "archived" : p.status === "draft" ? "draft" : "published"
    );
    setReviewStatus(p.reviewStatus || (p.isPublished ? "Approved" : "Needs Review"));
    setImageUrlInput("");
    setImages(p.images && p.images.length > 0 ? p.images : []);
    setAltText(p.altText || "");
    setWhatsappMessage(p.whatsappMessage || "");
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setIsNew(Boolean(p.isNew));
    setInStock(p.inStock);
    setSku(p.sku);
    setSpecs(p.specs && p.specs.length > 0 ? p.specs : [{ label: "Material", value: "" }]);
    setFeatures(p.features && p.features.length > 0 ? p.features : [""]);
    setBenefits(p.benefits && p.benefits.length > 0 ? p.benefits : [""]);
    setFaqs(
      p.productFaqs && p.productFaqs.length > 0
        ? p.productFaqs.map((f) => ({ question: f.question, answer: f.answer }))
        : []
    );
    setIsModalOpen(true);
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.url) {
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

  // Image gallery controls
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  // Open Media Picker
  const openMediaPicker = () => {
    setIsMediaPickerOpen(true);
    setSelectedMediaUrl(null);
    fetchMediaAssets();
  };

  const handleSelectMedia = (url: string) => {
    setSelectedMediaUrl(url);
  };

  const handleConfirmMediaSelection = () => {
    if (selectedMediaUrl) {
      setImages((prev) => (prev.includes(selectedMediaUrl) ? prev : [...prev, selectedMediaUrl]));
    }
    setIsMediaPickerOpen(false);
  };

  // Specs & FAQs
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

  const addFaqRow = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const updateFaqRow = (index: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const removeFaqRow = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Save product with strict image verification and neutral fallback
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const categoryObj = categories.find((c) => c.slug === categorySlug);
    const catName = categoryObj ? categoryObj.name : "General";

    // Clean and check images
    const cleanImages = images.filter((img) => img && img.trim().length > 0);
    const hasAuthenticImage = cleanImages.some(
      (img) => !img.includes("image-coming-soon.svg") && !img.includes("category-textiles")
    );

    // If no authentic image, use neutral coming soon placeholder and force review
    const finalImages = cleanImages.length > 0 ? cleanImages : ["/assets/image-coming-soon.svg"];
    const effectiveReviewStatus = hasAuthenticImage ? reviewStatus : "Needs Review";
    const effectivePublished = effectiveReviewStatus === "Approved" && isPublished;

    const payload = {
      name,
      category: catName,
      categorySlug,
      subcategory: subcategory || "General",
      tagline,
      description,
      price: priceType === "quote" ? null : price ? Number(price) : null,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stockQuantity: Number(stockQuantity) || 0,
      status:
        status === "archived"
          ? "archived"
          : effectiveReviewStatus === "Approved"
          ? effectivePublished
            ? "published"
            : "draft"
          : effectiveReviewStatus === "Needs Review"
          ? "needs_review"
          : "draft",
      reviewStatus: effectiveReviewStatus,
      priceNote,
      images: finalImages,
      altText: altText || `${name} — Bhaya India Authentic Handicraft`,
      whatsappMessage:
        whatsappMessage ||
        `Namaste Bhaya India, I am interested in inquiring about ${name} (SKU: ${sku}). Please share details.`,
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      features: features.filter((f) => f.trim()),
      benefits: benefits.filter((b) => b.trim()),
      productFaqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      isFeatured,
      isPublished: effectivePublished,
      isNew,
      inStock: inStock && (Number(stockQuantity) > 0 || stockQuantity === ""),
      sku,
      seoTitle: `${name} — Bhaya India`,
      seoDescription: description.slice(0, 160),
    };

    try {
      if (editingProduct) {
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

  // Quick Review Status Actions
  const handleQuickStatus = async (
    p: Product,
    targetReview: "Approved" | "Needs Review" | "Unpublished",
    targetStatus: "published" | "draft" | "archived" | "needs_review"
  ) => {
    try {
      const isPub = targetReview === "Approved" && targetStatus === "published";
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewStatus: targetReview,
          status: targetStatus,
          isPublished: isPub,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCatalogue();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (e) {
      console.error("Quick status update error", e);
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

  // Status counts
  const countAll = products.length;
  const countApproved = products.filter(
    (p) => p.reviewStatus === "Approved" || (p.isPublished && p.status === "published")
  ).length;
  const countNeedsReview = products.filter(
    (p) => p.reviewStatus === "Needs Review" || p.status === "needs_review"
  ).length;
  const countDraft = products.filter(
    (p) =>
      p.reviewStatus === "Unpublished" ||
      p.status === "draft" ||
      (!p.isPublished && p.status !== "archived" && p.reviewStatus !== "Needs Review")
  ).length;
  const countArchived = products.filter((p) => p.status === "archived").length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === "all" || p.categorySlug === selectedCat;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    if (!matchCat || !matchSearch) return false;

    const rev = (p.reviewStatus || "").toLowerCase();
    const stat = (p.status || "").toLowerCase();

    if (statusFilter === "approved") {
      return rev === "approved" || (p.isPublished && stat === "published");
    }
    if (statusFilter === "needs_review") {
      return rev === "needs review" || stat === "needs_review";
    }
    if (statusFilter === "draft") {
      return (
        rev === "unpublished" ||
        stat === "draft" ||
        (!p.isPublished && stat !== "archived" && rev !== "needs review")
      );
    }
    if (statusFilter === "archived") {
      return stat === "archived";
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Product Catalogue Management</h1>
          <p className={styles.subTitle}>
            Manage all {products.length} products, review authentic images, configure specifications, and control publication.
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          + Add New Product
        </button>
      </div>



      {/* Review Workflow Status Filter Tabs */}
      <div className={styles.statusTabs}>
        <button
          className={`${styles.statusTab} ${statusFilter === "all" ? styles.statusTabActive : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All Items <span className={styles.countPill}>{countAll}</span>
        </button>
        <button
          className={`${styles.statusTab} ${statusFilter === "approved" ? styles.statusTabActive : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved / Live <span className={styles.countPill}>{countApproved}</span>
        </button>
        <button
          className={`${styles.statusTab} ${statusFilter === "needs_review" ? styles.statusTabActive : ""}`}
          onClick={() => setStatusFilter("needs_review")}
        >
          Needs Review <span className={styles.countPill}>{countNeedsReview}</span>
        </button>
        <button
          className={`${styles.statusTab} ${statusFilter === "draft" ? styles.statusTabActive : ""}`}
          onClick={() => setStatusFilter("draft")}
        >
          Draft / Unpublished <span className={styles.countPill}>{countDraft}</span>
        </button>
        <button
          className={`${styles.statusTab} ${statusFilter === "archived" ? styles.statusTabActive : ""}`}
          onClick={() => setStatusFilter("archived")}
        >
          Archived <span className={styles.countPill}>{countArchived}</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search products by name, SKU or keyword..."
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
                  <th>Product & Authentic Image</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Review Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const isApproved =
                    p.reviewStatus === "Approved" ||
                    (p.isPublished && p.status === "published" && p.reviewStatus !== "Needs Review");
                  const isNeedsReview =
                    p.reviewStatus === "Needs Review" || p.status === "needs_review";
                  const isArchived = p.status === "archived";

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div
                            className={styles.thumbWrapper}
                            onClick={() => setPreviewImage(p.images[0] || "/assets/image-coming-soon.svg")}
                            title="Click to preview image"
                            style={{ cursor: "pointer" }}
                          >
                            <Image
                              src={p.images[0] || "/assets/image-coming-soon.svg"}
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
                          {p.isFeatured ? "Featured" : "Standard"}
                        </button>
                      </td>
                      <td>
                        {isApproved ? (
                          <span className={styles.badgeApproved}>Approved / Live</span>
                        ) : isNeedsReview ? (
                          <span className={styles.badgeNeedsReview}>Needs Review</span>
                        ) : isArchived ? (
                          <span className={styles.badgeArchived}>Archived</span>
                        ) : (
                          <span className={styles.badgeDraft}>Unpublished</span>
                        )}

                        {/* Quick Workflow Action Buttons */}
                        <div className={styles.quickActionGroup}>
                          {!isApproved && (
                            <button
                              type="button"
                              className={styles.quickApproveBtn}
                              onClick={() => handleQuickStatus(p, "Approved", "published")}
                              title="Approve & make visible publicly"
                            >
                              Approve
                            </button>
                          )}
                          {!isNeedsReview && (
                            <button
                              type="button"
                              className={styles.quickReviewBtn}
                              onClick={() => handleQuickStatus(p, "Needs Review", "needs_review")}
                              title="Flag for image review"
                            >
                              Needs Review
                            </button>
                          )}
                          {isApproved && (
                            <button
                              type="button"
                              className={styles.quickUnpublishBtn}
                              onClick={() => handleQuickStatus(p, "Unpublished", "draft")}
                              title="Unpublish from storefront"
                            >
                              Unpublish
                            </button>
                          )}
                        </div>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div className={styles.lightboxOverlay} onClick={() => setPreviewImage(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxCloseBtn} onClick={() => setPreviewImage(null)}>
              ✕
            </button>
            <Image
              src={previewImage}
              alt="Preview"
              width={600}
              height={600}
              style={{ maxHeight: "80vh", width: "auto", borderRadius: "8px", objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isMediaPickerOpen && (
        <div className={styles.mediaPickerOverlay} onClick={() => setIsMediaPickerOpen(false)}>
          <div className={styles.mediaPickerModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Select Image from Media Library</h2>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                  Choose authentic verified product photographs from your catalogue assets.
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
                placeholder="Search assets by filename or description..."
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
                      onClick={() => handleSelectMedia(m.url)}
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
                onClick={handleConfirmMediaSelection}
              >
                Add Selected to Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={18} />
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
                    placeholder="e.g. Handcrafted Brass Puja Kalash & Thali Ensemble"
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
                    placeholder="e.g. Traditional Vedic Ritual Craftsmanship with Sacred Motifs"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                {/* Category & Subcategory */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Primary Category *</label>
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
                  <label className={styles.label}>Subcategory / Collection</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Puja Samagri, Vivah Soop, Jaymala"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                  />
                </div>

                {/* Pricing Type */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Pricing Model</label>
                  <select
                    className={styles.select}
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as "fixed" | "quote")}
                  >
                    <option value="fixed">Fixed Price (₹ INR)</option>
                    <option value="quote">Price on Enquiry / Get Quote</option>
                  </select>
                </div>

                {priceType === "fixed" ? (
                  <div className={styles.colHalf}>
                    <label className={styles.label}>Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className={styles.input}
                      placeholder="e.g. 1850"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className={styles.colHalf}>
                    <label className={styles.label}>Enquiry Label</label>
                    <input
                      type="text"
                      disabled
                      className={styles.input}
                      value="Display 'Get Quote' button on storefront"
                    />
                  </div>
                )}

                <div className={styles.colHalf}>
                  <label className={styles.label}>Original / Compare Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    placeholder="e.g. 2500"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                  />
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    placeholder="e.g. 50"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>

                {/* Review Workflow Status */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Content Review Workflow Status *</label>
                  <select
                    className={styles.select}
                    value={reviewStatus}
                    onChange={(e) =>
                      setReviewStatus(e.target.value as "Approved" | "Needs Review" | "Unpublished")
                    }
                  >
                    <option value="Approved">Approved (Publicly Visible)</option>
                    <option value="Needs Review">Needs Review (Hidden until image verified)</option>
                    <option value="Unpublished">Unpublished (Work In Progress)</option>
                  </select>
                </div>

                <div className={styles.colFull}>
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
                    placeholder="Describe craftsmanship, materials, cultural significance, and occasion suitability..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Gallery Management with Reorder, Preview, & Media Library Picker */}
                <div className={styles.colFull}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label className={styles.label} style={{ margin: 0 }}>
                      Product Images & Gallery (Reorder & Set Primary)
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.35rem 0.75rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                      }}
                      onClick={openMediaPicker}
                    >
                      <ImageIcon size={14} />
                      Choose from Media Library
                    </button>
                  </div>

                  <div className={styles.imageUploadArea}>
                    {/* Gallery Cards */}
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`${styles.galleryCard} ${idx === 0 ? styles.galleryCardPrimary : ""}`}
                        >
                          {idx === 0 && <span className={styles.galleryPrimaryTag}>Primary</span>}
                          <Image
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            width={100}
                            height={100}
                            className={styles.galleryImg}
                            onClick={() => setPreviewImage(imgUrl)}
                            title="Click to preview large"
                          />
                          <div className={styles.galleryCardControls}>
                            {idx > 0 && (
                              <button
                                type="button"
                                className={styles.galleryControlBtn}
                                onClick={() => handleMoveImage(idx, -1)}
                                title="Move Left"
                              >
                                <ArrowLeft size={12} />
                              </button>
                            )}
                            {idx !== 0 && (
                              <button
                                type="button"
                                className={styles.galleryControlBtn}
                                onClick={() => handleSetPrimaryImage(idx)}
                                title="Make Primary"
                              >
                                <Star size={12} />
                              </button>
                            )}
                            {idx < images.length - 1 && (
                              <button
                                type="button"
                                className={styles.galleryControlBtn}
                                onClick={() => handleMoveImage(idx, 1)}
                                title="Move Right"
                              >
                                <ArrowRight size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              className={styles.galleryDeleteBtn}
                              onClick={() => handleRemoveImage(idx)}
                              title="Remove Image"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Manual URL input */}
                    <div style={{ display: "flex", gap: "8px", width: "100%", margin: "8px 0" }}>
                      <input
                        type="url"
                        className={styles.input}
                        placeholder="Paste image URL (e.g. /assets/products/... or https://...)"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: "0 16px", whiteSpace: "nowrap" }}
                        onClick={() => {
                          if (imageUrlInput.trim()) {
                            setImages((prev) => [...prev, imageUrlInput.trim()]);
                            setImageUrlInput("");
                          }
                        }}
                      >
                        Add URL
                      </button>
                    </div>

                    {/* File Upload input */}
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
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        justifyContent: "center",
                      }}
                    >
                      <Upload size={15} />
                      <span>{uploadLoading ? "Uploading Image..." : "Upload New Image File"}</span>
                    </button>
                    <span className={styles.uploadHint}>
                      Supports JPG, PNG, WEBP. Uploads directly to your server and auto-indexes in the Media Library.
                    </span>
                  </div>
                </div>

                {/* Alt Text & WhatsApp Message */}
                <div className={styles.colHalf}>
                  <label className={styles.label}>Image Alt Text (SEO & Accessibility)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Traditional Brass Puja Kalash by Bhaya India"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                  />
                </div>

                <div className={styles.colHalf}>
                  <label className={styles.label}>Custom WhatsApp Enquiry Message</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Leave blank for automatic smart message"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                  />
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
                          placeholder="Spec Value (e.g. Solid Brass)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles.rowDeleteBtn}
                          onClick={() => removeSpecRow(idx)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product FAQs Builder */}
                <div className={styles.colFull}>
                  <div className={styles.sectionHeaderFlex}>
                    <label className={styles.label}>Product-Specific FAQs</label>
                    <button type="button" onClick={addFaqRow} className={styles.addSmallBtn}>
                      + Add FAQ Question
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                          background: "#f8fafc",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="Question (e.g. Is this pure brass?)"
                            value={faq.question}
                            onChange={(e) => updateFaqRow(idx, "question", e.target.value)}
                          />
                          <button
                            type="button"
                            className={styles.rowDeleteBtn}
                            onClick={() => removeFaqRow(idx)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          className={styles.textarea}
                          placeholder="Answer..."
                          value={faq.answer}
                          onChange={(e) => updateFaqRow(idx, "answer", e.target.value)}
                        />
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
                      <span>Publish Live Immediately (if Approved)</span>
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
                <button type="submit" disabled={formLoading} className={styles.saveBtn}>
                  {formLoading
                    ? "Saving Product..."
                    : editingProduct
                    ? "Save Changes"
                    : "Create & Save Product →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
