import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ManufacturersClient from "./ManufacturersClient";

export const metadata: Metadata = {
  title: "For Manufacturers — Direct Supply & B2B Growth | BHAYA INDIA",
  description:
    "BHAYA INDIA निर्माताओं को सीधे थोक खरीदारों, खुदरा विक्रेताओं और अंतिम ग्राहकों से जोड़ता है। बिना बिचौलियों के सीधा व्यापार • बेहतर मार्जिन • पूरे भारत में मांग।",
};

export default function ManufacturersPage() {
  return (
    <>
      <Header />
      <ManufacturersClient />
      <Footer />
    </>
  );
}
