import { getShopifyProducts } from "@/lib/shopify";
import { getSiteSettings } from "@/lib/db";
import FeaturedProductsClient from "./FeaturedProductsClient";

export default async function FeaturedProducts() {
  const allProducts = await getShopifyProducts();
  const settings = getSiteSettings();
  const featured = allProducts.filter((p) => p.isFeatured);
  const displayProducts = featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);

  return (
    <FeaturedProductsClient
      products={displayProducts}
      whatsappNumber={settings.whatsapp}
    />
  );
}

