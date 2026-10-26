import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import ProductDetailView from "@/components/ProductDetail/ProductDetailView";
import { getShopifyProductBySlug, getShopifyProducts } from "@/lib/shopify";
import { getSiteSettings } from "@/lib/db";
import styles from "./product-detail.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopifyProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Bhaya India" };
  return {
    title: product.seoTitle || `${product.name} — ${product.category} | BHAYA INDIA`,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getShopifyProductBySlug(slug);
  if (!product) notFound();

  const settings = getSiteSettings();
  const allProducts = await getShopifyProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <ProductDetailView
          product={product}
          whatsappNumber={settings.whatsapp}
          phone={settings.phone}
          relatedProducts={relatedProducts}
        />
        <CredibilityStrip />
      </main>
      <Footer />
    </>
  );
}
