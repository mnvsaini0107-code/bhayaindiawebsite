import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CredibilityStrip from "@/components/CredibilityStrip/CredibilityStrip";
import { getBlogBySlug, getBlogs } from "@/lib/db";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import styles from "../blog.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | BHAYA INDIA",
      description: "The requested article could not be found.",
    };
  }

  const title = post.seoTitle || `${post.title} — BHAYA INDIA Publications`;
  const description = post.seoDescription || post.excerpt;
  const canonicalUrl = post.canonical || `https://bhayaindia.com/blog/${post.slug}`;
  const ogImageUrl = post.ogImage || post.featuredImage || "/assets/hero-editorial.jpg";
  const fullOgImage = ogImageUrl.startsWith("http")
    ? ogImageUrl
    : `https://bhayaindia.com${ogImageUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        "hi-IN": canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullOgImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Publications", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  // Format markdown-like headings and paragraphs
  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className={styles.postArticle}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Publications</Link>
          <span>/</span>
          <span>{post.category}</span>
        </nav>

        <header className={styles.postHeader}>
          <span className={styles.categoryTag}>{post.category}</span>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.postMeta}>
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className={styles.featuredImageContainer}>
          <Image
            src={post.featuredImage || "/assets/hero-editorial.jpg"}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 820px) 100vw, 820px"
          />
        </div>

        <div className={styles.postContent}>
          {paragraphs.map((para, index) => {
            if (para.startsWith("### ")) {
              return <h3 key={index}>{para.replace("### ", "")}</h3>;
            }
            if (para.startsWith("## ")) {
              return <h2 key={index}>{para.replace("## ", "")}</h2>;
            }
            if (para.startsWith("1. ") || para.startsWith("- ")) {
              const lines = para.split("\n");
              return (
                <ul key={index}>
                  {lines.map((l, i) => (
                    <li key={i}>{l.replace(/^[-1-9.]+\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{para}</p>;
          })}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className={styles.tagRow}>
            {post.tags.map((t) => (
              <span key={t} className={styles.tagItem}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </main>
      <CredibilityStrip />
      <Footer />
    </>
  );
}
