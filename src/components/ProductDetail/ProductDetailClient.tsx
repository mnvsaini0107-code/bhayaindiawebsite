"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import styles from "./ProductDetailClient.module.css";

interface Props {
  product: Product;
  whatsappNumber: string;
  phone: string;
}

export default function ProductDetailClient({ product, whatsappNumber, phone }: Props) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "/assets/category-textiles.jpg");
  const [added, setAdded] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Enquiry form state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState(
    `Hello Bhaya India, I am interested in purchasing "${product.name}". Please provide availability, dispatch timeline, and terms.`
  );

  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!product.price) {
      setEnquiryOpen(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: selectedImage,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product.price) {
      setEnquiryOpen(true);
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: selectedImage,
      category: product.category,
    });
    router.push("/checkout");
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          email,
          productName: product.name,
          productId: product.id,
          quantity: Number(quantity) || 1,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
        setTimeout(() => {
          setEnquirySuccess(false);
          setEnquiryOpen(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Enquiry submit error", err);
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Pre-filled WhatsApp format required by PRD Section 21:
  // "Hello BHAYA INDIA, I am interested in [PRODUCT NAME]. Please share more details."
  const whatsappText = `Hello BHAYA INDIA, I am interested in ${product.name}. Please share more details.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className={styles.clientWrapper}>
      {/* Image Gallery Switcher */}
      <div className={styles.galleryArea}>
        <div className={styles.mainImageContainer}>
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            priority
            className={styles.mainImage}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {product.isNew && <span className={styles.newBadge}>New Arrival</span>}
        </div>

        {product.images && product.images.length > 1 && (
          <div className={styles.thumbStrip}>
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.thumbBtn} ${selectedImage === img ? styles.thumbActive : ""}`}
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt={`View ${i + 1}`} width={64} height={64} className={styles.thumbImg} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Primary Actions Strip */}
      <div className={styles.actionsBox}>
        <div className={styles.buttonRow}>
          {product.price !== null ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`btn btn-primary ${styles.btnPrimary}`}
                id={`btn-add-cart-${product.sku}`}
              >
                {added ? "✓ Added to Shopping Bag" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className={`btn btn-secondary ${styles.btnSecondary}`}
                id={`btn-buy-now-${product.sku}`}
              >
                Buy Now
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className={`btn btn-primary ${styles.btnPrimary}`}
            >
              Request Custom Quotation
            </button>
          )}

          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className={styles.btnEnquire}
          >
            Enquire Now
          </button>
        </div>

        <div className={styles.contactLinksRow}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
            id={`btn-whatsapp-${product.sku}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z" />
            </svg>
            Enquire on WhatsApp
          </a>

          <a href={`tel:${phone}`} className={styles.callLink}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.59 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.35 5.35l.92-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15.93l.02.99z" />
            </svg>
            Call Desk
          </a>
        </div>
      </div>

      {/* Real Enquiry Modal */}
      {enquiryOpen && (
        <div className={styles.modalOverlay} onClick={() => setEnquiryOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalEyebrow}>DIRECT INQUIRY</span>
                <h3>Enquire About {product.name}</h3>
              </div>
              <button className={styles.modalClose} onClick={() => setEnquiryOpen(false)}>
                ✕
              </button>
            </div>

            {enquirySuccess ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>✓</span>
                <h4>Enquiry Received</h4>
                <p>Our client desk will reach out via WhatsApp / phone with quotes and delivery timelines.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className={styles.enquiryForm}>
                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="e.g. Rameshwar Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.formLabel}>Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      className={styles.formInput}
                      placeholder="+91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.formLabel}>Estimated Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className={styles.formInput}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.formLabel}>Message / Customization Details *</label>
                  <textarea
                    rows={3}
                    required
                    className={styles.formTextarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button type="submit" disabled={enquiryLoading} className="btn btn-primary">
                    {enquiryLoading ? "Submitting Lead..." : "Submit Inquiry to Admin →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
