import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BhayaIndia2Client from "./BhayaIndia2Client";

export const metadata: Metadata = {
  title: "BHAYA INDIA 2.0 — एक प्लेटफॉर्म, हजारों दुकानें, एक भरोसा",
  description:
    "BHAYA INDIA 2.0: Our next-generation hyperlocal business ecosystem connecting neighborhood merchants, manufacturers, and customers across India.",
};

export default function BhayaIndia2Page() {
  return (
    <>
      <Header />
      <BhayaIndia2Client />
      <Footer />
    </>
  );
}
