import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TrackOrderClient from "./TrackOrderClient";
import styles from "./track-order.module.css";

export const metadata: Metadata = {
  title: "Track Order Status — BHAYA INDIA Consignment Tracking",
  description:
    "Live order and shipment tracking for BHAYA INDIA customers. Track courier delivery status, carrier dispatch, and estimated arrival across India.",
};

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main className={styles.trackPage}>
        <Suspense
          fallback={
            <div className={styles.container} style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "var(--navy, #123456)", fontWeight: 600 }}>Loading Tracking Desk...</p>
            </div>
          }
        >
          <TrackOrderClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
