// Pure, client-safe utilities for Shopify & catalogue localization and asset handling

export interface LocalizedProductInput {
  name: string;
  nameHi?: string;
  description?: string;
  descriptionHi?: string;
  tagline?: string;
  taglineHi?: string;
  category?: string;
  categoryHi?: string;
  categorySlug?: string;
  subcategory?: string;
  subcategoryHi?: string;
  images?: string[];
  image_en?: string;
  image_hi?: string;
  features?: string[];
  featuresHi?: string[];
  benefits?: string[];
  benefitsHi?: string[];
  specs?: Array<{ label: string; value: string }>;
  specsHi?: Array<{ label: string; value: string }>;
}

export interface LocalizedCategoryInput {
  id?: string;
  name: string;
  nameHi?: string;
  slug: string;
  description: string;
  descriptionHi?: string;
  subcategories?: string[];
  subcategoriesHi?: string[];
}

export const CATEGORY_MAP_HI: Record<string, string> = {
  "textiles-fabrics": "वस्त्र एवं परिधान",
  "Textiles & Fabrics": "वस्त्र एवं परिधान",
  "stationery-office": "स्टेशनरी एवं कार्यालय सामग्री",
  "Stationery & Office": "स्टेशनरी एवं कार्यालय सामग्री",
  "gift-hampers": "उपहार हैम्पर्स",
  "Gift Hampers": "उपहार हैम्पर्स",
  "home-living": "घर एवं जीवनशैली",
  "Home & Living": "घर एवं जीवनशैली",
  "home-lifestyle": "घर एवं जीवनशैली",
  "Home & Lifestyle": "घर एवं जीवनशैली",
  "wholesale-bulk": "थोक एवं बड़ी मात्रा में आपूर्ति",
  "Wholesale & Bulk": "थोक एवं बड़ी मात्रा में आपूर्ति",
  "electronics-accessories": "इलेक्ट्रॉनिक्स एवं सहायक उपकरण",
  "Electronics & Accessories": "इलेक्ट्रॉनिक्स एवं सहायक उपकरण",
  "festival": "त्योहार",
  "Festival": "त्योहार",
  "retail": "खुदरा",
  "Retail": "खुदरा",
  "agro": "कृषि",
  "Agro": "कृषि",
  "manufacturing": "विनिर्माण",
  "Manufacturing": "विनिर्माण",
  "logistics": "लॉजिस्टिक्स",
  "Logistics": "लॉजिस्टिक्स",
  "exports": "निर्यात",
  "Exports": "निर्यात",
  "ecommerce": "ई-कॉमर्स",
  "E-commerce": "ई-कॉमर्स",
  "all": "सम्पूर्ण संग्रह",
  "All": "सम्पूर्ण संग्रह",
};

export const CATEGORY_DESC_MAP_HI: Record<string, string> = {
  "textiles-fabrics": "हस्तनिर्मित साड़ियाँ, शुद्ध रेशम, विरासती शॉल और प्रीमियम परिधान।",
  "Textiles & Fabrics": "हस्तनिर्मित साड़ियाँ, शुद्ध रेशम, विरासती शॉल और प्रीमियम परिधान।",
  "stationery-office": "उत्कृष्ट लेदर जर्नल्स, एग्जीक्यूटिव डेस्क एक्सेसरीज़ और कॉर्पोरेट स्टेशनरी सामग्री।",
  "Stationery & Office": "उत्कृष्ट लेदर जर्नल्स, एग्जीक्यूटिव डेस्क एक्सेसरीज़ और कॉर्पोरेट स्टेशनरी सामग्री।",
  "gift-hampers": "त्योहारों, शादियों और कॉर्पोरेट आयोजनों के लिए विशेष रूप से तैयार किए गए उपहार।",
  "Gift Hampers": "त्योहारों, शादियों और कॉर्पोरेट आयोजनों के लिए विशेष रूप से तैयार किए गए उपहार।",
  "home-living": "पारंपरिक पीतल के बर्तन, दस्तकारी सजावट और सुरुचिपूर्ण होम डेकोर।",
  "Home & Living": "पारंपरिक पीतल के बर्तन, दस्तकारी सजावट और सुरुचिपूर्ण होम डेकोर।",
  "home-lifestyle": "पारंपरिक पीतल के बर्तन, दस्तकारी सजावट और सुरुचिपूर्ण होम डेकोर।",
  "Home & Lifestyle": "पारंपरिक पीतल के बर्तन, दस्तकारी सजावट और सुरुचिपूर्ण होम डेकोर।",
  "wholesale-bulk": "संस्थागत आपूर्ति, वाणिज्यिक वस्त्र, कॉर्पोरेट स्टेशनरी और थोक पैकेजिंग।",
  "Wholesale & Bulk": "संस्थागत आपूर्ति, वाणिज्यिक वस्त्र, कॉर्पोरेट स्टेशनरी और थोक पैकेजिंग।",
};

