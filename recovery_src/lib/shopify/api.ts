// High-level Shopify Storefront Commerce API with graceful fallback

import {
  isShopifyConfigured,
  shopifyFetch,
} from "./client";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  ADD_LINES_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
} from "./queries";
import type {
  ShopifyProduct,
  ShopifyCart,
  ShopifyCollection,
  BhayaShopifyProduct,
  BhayaProductSpec,
  BhayaCollection,
} from "./types";
export type { BhayaCollection };
import { getProducts as getFallbackProducts, getCategories as getFallbackCategories } from "@/lib/db";

// Helper to safely parse Shopify metafields into Bhaya India product format
export function reshapeProduct(product: ShopifyProduct): BhayaShopifyProduct {
  const images = product.images?.edges?.map((edge) => edge.node.url) || [];
  if (images.length === 0 && product.featuredImage?.url) {
    images.push(product.featuredImage.url);
  }
  if (images.length === 0) {
    images.push("/assets/category-textiles.jpg");
  }

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const primaryVariant = product.variants?.edges?.[0]?.node;

  // Extract metafields
  const metafields = product.metafields || [];
  const getMeta = (key: string) => metafields.find((m) => m?.key === key)?.value;
  const getMetaImage = (key: string): string | undefined => {
    const meta = metafields.find((m) => m?.key === key);
    if (!meta) return undefined;
    if (meta.reference?.image?.url) {
      return meta.reference.image.url;
    }
    if (typeof meta.value === "string") {
      if (meta.value.startsWith("http") || meta.value.startsWith("/")) {
        return meta.value;
      }
      if (meta.value.startsWith("{")) {
        try {
          const parsed = JSON.parse(meta.value);
          if (parsed.url) return parsed.url;
        } catch {}
      }
    }
    return undefined;
  };

  const image_en = getMetaImage("image_en");
  const image_hi = getMetaImage("image_hi");

  const tagline = getMeta("tagline") || "";
  const priceNote = getMeta("price_note") || (minPrice > 0 ? "Per piece (Inclusive of Taxes)" : "Custom Quote / Wholesale");
  
  let features: string[] = [];
  try {
    const rawFeatures = getMeta("features");
    if (rawFeatures) {
      features = JSON.parse(rawFeatures);
    }
  } catch {
    const raw = getMeta("features");
    if (raw) features = raw.split(",").map((s) => s.trim());
  }

  let specs: BhayaProductSpec[] = [];
  try {
    const rawSpecs = getMeta("specifications");
    if (rawSpecs) {
      const parsed = JSON.parse(rawSpecs);
      if (Array.isArray(parsed)) {
        specs = parsed;
      } else if (typeof parsed === "object") {
        specs = Object.entries(parsed).map(([label, value]) => ({ label, value: String(value) }));
      }
    }
  } catch {
    // fallback if unparseable
  }

  let benefits: string[] = [];
  try {
    const rawBenefits = getMeta("benefits");
    if (rawBenefits) benefits = JSON.parse(rawBenefits);
  } catch {
    // fallback
  }

  const minOrderVal = parseInt(getMeta("min_order") || "1", 10);
  const subcategory = getMeta("subcategory") || "";
  const primaryCollection = product.collections?.edges?.[0]?.node;

  const categoryTitle = primaryCollection?.title || product.productType || "General Catalogue";
  const categorySlug = primaryCollection?.handle || (product.productType ? product.productType.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "all");

  const variantsList = (product.variants?.edges || []).map((v) => ({
    id: v.node.id,
    title: v.node.title,
    price: parseFloat(v.node.price.amount),
    compareAtPrice: v.node.compareAtPrice ? parseFloat(v.node.compareAtPrice.amount) : null,
    available: v.node.availableForSale,
    sku: v.node.sku || "",
    selectedOptions: v.node.selectedOptions || [],
    image: v.node.image?.url || null,
  }));

  const options = (product.options || []).map((opt) => ({
    id: opt.id,
    name: opt.name,
    values: opt.values,
  }));

  const nameHi = getMeta("name_hi");
  const descriptionHi = getMeta("description_hi");
  const taglineHi = getMeta("tagline_hi");
  const categoryHi = getMeta("category_hi");
  const subcategoryHi = getMeta("subcategory_hi");

  let featuresHi: string[] | undefined;
  try {
    const rawFHi = getMeta("features_hi");
    if (rawFHi) {
      featuresHi = rawFHi.startsWith("[") ? JSON.parse(rawFHi) : rawFHi.split(",").map((s) => s.trim());
    }
  } catch {}

  let benefitsHi: string[] | undefined;
  try {
    const rawBHi = getMeta("benefits_hi");
    if (rawBHi) {
      benefitsHi = rawBHi.startsWith("[") ? JSON.parse(rawBHi) : rawBHi.split(",").map((s) => s.trim());
    }
  } catch {}

  let specsHi: BhayaProductSpec[] | undefined;
  try {
    const rawSHi = getMeta("specifications_hi");
    if (rawSHi) {
      const parsed = JSON.parse(rawSHi);
      if (Array.isArray(parsed)) specsHi = parsed;
      else if (typeof parsed === "object") {
        specsHi = Object.entries(parsed).map(([label, value]) => ({ label, value: String(value) }));
      }
    }
  } catch {}

  return {
    id: product.id,
    shopifyId: product.id,
    name: product.title,
    nameHi,
    slug: product.handle,
    category: categoryTitle,
    categorySlug,
    categoryHi,
    subcategory,
    subcategoryHi,
    tagline,
    taglineHi,
    description: product.description,
    descriptionHi,
    descriptionHtml: product.descriptionHtml || product.description,
    images,
    image_en,
    image_hi,
    price: minPrice > 0 ? minPrice : null,
    compareAtPrice: primaryVariant?.compareAtPrice?.amount
      ? parseFloat(primaryVariant.compareAtPrice.amount)
      : minPrice > 0
      ? Math.round(minPrice * 1.25)
      : null,
    rating: Number((4.7 + ((product.id.charCodeAt(product.id.length - 1) % 4) * 0.1)).toFixed(1)),
    reviewsCount: 16 + (product.id.charCodeAt(product.id.length - 1) % 35),
    priceNote,
    specs,
    specsHi,
    features,
    featuresHi,
    benefits,
    benefitsHi,
    isFeatured: product.tags?.includes("featured") || false,
    isPublished: true,
    isNew: product.tags?.includes("new") || false,
    inStock: product.availableForSale,
    minOrder: minOrderVal || 1,
    sku: primaryVariant?.sku || "BI-SKU",
    variantId: primaryVariant?.id || "",
    variants: variantsList,
    options,
    seoTitle: `${product.title} — Bhaya India`,
    seoDescription: product.description,
    createdAt: new Date().toISOString(),
  };
}

