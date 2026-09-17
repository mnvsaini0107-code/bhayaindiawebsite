import { MetadataRoute } from "next";
import { getProducts } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bhayaindia.com";

  const staticRoutes: string[] = [
    "",
    "/about",
    "/bhaya-india-2",
    "/products",
    "/become-a-seller",
    "/manufacturers",
    "/wholesale",
    "/services",
    "/gallery",
    "/testimonials",
    "/why-choose-us",
    "/company-profile",
    "/faq",
    "/contact",
    "/account",
    "/privacy-policy",
    "/terms-conditions",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/products" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/products" || route === "/bhaya-india-2" ? 0.9 : 0.7,
  }));

  try {
    const products = getProducts();
    const productEntries: MetadataRoute.Sitemap = products
      .filter((p) => p.isPublished)
      .map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
