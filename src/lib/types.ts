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
  images: string[];
  price: number | null; // null = Get Quote
  priceNote?: string;
  specs: ProductSpec[];
  features: string[];
  benefits: string[];
  isFeatured: boolean;
  isPublished: boolean;
  isNew?: boolean;
  inStock: boolean;
  minOrder?: number;
  sku: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories: string[];
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
  orderStatus: "New" | "Processing" | "Completed" | "Cancelled";
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
