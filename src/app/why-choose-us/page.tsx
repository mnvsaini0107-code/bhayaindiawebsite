import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import WhyChooseUsClient from "./WhyChooseUsClient";

export const metadata: Metadata = {
  title: "Why Bhaya India — भाया इंडिया क्यों चुनें? | Core Values & Trust Pillars",
  description:
    "Discover why enterprises, retailers, and discerning individuals trust Bhaya India for verified craftsmanship, transparent pricing, and nationwide fulfillment.",
};

export default function WhyChooseUsPage() {
  return (
    <>
      <Header />
      <WhyChooseUsClient />
      <Footer />
    </>
  );
}
