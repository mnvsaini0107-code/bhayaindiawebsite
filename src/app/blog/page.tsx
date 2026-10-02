import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import { getBlogs } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { generateBreadcrumbSchema } from "@/lib/schema";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    path: "/blog",
    fallbackTitle: "Publications & Insights — Craftsmanship, Commerce & Heritage | BHAYA INDIA",
    fallbackDescription:
      "Read articles on Indian heritage crafts, regional manufacturing insights, Vastu decor tips, and modern e-commerce trends by BHAYA INDIA.",
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const activeCategory = resolvedParams.category || "all";

  const allBlogs = getBlogs().filter((b) => b.status === "Published");
  const filteredBlogs = allBlogs.filter(
    (b) => activeCategory === "all" || b.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const categories = [
    { label: "All Insights", value: "all" },
    { label: "Festive Heritage", value: "Festive Heritage" },
    { label: "Business & Industry", value: "Business & Industry" },
    { label: "Craft & Culture", value: "Craft & Culture" },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Publications", url: "/blog" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>EDITORIAL DESK • BHAYA INDIA</span>
          <h1 className={styles.title}>Publications & Craft Chronicles</h1>
          <p className={styles.subtitle}>
            Insightful analyses covering traditional Indian clusters, honest manufacturing practices, festive heritage traditions, and the digital expansion of regional businesses.
          </p>
        </div>

        {/* Category Filters */}
        <div className={styles.filterTabs}>
          {categories.map((c) => {
            const isActive = activeCategory.toLowerCase() === c.value.toLowerCase();
            return (
              <Link
                key={c.value}
                href={c.value === "all" ? "/blog" : `/blog?category=${encodeURIComponent(c.value)}`}
                className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Articles Grid */}
        <div className={styles.grid}>
          {filteredBlogs.map((post) => (
            <article key={post.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={post.featuredImage || "/assets/hero-editorial.jpg"}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.categoryTag}>{post.category}</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <Link href={`/blog/${post.slug}`} className={styles.cardTitle}>
                  {post.title}
                </Link>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className={styles.readMoreLink}>
                  <span>Read Article</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <CredibilityStrip />
      <Footer />
    </>
  );
}
