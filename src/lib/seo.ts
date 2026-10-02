import type { Metadata } from "next";
import { getGlobalSeoSettings, getPageSeo } from "@/lib/db";

interface BuildPageMetadataOptions {
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  isShopifyResource?: boolean;
  shopifySeoTitle?: string;
  shopifySeoDescription?: string;
  schemaType?: string;
}

const BASE_URL = "https://bhayaindia.com";

/**
 * Builds standard, production-ready Next.js Metadata with a strict priority order:
 * 1. CMS Page-level SEO record (if customized)
 * 2. Shopify Storefront SEO metadata (if Shopify resource)
 * 3. Fallback title/description passed by route
 * 4. Global default SEO settings
 */
export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const globalSeo = getGlobalSeoSettings();
  const pageSeo = getPageSeo(options.path);

  // 1. Determine Title
  let title =
    pageSeo?.seoTitle ||
    options.shopifySeoTitle ||
    options.fallbackTitle ||
    (options.path === "/" ? globalSeo.homepageTitle : globalSeo.defaultTitle);

  // 2. Determine Description
  let description =
    pageSeo?.metaDescription ||
    options.shopifySeoDescription ||
    options.fallbackDescription ||
    (options.path === "/" ? globalSeo.homepageDescription : globalSeo.defaultDescription);

  // 3. Determine Canonical
  const canonicalUrl = pageSeo?.canonicalUrl || `${BASE_URL}${options.path === "/" ? "" : options.path}`;

  // 4. Determine OG / Twitter Image
  const image =
    pageSeo?.ogImage ||
    options.fallbackImage ||
    globalSeo.defaultOgImage ||
    "/assets/hero-editorial.jpg";

  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // 5. Robots
  const robotsSetting = pageSeo?.robots || globalSeo.defaultRobots || "index, follow";
  const isNoIndex = robotsSetting.includes("noindex");
  const isNoFollow = robotsSetting.includes("nofollow");

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": `${BASE_URL}${options.path}`,
        "hi-IN": `${BASE_URL}${options.path}`,
        "x-default": `${BASE_URL}${options.path}`,
      },
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
      googleBot: {
        index: !isNoIndex,
        follow: !isNoFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: pageSeo?.ogTitle || title,
      description: pageSeo?.ogDescription || description,
      url: canonicalUrl,
      siteName: globalSeo.siteName || "BHAYA INDIA",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageSeo?.twitterTitle || title,
      description: pageSeo?.twitterDescription || description,
      images: [fullImageUrl],
    },
    other: globalSeo.googleVerificationTag
      ? { "google-site-verification": globalSeo.googleVerificationTag }
      : undefined,
  };
}
