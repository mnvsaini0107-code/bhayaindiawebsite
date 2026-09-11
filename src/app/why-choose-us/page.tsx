import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import Testimonials from "@/components/Testimonials/Testimonials";
import { getPageContent, getSiteSettings } from "@/lib/db";
import styles from "./why-choose-us.module.css";

export const metadata: Metadata = {
  title: "Why Choose Us — The Bhaya India Standard",
  description:
    "Discover why enterprises, retailers, and discerning individuals trust Bhaya India for certified craftsmanship, transparent pricing, and nationwide fulfillment.",
};

export default function WhyChooseUsPage() {
  const content = getPageContent();
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
              <span>Why Choose Us</span>
            </div>
            <span className={styles.eyebrow}>{content.whyBhaya.eyebrow}</span>
            <h1 className={styles.title}>{content.whyBhaya.headline}</h1>
            <p className={`${styles.tagline} font-devanagari`}>{settings.tagline}</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.pillarsGrid}>
            {content.whyBhaya.pillars.map((pillar, i) => (
              <div key={i} className={styles.pillarCard}>
                <div className={styles.pillarNumber}>0{i + 1}</div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.comparisonBox}>
            <div className={styles.compHeader}>
              <span className={styles.compEyebrow}>THE BHAYA INDIA DISTINCTION</span>
              <h2>How We Differ From Mass Marketplace Portals</h2>
            </div>

            <div className={styles.compTableWrapper}>
              <table className={styles.compTable}>
                <thead>
                  <tr>
                    <th>Attributes</th>
                    <th>Generic Online Marketplaces</th>
                    <th className={styles.highlightHeader}>Bhaya India Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sourcing Authenticity</td>
                    <td>Unverified third-party dropshippers</td>
                    <td className={styles.highlightCol}>Direct master weavers & certified mills</td>
                  </tr>
                  <tr>
                    <td>Quality Inspection</td>
                    <td>Dispatched blindly by third parties</td>
                    <td className={styles.highlightCol}>In-house multi-point quality check before dispatch</td>
                  </tr>
                  <tr>
                    <td>Pricing Integrity</td>
                    <td>Inflated markup with hidden fees</td>
                    <td className={styles.highlightCol}>Transparent factory rates with clear volume discounts</td>
                  </tr>
                  <tr>
                    <td>Corporate Customization</td>
                    <td>Rigid stock, no custom branding</td>
                    <td className={styles.highlightCol}>Bespoke foil stamping, embroidery & hampers</td>
                  </tr>
                  <tr>
                    <td>Customer Service</td>
                    <td>Automated AI bots and endless ticketing</td>
                    <td className={styles.highlightCol}>Dedicated human account concierge on call & WhatsApp</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <CredibilityStrip />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
