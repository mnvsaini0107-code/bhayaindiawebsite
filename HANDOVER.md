# BHAYA INDIA — Technical Platform Handover & Documentation

**Platform:** BHAYA INDIA (`bhayaindia.com`)  
**Technology Stack:** Next.js 16 (Turbopack, App Router), React 19, TypeScript, Vanilla CSS Modules  
**Brand Identity:** Sapphire Navy (`#123456`), Imperial Gold (`#C5A059`), Warm Ivory (`#FDFDFD`)  
**Motto:** *Local to Online • Local to India — जहाँ भाया, वहाँ भरोसा*

---

## 1. Executive Summary & Brand Preservation

This upgraded platform builds upon the approved 4-stage client draft while strictly preserving the client-approved branding, logo, color palette, navigation header, and visual aesthetics. Every new page, feature, and component has been seamlessly integrated into this design language.

### Truthful Content Policy Compliance

- **Zero Unverified Claims:** Removed fabricated metrics (e.g., "19,000+ pincodes", "Surat Corporate House", fake certifications).
- **Intentional "Coming Soon" States:**
  - **Visual Gallery (`/gallery`):** Displays a professional "Photography In Progress — Coming Soon" notice explaining that authentic artisan workshops and facilities are being documented without using misleading stock photography.
  - **Testimonials (`/testimonials`):** Displays an authenticated "Verified Reviews — In Progress" notice committing to publishing only verified order delivery reviews.
  - **Vendor Dashboard:** Transparent notice that automated self-service is under development for BHAYA INDIA 2.0, while early onboarding is managed directly by our merchant desk.

---

## 2. Dual-Language System (🇮🇳 हिन्दी | English 🇬🇧)

A centralized, responsive language switcher is integrated into the primary header and mobile drawer navigation.

- **Locale Dictionaries:**
  - `src/locales/en.ts` — Complete English vocabulary and UI strings.
  - `src/locales/hi.ts` — High-fidelity Hindi translations.
- **State Management:** `src/context/LanguageContext.tsx`
  - Persists selected locale to `localStorage` (`bhaya_locale`) and a 1-year browser cookie (`bhaya_locale`) for instant server-side hydration.
  - Exposes `locale`, `language`, `setLocale`, `toggleLocale`, `t(key, params)`, and `strings`.

---

## 3. WhatsApp Integration & Exact Hindi Template

Per client specifications, all product-level WhatsApp enquiry triggers dynamically generate the mandatory Hindi message template with the product name and requested quantity:

```text
नमस्कार, मुझे BHAYA INDIA के इस product के बारे में जानकारी चाहिए:

Product Name: [Product Name]
Quantity: [Selected Quantity]
```

- **Locations Wired:**
  - Product Detail Page (`/products/[slug]`)
  - Product Catalogue Cards (`/products`)
  - Homepage Featured Product Cards (`/`)
  - Shopping Bag Page (`/cart`) — with itemized cart summary
  - Wholesale Page (`/wholesale`) — with dedicated B2B quotation context

---

## 4. E-Commerce, Catalogue & Truthful Checkout

### Product Catalogue (`/products`)

- **Search Bar:** Input with placeholder `"Search Products..."` filtering dynamically across product names, descriptions, tags, and categories.
- **Category & Subcategory Pills:** Quick filter tabs for major categories and subcategories.
- **Price Range & Sorting:** Sort by Featured, Price Low → High, Price High → Low.

### Product Detail (`/products/[slug]`)

- Interactive quantity counter (`- [qty] +`).
- Instant actions: **"Add to Bag"**, **"Buy Now"**, and **"WhatsApp Enquiry"**.

### Shopping Bag (`/cart`)

- Real-time item count, quantity increment/decrement, and subtotal calculation.
- Primary **"Checkout"** and alternative **"Enquire on WhatsApp"** with full cart breakdown.

### Truthful Checkout (`/checkout`)

- Collects customer shipping information (Full Name, Phone, Email, Address, City, State, Pincode).
- Submits order to `/api/orders` with initial status:
  - `orderStatus`: `"Order Placed"`
  - `paymentStatus`: `"Pending"`
- **Architecture Readiness Notice:** Truthfully informs customers that automated payment gateway keys are undergoing merchant compliance registration, and payment instructions/verification are coordinated by the client concierge.

---

## 5. Customer Account & Order Tracking (`/account`)

A unified customer portal catering to both registered customers and guest order lookups:

### Guest Mode

- **Sign In Tab:** Quick login via 10-digit mobile number.
- **Create Account Tab:** Self-service registration (Name, Phone, Email).
- **Track Order Tab:** Instant dispatch lookup by Order ID (e.g. `ORD-9012`) or phone number without requiring authentication.

