import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Sourcing, Wholesale & Business Solutions | BHAYA INDIA",
  description:
    "Bhaya India business services: product sourcing, corporate gifting, wholesale B2B supply, custom branding, and future hyperlocal fulfillment network.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServicesClient />
      <Footer />
    </>
  );
}
