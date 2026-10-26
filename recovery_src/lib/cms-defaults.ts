import type {
  MediaAsset,
  ServiceItem,
  TeamMember,
  BlogPost,
  GlobalSeoSettings,
  PageSeoRecord,
  ActivityLogItem,
} from "./types";

export const defaultMediaAssets: MediaAsset[] = [
  {
    id: "media-logo",
    filename: "bhaya-india-logo.png",
    originalName: "BHAYA INDIA Official Brand Emblem",
    fileType: "image/png",
    dimensions: "512 × 512 px",
    fileSize: 714936,
    url: "/assets/bhaya-india-logo.png",
    altEn: "Official BHAYA INDIA Logo — Local to Online, Local to India",
    altHi: "भाया इंडिया आधिकारिक लोगो — जहाँ भाया, वहाँ भरोसा",
    title: "BHAYA INDIA Official Seal",
    caption: "Primary brand mark and corporate insignia.",
    usage: "Header & Brand Identity",
    uploadedAt: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "media-hero",
    filename: "hero-editorial.jpg",
    originalName: "Royal Heritage Festival Trunk & Brass Artifacts",
    fileType: "image/jpeg",
    dimensions: "1920 × 1080 px",
    fileSize: 719934,
    url: "/assets/hero-editorial.jpg",
    altEn: "Artisanal handcrafted festive gifting trunk and brass urns by Bhaya India",
    altHi: "भाया इंडिया द्वारा हस्तनिर्मित उत्सव उपहार ट्रंक और पीतल के कलात्मक बर्तन",
    title: "Heritage Gifting Editorial Showcase",
    caption: "Curated festive collection representing authentic Indian craftsmanship.",
    usage: "Homepage Hero & Editorial Showcase",
    uploadedAt: "2026-09-18T14:30:00.000Z",
  },
  {
    id: "media-textiles",
    filename: "category-textiles.jpg",
    originalName: "Chanderi Handloom Silk & Fine Cotton Dupattas",
    fileType: "image/jpeg",
    dimensions: "1200 × 800 px",
    fileSize: 794847,
    url: "/assets/category-textiles.jpg",
    altEn: "Authentic Indian heritage woven textiles and silk dupattas from Bhaya India",
    altHi: "भाया इंडिया प्रामाणिक भारतीय हथकरघा वस्त्र और सिल्क दुपट्टे",
    title: "Indian Handlooms & Fabrics",
    caption: "Direct cluster-sourced textiles preserving ancient regional weaving traditions.",
    usage: "Textiles Category & Catalogue",
    uploadedAt: "2026-09-20T11:15:00.000Z",
  },
  {
    id: "media-stationery",
    filename: "category-stationery.jpg",
    originalName: "Handmade Cotton Rag Paper Journals with Brass Accents",
    fileType: "image/jpeg",
    dimensions: "1200 × 800 px",
    fileSize: 597957,
    url: "/assets/category-stationery.jpg",
    altEn: "Handmade eco-friendly cotton rag paper journals with brass closures by Bhaya India",
    altHi: "भाया इंडिया पर्यावरण-अनुकूल हस्तनिर्मित कॉटन रैग पेपर डायरी",
    title: "Sustainable Artisanal Stationery",
    caption: "Recycled cotton rag deckle-edge journals bound in vegetable-tanned leather.",
    usage: "Stationery Category & Corporate Gifting",
    uploadedAt: "2026-09-22T09:45:00.000Z",
  },
];