// Convert fallback database Product to BhayaShopifyProduct
function fallbackToShopifyProduct(p: ReturnType<typeof getFallbackProducts>[0]): BhayaShopifyProduct {
  const compPrice = p.price ? Math.round(p.price * 1.25) : null;
  const hash = p.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = Number((4.7 + ((hash % 4) * 0.1)).toFixed(1));
  const reviewsCount = 14 + (hash % 38);

  return {
    id: p.id,
    shopifyId: `gid://shopify/Product/${p.id}`,
    name: p.name,
    nameHi: p.nameHi,
    slug: p.slug,
    category: p.category,
    categorySlug: p.categorySlug,
    categoryHi: p.categoryHi,
    subcategory: p.subcategory,
    subcategoryHi: p.subcategoryHi,
    tagline: p.tagline,
    taglineHi: p.taglineHi,
    description: p.description,
    descriptionHi: p.descriptionHi,
    descriptionHtml: `<p>${p.description}</p>`,
    images: p.images,
    image_en: p.image_en,
    image_hi: p.image_hi,
    price: p.price,
    compareAtPrice: compPrice,
    rating,
    reviewsCount,
    priceNote: p.priceNote,
    specs: p.specs,
    specsHi: p.specsHi,
    features: p.features,
    featuresHi: p.featuresHi,
    benefits: p.benefits || [],
    benefitsHi: p.benefitsHi,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    isNew: p.isNew || false,
    inStock: p.inStock,
    minOrder: p.minOrder || 1,
    sku: p.sku,
    variantId: `gid://shopify/ProductVariant/${p.id}-v1`,
    variants: [
      {
        id: `gid://shopify/ProductVariant/${p.id}-v1`,
        title: "Default Title",
        price: p.price || 0,
        compareAtPrice: compPrice,
        available: p.inStock,
        sku: p.sku,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
        image: p.images?.[0] || null,
      },
    ],
    options: [],
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    createdAt: p.createdAt,
  };
}

