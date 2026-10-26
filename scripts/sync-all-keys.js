const fs = require('fs');

const en = JSON.parse(fs.readFileSync('shopify-theme/locales/en.default.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('shopify-theme/locales/hi.json', 'utf8'));

function setVal(obj, pathStr, val) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!cur[p] || typeof cur[p] !== 'object') {
      cur[p] = {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = val;
}

const enTranslations = {
  "sections.bhaya_2.eyebrow": "FUTURE PLATFORM VISION • COMING SOON",
  "sections.bhaya_2.title": "BHAYA INDIA 2.0",
  "sections.bhaya_2.subtitle": "One Platform — Thousands of Shops — One Trust",
  "sections.bhaya_2.desc": "Building India's most dependable digital ecosystem for regional retailers, manufacturers, and trade buyers.",
  "sections.bhaya_2.cta": "Explore Platform Vision",
  "sections.bhaya_2.pillar_1_title": "Shopkeeper & Retailer Network",
  "sections.bhaya_2.pillar_1_desc": "Enabling verified local shopkeepers and retail merchants to join the BHAYA INDIA digital ecosystem.",
  "sections.bhaya_2.pillar_2_title": "Direct Manufacturer Partnerships",
  "sections.bhaya_2.pillar_2_desc": "Connecting regional manufacturers directly with customers and institutional buyers across India.",
  "sections.bhaya_2.pillar_3_title": "Wholesale & B2B Supply Hub",
  "sections.bhaya_2.pillar_3_desc": "Facilitating transparent product sourcing, bulk allocation, and customized corporate enquiries.",
  "sections.bhaya_2.pillar_4_title": "Integrated Logistics & Marketplace",
  "sections.bhaya_2.pillar_4_desc": "Building end-to-end fulfillment, digital storefronts, and multi-seller tools under one trusted umbrella.",

  "sections.story.eyebrow": "OUR STORY",
  "sections.story.title": "From a Trusted Merchant Counter to a Pan-India Digital Platform",
  "sections.story.para_1": "BHAYA INDIA was founded on an enduring commitment to truthful Indian trade. What began as a dedicated regional merchant counter in Uttar Pradesh has grown into a modern nationwide commerce network uniting verified manufacturers, local shops, and consumers.",
  "sections.story.quote_author": "THE FOUNDING ETHOS OF BHAYA INDIA",
  "sections.story.para_2": "Rooted in authentic sourcing, fair pricing, and dependable execution, we empower indigenous enterprise and bring India's diverse products to customers with absolute transparency.",
  "sections.story.read_more": "Read Our Full Heritage Journey",

  "sections.featured.empty_title": "Product Catalogue Being Curated",
  "sections.featured.empty_desc": "Under our strict quality verification protocol, every indigenous product and batch is authenticated before public release. Contact our merchant desk for custom requirements or immediate orders.",
  "sections.featured.empty_b2b_btn": "Inquire Wholesale Tiers",
  "sections.featured.empty_desk_btn": "Artisan Concierge Desk",

  "sections.footer.brand_about": "A Trusted Indian Business & E-commerce Platform dedicated to indigenous crafts, heritage textiles, festive decor, and reliable pan-India enterprise supply.",
  "sections.footer.directions_title": "Business Directions",
  "sections.footer.dir_1": "1. Festival",
  "sections.footer.dir_2": "2. Retail",
  "sections.footer.dir_3": "3. Agro",
  "sections.footer.dir_4": "4. Manufacturing",
  "sections.footer.dir_5": "5. Logistics",
  "sections.footer.dir_6": "6. Exports",
  "sections.footer.dir_7": "7. E-commerce",
  "sections.footer.dir_8": "8. Packaging & Paper Products",
  "sections.footer.nav_heading_company": "Company & Vision",
  "sections.footer.nav_about": "About Us",
  "sections.footer.nav_vision": "Company Vision",
  "sections.footer.nav_why": "Why Bhaya India",
  "sections.footer.nav_wholesale": "B2B & Wholesale",
  "sections.footer.nav_seller": "Sell on Bhaya India",
  "sections.footer.nav_manufacturers": "Become a Partner",
  "sections.footer.nav_reviews": "Customer Reviews",
  "sections.footer.nav_heading_customer": "Customer Care & Support",
  "sections.footer.desk_label": "Customer Desk",
  "sections.footer.whatsapp_label": "WhatsApp Inquiry Desk",
  "sections.footer.email_label": "Email Contact",
  "sections.footer.office_label": "Registered Office",
  "sections.footer.address": "Balrampur, Uttar Pradesh - 271201, India",
  "sections.footer.nav_faq": "FAQ",
  "sections.footer.nav_privacy": "Privacy Policy",
  "sections.footer.nav_terms": "Terms & Conditions",

  "sections.testimonials.notice": "Under our strict Truthful Content Policy, we do not show fabricated testimonials, fake company names, or invented ratings. Genuine customer reviews from verified delivered orders are currently being verified and will be published here shortly.",
  "sections.testimonials.explore_products": "Explore Products →",
  "sections.testimonials.share_experience": "Share Your Experience",

  "sections.why_bhaya.pillar_1_title": "Authentic Sourcing",
  "sections.why_bhaya.pillar_1_desc": "Directly connecting verified regional artisans and manufacturers with complete transparency.",
  "sections.why_bhaya.pillar_2_title": "Transparent & Honest Value",
  "sections.why_bhaya.pillar_2_desc": "Fair pricing with zero artificial markups, hidden fees, or misleading specifications.",
  "sections.why_bhaya.pillar_3_title": "Curated Variety",
  "sections.why_bhaya.pillar_3_desc": "Carefully vetted collection across festival, textiles, stationery, agro, and retail essentials.",
  "sections.why_bhaya.pillar_4_title": "Dedicated Support",
  "sections.why_bhaya.pillar_4_desc": "Responsive customer desk, direct WhatsApp assistance, and transparent order tracking.",

  "sections.product.buy_now": "Buy Now",
  "sections.product.whatsapp_enquiry": "WhatsApp Enquiry"
};

const hiTranslations = {
  "sections.bhaya_2.eyebrow": "भविष्य का प्लेटफ़ॉर्म विज़न • शीघ्र उपलब्ध",
  "sections.bhaya_2.title": "BHAYA INDIA 2.0",
  "sections.bhaya_2.subtitle": "एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा",
  "sections.bhaya_2.desc": "क्षेत्रीय खुदरा विक्रेताओं, निर्माताओं और व्यापारिक खरीदारों के लिए भारत का सबसे भरोसेमंद डिजिटल तंत्र।",
  "sections.bhaya_2.cta": "प्लेटफ़ॉर्म विज़न देखें",
  "sections.bhaya_2.pillar_1_title": "दुकानदार एवं विक्रेता नेटवर्क",
  "sections.bhaya_2.pillar_1_desc": "स्थानीय खुदरा व्यापारियों और दुकानदारों को BHAYA INDIA डिजिटल तंत्र से जोड़ना।",
  "sections.bhaya_2.pillar_2_title": "प्रत्यक्ष निर्माता सहयोग",
  "sections.bhaya_2.pillar_2_desc": "क्षेत्रीय निर्माताओं को सीधे देश भर के ग्राहकों और व्यावसायिक खरीदारों से जोड़ना।",
  "sections.bhaya_2.pillar_3_title": "थोक एवं B2B आपूर्ति हब",
  "sections.bhaya_2.pillar_3_desc": "पारदर्शी उत्पाद सोर्सिंग, थोक आवंटन और अनुकूलित कॉर्पोरेट पूछताछ की सुविधा।",
  "sections.bhaya_2.pillar_4_title": "एकीकृत लॉजिस्टिक्स एवं मार्केटप्लेस",
  "sections.bhaya_2.pillar_4_desc": "एक ही भरोसेमंद नाम के तहत संपूर्ण पूर्ति, डिजिटल स्टोरफ्रंट और मल्टी-सेलर टूल्स का निर्माण।",

  "sections.story.eyebrow": "हमारी कहानी",
  "sections.story.title": "एक विश्वसनीय व्यापारिक प्रतिष्ठान से अखिल भारतीय डिजिटल मंच तक",
  "sections.story.para_1": "BHAYA INDIA की स्थापना सच्चे और ईमानदार भारतीय व्यापार के संकल्प पर हुई। उत्तर प्रदेश के एक प्रतिष्ठित व्यापारिक प्रतिष्ठान से शुरू होकर, यह आज सत्यापित निर्माताओं, स्थानीय दुकानों और ग्राहकों को जोड़ने वाला एक आधुनिक राष्ट्रव्यापी मंच बन चुका है।",
  "sections.story.quote_author": "भाया इंडिया का मूल आदर्श वाक्य",
  "sections.story.para_2": "प्रामाणिक सोर्सिंग, उचित मूल्य और भरोसेमंद पूर्ति के सिद्धांतों पर आधारित, हम स्वदेशी व्यापार को सशक्त बनाते हैं और पूरी पारदर्शिता के साथ ग्राहकों तक भारत के विविध उत्पाद पहुँचाते हैं।",
  "sections.story.read_more": "हमारी पूरी विरासत यात्रा पढ़ें",

  "sections.featured.empty_title": "उत्पाद सूची तैयार की जा रही है",
  "sections.featured.empty_desc": "प्रत्येक प्रामाणिक उत्पाद और खेप को गुणवत्ता जांच के बाद ही प्रस्तुत किया जाता है। विशेष मांग या तुरंत आपूर्ति हेतु हमारे व्यापारी डेस्क से संपर्क करें।",
  "sections.featured.empty_b2b_btn": "थोक मूल्य स्तर पूछें",
  "sections.featured.empty_desk_btn": "आर्टिसन कंसीयज डेस्क",

  "sections.footer.brand_about": "स्वदेशी हस्तशिल्प, पारंपरिक वस्त्र, त्योहारी साज-सज्जा और भरोसेमंद अखिल भारतीय आपूर्ति को समर्पित एक प्रतिष्ठित भारतीय व्यावसायिक एवं ई-कॉमर्स मंच।",
  "sections.footer.directions_title": "व्यावसायिक दिशाएं",
  "sections.footer.dir_1": "1. त्योहार (Festival)",
  "sections.footer.dir_2": "2. खुदरा (Retail)",
  "sections.footer.dir_3": "3. कृषि (Agro)",
  "sections.footer.dir_4": "4. विनिर्माण (Manufacturing)",
  "sections.footer.dir_5": "5. लॉजिस्टिक्स (Logistics)",
  "sections.footer.dir_6": "6. निर्यात (Exports)",
  "sections.footer.dir_7": "7. ई-कॉमर्स (E-commerce)",
  "sections.footer.dir_8": "8. पैकेजिंग एवं पेपर उत्पाद",
  "sections.footer.nav_heading_company": "कंपनी एवं विज़न",
  "sections.footer.nav_about": "हमारे बारे में",
  "sections.footer.nav_vision": "कंपनी का विज़न",
  "sections.footer.nav_why": "भाया इंडिया क्यों चुनें?",
  "sections.footer.nav_wholesale": "बी2बी एवं थोक",
  "sections.footer.nav_seller": "विक्रेता बनें",
  "sections.footer.nav_manufacturers": "निर्माता पार्टनर",
  "sections.footer.nav_reviews": "ग्राहक समीक्षाएं",
  "sections.footer.nav_heading_customer": "ग्राहक सेवा एवं सहायता",
  "sections.footer.desk_label": "ग्राहक सेवा डेस्क",
  "sections.footer.whatsapp_label": "व्हाट्सएप पूछताछ डेस्क",
  "sections.footer.email_label": "ईमेल संपर्क",
  "sections.footer.office_label": "पंजीकृत कार्यालय",
  "sections.footer.address": "बलरामपुर, उत्तर प्रदेश - 271201, भारत",
  "sections.footer.nav_faq": "सामान्य प्रश्न (FAQ)",
  "sections.footer.nav_privacy": "गोपनीयता नीति",
  "sections.footer.nav_terms": "नियम एवं शर्तें",

  "sections.testimonials.notice": "हमारी सख्त सत्यनिष्ठ सामग्री नीति के अनुसार, हम कोई भी कृत्रिम समीक्षा या काल्पनिक प्रशंसापत्र प्रकाशित नहीं करते हैं। वास्तविक डिलीवर किए गए ऑर्डरों से प्राप्त ग्राहक समीक्षाओं का सत्यापन जारी है और वे शीघ्र यहाँ लाइव होंगी।",
  "sections.testimonials.explore_products": "उत्पाद सूची देखें →",
  "sections.testimonials.share_experience": "अपना अनुभव साझा करें",

  "sections.why_bhaya.pillar_1_title": "प्रामाणिक सोर्सिंग",
  "sections.why_bhaya.pillar_1_desc": "सत्यापित क्षेत्रीय कारीगरों और निर्माताओं से सीधे और पारदर्शी संपर्क।",
  "sections.why_bhaya.pillar_2_title": "पारदर्शी और ईमानदार मूल्य",
  "sections.why_bhaya.pillar_2_desc": "बिना किसी अनुचित मार्कअप या छिपी लागत के वास्तविक और उचित मूल्य।",
  "sections.why_bhaya.pillar_3_title": "क्यूरेटेड विविधता",
  "sections.why_bhaya.pillar_3_desc": "त्योहार, वस्त्र, स्टेशनरी, कृषि और दैनिक उपयोग के सामान का ध्यानपूर्वक चयनित संग्रह।",
  "sections.why_bhaya.pillar_4_title": "समर्पित सहायता",
  "sections.why_bhaya.pillar_4_desc": "उत्तरदायी ग्राहक सेवा डेस्क, सीधा व्हाट्सएप समर्थन और ऑर्डर ट्रैकिंग।",

  "sections.product.buy_now": "अभी खरीदें",
  "sections.product.whatsapp_enquiry": "व्हाट्सएप पूछताछ"
};

for (const [k, v] of Object.entries(enTranslations)) {
  setVal(en, k, v);
}

for (const [k, v] of Object.entries(hiTranslations)) {
  setVal(hi, k, v);
}

fs.writeFileSync('shopify-theme/locales/en.default.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('shopify-theme/locales/hi.json', JSON.stringify(hi, null, 2), 'utf8');
console.log('Successfully synced all missing keys into en.default.json and hi.json!');
