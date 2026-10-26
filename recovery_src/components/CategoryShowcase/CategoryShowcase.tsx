import { getShopifyCollections } from "@/lib/shopify";
import CategoryShowcaseClient from "./CategoryShowcaseClient";

export default async function CategoryShowcase() {
  const categories = await getShopifyCollections();
  if (!categories || categories.length === 0) return null;

  return <CategoryShowcaseClient categories={categories} />;
}