export { getLanguageAwareProductImage } from "./utils";

// ------------------- PRODUCTS API -------------------

export async function getShopifyProducts(options?: {
  query?: string;
  category?: string;
  sortKey?: "RELEVANCE" | "PRICE" | "CREATED_AT" | "BEST_SELLING";
  reverse?: boolean;
}): Promise<BhayaShopifyProduct[]> {
  if (!isShopifyConfigured()) {
    // Return formatted fallback products
    const dbProducts = getFallbackProducts();
    let res = dbProducts.map(fallbackToShopifyProduct);

    if (options?.category && options.category !== "all") {
      res = res.filter((p) => p.categorySlug === options.category);
    }
    if (options?.query) {
      const q = options.query.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (options?.sortKey === "PRICE") {
      res.sort((a, b) => {
        const pa = a.price || 0;
        const pb = b.price || 0;
        return options.reverse ? pb - pa : pa - pb;
      });
    }
    return res;
  }

  try {
    let rawQuery = options?.query || "";
    if (options?.category && options.category !== "all") {
      rawQuery = rawQuery ? `${rawQuery} AND (tag:${options.category} OR product_type:${options.category})` : `(tag:${options.category} OR product_type:${options.category})`;
    }

    const { body } = await shopifyFetch<{
      data: {
        products: {
          edges: Array<{ node: ShopifyProduct }>;
        };
      };
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        query: rawQuery || undefined,
        sortKey: options?.sortKey || "RELEVANCE",
        reverse: options?.reverse,
      },
      cache: "no-store",
    });

    const products = body.data.products.edges.map((edge) => reshapeProduct(edge.node));
    if (products.length === 0 && !options?.query && (!options?.category || options.category === "all")) {
      // If store is newly configured and has 0 products yet in Shopify, return fallback sample catalog
      const dbProducts = getFallbackProducts();
      return dbProducts.map(fallbackToShopifyProduct);
    }
    return products;
  } catch (err) {
    console.warn("Shopify fetch failed, falling back to local dataset:", err);
    return getFallbackProducts().map(fallbackToShopifyProduct);
  }
}

export async function getShopifyProductBySlug(slug: string): Promise<BhayaShopifyProduct | null> {
  if (!isShopifyConfigured()) {
    const p = getFallbackProducts().find((item) => item.slug === slug);
    return p ? fallbackToShopifyProduct(p) : null;
  }

  try {
    const { body } = await shopifyFetch<{
      data: {
        product: ShopifyProduct | null;
      };
    }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: slug },
    });

    if (!body.data.product) {
      // Check fallback in case it's a seed slug
      const p = getFallbackProducts().find((item) => item.slug === slug);
      return p ? fallbackToShopifyProduct(p) : null;
    }

    return reshapeProduct(body.data.product);
  } catch (err) {
    console.warn("Shopify single product fetch failed:", err);
    const p = getFallbackProducts().find((item) => item.slug === slug);
    return p ? fallbackToShopifyProduct(p) : null;
  }
}

