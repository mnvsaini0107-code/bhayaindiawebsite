import fs from "fs";
import path from "path";

export * from "./types";
export * from "./site-config";
import type {
  Product,
  Category,
  Enquiry,
  Order,
  Testimonial,
  FAQ,
  GalleryItem,
  SiteSettings,
  PageContent,
  CustomerUser,
  CustomerAddress,
} from "./types";

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  enquiries: Enquiry[];
  orders: Order[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  gallery: GalleryItem[];
  settings: SiteSettings;
  content: PageContent;
  users?: CustomerUser[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Default initial data
const initialData: DatabaseSchema = {
  users: [],
  settings: {
    businessName: "BHAYA INDIA",
    tagline: "जहाँ भाया, वहाँ भरोसा",
    phone: "+91 87266 90926",
    whatsapp: "918726690926",
    email: "hello@bhayaindia.com",
    address: "BHAYA INDIA — Business & E-commerce Desk, India",
    businessHours: "Monday – Saturday: 9:30 AM – 7:00 PM IST",
    socialLinks: {
      instagram: "https://instagram.com/bhayaindia",
      facebook: "https://facebook.com/bhayaindia",
      youtube: "https://youtube.com/@bhayaindia",
      linkedin: "https://linkedin.com/company/bhayaindia",
    },
    mapsEmbedUrl: "",
  },
  content: {
    hero: {
      eyebrow: "BHAYA INDIA • जहाँ भाया, वहाँ भरोसा",
      headline: "Quality Products. Honest Business.",
      subheadline:
        "BHAYA INDIA is an Indian business and e-commerce platform connecting customers, regional merchants, and verified manufacturers with genuine trust.",
      ctaPrimaryText: "Explore Products",
      ctaSecondaryText: "Wholesale & B2B",
    },
    brandStory: {
      eyebrow: "OUR STORY",
      headline: "Local to Online • Local to India",
      paragraph1:
        "BHAYA INDIA एक भारतीय Business & E-commerce Platform है, जिसका उद्देश्य ग्राहकों, स्थानीय व्यवसायों और manufacturers को एक भरोसेमंद digital platform से जोड़ना है।",
      paragraph2:
        "Built on the foundational promise of 'जहाँ भाया, वहाँ भरोसा', we provide an authentic e-commerce and business ecosystem honoring quality products and reliable customer relationships.",
      stats: [
        { label: "Our Foundation", value: "भरोसा" },
        { label: "Vision", value: "Local to India" },
        { label: "Sourcing", value: "Authentic" },
        { label: "Platform", value: "B2B & Retail" },
      ],
    },
    whyBhaya: {
      eyebrow: "WHY CHOOSE BHAYA INDIA",
      headline: "Built on Values That Stand the Test of Time",
      pillars: [
        {
          title: "Authentic Sourcing",
          desc: "Products selected directly from trusted makers, artisans, and manufacturers.",
          icon: "shield",
        },
        {
          title: "Honest & Transparent Value",
          desc: "Straightforward communication and honest value that honors both makers and customers.",
          icon: "tag",
        },
        {
          title: "Curated Range",
          desc: "Explore quality textiles, fine stationery, bespoke hampers, and daily essentials.",
          icon: "layers",
        },
        {
          title: "Dedicated Support",
          desc: "Personalized assistance for corporate orders, custom requirements, and quick dispatches.",
          icon: "headset",
        },
      ],
    },
    sellerCta: {
      headline: "क्या आप दुकानदार या manufacturer हैं?",
      body: "भविष्य के BHAYA INDIA Marketplace से जुड़ने के लिए अपना interest दर्ज करें।",
      ctaText: "Become a Seller",
    },
    bhaya2: {
      headline: "BHAYA INDIA 2.0",
      subheadline: "एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा",
      body: "Our future ecosystem connecting customers, local shopkeepers, manufacturers, and logistics under one trusted umbrella.",
    },
  },
  categories: [
    {
      id: "cat-puja",
      name: "Puja Samagri",
      nameHi: "पूजा सामग्री",
      slug: "puja-samagri",
      description: "Pure and authentic puja samagri, brassware, diya lamps, camphor, dhoop, and sacred ritual offerings.",
      descriptionHi: "शुद्ध एवं प्रामाणिक पूजा सामग्री, पीतल के दीये, धूप, हवन सामग्री और पारंपरिक पूजा अनुष्ठान सामग्री।",
      image: "/assets/hero-editorial.jpg",
      productCount: 45,
      subcategories: ["Brassware & Diyas", "Dhoop & Agarbatti", "Havan Samagri", "Pooja Aasan & Cloth"],
      subcategoriesHi: ["पीतल के दीये व थाली", "धूप एवं अगरबत्ती", "हवन सामग्री", "पूजा आसन व वस्त्र"],
    },
    {
      id: "cat-fest-decor",
      name: "Festival Decoration",
      nameHi: "त्योहार सजावट",
      slug: "festival-decoration",
      description: "Traditional festival decor, decorative torans, bandhanwars, handcrafted festive hangings, and lights.",
      descriptionHi: "पारंपरिक त्योहार सजावट, तोरण, बंदनवार, हस्तशिल्प झालरें, शुभ-लाभ हैंगिंग्स और उत्सव सामग्री।",
      image: "/assets/category-textiles.jpg",
      productCount: 38,
      subcategories: ["Torans & Bandhanwars", "Festive Hangings", "Decorative Lights", "Rangoli & Accents"],
      subcategoriesHi: ["तोरण एवं बंदनवार", "उत्सव हैंगिंग्स", "सजावटी लाइट्स", "रंगोली व सजावट"],
    },
    {
      id: "cat-wedding",
      name: "Wedding & Marriage Items",
      nameHi: "विवाह एवं शादी सामग्री",
      slug: "wedding-marriage-items",
      description: "Essential marriage ritual items, bridal accessories, ornate wedding trunks, and gift boxes.",
      descriptionHi: "विवाह एवं शुभ वैवाहिक संस्कार सामग्री, शगुन लिफाफे, वर-वधू पूजन सामग्री और शादी के विशेष उपहार बक्से।",
      image: "/assets/category-textiles.jpg",
      productCount: 32,
      subcategories: ["Ritual Essentials", "Shagun & Gift Boxes", "Bridal Accessories", "Ceremonial Trunks"],
      subcategoriesHi: ["विवाह संस्कार सामग्री", "शगुन एवं उपहार बॉक्स", "विवाह परिधान व श्रृंगार", "वैवाहिक बक्से"],
    },
    {
      id: "cat-handicraft",
      name: "Handicraft",
      nameHi: "हस्तशिल्प",
      slug: "handicraft",
      description: "Authentic Indian handicrafts, brass artifacts, hand-carved woodwork, terracotta, and folk art.",
      descriptionHi: "प्रामाणिक भारतीय हस्तशिल्प, पीतल शिल्प, नक्काशीदार काष्ठ कला, टेराकोटा कलाकृतियां और क्षेत्रीय लोक शिल्प।",
      image: "/assets/category-stationery.jpg",
      productCount: 54,
      subcategories: ["Brass & Metal Craft", "Wood Crafts", "Folk Art & Paintings", "Terracotta Art"],
      subcategoriesHi: ["पीतल एवं धातु शिल्प", "काष्ठ कला", "लोक कला एवं पेंटिंग्स", "टेराकोटा शिल्प"],
    },
    {
      id: "cat-home-decor",
      name: "Home Decoration",
      nameHi: "घर की सजावट",
      slug: "home-decoration",
      description: "Artisan homeware, wall decor, brass urns, decorative figurines, and aesthetic interior accents.",
      descriptionHi: "पारंपरिक एवं आधुनिक घर की सजावट, वॉल डेकोर, पीतल के शोपीस, लैंप्स और सुरुचिपूर्ण कलाकृतियां।",
      image: "/assets/hero-editorial.jpg",
      productCount: 42,
      subcategories: ["Wall Hangings & Clocks", "Brass Showpieces", "Tabletop Decor", "Vases & Urns"],
      subcategoriesHi: ["दीवार सजावट व घड़ियां", "पीतल शोपीस", "टेबल सजावट", "फूलदान एवं पात्र"],
    },
    {
      id: "cat-gifts",
      name: "Gift Items",
      nameHi: "उपहार सामग्री",
      slug: "gift-items",
      description: "Curated gift items, festive hampers, corporate tokens, and customized bespoke presentation boxes.",
      descriptionHi: "विचारशील उपहार सामग्री, त्योहार उपहार हैम्पर्स, कॉर्पोरेट उपहार सेट, रिटर्न गिफ्ट्स और कस्टम उपहार।",
      image: "/assets/hero-editorial.jpg",
      productCount: 49,
      subcategories: ["Festival Hampers", "Corporate Gifts", "Return Gifts", "Personalized Boxes"],
      subcategoriesHi: ["त्योहार हैम्पर्स", "कॉर्पोरेट उपहार", "रिटर्न गिफ्ट्स", "कस्टम बॉक्सेज"],
    },
    {
      id: "cat-household",
      name: "Household Products",
      nameHi: "घरेलू उत्पाद",
      slug: "household-products",
      description: "Everyday household essentials, kitchenware, copper bottles, storage organizers, and home utility.",
      descriptionHi: "दैनिक घरेलू उत्पाद, रसोई सामग्री, तांबे के बर्तन व बोतलें, स्टोरेज वस्तुएं और पारिवारिक दैनिक उपयोग की वस्तुएं।",
      image: "/assets/category-textiles.jpg",
      productCount: 65,
      subcategories: ["Copper & Brass Utensils", "Storage & Utility", "Kitchen Essentials", "Home Textiles"],
      subcategoriesHi: ["तांबे व पीतल के बर्तन", "स्टोरेज एवं उपयोगिता", "रसोई उपयोगी वस्तुएं", "घरेलू वस्त्र"],
    },
    {
      id: "cat-other",
      name: "Other Categories",
      nameHi: "अन्य श्रेणियाँ",
      slug: "other-categories",
      description: "Textiles, fabrics, fine stationery, Agro produce, packaging materials, and general merchandise.",
      descriptionHi: "वस्त्र, स्टेशनरी, कृषि उत्पाद, पैकेजिंग सामग्री और हमारे 7 व्यावसायिक क्षेत्रों के विविध उत्पाद।",
      image: "/assets/category-stationery.jpg",
      productCount: 88,
      subcategories: ["Textiles & Fabrics", "Stationery & Office", "Agro Produce", "Commercial Packaging"],
      subcategoriesHi: ["वस्त्र एवं परिधान", "स्टेशनरी व कार्यालय", "कृषि उपज", "व्यावसायिक पैकेजिंग"],
    },
    {
      id: "cat-1",
      name: "Textiles & Fabrics",
      slug: "textiles-fabrics",
      description: "Handcrafted sarees, pure silks, heritage shawls, and premium tailored linens.",
      image: "/assets/category-textiles.jpg",
      productCount: 48,
      subcategories: ["Sarees", "Silk Dupattas", "Handloom Shawls", "Unstitched Suits"],
    },
    {
      id: "cat-2",
      name: "Stationery & Office",
      slug: "stationery-office",
      description: "Fine leather journals, executive desk accessories, and corporate paper supplies.",
      image: "/assets/category-stationery.jpg",
      productCount: 36,
      subcategories: ["Notebooks", "Executive Pens", "Desk Organizers", "Paper Sets"],
    },
    {
      id: "cat-3",
      name: "Gift Hampers",
      slug: "gift-hampers",
      description: "Bespoke curated gifting for festive celebrations, weddings, and corporate recognition.",
      image: "/assets/hero-editorial.jpg",
      productCount: 24,
      subcategories: ["Corporate Gifts", "Festival Hampers", "Wedding Favours", "Custom Hampers"],
    },
    {
      id: "cat-4",
      name: "Home & Living",
      slug: "home-living",
      description: "Artisanal brassware, hand-carved accessories, and luxury home decor accents.",
      image: "/assets/hero-editorial.jpg",
      productCount: 42,
      subcategories: ["Brass Decor", "Bedding", "Tableware", "Artisanal Accents"],
    },
    {
      id: "cat-5",
      name: "Wholesale & Bulk",
      slug: "wholesale-bulk",
      description: "Institutional supply, commercial fabrics, corporate supplies, and bulk packaging.",
      image: "/assets/category-stationery.jpg",
      productCount: 65,
      subcategories: ["Institutional Textiles", "Bulk Stationery", "Custom Merchandise"],
    },
  ],
  products: [
    {
      id: "prod-001",
      name: "Premium Banarasi Silk Saree",
      slug: "premium-banarasi-silk-saree",
      category: "Textiles & Fabrics",
      categorySlug: "textiles-fabrics",
      subcategory: "Sarees",
      tagline: "Heritage weave, contemporary grace",
      description:
        "Handwoven Banarasi silk saree crafted with genuine gold-tone zari embellishment along the borders and ornate pallu. Blends timeless Indian craftsmanship with modern refinement, ideal for weddings, family milestones, and auspicious celebrations.",
      images: ["/assets/category-textiles.jpg"],
      price: 3800,
      priceNote: "Per piece (Inclusive of Taxes)",
      specs: [
        { label: "Material", value: "Pure Katan Silk" },
        { label: "Length", value: "6.5 metres (with blouse)" },
        { label: "Blouse Piece", value: "Included (0.8m)" },
        { label: "Weave Technique", value: "Kadhwa Handloom" },
        { label: "Care Instructions", value: "Dry Clean Only" },
      ],
      features: [
        "Pure mulberry silk foundation",
        "Authentic Banarasi Kadhwa weave",
        "Rich zari borders and heavy ornamental pallu",
        "Silk Mark certified quality assurance",
      ],
      benefits: [
        "Inheritance-grade longevity and natural silk lustre",
        "Lightweight drape for effortless evening wear",
        "Includes matched unstitched blouse piece",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-TX-001",
      seoTitle: "Premium Banarasi Silk Saree — Bhaya India",
      seoDescription: "Authentic handwoven Banarasi pure silk saree with zari border. Pan-India delivery from Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-002",
      name: "Leather-Bound Executive Notebook",
      slug: "leather-bound-executive-notebook",
      category: "Stationery & Office",
      categorySlug: "stationery-office",
      subcategory: "Notebooks",
      tagline: "Write your legacy with intention",
      description:
        "Handcrafted top-grain leather journal with 200 pages of 90 GSM archival-grade ivory paper. Featuring lay-flat bookbinding, gilded edge accents, and a satin bookmark ribbon. Built for leaders, thinkers, and discerning professionals.",
      images: ["/assets/category-stationery.jpg"],
      price: 650,
      priceNote: "Per piece (Bulk rates available)",
      specs: [
        { label: "Cover Material", value: "Genuine Full-Grain Leather" },
        { label: "Paper", value: "90 GSM Fountain-pen friendly Ivory" },
        { label: "Page Count", value: "200 Ruled Pages" },
        { label: "Dimensions", value: "A5 (148 × 210 mm)" },
        { label: "Binding", value: "Hand-stitched Lay-flat" },
      ],
      features: [
        "Supple genuine leather finish that patinas with age",
        "Zero bleed-through on fountain pens and rollers",
        "Integrated dual bookmark ribbons",
        "Custom hot-foil gold monogramming available on bulk orders",
      ],
      benefits: [
        "Elevates executive workspace aesthetic",
        "Resistant to environmental humidity and yellowing",
        "Ideal corporate executive gift",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: true,
      inStock: true,
      minOrder: 1,
      sku: "BI-ST-002",
      seoTitle: "Leather-Bound Executive Notebook — Bhaya India",
      seoDescription: "Fine genuine leather notebook with archival paper. Shop luxury office stationery at Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-003",
      name: "Royal Heritage Festival Hamper",
      slug: "royal-heritage-festival-hamper",
      category: "Gift Hampers",
      categorySlug: "gift-hampers",
      subcategory: "Festival Hampers",
      tagline: "Thoughtful gifting made effortless",
      description:
        "An opulent gift trunk handcrafted in wooden casing with gold-embossed faux leather trim. Includes artisanal saffron treats, stone-ground dry fruits, pure brass incense holder, hand-poured soy candle, and personalized greeting scroll.",
      images: ["/assets/hero-editorial.jpg"],
      price: 2450,
      priceNote: "Per hamper (Minimum order for customization: 15)",
      specs: [
        { label: "Trunk Dimensions", value: "32 × 24 × 12 cm" },
        { label: "Trunk Material", value: "Textured Vegan Leather & Brass Clasps" },
        { label: "Shelf Life", value: "6 Months for Food Items" },
        { label: "Packaging", value: "Individual air-sealed containers" },
      ],
      features: [
        "Curated assortment of premium dry fruits and sweets",
        "Brass handcrafted artifact for lasting keepsake",
        "Custom foil-stamped corporate company ribbon option",
        "Express temperature-controlled shipping",
      ],
      benefits: [
        "Leaves an unforgettable impression on clients and family",
        "Zero plastic presentation with reusable storage trunk",
        "Complete gifting solution ready to present",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: true,
      inStock: true,
      minOrder: 1,
      sku: "BI-GH-003",
      seoTitle: "Royal Heritage Festival Hamper — Bhaya India",
      seoDescription: "Luxury corporate and festive gifting hampers by Bhaya India. Nationwide delivery.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-004",
      name: "Handcrafted Brass Urli Bowl",
      slug: "handcrafted-brass-urli-bowl",
      category: "Home & Living",
      categorySlug: "home-living",
      subcategory: "Brass Decor",
      tagline: "Spiritual serenity in pure metal",
      description:
        "Traditional bell-metal brass urli bowl hand-beaten by hereditary artisans. Perfectly sized for floating flower petals, aromatic water, and tealights at the entrance of homes and luxury office receptions.",
      images: ["/assets/hero-editorial.jpg"],
      price: 1850,
      priceNote: "Per piece",
      specs: [
        { label: "Metal", value: "Virgin Cast Brass (85% Copper, 15% Zinc)" },
        { label: "Diameter", value: "12 inches (30 cm)" },
        { label: "Weight", value: "2.1 kg" },
        { label: "Finish", value: "Traditional Antique Gold Polish" },
      ],
      features: [
        "Hand-carved floral edge filigree",
        "Heavy stable base prevents tipping",
        "Coated with natural tarnish-resistant lacquer",
      ],
      benefits: [
        "Invokes traditional Vastu positive energy",
        "Timeless decorative centerpiece for living and dining areas",
        "Durable heirloom piece",
      ],
      isFeatured: true,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-HL-004",
      seoTitle: "Handcrafted Brass Urli Bowl — Bhaya India Home",
      seoDescription: "Pure brass hand-carved urli bowl for floating flowers. Buy authentic home decor at Bhaya India.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-005",
      name: "Chanderi Silk Cotton Dupatta",
      slug: "chanderi-silk-cotton-dupatta",
      category: "Textiles & Fabrics",
      categorySlug: "textiles-fabrics",
      subcategory: "Silk Dupattas",
      tagline: "Breezy elegance woven with grace",
      description:
        "Lightweight authentic Chanderi fabric combining raw silk warp with fine combed cotton weft. Embellished with delicate hand-block gold motifs (boota) and sheer pallu detailing.",
      images: ["/assets/category-textiles.jpg"],
      price: 1250,
      priceNote: "Per piece",
      specs: [
        { label: "Composition", value: "70% Cotton, 30% Silk" },
        { label: "Length", value: "2.5 metres" },
        { label: "Width", value: "36 inches" },
        { label: "Care", value: "Gentle Hand Wash or Dry Clean" },
      ],
      features: [
        "Authentic Madhya Pradesh Chanderi cluster weave",
        "Zari tissue borders",
        "Subtle shimmer in natural daylight",
      ],
      benefits: [
        "Comfortable for all-day festive wear in warm climates",
        "Pairs seamlessly with ethnic kurtas and fusion outfits",
      ],
      isFeatured: false,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 1,
      sku: "BI-TX-005",
      seoTitle: "Chanderi Silk Cotton Dupatta — Bhaya India",
      seoDescription: "Authentic handwoven Chanderi dupatta with gold boota motifs. Bhaya India textiles.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "prod-006",
      name: "Institutional Bulk Uniform Fabric",
      slug: "institutional-bulk-uniform-fabric",
      category: "Wholesale & Bulk",
      categorySlug: "wholesale-bulk",
      subcategory: "Institutional Textiles",
      tagline: "Industrial durability meets comfort",
      description:
        "High-density poly-viscose and combed cotton blended textiles tailored for institutional uniforms, corporate workforce attire, and hospitality garments. Available in roll bolts of 50m to 500m.",
      images: ["/assets/category-textiles.jpg"],
      price: null, // Get Quote
      priceNote: "Custom Quotation based on Meterage",
      specs: [
        { label: "Blend", value: "65% Poly, 35% Viscose" },
        { label: "GSM", value: "210 GSM" },
        { label: "Bolt Width", value: "58 inches (147 cm)" },
        { label: "Colour Fastness", value: "Grade 4.5 Certified" },
      ],
      features: [
        "Wrinkle-resistant and sweat-wicking breathability",
        "Tested for 100+ commercial wash cycles",
        "Custom Pantone dyeing available for 500m+ orders",
      ],
      benefits: [
        "Standardized color matching across repeated batch orders",
        "Direct mill pricing ensures optimal margin for institutions",
      ],
      isFeatured: false,
      isPublished: true,
      isNew: false,
      inStock: true,
      minOrder: 50,
      sku: "BI-WB-006",
      seoTitle: "Institutional Bulk Uniform Fabric — Bhaya India Wholesale",
      seoDescription: "Commercial and institutional uniform textiles in bulk rolls. Request quotation from Bhaya India.",
      createdAt: new Date().toISOString(),
    },
  ],
  enquiries: [
    {
      id: "enq-101",
      name: "Rajesh Sharma",
      mobile: "+91 98200 12345",
      email: "rajesh@sharmatraders.in",
      productName: "Royal Heritage Festival Hamper",
      productId: "prod-003",
      quantity: 50,
      message: "Looking for 50 corporate Diwali gift hampers with custom company logo embossing. Need delivery in Mumbai by next month.",
      status: "In Progress",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "enq-102",
      name: "Pooja Verma",
      mobile: "+91 97111 89012",
      email: "pooja.v@delhidesigns.org",
      productName: "Premium Banarasi Silk Saree",
      productId: "prod-001",
      quantity: 5,
      message: "Interested in sample swatches for bridal orders. Please confirm if red and emerald green colourways are available.",
      status: "New",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ],
  orders: [
    {
      id: "ORD-9012",
      customerName: "Ananya Gupta",
      email: "ananya.g@gmail.com",
      phone: "+91 98101 22334",
      address: "Flat 402, Lotus Heights, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      items: [
        {
          productId: "prod-002",
          name: "Leather-Bound Executive Notebook",
          price: 650,
          quantity: 2,
          image: "/assets/category-stationery.jpg",
        },
      ],
      totalAmount: 1300,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      orderStatus: "Processing",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  testimonials: [],
  faqs: [
    {
      id: "faq-1",
      question: "What is BHAYA INDIA?",
      questionHi: "BHAYA INDIA क्या है?",
      answer: "BHAYA INDIA is an Indian Business & E-commerce Platform connecting customers, local businesses, and manufacturers on a trusted digital platform.",
      answerHi: "BHAYA INDIA एक भारतीय Business & E-commerce Platform है, जिसका उद्देश्य ग्राहकों, स्थानीय व्यवसायों और manufacturers को एक भरोसेमंद digital platform से जोड़ना है।",
      category: "General",
      isPublished: true,
      sortOrder: 1,
    },
    {
      id: "faq-2",
      question: "How to purchase products?",
      questionHi: "Product कैसे खरीदें?",
      answer: "Browse our catalogue, select your desired quantity, and click 'Add to Bag' or 'Buy Now'. You can also enquire directly on WhatsApp for instant assistance.",
      answerHi: "हमारी वेबसाइट पर products browse करें, आवश्यक संख्या चुनें, और 'Add to Bag' या 'Buy Now' पर क्लिक करें। आप सीधे WhatsApp पर भी Enquiry कर सकते हैं।",
      category: "Product",
      isPublished: true,
      sortOrder: 2,
    },
    {
      id: "faq-3",
      question: "How to make a wholesale or bulk enquiry?",
      questionHi: "Wholesale enquiry कैसे करें?",
      answer: "Visit our dedicated Wholesale & B2B page and fill out the enquiry form with your product and quantity details, or connect with our team via WhatsApp.",
      answerHi: "हमारे Wholesale & B2B पेज पर जाकर enquiry form भरें या WhatsApp पर संपर्क करें। हमारी टीम आपकी आवश्यकतानुसार कोटेशन प्रदान करेगी।",
      category: "Service",
      isPublished: true,
      sortOrder: 3,
    },
    {
      id: "faq-4",
      question: "How to become a seller?",
      questionHi: "Seller कैसे बनें?",
      answer: "Shopkeepers and retailers can submit their interest on our 'Become a Seller' page for the upcoming BHAYA INDIA digital marketplace.",
      answerHi: "'Become a Seller' पेज पर जाकर अपना interest फॉर्म दर्ज करें। भविष्य के BHAYA INDIA Marketplace के लिए हमारी टीम आपसे संपर्क करेगी।",
      category: "General",
      isPublished: true,
      sortOrder: 4,
    },
    {
      id: "faq-5",
      question: "How can manufacturers partner with BHAYA INDIA?",
      questionHi: "Manufacturer कैसे जुड़ें?",
      answer: "Manufacturers can submit their product categories and factory details on our dedicated 'For Manufacturers' page to register interest for distribution.",
      answerHi: "'For Manufacturers' पेज पर जाकर अपने उत्पाद और उत्पादन क्षमता का विवरण दर्ज करें। हमारी मर्चेंट टीम आपसे संपर्क करेगी।",
      category: "General",
      isPublished: true,
      sortOrder: 5,
    },
    {
      id: "faq-6",
      question: "What payment methods are available?",
      questionHi: "Payment कैसे करें?",
      answer: "We support UPI, Debit & Credit Cards, Net Banking, and Order Confirmation with verification upon delivery.",
      answerHi: "हम UPI, डेबिट/क्रेडिट कार्ड, नेट बैंकिंग और डिलीवरी सत्यापन के साथ आर्डर स्वीकार करते हैं।",
      category: "Payment",
      isPublished: true,
      sortOrder: 6,
    },
    {
      id: "faq-7",
      question: "How to track an order?",
      questionHi: "Order कैसे track करें?",
      answer: "You can track your order status anytime in the 'My Account' section using your registered mobile number or Order ID.",
      answerHi: "'My Account' सेक्शन में जाकर अपने रजिस्टर्ड मोबाइल नंबर या Order ID के माध्यम से अपने आर्डर का status देख सकते हैं।",
      category: "Delivery",
      isPublished: true,
      sortOrder: 7,
    },
  ],
  gallery: [],
};

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading db.json, falling back to initialData:", err);
    return initialData;
  }
}

function writeDb(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}

// ------------------- PRODUCTS -------------------
export function getProducts(): Product[] {
  const db = ensureDb();
  return db.products || [];
}

export function getProductBySlug(slug: string): Product | undefined {
  const db = ensureDb();
  return db.products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const db = ensureDb();
  return db.products.find((p) => p.id === id);
}

export function createProduct(productData: Omit<Product, "id" | "createdAt">): Product {
  const db = ensureDb();
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  // Update category count
  const cat = db.categories.find((c) => c.slug === newProduct.categorySlug);
  if (cat) cat.productCount = (cat.productCount || 0) + 1;
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.products[index] = { ...db.products[index], ...updates };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = ensureDb();
  const product = db.products.find((p) => p.id === id);
  if (!product) return false;
  db.products = db.products.filter((p) => p.id !== id);
  const cat = db.categories.find((c) => c.slug === product.categorySlug);
  if (cat && cat.productCount > 0) cat.productCount -= 1;
  writeDb(db);
  return true;
}

// ------------------- CATEGORIES -------------------
export function getCategories(): Category[] {
  const db = ensureDb();
  return db.categories || [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = ensureDb();
  return db.categories.find((c) => c.slug === slug);
}

export function createCategory(catData: Omit<Category, "id" | "productCount">): Category {
  const db = ensureDb();
  const newCat: Category = {
    ...catData,
    id: `cat-${Date.now()}`,
    productCount: 0,
  };
  db.categories.push(newCat);
  writeDb(db);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const db = ensureDb();
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...updates };
  writeDb(db);
  return db.categories[index];
}

export function deleteCategory(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- ENQUIRIES -------------------
export function getEnquiries(): Enquiry[] {
  const db = ensureDb();
  return db.enquiries || [];
}

export function createEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
  const db = ensureDb();
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  writeDb(db);
  return newEnquiry;
}

export function updateEnquiryStatus(id: string, status: Enquiry["status"]): Enquiry | null {
  const db = ensureDb();
  const enq = db.enquiries.find((e) => e.id === id);
  if (!enq) return null;
  enq.status = status;
  writeDb(db);
  return enq;
}

// ------------------- ORDERS -------------------
export function getOrders(): Order[] {
  const db = ensureDb();
  return db.orders || [];
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt">): Order {
  const db = ensureDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${randomSuffix}`,
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(newOrder);
  writeDb(db);
  return newOrder;
}

export function updateOrderStatus(
  id: string,
  orderStatus?: Order["orderStatus"],
  paymentStatus?: Order["paymentStatus"]
): Order | null {
  const db = ensureDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  writeDb(db);
  return order;
}

// ------------------- TESTIMONIALS -------------------
export function getTestimonials(): Testimonial[] {
  const db = ensureDb();
  return db.testimonials || [];
}

export function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">): Testimonial {
  const db = ensureDb();
  const item: Testimonial = {
    ...data,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.testimonials.unshift(item);
  writeDb(db);
  return item;
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
  const db = ensureDb();
  const index = db.testimonials.findIndex((t) => t.id === id);
  if (index === -1) return null;
  db.testimonials[index] = { ...db.testimonials[index], ...updates };
  writeDb(db);
  return db.testimonials[index];
}

export function deleteTestimonial(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.testimonials.length;
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  if (db.testimonials.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- FAQS -------------------
export function getFaqs(): FAQ[] {
  const db = ensureDb();
  return db.faqs || [];
}

export function createFaq(data: Omit<FAQ, "id">): FAQ {
  const db = ensureDb();
  const item: FAQ = {
    ...data,
    id: `faq-${Date.now()}`,
  };
  db.faqs.push(item);
  writeDb(db);
  return item;
}

export function updateFaq(id: string, updates: Partial<FAQ>): FAQ | null {
  const db = ensureDb();
  const index = db.faqs.findIndex((f) => f.id === id);
  if (index === -1) return null;
  db.faqs[index] = { ...db.faqs[index], ...updates };
  writeDb(db);
  return db.faqs[index];
}

export function deleteFaq(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.faqs.length;
  db.faqs = db.faqs.filter((f) => f.id !== id);
  if (db.faqs.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- GALLERY -------------------
export function getGallery(): GalleryItem[] {
  const db = ensureDb();
  return db.gallery || [];
}

export function createGalleryItem(data: Omit<GalleryItem, "id" | "createdAt">): GalleryItem {
  const db = ensureDb();
  const item: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.gallery.unshift(item);
  writeDb(db);
  return item;
}

export function deleteGalleryItem(id: string): boolean {
  const db = ensureDb();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  if (db.gallery.length === initialLen) return false;
  writeDb(db);
  return true;
}

// ------------------- SETTINGS & CONTENT -------------------
export function getSiteSettings(): SiteSettings {
  const db = ensureDb();
  return db.settings || initialData.settings;
}

export function updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  const db = ensureDb();
  db.settings = { ...db.settings, ...settings };
  writeDb(db);
  return db.settings;
}

export function getPageContent(): PageContent {
  const db = ensureDb();
  return db.content || initialData.content;
}

export function updatePageContent(content: Partial<PageContent>): PageContent {
  const db = ensureDb();
  db.content = { ...db.content, ...content };
  writeDb(db);
  return db.content;
}

// ------------------- USERS / CUSTOMER ACCOUNTS -------------------
export function getUsers(): CustomerUser[] {
  const db = ensureDb();
  return db.users || [];
}

export function getUserById(id: string): CustomerUser | undefined {
  const db = ensureDb();
  return (db.users || []).find((u) => u.id === id);
}

export function getUserByPhoneOrEmail(identifier: string): CustomerUser | undefined {
  const db = ensureDb();
  const clean = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/[^0-9]/g, "");
  return (db.users || []).find(
    (u) =>
      (cleanPhone && u.phone.replace(/[^0-9]/g, "").includes(cleanPhone)) ||
      u.email.toLowerCase() === clean
  );
}

export function saveUser(userData: Omit<CustomerUser, "id" | "createdAt"> & { id?: string }): CustomerUser {
  const db = ensureDb();
  if (!db.users) db.users = [];

  if (userData.id) {
    const index = db.users.findIndex((u) => u.id === userData.id);
    if (index !== -1) {
      db.users[index] = {
        ...db.users[index],
        ...userData,
      };
      writeDb(db);
      return db.users[index];
    }
  }

  // Create new user
  const newUser: CustomerUser = {
    ...userData,
    id: userData.id || `usr-${Date.now()}`,
    addresses: userData.addresses || [],
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function addUserAddress(userId: string, addressData: Omit<CustomerAddress, "id">): CustomerUser | null {
  const db = ensureDb();
  if (!db.users) db.users = [];
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;

  const newAddress: CustomerAddress = {
    ...addressData,
    id: `addr-${Date.now()}`,
  };

  if (!user.addresses) user.addresses = [];
  if (newAddress.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(newAddress);
  writeDb(db);
  return user;
}

export function deleteUserAddress(userId: string, addressId: string): CustomerUser | null {
  const db = ensureDb();
  if (!db.users) db.users = [];
  const user = db.users.find((u) => u.id === userId);
  if (!user || !user.addresses) return null;

  user.addresses = user.addresses.filter((a) => a.id !== addressId);
  writeDb(db);
  return user;
}