export const SUBCATEGORY_MAP_HI: Record<string, string> = {
  "Corporate Gifts": "कॉर्पोरेट उपहार",
  "corporate-gifts": "कॉर्पोरेट उपहार",
  "Festival Hampers": "त्योहार उपहार",
  "festival-hampers": "त्योहार उपहार",
  "Wedding Favours": "विवाह उपहार",
  "wedding-favours": "विवाह उपहार",
  "Custom Hampers": "कस्टम उपहार",
  "custom-hampers": "कस्टम उपहार",
  "Sarees": "साड़ियाँ",
  "sarees": "साड़ियाँ",
  "Silk Dupattas": "सिल्क दुपट्टे",
  "silk-dupattas": "सिल्क दुपट्टे",
  "Handloom Shawls": "हथकरघा शॉल",
  "handloom-shawls": "हथकरघा शॉल",
  "Unstitched Suits": "अनस्टिच्ड सूट",
  "unstitched-suits": "अनस्टिच्ड सूट",
  "Notebooks": "नोटबुक्स",
  "notebooks": "नोटबुक्स",
  "Executive Pens": "एग्जीक्यूटिव पेन",
  "executive-pens": "एग्जीक्यूटिव पेन",
  "Desk Organizers": "डेस्क आयोजक",
  "desk-organizers": "डेस्क आयोजक",
  "Paper Sets": "पेपर सेट्स",
  "paper-sets": "पेपर सेट्स",
  "Brass Decor": "पीतल सजावट",
  "brass-decor": "पीतल सजावट",
  "Décor": "पीतल सजावट",
  "decor": "पीतल सजावट",
  "Bedding": "बिस्तर एवं चादरें",
  "bedding": "बिस्तर एवं चादरें",
  "Tableware": "टेबलवेयर",
  "tableware": "टेबलवेयर",
  "Artisanal Accents": "शिल्प कलाकृतियाँ",
  "artisanal-accents": "शिल्प कलाकृतियाँ",
  "Institutional Textiles": "संस्थागत वस्त्र",
  "institutional-textiles": "संस्थागत वस्त्र",
  "Bulk Stationery": "थोक स्टेशनरी",
  "bulk-stationery": "थोक स्टेशनरी",
  "Custom Merchandise": "कस्टम मर्चेंडाइज",
  "custom-merchandise": "कस्टम मर्चेंडाइज",
  "Bulk Orders": "थोक ऑर्डर",
  "bulk-orders": "थोक ऑर्डर",
  "Audio": "ऑडियो",
  "audio": "ऑडियो",
};

export const SPEC_LABEL_MAP_HI: Record<string, string> = {
  "Material": "सामग्री",
  "Length": "लंबाई",
  "Blouse Piece": "ब्लाउज पीस",
  "Weave Technique": "बुनाई तकनीक",
  "Care Instructions": "देखभाल निर्देश",
  "Care": "देखभाल",
  "Cover Material": "कवर सामग्री",
  "Cover": "कवर",
  "Paper": "कागज",
  "Page Count": "पृष्ठ संख्या",
  "Pages": "पृष्ठ संख्या",
  "Dimensions": "आकार",
  "Size": "आकार",
  "Contents": "सामग्री",
  "Packaging": "पैकेजिंग",
  "Branding": "ब्रांडिंग",
  "Delivery": "वितरण",
  "Battery": "बैटरी",
  "Connectivity": "कनेक्टिविटी",
  "Noise Cancellation": "नॉइज़ कैंसलेशन",
  "Warranty": "वारंटी",
  "Finish": "फिनिश",
  "Set Contains": "सेट सामग्री",
  "Pack Size": "पैक साइज",
  "GSM": "जीएसएम",
  "Min Order": "न्यूनतम ऑर्डर",
};

// Helper to resolve the correct product image based on active locale
export function getLanguageAwareProductImage(
  product: {
    images?: string[];
    image_en?: string;
    image_hi?: string;
  },
  language: string
): string {
  if (language === "hi" && product.image_hi) {
    return product.image_hi;
  }
  if (language === "en" && product.image_en) {
    return product.image_en;
  }
  return product.images?.[0] || "/assets/category-textiles.jpg";
}

// Localized product name
export function getLocalizedProductName(
  product: LocalizedProductInput,
  language: string
): string {
  if (language === "hi" && product.nameHi && product.nameHi.trim().length > 0) {
    return product.nameHi;
  }
  return product.name;
}

