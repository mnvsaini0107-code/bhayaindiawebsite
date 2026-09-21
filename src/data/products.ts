// BHAYA INDIA — Products Data

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
  priceNote?: string;
  specs: ProductSpec[];
  specsHi?: ProductSpec[];
  features: string[];
  featuresHi?: string[];
  isFeatured: boolean;
  isNew?: boolean;
  inStock: boolean;
  minOrder?: number;
  sku: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    name: "Premium Banarasi Silk Saree",
    nameHi: "प्रीमियम बनारसी सिल्क साड़ी",
    slug: "premium-banarasi-silk-saree",
    category: "Textiles & Fabrics",
    categoryHi: "वस्त्र एवं परिधान",
    categorySlug: "textiles-fabrics",
    subcategory: "Sarees",
    subcategoryHi: "साड़ियाँ",
    tagline: "Heritage weave, contemporary grace",
    taglineHi: "विरासती बुनाई, समकालीन लालित्य",
    description: "Handwoven Banarasi silk saree with traditional zari work border. A timeless piece that blends heritage craftsmanship with refined contemporary taste. Suitable for weddings, festivals and formal occasions.",
    descriptionHi: "हथकरघे पर निर्मित प्रामाणिक बनारसी सिल्क साड़ी, पारंपरिक जरी बॉर्डर और समृद्ध पल्लू के साथ। विवाह एवं शुभ अवसरों के लिए सर्वोत्कृष्ट भारतीय शिल्प।",
    images: ["/assets/category-textiles.jpg"],
    image_en: "/assets/category-textiles.jpg",
    image_hi: "/assets/hero-editorial.jpg",
    price: 3800,
    priceNote: "Per piece",
    specs: [
      { label: "Material", value: "Pure Silk" },
      { label: "Length", value: "6.5 metres" },
      { label: "Blouse Piece", value: "Included" },
      { label: "Care", value: "Dry Clean Only" },
    ],
    specsHi: [
      { label: "सामग्री", value: "शुद्ध सिल्क" },
      { label: "लंबाई", value: "6.5 मीटर" },
      { label: "ब्लाउज पीस", value: "शामिल" },
      { label: "देखभाल", value: "केवल ड्राई क्लीन" },
    ],
    features: [
      "Handwoven Banarasi technique",
      "Traditional zari border",
      "Rich pallu design",
      "Blouse piece included",
    ],
    featuresHi: [
      "हथकरघा बनारसी बुनाई तकनीक",
      "पारंपरिक जरी बॉर्डर",
      "समृद्ध पल्लू डिजाइन",
      "ब्लाउज पीस शामिल",
    ],
    isFeatured: true,
    isNew: false,
    inStock: true,
    sku: "BI-TX-001",
  },
  {
    id: "prod-002",
    name: "Leather-Bound Premium Notebook",
    nameHi: "प्रीमियम लेदर-बाउंड नोटबुक",
    slug: "leather-bound-premium-notebook",
    category: "Stationery & Office",
    categoryHi: "स्टेशनरी एवं कार्यालय सामग्री",
    categorySlug: "stationery-office",
    subcategory: "Notebooks",
    subcategoryHi: "नोटबुक्स",
    tagline: "Write your story with intention",
    taglineHi: "अपने विचारों को दें एक गरिमापूर्ण रूप",
    description: "Crafted with a genuine leather cover and acid-free ivory pages, this premium notebook is designed for professionals and creatives who value quality in every detail.",
    descriptionHi: "हस्तनिर्मित लेदर कवर और 90 जीएसएम एसिड-फ्री आइवरी पेपर्स के साथ निर्मित प्रीमियम नोटबुक। विचारकों और प्रोफेशनल्स के लिए उत्कृष्ट साथी।",
    images: ["/assets/category-stationery.jpg"],
    price: 650,
    priceNote: "Per piece",
    specs: [
      { label: "Cover", value: "Genuine Leather" },
      { label: "Pages", value: "200 ruled pages" },
      { label: "Size", value: "A5 (148 × 210mm)" },
      { label: "Paper", value: "90 GSM Acid-Free" },
    ],
    specsHi: [
      { label: "कवर", value: "प्रामाणिक लेदर" },
      { label: "पृष्ठ", value: "200 रूल्ड पृष्ठ" },
      { label: "आकार", value: "A5 (148 × 210 मिमी)" },
      { label: "कागज", value: "90 जीएसएम एसिड-फ्री" },
    ],
    features: [
      "Genuine leather cover",
      "Lay-flat binding",
      "Ribbon bookmark",
      "Custom embossing available",
    ],
    featuresHi: [
      "असली लेदर कवर",
      "फ्लैट खुलने वाली बाइंडिंग",
      "सैटिन रिबन बुकमार्क",
      "कस्टम लोगो एम्बॉसिंग उपलब्ध",
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: "BI-ST-002",
  },
  {
    id: "prod-003",
    name: "Corporate Festival Hamper",
    nameHi: "रॉयल कॉर्पोरेट त्योहार उपहार",
    slug: "corporate-festival-hamper",
    category: "Gift Hampers",
    categoryHi: "उपहार हैम्पर्स",
    categorySlug: "gift-hampers",
    subcategory: "Corporate Gifts",
    subcategoryHi: "कॉर्पोरेट उपहार",
    tagline: "Thoughtful gifting made effortless",
    taglineHi: "विचारशील उपहार, अत्यंत सहजता के साथ",
    description: "A premium curated hamper for corporate gifting — includes artisanal sweets, quality stationery, and artisan homeware. Customisable branding available for orders of 25+.",
    descriptionHi: "कॉर्पोरेट एवं त्योहारों के लिए विशेष रूप से तैयार किया गया प्रीमियम हैंपर — जिसमें पारंपरिक मिष्ठान, उत्कृष्ट स्टेशनरी और हस्तनिर्मित वस्तुएं शामिल हैं।",
    images: ["/assets/hero-editorial.jpg"],
    price: null,
    priceNote: "Get Quote",
    specs: [
      { label: "Contents", value: "5–8 curated items" },
      { label: "Packaging", value: "Premium gift box" },
      { label: "Branding", value: "Custom available (25+ pcs)" },
      { label: "Delivery", value: "Pan-India" },
    ],
    specsHi: [
      { label: "सामग्री", value: "5–8 चयनित वस्तुएं" },
      { label: "पैकेजिंग", value: "प्रीमियम गिफ्ट बॉक्स" },
      { label: "ब्रांडिंग", value: "कस्टम उपलब्ध (25+ पीस)" },
      { label: "वितरण", value: "अखिल भारतीय डिलीवरी" },
    ],
    features: [
      "Curated premium contents",
      "Custom brand printing",
      "Premium gift packaging",
      "Bulk pricing available",
    ],
    featuresHi: [
      "विशिष्ट चयनित वस्तुएं",
      "कस्टम ब्रांड लोगो प्रिंटिंग",
      "प्रीमियम उपहार पैकेजिंग",
      "थोक मूल्य उपलब्ध",
    ],
    isFeatured: true,
    inStock: true,
    minOrder: 1,
    sku: "BI-GH-003",
  },
  {
    id: "prod-004",
    name: "Premium Wireless Earphones",
    nameHi: "प्रीमियम वायरलेस ईयरफ़ोन",
    slug: "premium-wireless-earphones",
    category: "Electronics & Accessories",
    categoryHi: "इलेक्ट्रॉनिक्स एवं सहायक उपकरण",
    categorySlug: "electronics-accessories",
    subcategory: "Audio",
    subcategoryHi: "ऑडियो",
    tagline: "Immersive sound, all day comfort",
    taglineHi: "शानदार ध्वनि, दिनभर का आरामदायक अनुभव",
    description: "Quality wireless earphones with active noise cancellation, 30-hour battery life and premium sound drivers. Ideal for professionals and everyday use.",
    descriptionHi: "एक्टिव नॉइज़ कैंसलेशन, 30 घंटे की बैटरी बैकअप और प्रीमियम साउंड ड्राइवर्स के साथ उच्च गुणवत्ता वाले वायरलेस ईयरफ़ोन।",
    images: ["/assets/category-stationery.jpg"],
    price: 2200,
    priceNote: "Per piece",
    specs: [
      { label: "Battery", value: "30 hours" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Noise Cancellation", value: "Active (ANC)" },
      { label: "Warranty", value: "1 Year" },
    ],
    specsHi: [
      { label: "बैटरी", value: "30 घंटे" },
      { label: "कनेक्टिविटी", value: "ब्लूटूथ 5.3" },
      { label: "नॉइज़ कैंसलेशन", value: "एक्टिव (ANC)" },
      { label: "वारंटी", value: "1 वर्ष" },
    ],
    features: [
      "Active noise cancellation",
      "30-hour battery life",
      "Quick charge 15 min",
      "Foldable design",
    ],
    featuresHi: [
      "एक्टिव नॉइज़ कैंसलेशन",
      "30 घंटे बैटरी लाइफ",
      "15 मिनट क्विक चार्ज",
      "फोल्डेबल व हल्का डिज़ाइन",
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: "BI-EL-004",
  },
  {
    id: "prod-005",
    name: "Handcrafted Brass Diya Set",
    nameHi: "हस्तनिर्मित पीतल दीया सेट",
    slug: "handcrafted-brass-diya-set",
    category: "Home & Lifestyle",
    categoryHi: "घर एवं जीवनशैली",
    categorySlug: "home-lifestyle",
    subcategory: "Décor",
    subcategoryHi: "पीतल सजावट",
    tagline: "Light your home with tradition",
    taglineHi: "परंपरा और प्रकाश से सजाएं अपना घर",
    description: "Set of four handcrafted brass diyas with intricate traditional patterns. Each piece is individually finished by skilled artisans, making every set uniquely beautiful.",
    descriptionHi: "चार हस्तनिर्मित शुद्ध पीतल के दीयों का सेट। कुशल कारीगरों द्वारा गढ़े गए पारंपरिक आकृतियाँ जो पूजा और त्योहारों को पावन बनाती हैं।",
    images: ["/assets/category-textiles.jpg"],
    price: 880,
    priceNote: "Set of 4",
    specs: [
      { label: "Material", value: "Pure Brass" },
      { label: "Finish", value: "Antique Polish" },
      { label: "Size", value: "3–5 inches (assorted)" },
      { label: "Set Contains", value: "4 pieces" },
    ],
    specsHi: [
      { label: "सामग्री", value: "शुद्ध पीतल" },
      { label: "फिनिश", value: "एंटीक पॉलिश" },
      { label: "आकार", value: "3–5 इंच" },
      { label: "सेट में", value: "4 पीस" },
    ],
    features: [
      "Handcrafted by artisans",
      "Traditional motifs",
      "Antique brass finish",
      "Gift box packaging",
    ],
    featuresHi: [
      "कारीगरों द्वारा हस्तनिर्मित",
      "पारंपरिक भारतीय रूपांकन",
      "एंटीक ब्रास फिनिश",
      "गिफ्ट बॉक्स पैकेजिंग",
    ],
    isFeatured: true,
    inStock: true,
    sku: "BI-HL-005",
  },
  {
    id: "prod-006",
    name: "Bulk Cotton Dress Material Pack",
    nameHi: "थोक कॉटन ड्रेस मटेरियल पैक",
    slug: "bulk-cotton-dress-material-pack",
    category: "Wholesale & Bulk",
    categoryHi: "थोक एवं बड़ी मात्रा में आपूर्ति",
    categorySlug: "wholesale-bulk",
    subcategory: "Bulk Orders",
    subcategoryHi: "थोक ऑर्डर",
    tagline: "Quality at scale",
    taglineHi: "बड़े पैमाने पर उच्च गुणवत्ता",
    description: "Wholesale pack of premium cotton dress materials in assorted prints. Ideal for retailers, boutiques and institutions. Custom colour and print selection available on bulk orders.",
    descriptionHi: "प्रीमियम कॉटन ड्रेस मटेरियल का थोक पैक। खुदरा विक्रेताओं, बुटीक और संस्थानों के लिए सर्वोत्तम। थोक ऑर्डर पर कस्टम प्रिंट व रंग उपलब्ध।",
    images: ["/assets/category-textiles.jpg"],
    price: null,
    priceNote: "Get Quote",
    specs: [
      { label: "Pack Size", value: "50 pieces" },
      { label: "Material", value: "100% Cotton" },
      { label: "GSM", value: "120 GSM" },
      { label: "Min Order", value: "50 pcs" },
    ],
    specsHi: [
      { label: "पैक साइज", value: "50 पीस" },
      { label: "सामग्री", value: "100% शुद्ध कॉटन" },
      { label: "जीएसएम", value: "120 GSM" },
      { label: "न्यूनतम ऑर्डर", value: "50 पीस" },
    ],
    features: [
      "Wholesale pricing",
      "Assorted prints available",
      "Custom colour selection",
      "Pan-India delivery",
    ],
    featuresHi: [
      "थोक प्रतिस्पर्धी मूल्य",
      "विविध प्रिंट उपलब्ध",
      "कस्टम रंग चयन",
      "अखिल भारतीय डिलीवरी",
    ],
    isFeatured: true,
    inStock: true,
    minOrder: 50,
    sku: "BI-WB-006",
  },
];

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.isFeatured);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getProductsByCategory = (categorySlug: string): Product[] =>
  products.filter((p) => p.categorySlug === categorySlug);
