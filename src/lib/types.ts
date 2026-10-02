export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  tagline: string;
  description: string;
  nameHi?: string;
  descriptionHi?: string;
  taglineHi?: string;
  categoryHi?: string;
  subcategoryHi?: string;
  images: string[];
  image_en?: string;
  image_hi?: string;
  price: number | null; // null = Get Quote
  compareAtPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  priceNote?: string;
  specs: ProductSpec[];
  specsHi?: ProductSpec[];
  features: string[];
  featuresHi?: string[];
  benefits: string[];
  benefitsHi?: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isNew?: boolean;
  inStock: boolean;
  minOrder?: number;
  sku: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  nameHi?: string;
  descriptionHi?: string;
  image: string;
  productCount: number;
  subcategories: string[];
  subcategoriesHi?: string[];
}

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  productName: string;
  productId?: string;
  quantity?: number;
  message: string;
  status: "New" | "In Progress" | "Closed";
  type?: "general" | "product" | "wholesale" | "seller" | "manufacturer";
  businessName?: string;
  businessType?: string;
  categoryInterest?: string;
  city?: string;
  location?: string;
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  title?: string;
  label?: string;
  recipientName?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  street?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  addresses: CustomerAddress[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Order Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "New" | "Completed";
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  role: string;
  company: string;
  review: string;
  rating: number;
  photo?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  questionHi?: string;
  answerHi?: string;
  category: "Product" | "Service" | "Payment" | "Delivery" | "General";
  isPublished: boolean;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  category: "Products" | "Company" | "Projects" | "Business";
  caption?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  dimensions?: string;
  fileSize: number; // bytes
  url: string;
  altEn: string;
  altHi: string;
  title?: string;
  caption?: string;
  usage?: string;
  uploadedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: string;
  image?: string;
  featured: boolean;
  status: "Published" | "Draft";
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nameHi?: string;
  role: string;
  roleHi?: string;
  bio?: string;
  bioHi?: string;
  image?: string;
  order: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleHi?: string;
  slug: string;
  excerpt: string;
  excerptHi?: string;
  content: string;
  contentHi?: string;
  author: string;
  publishedAt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: "Published" | "Draft";
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  ogImage?: string;
}

export interface GlobalSeoSettings {
  homepageTitle: string;
  homepageDescription: string;
  homepageKeywords: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  defaultTwitterImage: string;
  defaultCanonical: string;
  siteName: string;
  organizationName: string;
  defaultRobots: string;
  googleVerificationTag?: string;
  ga4MeasurementId?: string;
  gtmId?: string;
  cookieConsentEnabled: boolean;
}

export interface PageSeoRecord {
  path: string;
  pageName: string;
  pageNameHi?: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: "index, follow" | "noindex, follow" | "noindex, nofollow";
  schemaType: "Organization" | "WebSite" | "Article" | "FAQPage" | "LocalBusiness" | "Product";
  isIndexable: boolean;
  updatedAt?: string;
}

export interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  statusCode: 301 | 302;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  action: string;
  object: string;
  details?: string;
  timestamp: string;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
  };
  mapsEmbedUrl?: string;
}

export interface PageContent {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
  };
  brandStory: {
    eyebrow: string;
    headline: string;
    paragraph1: string;
    paragraph2: string;
    stats: { label: string; value: string }[];
  };
  whyBhaya: {
    eyebrow: string;
    headline: string;
    pillars: { title: string; desc: string; icon: string }[];
  };
  sellerCta: {
    headline: string;
    body: string;
    ctaText: string;
  };
  bhaya2: {
    headline: string;
    subheadline: string;
    body: string;
  };
}

export interface ExtendedSiteSettings extends SiteSettings {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  taxGst?: string;
  currencySymbol?: string;
  currencyCode?: string;
  minimumOrderValue?: number;
  codEnabled?: boolean;
  shippingNotes?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpSenderEmail?: string;
  sessionTimeoutMinutes?: number;
}