### Authenticated Customer Dashboard

- **Session Bar:** Displays welcome greeting, phone, email, and "Sign Out".
- **Tab 1 — "My Orders":**
  - Itemized order history matching customer phone.
  - Visual 4-stage progression timeline:
    `Order Placed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` (or `Cancelled`).
  - Total amount and delivery destination details.
- **Tab 2 — "Saved Addresses":**
  - Grid of saved delivery addresses (Home, Office, Warehouse).
  - Modal form to add new delivery addresses.
  - Single-click address deletion.
- **Tab 3 — "Profile Settings":**
  - Edit personal name and contact email.

---

## 6. Dedicated Pages & B2B Expansion

| Route | Page Title | Key Features |
| --- | --- | --- |
| `/about` | About BHAYA INDIA | Approved Hindi mission & vision, B2C/B2B/Hyperlocal business model pillars, core values. |
| `/bhaya-india-2` | BHAYA INDIA 2.0 | "एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा", hyperlocal customer ➔ BHAYA INDIA ➔ local merchant routing flow, early access onboarding form. |
| `/become-a-seller` | Become a Seller | Approved Hindi copy, merchant benefits, transparent onboarding application submitting to `/api/enquiries` (`type: "seller"`). |
| `/manufacturers` | For Manufacturers | Approved copy ("बिना बिचौलियों के सीधा व्यापार"), direct factory registration form (`type: "manufacturer"`). |
| `/wholesale` | Wholesale & B2B | Bulk pricing benefits, instant WhatsApp quotation card, B2B requirement form (`type: "wholesale"`). |
| `/services` | Services & Solutions | Active services (Product Sourcing, B2B Supply, Corporate Gifting, Custom Packaging) vs. Upcoming Vision 2.0 services. |
| `/gallery` | Visual Gallery | Truthful "Photography In Progress" notice with dynamic rendering of verified images from `/api/gallery`. |
| `/testimonials` | Client Reviews | Authenticated "Reviews In Progress" notice with dynamic rendering of verified client reviews from `/api/testimonials`. |
| `/faq` | Frequently Asked Questions | 7 client-mandated bilingual questions with accordion interaction and WhatsApp support link. |

---

## 7. Administrative CMS Portal (`/admin`)

- **Dashboard:** `/admin`
- **Orders Management (`/admin/orders`):**
  - Filter orders by status (`Order Placed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Update fulfillment status dropdown and payment status (`Paid`, `Pending`, `Failed`).
- **Leads & Inquiries (`/admin/enquiries`):**
  - Filter by inquiry type (`wholesale`, `seller`, `manufacturer`, `product`, `general`).
  - Filter by status (`New`, `In Progress`, `Closed`).
  - One-click **"💬 WhatsApp"** and **"📞 Call"** action buttons.
- **Catalogue CMS:** `/admin/products`, `/admin/categories`.
- **Media & Content CMS:** `/admin/gallery`, `/admin/faqs`, `/admin/testimonials`, `/admin/settings`.

---

## 8. Database Architecture & Persistence

Data is persisted in JSON database format at `data/db.json` and accessed via `src/lib/db.ts`:

- `products`: Product catalog with pricing, images, specifications, and slugs.
- `categories`: Categories and subcategories.
- `orders`: Customer orders, items, amounts, and statuses.
- `enquiries`: B2B, wholesale, seller, manufacturer, and product leads.
- `users`: Customer accounts with saved delivery addresses.
- `faqs`: 7 bilingual FAQ records with English and Hindi questions and answers.
- `gallery`: Visual media items.
- `testimonials`: Verified customer feedback items.
- `settings`: Store configuration, phone, WhatsApp, email, and address.

---

## 9. Payment Gateway Configuration (When Merchant Credentials Arrive)

To activate automated online payment collection (Razorpay, Cashfree, PhonePe, or Paytm), add the following keys to your `.env.local` file:

```env
# Razorpay Configuration (Example)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"

# Webhook Secret (For automatic status transition to 'Paid')
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxx"
```

The checkout endpoint (`src/app/checkout/page.tsx`) and orders API (`src/app/api/orders/route.ts`) are modularly structured to initialize the checkout modal upon receiving these keys.

---

## 10. Technical SEO & Production Verification

- **Robots.txt:** Configured at `public/robots.txt` allowing public indexing while disallowing `/admin/` and `/api/`.
- **Dynamic Sitemap:** Configured at `src/app/sitemap.ts` generating `/sitemap.xml` with all core routes, categories, and dynamic product URLs.
- **Build Status:** Verified 100% clean production build with `npm run build` (Next.js 16.3.4, Turbopack, React 19).

### Local Execution Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```
