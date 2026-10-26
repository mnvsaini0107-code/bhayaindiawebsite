import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FounderProfileClient from "./FounderProfileClient";
import { getPageContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "राम जी भाया — Founder & Visionary | BHAYA INDIA",
  description:
    "राम जी भाया, Bhaya India के संस्थापक एवं विज़नरी। जहाँ भाया, वहाँ भरोसा। Festival, Retail, Agro, Manufacturing, Logistics और Exports के क्षेत्रों में एक मजबूत भारतीय व्यवसायिक समूह।",
};

export default function FounderProfilePage() {
  const content = getPageContent();

  return (
    <>
      <Header />
      <FounderProfileClient founderContent={content?.founder} />
      <Footer />
    </>
  );
}
