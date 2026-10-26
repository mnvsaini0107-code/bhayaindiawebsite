import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import BecomeSellerClient from "./BecomeSellerClient";

export const metadata: Metadata = {
  title: "Become a Seller — Grow Your Business Online | BHAYA INDIA",
  description:
    "क्या आप दुकानदार या manufacturer हैं? BHAYA INDIA के साथ जुड़कर अपने व्यापार को ऑनलाइन और पूरे भारत में पहुँचाएं।",
};

export default function BecomeSellerPage() {
  return (
    <>
      <Header />
      <BecomeSellerClient />
      <Footer />
    </>
  );
}
