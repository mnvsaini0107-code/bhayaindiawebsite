import type { Product, BlogPost, FAQ } from "./types";

const BASE_URL = "https://bhayaindia.com";

/**
 * Generates official Organization JSON-LD Schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BHAYA INDIA",
    alternateName: ["Bhaya India", "भाया इंडिया"],
    url: BASE_URL,
    logo: `${BASE_URL}/assets/bhaya-india-logo.png`,
    slogan: "जहाँ भाया, वहाँ भरोसा",
    description:
      "BHAYA INDIA is an Indian Business & E-commerce Platform connecting customers, regional retailers, and verified manufacturers on a trusted digital platform.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 87266 90926",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://instagram.com/bhayaindia",
      "https://facebook.com/bhayaindia",
      "https://youtube.com/@bhayaindia",
      "https://linkedin.com/company/bhayaindia",
    ],
  };
}

/**
 * Generates official WebSite JSON-LD Schema with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BHAYA INDIA",
    alternateName: "भाया इंडिया",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates truthful Product JSON-LD Schema
 * Uses real pricing, availability, and description without fake ratings
 */
export function generateProductSchema(product: Product) {
  const images = (product.images || []).map((img) =>
    img.startsWith("http") ? img : `${BASE_URL}${img}`
  );

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.length > 0 ? images : [`${BASE_URL}/assets/hero-editorial.jpg`],
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "BHAYA INDIA",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price ? product.price.toString() : "0",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "BHAYA INDIA",
      },
    },
  };

  return schema;
}

/**
 * Generates Article JSON-LD Schema for Blog
 */
export function generateArticleSchema(post: BlogPost) {
  const imageUrl = post.featuredImage.startsWith("http")
    ? post.featuredImage
    : `${BASE_URL}${post.featuredImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || "BHAYA INDIA",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "BHAYA INDIA",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/assets/bhaya-india-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

/**
 * Generates FAQPage JSON-LD Schema
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
