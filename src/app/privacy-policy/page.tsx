import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./legal.module.css";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Privacy Policy — Bhaya India",
  description: "Official privacy policy and customer data protection standards of Bhaya India.",
};

export default function PrivacyPolicyPage() {
  const settings = getSiteSettings();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className="container">
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span className={styles.sep}>/</span>
              <span>Privacy Policy</span>
            </div>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last Updated: September 2026</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.content}>
            <section>
              <h2>1. Commitment to Customer Privacy</h2>
              <p>
                At Bhaya India (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;), we recognize that customer trust is the cornerstone of our business, embodied in our motto &ldquo;जहाँ भाया, वहाँ भरोसा&rdquo;. We are committed to safeguarding the personal data of all visitors, corporate clients, and buyers who interact with our website and services.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <p>
                We only collect data necessary to fulfill commercial transactions, deliver goods, and respond to enquiries:
              </p>
              <ul>
                <li><strong>Contact Information:</strong> Name, delivery address, phone number, and email address provided during checkout or enquiry submission.</li>
                <li><strong>Transactional Details:</strong> Records of products purchased, order values, and payment status. We do not store raw credit card credentials or banking passwords on our servers.</li>
                <li><strong>Communication Records:</strong> Queries submitted through our online forms, WhatsApp concierge, or telephone support.</li>
              </ul>
            </section>

            <section>
              <h2>3. Purpose of Processing</h2>
              <p>Your information is used strictly for:</p>
              <ul>
                <li>Processing orders, shipping products via insured logistics couriers, and sending dispatch notifications.</li>
                <li>Responding to bulk quotations, RFPs, and customer service requests.</li>
                <li>Complying with applicable Indian commercial, tax, and GST statutory requirements.</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Sharing & Security</h2>
              <p>
                We do not sell, rent, or trade your personal information. Data is shared solely with certified payment processors (to settle payments) and national logistics carriers (to deliver your physical shipments). All transmissions are protected with industry-standard 256-bit SSL encryption.
              </p>
            </section>

            <section>
              <h2>5. Contact Our Privacy Desk</h2>
              <p>
                For questions regarding data records or deletion requests, contact our compliance officer at{" "}
                <a href={`mailto:${settings.email}`}>{settings.email}</a> or visit {settings.address}.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
