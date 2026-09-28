// BHAYA INDIA — Client-Mandated Categories Data

export interface Category {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  tagline: string;
  taglineHi?: string;
  description: string;
  descriptionHi?: string;
  image: string;
  productCount: number;
  subcategories: string[];
  subcategoriesHi?: string[];
}

export const categories: Category[] = [
  {
    id: "cat-puja",
    name: "Puja Samagri",
    nameHi: "पूजा सामग्री",
    slug: "puja-samagri",
    tagline: "Sacred & Pure",
    taglineHi: "पवित्र एवं शुद्ध",
    description: "Pure and authentic puja samagri, brassware, diya lamps, camphor, dhoop, and sacred ritual offerings sourced directly from traditional centers.",
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
    tagline: "Celebrate with Grandeur",
    taglineHi: "उत्सव की भव्यता",
    description: "Traditional festival decor, decorative torans, bandhanwars, handcrafted festive hangings, lights, and celebration ensembles.",
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
    tagline: "Timeless Auspicious Traditions",
    taglineHi: "शुभ वैवाहिक परंपराएं",
    description: "Essential marriage ritual items, bridal accessories, ornate wedding trunks, gift presentation boxes, and auspicious ceremony accessories.",
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
    tagline: "Honoring Master Artisans",
    taglineHi: "माटी और हुनर का सम्मान",
    description: "Authentic Indian handicrafts, brass artifacts, hand-carved woodwork, terracotta creations, and regional folk art from master craftspeople.",
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
    tagline: "Elegance for Every Corner",
    taglineHi: "घर के हर कोने में लालित्य",
    description: "Artisan homeware, wall decor, brass urns, decorative figurines, and aesthetic interior accents blending heritage with modern grace.",
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
    tagline: "Meaningful Celebrations",
    taglineHi: "सार्थक उपहार एवं सम्मान",
    description: "Curated gift items, festive gift hampers, corporate token boxes, return gifts, and customized bespoke presentation packages.",
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
    tagline: "Quality for Daily Living",
    taglineHi: "दैनिक जीवन के लिए गुणवत्ता",
    description: "Everyday household essentials, kitchenware, copper bottles, storage organizers, fine towels, and utility products for the Indian family.",
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
    tagline: "Diverse Regional Offerings",
    taglineHi: "विविध क्षेत्रीय उत्पाद",
    description: "Textiles, fabrics, fine stationery, Agro produce, packaging materials, and general merchandise across our 7 business verticals.",
    descriptionHi: "वस्त्र, स्टेशनरी, कृषि उत्पाद, पैकेजिंग सामग्री और हमारे 7 व्यावसायिक क्षेत्रों के विविध उत्पाद।",
    image: "/assets/category-stationery.jpg",
    productCount: 88,
    subcategories: ["Textiles & Fabrics", "Stationery & Office", "Agro Produce", "Commercial Packaging"],
    subcategoriesHi: ["वस्त्र एवं परिधान", "स्टेशनरी व कार्यालय", "कृषि उपज", "व्यावसायिक पैकेजिंग"],
  },
];

// Slugs mapping for backward compatibility with previous category URLs
const COMPATIBILITY_MAP: Record<string, string> = {
  "textiles-fabrics": "other-categories",
  "stationery-office": "other-categories",
  "gift-hampers": "gift-items",
  "home-living": "home-decoration",
  "wholesale-bulk": "other-categories",
  "electronics-accessories": "household-products",
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const direct = categories.find((c) => c.slug === slug);
  if (direct) return direct;
  const mapped = COMPATIBILITY_MAP[slug];
  if (mapped) return categories.find((c) => c.slug === mapped);
  return undefined;
};
