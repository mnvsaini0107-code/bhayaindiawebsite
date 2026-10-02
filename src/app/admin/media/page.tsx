"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { MediaAsset } from "@/lib/types";
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  HardDrive,
  FileImage,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import styles from "./media.module.css";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formattedSize, setFormattedSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
        setFormattedSize(data.formattedSize || "0 KB");
        setSelectedAsset((prev) => (prev ? prev : (data.assets && data.assets.length > 0 ? data.assets[0] : null)));
      }
    } catch (err) {
      console.error("Failed to fetch media assets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotice("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNotice(`Uploaded ${data.fileName} successfully!`);
        await fetchAssets();
        if (data.asset) setSelectedAsset(data.asset);
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setNotice("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    setSaving(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedAsset),
      });
      const data = await res.json();
      if (data.success) {
        setNotice("Media asset metadata & SEO alt text saved!");
        setAssets((prev) =>
          prev.map((a) => (a.id === selectedAsset.id ? selectedAsset : a))
        );
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Save media error:", err);
      setNotice("Error saving asset details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedAsset.filename}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/media?id=${selectedAsset.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const remaining = assets.filter((a) => a.id !== selectedAsset.id);
        setAssets(remaining);
        setSelectedAsset(remaining.length > 0 ? remaining[0] : null);
        setNotice("Asset deleted successfully.");
        setTimeout(() => setNotice(""), 3500);
      }
    } catch (err) {
      console.error("Delete asset error:", err);
    }
  };

  const handleCopyUrl = () => {
    if (!selectedAsset) return;
    const fullUrl = selectedAsset.url.startsWith("http")
      ? selectedAsset.url
      : `${window.location.origin}${selectedAsset.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter assets
  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      searchQuery === "" ||
      a.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.altEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.altHi.includes(searchQuery) ||
      (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "jpg" && (a.fileType.includes("jpeg") || a.fileType.includes("jpg"))) ||
      (typeFilter === "png" && a.fileType.includes("png")) ||
      (typeFilter === "webp" && a.fileType.includes("webp"));

    return matchesSearch && matchesType;
  });

  return (
    <div className={styles.page}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Media Library & Asset SEO</h1>
          <p className={styles.subtitle}>
            Upload brand imagery, configure dual-language image alt text (English & Hindi), and optimize asset delivery.
          </p>
        </div>
        <div className={styles.topActions}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            <Upload size={17} />
            <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {notice}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className={styles.filterCard}>
        <div className={styles.searchBox}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search assets by filename, alt text, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.typeFilters}>
          {["all", "jpg", "png", "webp"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`${styles.typeBtn} ${typeFilter === t ? styles.typeBtnActive : ""}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.storageSummary}>
          <HardDrive size={16} color="#64748b" />
          <span>
            <strong>{filteredAssets.length}</strong> assets • Total: <strong>{formattedSize}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid + Inspector Layout */}
      <div className={styles.contentLayout}>
        {/* Assets Grid */}
        <div>
          {loading ? (
            <p style={{ color: "#64748b", padding: "2rem 0" }}>Loading assets...</p>
          ) : filteredAssets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1.5rem",
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <FileImage size={36} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
              <h3 style={{ margin: "0 0 0.25rem", color: "var(--navy)" }}>No assets found</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                Upload an image or adjust your search filter.
              </p>
            </div>
          ) : (
            <div className={styles.assetsGrid}>
              {filteredAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                const hasMissingAlt = !asset.altEn || asset.altEn.trim() === "";

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`${styles.assetCard} ${isSelected ? styles.assetCardSelected : ""}`}
                  >
                    {hasMissingAlt && (
                      <span className={styles.altWarningBadge} title="Missing English Alt Text">
                        <AlertTriangle size={11} />
                        <span>No Alt</span>
                      </span>
                    )}
                    <div className={styles.thumbWrapper}>
                      <Image
                        src={asset.url}
                        alt={asset.altEn || asset.filename}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="180px"
                      />
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.filename}>{asset.filename}</div>
                      <div className={styles.fileMeta}>
                        <span>{asset.dimensions || "Image"}</span>
                        <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Inspector Drawer */}
        {selectedAsset && (
          <aside className={styles.inspectorCard}>
            <div className={styles.inspectorHeader}>
              <h2 className={styles.inspectorTitle}>Asset Details & SEO</h2>
              <a
                href={selectedAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View original image in new tab"
                style={{ color: "var(--navy)", display: "flex", alignItems: "center" }}
              >
                <ExternalLink size={16} />
              </a>
            </div>

            <div className={styles.previewWrapper}>
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.altEn || selectedAsset.filename}
                fill
                style={{ objectFit: "contain" }}
                sizes="380px"
              />
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Filename:</span>
                <span className={styles.infoValue}>{selectedAsset.filename}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Dimensions:</span>
                <span className={styles.infoValue}>{selectedAsset.dimensions || "Auto"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>File Size:</span>
                <span className={styles.infoValue}>
                  {(selectedAsset.fileSize / 1024).toFixed(1)} KB ({(selectedAsset.fileSize / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Format:</span>
                <span className={styles.infoValue}>{selectedAsset.fileType}</span>
              </div>
            </div>

            <form onSubmit={handleSaveDetails}>
              {/* English Alt Text */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Alt Text (English) <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={selectedAsset.altEn}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, altEn: e.target.value })
                  }
                  placeholder="Accurately describe the visible product/subject for search engines..."
                />
              </div>

              {/* Hindi Alt Text */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Alt Text (हिन्दी) — SEO Multilingual</label>
                <textarea
                  className={styles.formTextarea}
                  value={selectedAsset.altHi}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, altHi: e.target.value })
                  }
                  placeholder="छवि का सटीक हिन्दी विवरण (उदा. भाया इंडिया द्वारा हस्तनिर्मित उत्सव उपहार)..."
                />
              </div>

              {/* Title & Caption */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title Attribute</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={selectedAsset.title || ""}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, title: e.target.value })
                  }
                  placeholder="Optional title tooltip"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Usage Context</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={selectedAsset.usage || ""}
                  onChange={(e) =>
                    setSelectedAsset({ ...selectedAsset, usage: e.target.value })
                  }
                  placeholder="e.g. Hero Editorial, Festive Collection"
                />
              </div>

              <div className={styles.inspectorActions}>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : "Save SEO Details"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className={styles.copyBtn}
                  title="Copy direct image URL"
                >
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  <span>{copied ? "Copied" : "Copy URL"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={styles.deleteBtn}
                  title="Delete image asset"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={styles.optimizationNote}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
                  <Sparkles size={14} />
                  <strong>Web Performance Recommendation:</strong>
                </div>
                Next.js automatically serves responsive AVIF/WebP formats with caching. Providing accurate English and Hindi alt text ensures zero crawlability penalties.
              </div>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}
