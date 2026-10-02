import { MetadataRoute } from "next";
import { getProducts, getCategories, getBlogs } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bhayaindia.com";

  const staticRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/bhaya-india-2", priority: 0.9, changeFrequency: "weekly" },
    { path: "/why-choose-us", priority: 0.8, changeFrequency: "monthly" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/services", priority: 0.8, changeFrequency: "weekly" },
    { path: "/wholesale", priority: 0.9, changeFrequency: "weekly" },
    { path: "/manufacturers", priority: 0.8, changeFrequency: "monthly" },
    { path: "/become-a-seller", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" },
    { path: "/gallery", priority: 0.7, changeFrequency: "weekly" },
    { path: "/testimonials", priority: 0.7, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/company-profile", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" },
    { path: "/terms-conditions", priority: 0.5, changeFrequency: "monthly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    // 1. Dynamic Products
    const products = getProducts();
    const productEntries: MetadataRoute.Sitemap = products
      .filter((p) => p.isPublished)
      .map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    // 2. Dynamic Categories
    const categories = getCategories();
    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // 3. Dynamic Blog Articles
    const blogs = getBlogs();
    const blogEntries: MetadataRoute.Sitemap = blogs
      .filter((b) => b.status === "Published")
      .map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: new Date(b.publishedAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

    return [...staticEntries, ...productEntries, ...categoryEntries, ...blogEntries];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    return staticEntries;
  }
}
