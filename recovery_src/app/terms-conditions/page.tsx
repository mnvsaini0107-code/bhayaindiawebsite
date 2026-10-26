import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../privacy-policy/legal.module.css";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Terms & Conditions — Bhaya India",
  description: "Official terms of service and commercial sale conditions for Bhaya India transactions.",
};

export default function TermsConditionsPage() {
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
              <span>Terms & Conditions</span>
            </div>
            <h1 className={styles.title}>Terms & Conditions</h1>
            <p className={styles.updated}>Last Updated: September 2026</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.content}>
            <section>
              <h2>1. Commercial Relationship & Scope</h2>
              <p>
                These terms govern all transactions, bulk quotations, and online purchases completed on the Bhaya India website. By accessing our catalogue, requesting quotations, or placing orders, you agree to abide by these terms.
              </p>
            </section>

            <section>
              <h2>2. Product Representations & Specifications</h2>
              <p>
                We strive for meticulous accuracy in describing fabrics, pure silk compositions, paper GSMs, brass dimensions, and hamper contents. However, as many of our pieces involve genuine handloom weaving and artisan metal casting, slight natural variances in texture, weave rhythm, and antique patina are hallmarks of authentic Indian craftsmanship.
              </p>
            </section>

            <section>
              <h2>3. Pricing, Taxes & Payment Verification</h2>
              <p>
                All retail prices displayed in our catalogue are quoted in Indian Rupees (INR) inclusive of applicable Goods and Services Tax (GST). For institutional quotations, price slabs are confirmed via official pro-forma invoice. Orders are dispatched upon verified payment settlement through UPI, Net Banking, or certified cards.
              </p>
            </section>

            <section>
              <h2>4. Shipping, Transit Risk & Quality Inspection</h2>
              <p>
                Every order undergoes pre-dispatch quality verification. Shipments are consigned to certified national logistics couriers. Transit tracking is provided upon dispatch. In the rare event of transit damage, clients must document package condition and notify us within 48 hours for immediate replacement.
              </p>
            </section>

            <section>
              <h2>5. Governing Jurisdiction</h2>
              <p>
                All commercial agreements and transactions are governed under the laws of India, subject to the jurisdiction of courts in New Delhi, India.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
