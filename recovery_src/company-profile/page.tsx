import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CompanyProfileClient from "./CompanyProfileClient";

export const metadata: Metadata = {
  title: "Company Vision & Corporate Profile — कंपनी का विज़न | BHAYA INDIA",
  description:
    "Official corporate profile and vision of Bhaya India — authentic Indian commerce, local merchant empowerment, institutional trade, and heritage values.",
};

export default function CompanyProfilePage() {
  return (
    <>
      <Header />
      <CompanyProfileClient />
      <Footer />
    </>
  );
}
