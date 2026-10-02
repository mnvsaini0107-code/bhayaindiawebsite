import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getShopifyProducts } from "@/lib/shopify";
import { getSiteSettings } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue — Handcrafted Textiles, Executive Stationery, Festival & Packaging | Bhaya India",
  description:
    "Explore Bhaya India's collection — pure handloom silks, fine stationery, corporate hampers, packaging products and wholesale consignments across India.",
};

export default async function ProductsPage() {
  const allProducts = await getShopifyProducts();
  const settings = getSiteSettings();

  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading catalogue...</div>}>
        <ProductsClient
          allProducts={allProducts}
          whatsappNumber={settings.whatsapp}
        />
      </Suspense>
      <Footer />
    </>
  );
}