export const defaultServices: ServiceItem[] = [
  {
    id: "srv-001",
    title: "Authentic Product Sourcing & Cluster Curation",
    titleHi: "प्रामाणिक उत्पाद सोर्सिंग एवं क्लस्टर चयन",
    description:
      "Direct procurement from vetted artisan clusters, master weavers, and certified regional workshops with zero middleman markups.",
    descriptionHi:
      "बिना बिचौलियों के सीधे कारीगरों, बुनकरों और प्रमाणित विनिर्माण इकाइयों से पारदर्शी खरीद।",
    category: "Sourcing & Supply Chain",
    image: "/assets/category-textiles.jpg",
    featured: true,
    status: "Published",
    order: 1,
    seoTitle: "Authentic Product Sourcing Services — BHAYA INDIA",
    seoDescription:
      "Direct cluster procurement and artisanal sourcing across India by BHAYA INDIA. Verified craft clusters and transparent supply chain.",
    createdAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "srv-002",
    title: "Wholesale & Institutional B2B Supply",
    titleHi: "थोक एवं संस्थागत बी2बी आपूर्ति",
    description:
      "Tiered volume pricing, scheduled dispatches, and GST compliance for retail stores, hospitality chains, and institutions.",
    descriptionHi:
      "खुदरा दुकानों, होटलों और कॉर्पोरेट संस्थानों के लिए पारदर्शी थोक मूल्य और जीएसटी बिलिंग।",
    category: "Wholesale & Commerce",
    image: "/assets/hero-editorial.jpg",
    featured: true,
    status: "Published",
    order: 2,
    seoTitle: "Wholesale B2B Supply & Institutional Procurement — BHAYA INDIA",
    seoDescription:
      "Reliable wholesale procurement for retail stores, hospitality, and corporate institutions. Direct Indian factory sourcing.",
    createdAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "srv-003",
    title: "Bespoke Corporate Gifting & Festive Hampers",
    titleHi: "कस्टम कॉर्पोरेट उपहार एवं उत्सव हैंपर्स",
    description:
      "Custom foil-stamped corporate ribbons, bespoke wood trunks, and curated artisanal delicacies for executive and festive occasions.",
    descriptionHi:
      "कॉर्पोरेट कंपनियों के लिए विशेष ब्रांडिंग, लकड़ी के ट्रंक और प्रामाणिक उपहार हैंपर्स।",
    category: "Corporate Solutions",
    image: "/assets/hero-editorial.jpg",
    featured: true,
    status: "Published",
    order: 3,
    seoTitle: "Luxury Corporate & Festive Gifting Hampers — BHAYA INDIA",
    seoDescription:
      "Bespoke corporate gifting solutions and handcrafted festive hampers curated by BHAYA INDIA with personalized branding.",
    createdAt: "2026-09-12T10:00:00.000Z",
  },
  {
    id: "srv-004",
    title: "Sustainable Packaging & Paper Products",
    titleHi: "सतत पैकेजिंग एवं हस्तनिर्मित पेपर उत्पाद",
    description:
      "Recycled cotton-rag paper boxes, rigid festive trunks, and eco-friendly protective packaging for premium lifestyle brands.",
    descriptionHi:
      "पर्यावरण अनुकूल कॉटन रैग पेपर बॉक्स, मजबूत क्राफ्ट ट्रंक और प्रीमियम ब्रांड्स के लिए टिकाऊ पैकेजिंग।",
    category: "Packaging & Manufacturing",
    image: "/assets/category-stationery.jpg",
    featured: true,
    status: "Published",
    order: 4,
    seoTitle: "Sustainable Packaging & Custom Paper Products — BHAYA INDIA",
    seoDescription:
      "Eco-friendly rigid boxes, handmade paper products, and custom packaging solutions for businesses by BHAYA INDIA.",
    createdAt: "2026-09-14T10:00:00.000Z",
  },
  {
    id: "srv-005",
    title: "BHAYA INDIA 2.0 — Hyperlocal Merchant Fulfillment",
    titleHi: "भाया इंडिया 2.0 — हाइपरलोकल मर्चेंट डिलीवरी",
    description:
      "Future vision: Linking local neighborhood retail stores to high-intent regional shoppers with automated order routing and trusted local delivery.",
    descriptionHi:
      "भविष्य की योजना: स्थानीय खुदरा दुकानों को डिजिटल ग्राहकों से जोड़ना और उसी दिन सुरक्षित डिलीवरी सुनिश्चित करना।",
    category: "Future Vision & Technology",
    image: "/assets/hero-editorial.jpg",
    featured: false,
    status: "Draft",
    order: 5,
    seoTitle: "BHAYA INDIA 2.0 Hyperlocal Platform Vision",
    seoDescription:
      "Empowering local Indian brick-and-mortar merchants with digital storefronts and unified customer trust.",
    createdAt: "2026-09-20T10:00:00.000Z",
  },
];