// Localized product description
export function getLocalizedProductDescription(
  product: LocalizedProductInput,
  language: string
): string {
  if (language === "hi" && product.descriptionHi && product.descriptionHi.trim().length > 0) {
    return product.descriptionHi;
  }
  return product.description || "";
}

// Localized product tagline
export function getLocalizedProductTagline(
  product: LocalizedProductInput,
  language: string
): string {
  if (language === "hi" && product.taglineHi && product.taglineHi.trim().length > 0) {
    return product.taglineHi;
  }
  return product.tagline || "";
}

// Localized product category
export function getLocalizedProductCategory(
  product: LocalizedProductInput,
  language: string
): string {
  if (language === "hi") {
    if (product.categoryHi && product.categoryHi.trim().length > 0) {
      return product.categoryHi;
    }
    if (product.categorySlug && CATEGORY_MAP_HI[product.categorySlug]) {
      return CATEGORY_MAP_HI[product.categorySlug];
    }
    if (product.category && CATEGORY_MAP_HI[product.category]) {
      return CATEGORY_MAP_HI[product.category];
    }
  }
  return product.category || "General Catalogue";
}

// Localized product subcategory
export function getLocalizedProductSubcategory(
  productOrSubcategory: LocalizedProductInput | string | undefined,
  language: string
): string {
  if (!productOrSubcategory) return "";
  let subcategory = "";
  if (typeof productOrSubcategory === "string") {
    subcategory = productOrSubcategory;
  } else {
    if (
      language === "hi" &&
      productOrSubcategory.subcategoryHi &&
      productOrSubcategory.subcategoryHi.trim().length > 0
    ) {
      return productOrSubcategory.subcategoryHi;
    }
    subcategory = productOrSubcategory.subcategory || "";
  }
  if (!subcategory) return "";
  if (language === "hi") {
    if (SUBCATEGORY_MAP_HI[subcategory]) {
      return SUBCATEGORY_MAP_HI[subcategory];
    }
    const lower = subcategory.toLowerCase();
    if (SUBCATEGORY_MAP_HI[lower]) {
      return SUBCATEGORY_MAP_HI[lower];
    }
  }
  return subcategory;
}

// Localized category/collection name
export function getLocalizedCategoryName(
  category: LocalizedCategoryInput | undefined | null,
  language: string
): string {
  if (!category) return "";
  if (language === "hi") {
    if (category.nameHi && category.nameHi.trim().length > 0) {
      return category.nameHi;
    }
    if (category.slug && CATEGORY_MAP_HI[category.slug]) {
      return CATEGORY_MAP_HI[category.slug];
    }
    if (category.name && CATEGORY_MAP_HI[category.name]) {
      return CATEGORY_MAP_HI[category.name];
    }
  }
  return category.name;
}

// Localized category/collection description
export function getLocalizedCategoryDesc(
  category: LocalizedCategoryInput | undefined | null,
  language: string
): string {
  if (!category) return "";
  if (language === "hi") {
    if (category.descriptionHi && category.descriptionHi.trim().length > 0) {
      return category.descriptionHi;
    }
    if (category.slug && CATEGORY_DESC_MAP_HI[category.slug]) {
      return CATEGORY_DESC_MAP_HI[category.slug];
    }
    if (category.name && CATEGORY_DESC_MAP_HI[category.name]) {
      return CATEGORY_DESC_MAP_HI[category.name];
    }
  }
  return category.description;
}

// Localized subcategory name helper
export function getLocalizedSubcategoryName(
  subcat: string,
  language: string
): string {
  return getLocalizedProductSubcategory(subcat, language);
}

// Localized product features
export function getLocalizedFeatures(
  product: LocalizedProductInput,
  language: string
): string[] {
  if (language === "hi" && product.featuresHi && product.featuresHi.length > 0) {
    return product.featuresHi;
  }
  return product.features || [];
}

// Localized product benefits
export function getLocalizedBenefits(
  product: LocalizedProductInput,
  language: string
): string[] {
  if (language === "hi" && product.benefitsHi && product.benefitsHi.length > 0) {
    return product.benefitsHi;
  }
  return product.benefits || [];
}

// Localized specifications
export function getLocalizedSpecs(
  product: LocalizedProductInput,
  language: string
): Array<{ label: string; value: string }> {
  if (language === "hi") {
    if (product.specsHi && product.specsHi.length > 0) {
      return product.specsHi;
    }
    if (product.specs && product.specs.length > 0) {
      return product.specs.map((spec) => ({
        label: SPEC_LABEL_MAP_HI[spec.label] || spec.label,
        value: spec.value,
      }));
    }
  }
  return product.specs || [];
}
