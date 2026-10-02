import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { getShopifyProducts, isShopifyConfigured } from "@/lib/shopify";
import { getSiteSettings } from "@/lib/db";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subcat?: string;
    price?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ? params.q.trim() : "";

  return {
    title: q
      ? `Search Results for "${q}" | BHAYA INDIA`
      : "Search Products & Catalogue | BHAYA INDIA",
    description: q
      ? `Find products, categories, ritual essentials, and wholesale merchandise for "${q}" at BHAYA INDIA.`
      : "Explore certified Indian textiles, executive stationery, festival essentials, packaging, and B2B goods.",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage() {
  // Fetch live products from Shopify
  const allProducts = await getShopifyProducts();
  const settings = getSiteSettings();
  const shopifyConnected = isShopifyConfigured();

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sapphire)",
              fontWeight: 600,
            }}
          >
            Loading search results...
          </div>
        }
      >
        <SearchClient
          initialProducts={allProducts}
          whatsappNumber={settings.whatsapp}
          isShopify={shopifyConnected}
        />
      </Suspense>
      <Footer />
    </>
  );
}
