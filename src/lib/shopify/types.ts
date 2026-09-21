// Shopify Storefront API & Domain Types for BHAYA INDIA

export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyMetafield {
  id?: string;
  namespace: string;
  key: string;
  value: string;
  type?: string;
  reference?: {
    image?: ShopifyImage;
    [key: string]: unknown;
  } | null;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice | null;
  sku?: string | null;
  quantityAvailable?: number | null;
  image?: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  productType?: string;
  vendor?: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  featuredImage?: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  metafields?: Array<ShopifyMetafield | null>;
  collections?: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        title: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ShopifyImage | null;
  products?: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyPrice;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: ShopifyImage | null;
      productType?: string;
    };
    price: ShopifyPrice;
    image?: ShopifyImage | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount?: ShopifyPrice | null;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}

// Internal Bhaya India Product format mapped from Shopify
export interface BhayaProductSpec {
  label: string;
  value: string;
}

export interface BhayaShopifyProduct {
  id: string;
  shopifyId: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  tagline: string;
  description: string;
  descriptionHtml?: string;
  images: string[];
  image_en?: string;
  image_hi?: string;
  price: number | null;
  compareAtPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  nameHi?: string;
  descriptionHi?: string;
  taglineHi?: string;
  categoryHi?: string;
  subcategoryHi?: string;
  priceNote?: string;
  specs: BhayaProductSpec[];
  specsHi?: BhayaProductSpec[];
  features: string[];
  featuresHi?: string[];
  benefits: string[];
  benefitsHi?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isNew: boolean;
  inStock: boolean;
  minOrder: number;
  sku: string;
  variantId: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    available: boolean;
    sku: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface BhayaCollection {
  id: string;
  slug: string;
  name: string;
  nameHi?: string;
  description: string;
  descriptionHi?: string;
  image: string;
  productCount: number;
  subcategories: string[];
  subcategoriesHi?: string[];
}
