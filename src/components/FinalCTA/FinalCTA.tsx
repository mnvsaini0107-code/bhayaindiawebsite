"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./FinalCTA.module.css";
import EnquiryModal from "@/components/EnquiryModal/EnquiryModal";

const WHATSAPP_NUMBER = "919876543210";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Bhaya%20India%2C%20I%20would%20like%20to%20enquire%20about%20your%20products%20and%20catalogue.`;

export default function FinalCTA() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <section className={`section ${styles.ctaSection}`} aria-labelledby="final-cta-heading">
        <div className="container container--narrow">
          <div className={styles.inner}>
            <div className="eyebrow eyebrow--gold">
              <span className="eyebrow-line" />
              Acquisitions & Bespoke Commissions
            </div>

            <h2 className={styles.heading} id="final-cta-heading">
              Ready to Experience Certified Craftsmanship?
            </h2>

            <p className={styles.subtext}>
              Discover curated varieties across pure silk handlooms, luxury corporate stationery, festive gifting trunks, and institutional supplies — or connect directly with our client desk for bespoke orders.
            </p>

            <div className={styles.actions}>
              <Link
                href="/products"
                className="btn btn-primary"
                id="final-explore-products-btn"
              >
                Explore Full Catalogue
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="btn btn-secondary"
                id="final-enquire-desk-btn"
              >
                Commercial Inquiry Desk
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappSubtle}
                id="final-whatsapp-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.998 2C6.477 2 2 6.484 2 12.017c0 1.99.518 3.869 1.424 5.49L2 22l4.618-1.41A9.917 9.917 0 0 0 12 22.033c5.52 0 9.998-4.484 9.998-10.016C21.998 6.484 17.52 2 11.998 2zm0 18.338a8.28 8.28 0 0 1-4.22-1.155l-.302-.18-3.13.955.832-3.048-.198-.313A8.273 8.273 0 0 1 3.72 12.017c0-4.57 3.718-8.286 8.278-8.286 4.556 0 8.275 3.716 8.275 8.286 0 4.571-3.72 8.321-8.275 8.321z"/>
                </svg>
                WhatsApp Desk
              </a>
            </div>
          </div>
        </div>
      </section>

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        productName="General Catalogue & Enterprise Allocation"
      />
    </>
  );
}