export const defaultTeam: TeamMember[] = [
  {
    id: "team-001",
    name: "Merchant Operations Desk",
    nameHi: "मर्चेंट ऑपरेशंस डेस्क",
    role: "Merchant Partnerships & Seller Verification",
    roleHi: "व्यापारी साझेदारी एवं सत्यापन",
    bio: "Dedicated team overseeing transparent vendor onboarding, factory inspections, and product authenticity verification.",
    bioHi: "व्यापारियों के सत्यापन, गुणवत्ता जांच और पारदर्शी समन्वय के लिए समर्पित टीम।",
    image: "/assets/bhaya-india-logo.png",
    order: 1,
    status: "Active",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "team-002",
    name: "Craft Curation & Quality Desk",
    nameHi: "शिल्प चयन एवं गुणवत्ता टीम",
    role: "Regional Cluster Liaison & Quality Control",
    roleHi: "क्षेत्रीय शिल्प समन्वय एवं गुणवत्ता नियंत्रण",
    bio: "Working hand-in-hand with hereditary artisans, weavers, and metal smiths across Indian craft centers.",
    bioHi: "देश भर के शिल्प केंद्रों, बुनकरों और कारीगरों के साथ मिलकर प्रामाणिक गुणवत्ता सुनिश्चित करने वाली टीम।",
    image: "/assets/bhaya-india-logo.png",
    order: 2,
    status: "Active",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
];

export const defaultBlogs: BlogPost[] = [
  {
    id: "blog-001",
    title: "The Art of Authentic Indian Gifting: Behind Our Heritage Hampers",
    titleHi: "भारतीय उपहार परंपरा: प्रामाणिक उत्सव हैंपर्स की कहानी",
    slug: "art-of-authentic-indian-gifting",
    excerpt:
      "How genuine Indian festivities, handcrafted bell-metal artifacts, and wholesome treats create an unforgettable impression for corporate and personal celebrations.",
    excerptHi:
      "भारतीय त्योहारों में प्रामाणिक उपहारों, पीतल शिल्पों और शुद्ध मिष्ठानों का महत्व और कॉर्पोरेट आयोजनों पर इसका प्रभाव।",
    content: `Indian celebrations have always been grounded in personal warmth, shared abundance, and timeless craftsmanship. When selecting a festive or corporate gift, the packaging and contents tell a lasting story of respect and genuine care.

### Sourcing Without Compromise
At BHAYA INDIA, every festive hamper begins with authentic artisan partnerships. We combine reusable handcrafted wooden trunks lined with textured vegan leather and antique brass clasps. Inside, stone-ground dry fruits, pure saffron delicacies, and heirloom brass keepsakes ensure that nothing is transient or disposable.

### The Return to Meaningful Keepsakes
Modern gifting has often suffered from generic disposable merchandise. By contrast, a hand-beaten bell-brass urli bowl or a solid cast incense burner stays in the recipient's home for decades, continuing to radiate serene positive energy long after the festival concludes.

### Transparent B2B Coordination
For corporate partners seeking custom branded foil ribbons and specialized volume dispatches, our merchant desk coordinates nationwide temperature-controlled deliveries with complete GST compliance and order tracking.`,
    author: "BHAYA INDIA Editorial Desk",
    publishedAt: "2026-09-25T10:00:00.000Z",
    featuredImage: "/assets/hero-editorial.jpg",
    category: "Festive Heritage",
    tags: ["Festivals", "Corporate Gifting", "Artisanal", "B2B"],
    status: "Published",
    seoTitle: "The Art of Authentic Indian Gifting — BHAYA INDIA Heritage",
    seoDescription:
      "Discover the heritage behind handcrafted Indian festive hampers and corporate gifting solutions by BHAYA INDIA.",
    canonical: "https://bhayaindia.com/blog/art-of-authentic-indian-gifting",
    ogImage: "/assets/hero-editorial.jpg",
  },
  {
    id: "blog-002",
    title: "Local to Online: Empowering Regional Indian Manufacturers",
    titleHi: "लोकल से ऑनलाइन: क्षेत्रीय भारतीय निर्माताओं का सशक्तिकरण",
    slug: "local-to-online-empowering-regional-manufacturers",
    excerpt:
      "Bridging the critical gap between authentic Indian factory floors and high-intent nationwide buyers with transparent commerce and trust.",
    excerptHi:
      "स्थानीय भारतीय कारखानों और देश भर के खरीदारों के बीच पारदर्शी व्यापार और भरोसे का सेतु।",
    content: `India is home to thousands of extraordinary manufacturing clusters: precision bell-metal artisans, heritage handloom cooperatives, sustainable paper fabricators, and agro processors. However, many remain disconnected from direct digital distribution due to predatory intermediaries.

### The Foundational Promise: जहाँ भाया, वहाँ भरोसा
BHAYA INDIA was founded on a simple premise: local commerce thrives when trust and transparency are preserved. Rather than burying manufacturers under opaque commissions or competing private labels, our platform provides a direct showcase.

### Direct Sourcing Advantages for Businesses
1. **Verifiable Quality:** Every partner factory is vetted for manufacturing capacity, raw material authenticity, and ethical labor practices.
2. **Transparent Factory Pricing:** Buyers access truthful wholesale rates without multiple broker markups.
3. **Streamlined Fulfillment:** Scheduled bulk shipments and consolidated regional dispatches reduce transit losses and delivery delays.

We welcome factory owners and regional craft centers to join our growing merchant network.`,
    author: "Merchant Advisory Desk",
    publishedAt: "2026-09-28T11:00:00.000Z",
    featuredImage: "/assets/category-textiles.jpg",
    category: "Business & Industry",
    tags: ["Manufacturing", "Local to Online", "B2B", "Make in India"],
    status: "Published",
    seoTitle: "Local to Online: Empowering Regional Indian Manufacturers | BHAYA INDIA",
    seoDescription:
      "How BHAYA INDIA bridges regional manufacturers with transparent nationwide wholesale and consumer demand.",
    canonical: "https://bhayaindia.com/blog/local-to-online-empowering-regional-manufacturers",
    ogImage: "/assets/category-textiles.jpg",
  },
  {
    id: "blog-003",
    title: "Traditional Brass Urli: Craftsmanship, Vastu & Home Care",
    titleHi: "पारंपरिक पीतल उरली: शिल्प, वास्तु एवं रख-रखाव",
    slug: "traditional-brass-urli-craft-and-care",
    excerpt:
      "An in-depth guide to traditional bell-metal brass urli bowls, their spiritual significance at home entrances, and proper natural maintenance.",
    excerptHi:
      "पीतल की पारंपरिक उरली का महत्व, प्रवेश द्वार पर वास्तु लाभ और प्राकृतिक चमक बनाए रखने के सरल उपाय।",
    content: `The Urli is an ancient vessel deeply rooted in traditional South and Central Indian heritage. Originally used for Ayurvedic preparations, its wide, shallow form has evolved into an auspicious home and hospitality centerpiece.

### Vastu Significance of Water and Flowers
In Indian Vastu Shastra and traditional architectural design, water elements placed near the northeast or main entryway attract tranquil energy and prosperity. Floating fresh flower petals with natural camphor or tealights in a virgin brass urli purifies the atmospheric vibration and offers a serene welcome to guests.

### Hand-Beaten Craftsmanship
Authentic urli vessels are hand-beaten by hereditary smiths using virgin cast brass (85% copper, 15% zinc). This alloy produces a resonant bell tone when struck and exhibits superior tarnish resistance compared to thin pressed sheet metal.

### Natural Cleaning and Long-Term Care
To maintain the warm golden luster of pure brass without using harmful abrasive chemicals:
- Apply a paste of fresh tamarind or lemon juice mixed with table salt.
- Gently rub along the contour with a soft cotton cloth.
- Rinse thoroughly with lukewarm water and dry immediately to prevent water spots.`,
    author: "Craft Curation Team",
    publishedAt: "2026-09-30T09:30:00.000Z",
    featuredImage: "/assets/hero-editorial.jpg",
    category: "Craft & Culture",
    tags: ["Home Decor", "Brass Craft", "Vastu", "Handmade"],
    status: "Published",
    seoTitle: "Traditional Brass Urli: Craftsmanship, Vastu & Care — BHAYA INDIA",
    seoDescription:
      "Learn the heritage, Vastu benefits, and natural cleaning tips for handcrafted pure brass urli bowls by BHAYA INDIA.",
    canonical: "https://bhayaindia.com/blog/traditional-brass-urli-craft-and-care",
    ogImage: "/assets/hero-editorial.jpg",
  },
];

export const defaultGlobalSeoSettings: GlobalSeoSettings = {
  homepageTitle: "BHAYA INDIA — जहाँ भाया, वहाँ भरोसा | Indian Business & E-commerce Platform",
  homepageDescription:
    "BHAYA INDIA connects consumers, regional retailers, and verified manufacturers across India. Authentic festival essentials, handlooms, corporate gifting, and wholesale sourcing.",
  homepageKeywords:
    "BHAYA INDIA, Indian business platform, Indian e-commerce, Festival products, Puja products, Retail products, Agro products, Manufacturing, Logistics, Exports, Wholesale, B2B, Local to Online, Local to India",
  defaultTitle: "BHAYA INDIA — जहाँ भाया, वहाँ भरोसा",
  defaultDescription:
    "BHAYA INDIA is an Indian Business & E-commerce Platform connecting customers, local businesses and manufacturers on a trusted digital platform.",
  defaultOgImage: "/assets/hero-editorial.jpg",
  defaultTwitterImage: "/assets/hero-editorial.jpg",
  defaultCanonical: "https://bhayaindia.com",
  siteName: "BHAYA INDIA",
  organizationName: "BHAYA INDIA",
  defaultRobots: "index, follow",
  googleVerificationTag: "",
  ga4MeasurementId: "",
  gtmId: "",
  cookieConsentEnabled: true,
};

export const defaultPageSeoRecords: Record<string, PageSeoRecord> = {
  "/": {
    path: "/",
    pageName: "Home",
    pageNameHi: "होम",
    seoTitle: "BHAYA INDIA — जहाँ भाया, वहाँ भरोसा | Indian Business & E-commerce Platform",
    metaDescription:
      "BHAYA INDIA is an Indian Business & E-commerce Platform connecting customers, regional retailers, and verified manufacturers with genuine trust.",
    canonicalUrl: "https://bhayaindia.com",
    ogTitle: "BHAYA INDIA — Quality Products. Honest Business.",
    ogDescription:
      "Explore curated Indian festival gifts, handlooms, and direct B2B manufacturer supply. Built on the promise of trust.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "BHAYA INDIA — Indian Business & E-commerce Platform",
    twitterDescription:
      "Local to Online • Local to India. Authentic products and verified manufacturers.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/about": {
    path: "/about",
    pageName: "About Bhaya India",
    pageNameHi: "हमारे बारे में",
    seoTitle: "About BHAYA INDIA — Mission, Vision & Core Values",
    metaDescription:
      "Learn about the mission, values, and ethical business pillars of BHAYA INDIA. Connecting local businesses, manufacturers, and customers on a trusted platform.",
    canonicalUrl: "https://bhayaindia.com/about",
    ogTitle: "About BHAYA INDIA — जहाँ भाया, वहाँ भरोसा",
    ogDescription:
      "Our mission is to empower authentic Indian makers and regional merchants through transparent, technology-enabled commerce.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "About BHAYA INDIA — Trusted Indian Commerce",
    twitterDescription:
      "Our mission, ethical pillars, and commitment to genuine Indian craftsmanship.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/bhaya-india-2": {
    path: "/bhaya-india-2",
    pageName: "BHAYA INDIA 2.0 Vision",
    pageNameHi: "भाया इंडिया 2.0",
    seoTitle: "BHAYA INDIA 2.0 — एक प्लेटफॉर्म, हजारों दुकानें, एक भरोसा",
    metaDescription:
      "BHAYA INDIA 2.0 empowers neighborhood shops with digital storefronts, verified local inventory, and hyper-reliable customer fulfillment.",
    canonicalUrl: "https://bhayaindia.com/bhaya-india-2",
    ogTitle: "BHAYA INDIA 2.0 — Future of Indian Local Commerce",
    ogDescription:
      "Transforming neighborhood retail with digital power. Join our early access merchant onboarding network.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "BHAYA INDIA 2.0 — Local Retail Revolution",
    twitterDescription:
      "Empowering local shopkeepers with digital technology and customer trust.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "WebSite",
    isIndexable: true,
  },
  "/why-choose-us": {
    path: "/why-choose-us",
    pageName: "Why Bhaya India",
    pageNameHi: "भाया इंडिया क्यों चुनें",
    seoTitle: "Why Choose BHAYA INDIA — Authentic Sourcing & Genuine Trust",
    metaDescription:
      "Discover the foundational pillars that make BHAYA INDIA the preferred partner for corporate gifting, B2B wholesale, and authentic products.",
    canonicalUrl: "https://bhayaindia.com/why-choose-us",
    ogTitle: "Why Choose BHAYA INDIA — Built on Enduring Trust",
    ogDescription:
      "Vetted artisan sourcing, honest pricing, and dedicated customer support across India.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Why BHAYA INDIA — Built on Trust",
    twitterDescription:
      "Vetted makers, genuine pricing, and zero middleman markups.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/products": {
    path: "/products",
    pageName: "Products & Catalogue",
    pageNameHi: "उत्पाद एवं कैटलॉग",
    seoTitle: "Product Catalogue — Authentic Indian Crafts & Gifts | BHAYA INDIA",
    metaDescription:
      "Shop curated Indian handlooms, brass home decor, festive gift hampers, and artisanal stationery with nationwide delivery.",
    canonicalUrl: "https://bhayaindia.com/products",
    ogTitle: "Curated Indian Products — BHAYA INDIA Catalogue",
    ogDescription:
      "Handcrafted Chanderi dupattas, pure brass urli bowls, eco-friendly journals, and luxury corporate gift trunks.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Shop Authentic Indian Products | BHAYA INDIA",
    twitterDescription:
      "Curated gifts, festive essentials, and heritage craftsmanship.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "WebSite",
    isIndexable: true,
  },
  "/services": {
    path: "/services",
    pageName: "Services & Solutions",
    pageNameHi: "सेवाएँ एवं समाधान",
    seoTitle: "Business Services — Sourcing, Wholesale & Corporate Solutions | BHAYA INDIA",
    metaDescription:
      "Explore BHAYA INDIA services: authentic product sourcing, corporate gifting, wholesale supply, sustainable packaging, and regional distribution.",
    canonicalUrl: "https://bhayaindia.com/services",
    ogTitle: "Services & Solutions — BHAYA INDIA B2B & Retail",
    ogDescription:
      "Tailored sourcing, corporate hampers, and factory-direct wholesale procurement.",
    ogImage: "/assets/category-textiles.jpg",
    twitterTitle: "Business Services — BHAYA INDIA",
    twitterDescription: "Direct sourcing, corporate gifts, and bulk supply solutions.",
    twitterImage: "/assets/category-textiles.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/wholesale": {
    path: "/wholesale",
    pageName: "Wholesale & B2B",
    pageNameHi: "थोक एवं बी2बी",
    seoTitle: "Wholesale & B2B Procurement — Direct Factory Supply | BHAYA INDIA",
    metaDescription:
      "Partner with BHAYA INDIA for bulk purchasing, institutional gifting, and factory-direct pricing with verified GST billing and nationwide logistics.",
    canonicalUrl: "https://bhayaindia.com/wholesale",
    ogTitle: "Wholesale & B2B Sourcing — BHAYA INDIA",
    ogDescription:
      "Direct factory wholesale pricing, minimum order flexibility, and dedicated B2B account management.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "B2B Wholesale Procurement | BHAYA INDIA",
    twitterDescription: "Factory direct supply, bulk discounts, and prompt dispatch.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/manufacturers": {
    path: "/manufacturers",
    pageName: "For Manufacturers",
    pageNameHi: "निर्माताओं के लिए",
    seoTitle: "For Manufacturers — Direct Distribution & Factory Growth | BHAYA INDIA",
    metaDescription:
      "Manufacturers and production units can connect directly with nationwide institutional and retail demand without broker markups.",
    canonicalUrl: "https://bhayaindia.com/manufacturers",
    ogTitle: "Partner as a Manufacturer — BHAYA INDIA",
    ogDescription:
      "बिना बिचौलियों के सीधा व्यापार. Register your production capacity and expand nationwide.",
    ogImage: "/assets/category-textiles.jpg",
    twitterTitle: "Direct Factory Partnerships | BHAYA INDIA",
    twitterDescription: "Join the verified BHAYA INDIA manufacturing network.",
    twitterImage: "/assets/category-textiles.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/become-a-seller": {
    path: "/become-a-seller",
    pageName: "Become a Seller",
    pageNameHi: "विक्रेता बनें",
    seoTitle: "Become a Seller — Expand Your Local Shop Online | BHAYA INDIA",
    metaDescription:
      "Local shopkeepers and retailers can register for the upcoming BHAYA INDIA marketplace. Grow your customer base with genuine trust.",
    canonicalUrl: "https://bhayaindia.com/become-a-seller",
    ogTitle: "Become a Seller on BHAYA INDIA — Local to Online",
    ogDescription:
      "Digital tools, zero upfront barrier, and genuine customer trust for local Indian retail businesses.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Become a Seller | BHAYA INDIA",
    twitterDescription: "Empower your neighborhood store with digital reach.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/faq": {
    path: "/faq",
    pageName: "FAQs",
    pageNameHi: "अक्सर पूछे जाने वाले प्रश्न",
    seoTitle: "Frequently Asked Questions — Orders, Wholesale & Services | BHAYA INDIA",
    metaDescription:
      "Find quick answers to common questions about BHAYA INDIA ordering, wholesale enquiries, payments, deliveries, and merchant partnerships.",
    canonicalUrl: "https://bhayaindia.com/faq",
    ogTitle: "Frequently Asked Questions — BHAYA INDIA Help Desk",
    ogDescription:
      "Answers regarding product authenticity, bulk quotations, delivery schedules, and platform support.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "BHAYA INDIA FAQ — Helpful Answers",
    twitterDescription: "Orders, shipping, payment methods, and wholesale help.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "FAQPage",
    isIndexable: true,
  },
  "/blog": {
    path: "/blog",
    pageName: "Blog & Publications",
    pageNameHi: "ब्लॉग एवं प्रकाशन",
    seoTitle: "Publications & Insights — Craftsmanship, Commerce & Heritage | BHAYA INDIA",
    metaDescription:
      "Read articles on Indian heritage crafts, regional manufacturing insights, Vastu decor tips, and modern e-commerce trends by BHAYA INDIA.",
    canonicalUrl: "https://bhayaindia.com/blog",
    ogTitle: "BHAYA INDIA Publications & Editorial Insights",
    ogDescription:
      "Stories behind authentic Indian artisans, festival gifting guides, and manufacturer spotlights.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Publications & Heritage Insights | BHAYA INDIA",
    twitterDescription: "Authentic stories of Indian crafts and commerce.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Article",
    isIndexable: true,
  },
  "/gallery": {
    path: "/gallery",
    pageName: "Visual Gallery",
    pageNameHi: "विजुअल गैलरी",
    seoTitle: "Visual Gallery — Artisan Workshops & Product Chronicles | BHAYA INDIA",
    metaDescription:
      "Explore authentic visual chronicles of master workshops, handcrafted collections, and partner manufacturing facilities.",
    canonicalUrl: "https://bhayaindia.com/gallery",
    ogTitle: "Visual Gallery — BHAYA INDIA Crafts & Facilities",
    ogDescription:
      "Authentic photographic documentation of artisan ateliers and production excellence.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Visual Gallery | BHAYA INDIA",
    twitterDescription: "Authentic workshops and craft photography.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "WebSite",
    isIndexable: true,
  },
  "/testimonials": {
    path: "/testimonials",
    pageName: "Reviews & Testimonials",
    pageNameHi: "समीक्षाएं एवं अनुभव",
    seoTitle: "Verified Reviews & Client Experiences | BHAYA INDIA",
    metaDescription:
      "Read genuine feedback from verified customers, corporate gifting clients, and retail partners of BHAYA INDIA.",
    canonicalUrl: "https://bhayaindia.com/testimonials",
    ogTitle: "Client Reviews & Trust — BHAYA INDIA",
    ogDescription:
      "Transparent customer reviews and feedback on product quality and delivery reliability.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Client Reviews | BHAYA INDIA",
    twitterDescription: "Verified client feedback and experiences.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/contact": {
    path: "/contact",
    pageName: "Contact Us",
    pageNameHi: "संपर्क करें",
    seoTitle: "Contact Us — Business Desk & Customer Support | BHAYA INDIA",
    metaDescription:
      "Get in touch with the BHAYA INDIA merchant desk. Connect via phone, WhatsApp, or email for order enquiries, corporate quotations, and support.",
    canonicalUrl: "https://bhayaindia.com/contact",
    ogTitle: "Contact BHAYA INDIA — We're Here to Help",
    ogDescription:
      "Helpline: +91 87266 90926 • Official WhatsApp • Business Desk support Monday through Saturday.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Contact BHAYA INDIA",
    twitterDescription: "Reach our customer desk and business enquiry support.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "LocalBusiness",
    isIndexable: true,
  },
  "/company-profile": {
    path: "/company-profile",
    pageName: "Company Profile",
    pageNameHi: "कंपनी प्रोफाइल",
    seoTitle: "Corporate Profile & Credentials — BHAYA INDIA",
    metaDescription:
      "Official corporate profile of BHAYA INDIA. Governance, ethical sourcing principles, and registered business information.",
    canonicalUrl: "https://bhayaindia.com/company-profile",
    ogTitle: "Corporate Profile — BHAYA INDIA",
    ogDescription:
      "A trusted Indian business and e-commerce platform dedicated to quality and reliable merchant partnerships.",
    ogImage: "/assets/hero-editorial.jpg",
    twitterTitle: "Company Profile | BHAYA INDIA",
    twitterDescription: "Corporate overview and ethical business foundation.",
    twitterImage: "/assets/hero-editorial.jpg",
    robots: "index, follow",
    schemaType: "Organization",
    isIndexable: true,
  },
  "/account": {
    path: "/account",
    pageName: "My Account & Orders",
    pageNameHi: "खाता एवं आर्डर",
    seoTitle: "My Account & Order Tracking — BHAYA INDIA",
    metaDescription:
      "Track order dispatches, manage saved delivery addresses, and view order history on BHAYA INDIA.",
    canonicalUrl: "https://bhayaindia.com/account",
    ogTitle: "My Account — BHAYA INDIA Customer Portal",
    ogDescription: "Fast order lookup and personalized account management.",
    ogImage: "/assets/bhaya-india-logo.png",
    twitterTitle: "Account & Order Tracking | BHAYA INDIA",
    twitterDescription: "Track your orders and manage saved addresses.",
    twitterImage: "/assets/bhaya-india-logo.png",
    robots: "noindex, follow",
    schemaType: "WebSite",
    isIndexable: false,
  },
  "/cart": {
    path: "/cart",
    pageName: "Shopping Bag",
    pageNameHi: "शॉपिंग बैग",
    seoTitle: "Shopping Bag — Review Your Order | BHAYA INDIA",
    metaDescription:
      "Review selected artisanal products, adjust quantities, and proceed to secure checkout or WhatsApp order confirmation.",
    canonicalUrl: "https://bhayaindia.com/cart",
    ogTitle: "Shopping Bag — BHAYA INDIA",
    ogDescription: "Review your selected items and complete your order.",
    ogImage: "/assets/bhaya-india-logo.png",
    twitterTitle: "Shopping Bag | BHAYA INDIA",
    twitterDescription: "Review selected items and checkout securely.",
    twitterImage: "/assets/bhaya-india-logo.png",
    robots: "noindex, follow",
    schemaType: "WebSite",
    isIndexable: false,
  },
  "/privacy-policy": {
    path: "/privacy-policy",
    pageName: "Privacy Policy",
    pageNameHi: "गोपनीयता नीति",
    seoTitle: "Privacy Policy — Data Protection & Trust | BHAYA INDIA",
    metaDescription:
      "Our privacy policy outlines how BHAYA INDIA protects and respects your personal data, order details, and privacy.",
    canonicalUrl: "https://bhayaindia.com/privacy-policy",
    ogTitle: "Privacy Policy — BHAYA INDIA",
    ogDescription: "Transparent data protection and privacy practices.",
    ogImage: "/assets/bhaya-india-logo.png",
    twitterTitle: "Privacy Policy | BHAYA INDIA",
    twitterDescription: "How we protect your data and privacy.",
    twitterImage: "/assets/bhaya-india-logo.png",
    robots: "index, follow",
    schemaType: "WebSite",
    isIndexable: true,
  },
  "/terms-conditions": {
    path: "/terms-conditions",
    pageName: "Terms & Conditions",
    pageNameHi: "नियम एवं शर्तें",
    seoTitle: "Terms & Conditions — Platform Agreement | BHAYA INDIA",
    metaDescription:
      "Read the terms, conditions, and customer service standards governing the use of BHAYA INDIA.",
    canonicalUrl: "https://bhayaindia.com/terms-conditions",
    ogTitle: "Terms & Conditions — BHAYA INDIA",
    ogDescription: "Platform policies and customer terms of service.",
    ogImage: "/assets/bhaya-india-logo.png",
    twitterTitle: "Terms & Conditions | BHAYA INDIA",
    twitterDescription: "Platform guidelines and conditions of use.",
    twitterImage: "/assets/bhaya-india-logo.png",
    robots: "index, follow",
    schemaType: "WebSite",
    isIndexable: true,
  },
};

export const defaultActivityLogs: ActivityLogItem[] = [
  {
    id: "act-001",
    user: "System Administrator",
    action: "Platform Initialization",
    object: "BHAYA INDIA Core CMS",
    details: "Initialized Next.js 16 Admin Control Center and SEO management layer.",
    timestamp: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "act-002",
    user: "System Administrator",
    action: "Shopify Storefront Sync",
    object: "Commerce Catalog",
    details: "Verified live Storefront API connection and primary commerce source of truth.",
    timestamp: "2026-10-01T09:30:00.000Z",
  },
  {
    id: "act-003",
    user: "Content Editor",
    action: "Media Asset Audit",
    object: "Brand Assets",
    details: "Audited brand logos, hero editorials, and indexed dual-language alt text.",
    timestamp: "2026-10-01T11:15:00.000Z",
  },
  {
    id: "act-004",
    user: "SEO Manager",
    action: "Page SEO Calibration",
    object: "19 Core Pages",
    details: "Configured unique title, description, canonical and schema records.",
    timestamp: "2026-10-01T14:45:00.000Z",
  },
];
