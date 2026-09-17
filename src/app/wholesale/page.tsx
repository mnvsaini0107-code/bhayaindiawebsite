import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import WholesaleClient from "./WholesaleClient";

export const metadata: Metadata = {
  title: "Wholesale & B2B Supply — Bulk Orders & Factory Sourcing | BHAYA INDIA",
  description:
    "BHAYA INDIA थोक व्यापार (Wholesale & B2B): थोक दरों पर गुणवत्तापूर्ण उत्पाद • सीधा फैक्ट्री से सोर्सिंग • आसान ऑर्डरिंग।",
};

export default function WholesalePage() {
  return (
    <>
      <Header />
      <WholesaleClient />
      <Footer />
    </>
  );
}