export async function searchShopifyProducts(query: string): Promise<BhayaShopifyProduct[]> {
  if (!query.trim()) return [];

  if (!isShopifyConfigured()) {
    const q = query.toLowerCase();
    return getFallbackProducts()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameHi && p.nameHi.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.categoryHi && p.categoryHi.toLowerCase().includes(q)) ||
          p.subcategory.toLowerCase().includes(q) ||
          (p.subcategoryHi && p.subcategoryHi.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.descriptionHi && p.descriptionHi.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map(fallbackToShopifyProduct);
  }

  try {
    const { body } = await shopifyFetch<{
      data: {
        search: {
          edges: Array<{ node: ShopifyProduct }>;
        };
      };
    }>({
      query: SEARCH_PRODUCTS_QUERY,
      variables: { query, first: 6 },
    });

    return body.data.search.edges.map((edge) => reshapeProduct(edge.node));
  } catch (err) {
    console.error("Shopify search failed, falling back:", err);
    const q = query.toLowerCase();
    return getFallbackProducts()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameHi && p.nameHi.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map(fallbackToShopifyProduct);
  }
}

// ------------------- COLLECTIONS API -------------------

export async function getShopifyCollections(): Promise<BhayaCollection[]> {
  const fallbackCats = getFallbackCategories();

  if (!isShopifyConfigured()) {
    return fallbackCats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      nameHi: c.nameHi,
      description: c.description,
      descriptionHi: c.descriptionHi,
      image: c.image,
      productCount: c.productCount,
      subcategories: c.subcategories,
      subcategoriesHi: c.subcategoriesHi,
    }));
  }

  try {
    const { body } = await shopifyFetch<{
      data: {
        collections: {
          edges: Array<{ node: ShopifyCollection }>;
        };
      };
    }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first: 20 },
    });

    return body.data.collections.edges.map((edge) => {
      const match = fallbackCats.find((f) => f.slug === edge.node.handle);
      return {
        id: edge.node.id,
        slug: edge.node.handle,
        name: edge.node.title,
        nameHi: match?.nameHi,
        description: edge.node.description || match?.description || "",
        descriptionHi: match?.descriptionHi,
        image: edge.node.image?.url || match?.image || "/assets/category-textiles.jpg",
        productCount: match?.productCount || 0,
        subcategories: match?.subcategories || [],
        subcategoriesHi: match?.subcategoriesHi || [],
      };
    });
  } catch (err) {
    console.warn("Shopify collections fetch failed:", err);
    return fallbackCats;
  }
}

// ------------------- CART API -------------------

export async function createShopifyCart(lines?: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const { body } = await shopifyFetch<{
      data: {
        cartCreate: {
          cart: ShopifyCart;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines: lines || [],
        },
      },
      cache: "no-store",
    });

    return body.data.cartCreate.cart;
  } catch (err) {
    console.error("Failed to create Shopify cart:", err);
    return null;
  }
}

export async function getShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  try {
    const { body } = await shopifyFetch<{
      data: {
        cart: ShopifyCart | null;
      };
    }>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: "no-store",
    });

    return body.data.cart;
  } catch (err) {
    console.error("Failed to retrieve Shopify cart:", err);
    return null;
  }
}

export async function addLinesToShopifyCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const { body } = await shopifyFetch<{
      data: {
        cartLinesAdd: {
          cart: ShopifyCart;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: ADD_LINES_TO_CART_MUTATION,
      variables: { cartId, lines },
      cache: "no-store",
    });

    return body.data.cartLinesAdd.cart;
  } catch (err) {
    console.error("Failed to add lines to Shopify cart:", err);
    return null;
  }
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const { body } = await shopifyFetch<{
      data: {
        cartLinesUpdate: {
          cart: ShopifyCart;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: UPDATE_CART_LINES_MUTATION,
      variables: { cartId, lines },
      cache: "no-store",
    });

    return body.data.cartLinesUpdate.cart;
  } catch (err) {
    console.error("Failed to update Shopify cart lines:", err);
    return null;
  }
}

export async function removeShopifyCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const { body } = await shopifyFetch<{
      data: {
        cartLinesRemove: {
          cart: ShopifyCart;
          userErrors: Array<{ field: string; message: string }>;
        };
      };
    }>({
      query: REMOVE_CART_LINES_MUTATION,
      variables: { cartId, lineIds },
      cache: "no-store",
    });

    return body.data.cartLinesRemove.cart;
  } catch (err) {
    console.error("Failed to remove Shopify cart lines:", err);
    return null;
  }
}
