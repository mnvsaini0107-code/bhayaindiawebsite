import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import styles from "./company-profile.module.css";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Company Profile — Corporate Identity & Governance",
  description:
    "Official corporate profile of Bhaya India — Indian craftsmanship, institutional trade, distribution governance, and heritage commerce.",
};

export default function CompanyProfilePage() {
  const settings = getSiteSettings();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Company Profile</span>
            </div>
            <span className={styles.eyebrow}>CORPORATE DOSSIER</span>
            <h1 className={styles.title}>Bhaya India Commercial Profile</h1>
            <p className={`${styles.tagline} font-devanagari`}>{settings.tagline}</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.badge}>FOUNDATIONAL PURPOSE</span>
              <h2>About Our Enterprise</h2>
              <p>
                Bhaya India is a multi-category Indian manufacturing, sourcing, and distribution enterprise
                operating across premium textiles, corporate stationery, festive gifting trunks, and handcrafted brassware.
                Established on principles of authenticity and direct merchant accountability, we bridge regional
                artisan clusters with modern enterprise supply chains.
              </p>
            </div>

            <div className={styles.card}>
              <span className={styles.badge}>PILLARS OF GOVERNANCE</span>
              <h2>Operational Principles</h2>
              <ul className={styles.list}>
                <li><strong>Strict Origin Provenance:</strong> Direct cluster sourcing without exploitative middlemen.</li>
                <li><strong>Certified Material Specifications:</strong> Lab-tested silk compositions, archival papers, and pure copper-brass metallurgy.</li>
                <li><strong>Transparent Contract Commercials:</strong> Fixed wholesale volume slabs with verified GST compliance.</li>
                <li><strong>Pan-India Supply Reliability:</strong> Express courier partnerships covering 19,000+ pincodes.</li>
              </ul>
            </div>

            <div className={styles.cardFull}>
              <span className={styles.badge}>KEY CAPABILITIES</span>
              <h2>Corporate Supply & Institutional Logistics</h2>
              <div className={styles.capsGrid}>
                <div className={styles.capBox}>
                  <h3>Textiles & Handloom Weaving</h3>
                  <p>Over 200+ handlooms across Varanasi and Chanderi weaving bridal silks, uniform bolts, and festive dupattas.</p>
                </div>
                <div className={styles.capBox}>
                  <h3>Executive Gifting & Stationery</h3>
                  <p>In-house gold foil stamping, custom leather debossing, and laser engraving for corporate orders.</p>
                </div>
                <div className={styles.capBox}>
                  <h3>Bespoke Festival Trunks</h3>
                  <p>Curated packaging with air-sealed organic confections, artisanal brassware, and customized message scrolls.</p>
                </div>
                <div className={styles.capBox}>
                  <h3>Nationwide Dispatch Network</h3>
                  <p>Centralized distribution hubs in North, West, and South India ensuring 48 to 72-hour delivery to major metro centers.</p>
                </div>
              </div>
            </div>

            <div className={styles.cardFull}>
              <div className={styles.contactBlock}>
                <div>
                  <h2>Corporate Enquiries & Institutional Contracting</h2>
                  <p>For RFPs, institutional uniform tenders, or bulk festive allocations, connect with our commercial directorate.</p>
                </div>
                <div className={styles.contactActions}>
                  <Link href="/contact" className="btn btn-primary">
                    Contact Commercial Team
                  </Link>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Hello%20Bhaya%20India%2C%20we%20would%20like%20to%20request%20your%20Company%20Profile%20and%20Wholesale%20Dossier.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Direct WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
