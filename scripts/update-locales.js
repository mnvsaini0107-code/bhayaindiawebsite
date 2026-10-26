const fs = require('fs');
const path = require('path');

const enFile = path.resolve(__dirname, '..', 'shopify-theme', 'locales', 'en.default.json');
const hiFile = path.resolve(__dirname, '..', 'shopify-theme', 'locales', 'hi.json');

const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiFile, 'utf8'));

en.sections = en.sections || {};
hi.sections = hi.sections || {};

en.sections.header = {
  announcement: 'Pan-India Verified Delivery • Direct Artisan Sourced • 100% Quality Assured',
  logo_name: 'BHAYA INDIA',
  logo_tagline: 'जहाँ भाया, वहाँ भरोसा',
  search_placeholder: 'Search Products...',
  search_aria: 'Search Products...',
  account_label: 'Sign In / Register',
  cart_label: 'Shopping Bag',
  enquire_now: 'Enquire Now',
  all_categories: 'All Categories',
  nav_home: 'Home',
  nav_about: 'About Us',
  nav_products: 'Products',
  nav_services: 'Services',
  nav_wholesale: 'Wholesale & B2B',
  nav_bhaya2: 'BHAYA INDIA 2.0',
  nav_faq: 'FAQ',
  nav_contact: 'Contact',
  cat_festival: 'Festival',
  cat_retail: 'Retail',
  cat_agro: 'Agro',
  cat_manufacturing: 'Manufacturing',
  cat_logistics: 'Logistics',
  cat_exports: 'Exports',
  cat_ecommerce: 'E-commerce',
  cat_textiles: 'Textiles & Fabrics',
  cat_stationery: 'Stationery & Office',
  drawer_title_products: 'All Products',
  drawer_title_categories: 'Product Categories'
};

hi.sections.header = {
  announcement: 'अखिल भारतीय सत्यापित डिलीवरी • कारीगरों से सीधे प्राप्त • 100% गुणवत्ता सुनिश्चित',
  logo_name: 'BHAYA INDIA',
  logo_tagline: 'जहाँ भाया, वहाँ भरोसा',
  search_placeholder: 'उत्पाद खोजें...',
  search_aria: 'उत्पाद खोजें...',
  account_label: 'साइन इन / खाता',
  cart_label: 'शॉपिंग बैग',
  enquire_now: 'पूछताछ करें',
  all_categories: 'सभी श्रेणियां',
  nav_home: 'होम',
  nav_about: 'हमारे बारे में',
  nav_products: 'उत्पाद',
  nav_services: 'सेवाएं',
  nav_wholesale: 'थोक व B2B',
  nav_bhaya2: 'भाया इंडिया 2.0',
  nav_faq: 'सामान्य प्रश्न',
  nav_contact: 'संपर्क करें',
  cat_festival: 'त्योहार',
  cat_retail: 'खुदरा',
  cat_agro: 'कृषि',
  cat_manufacturing: 'विनिर्माण',
  cat_logistics: 'लॉजिस्टिक्स',
  cat_exports: 'निर्यात',
  cat_ecommerce: 'ई-कॉमर्स',
  cat_textiles: 'वस्त्र एवं परिधान',
  cat_stationery: 'स्टेशनरी एवं कार्यालय सामग्री',
  drawer_title_products: 'सभी उत्पाद',
  drawer_title_categories: 'उत्पाद श्रेणियां'
};

en.sections.hero = {
  eyebrow: 'BHAYA INDIA — A TRUSTED INDIAN COMMERCE PLATFORM',
  title: 'Quality Products. Honest Business. Genuine Trust.',
  subtitle: 'Connecting customers, regional retailers, and verified manufacturers through authentic sourcing, fair pricing, and dependable e-commerce across India.',
  explore_products: 'Explore Products',
  wholesale_enquiry: 'Wholesale & Business Enquiry',
  motto: 'जहाँ भाया, वहाँ भरोसा',
  submotto: 'Local to Online • Local to India',
  slide1_tag: 'Heritage Collection',
  slide2_eyebrow: 'AUTHENTIC TEXTILES & LUXURY HANDLOOMS',
  slide2_title: 'Pure Silk Sarees & Heirloom Weaves',
  slide2_subtitle: 'Handwoven by master artisans across Varanasi and regional clusters with Silk Mark purity assurance.',
  slide2_tag: 'Silk & Handlooms',
  slide3_eyebrow: 'EXECUTIVE OFFICE & CURATED GIFTING',
  slide3_title: 'Refined Leather Journals & Bespoke Hampers',
  slide3_subtitle: 'Bespoke gifting solutions for corporate celebrations, festivals, and discerning professionals.',
  slide3_tag: 'Stationery & Gifting'
};

hi.sections.hero = {
  eyebrow: 'BHAYA INDIA — भारत का अपना भरोसेमंद व्यापारिक मंच',
  title: 'उत्कृष्ट उत्पाद। सच्चा व्यापार। अटूट भरोसा।',
  subtitle: 'ग्राहकों, क्षेत्रीय खुदरा विक्रेताओं और सत्यापित निर्माताओं को प्रामाणिक सोर्सिंग, उचित मूल्य और भरोसेमंद ई-कॉमर्स के साथ जोड़ना।',
  explore_products: 'उत्पाद देखें',
  wholesale_enquiry: 'थोक व व्यापारिक पूछताछ',
  motto: 'जहाँ भाया, वहाँ भरोसा',
  submotto: 'लोकल टू ऑनलाइन • लोकल टू इंडिया',
  slide1_tag: 'विरासत संग्रह',
  slide2_eyebrow: 'प्रामाणिक वस्त्र एवं शुद्ध हैंडलूम',
  slide2_title: 'शुद्ध बनारसी सिल्क एवं पारंपरिक बुनाई',
  slide2_subtitle: 'वाराणसी और प्रमुख भारतीय बुनकर केंद्रों के कुशल कारीगरों द्वारा हस्तनिर्मित शुद्ध वस्त्र।',
  slide2_tag: 'शुद्ध सिल्क वस्त्र',
  slide3_eyebrow: 'कॉर्पोरेट स्टेशनरी एवं विशेष उपहार',
  slide3_title: 'उत्कृष्ट लेदर जर्नल्स एवं कॉर्पोरेट हैंपर्स',
  slide3_subtitle: 'कॉर्पोरेट आयोजनों, उत्सवों और विचारकों के लिए विशेष रूप से तैयार किए गए प्रीमियम उपहार।',
  slide3_tag: 'स्टेशनरी व उपहार'
};

en.sections.business_verticals = {
  eyebrow: 'MAIN BUSINESS DIRECTIONS',
  title: 'Festival • Retail • Agro • Manufacturing • Logistics • Exports • E-commerce',
  subtitle: "The seven foundational pillars guiding BHAYA INDIA's nationwide commerce ecosystem.",
  explore_direction: 'Explore Direction',
  v1_title: '1. FESTIVAL',
  v1_desc: 'Festival Products, Decoration, Puja & Celebration',
  v1_status: 'Active',
  v2_title: '2. RETAIL',
  v2_desc: 'Daily-use & General Products for Households and Stores',
  v2_status: 'Active',
  v3_title: '3. AGRO',
  v3_desc: 'Agricultural Products & Sustainable Rural Opportunities',
  v3_status: 'Active / Expanding',
  v4_title: '4. MANUFACTURING',
  v4_desc: 'Made in India Products & Direct Factory Manufacturing',
  v4_status: 'Active',
  v5_title: '5. LOGISTICS',
  v5_desc: 'Distribution & Delivery Network Across Key Hubs',
  v5_status: 'Active Network',
  v6_title: '6. EXPORTS',
  v6_desc: 'India to the World — Connecting Indian Makers to Global Buyers',
  v6_status: 'Active Desk',
  v7_title: '7. E-COMMERCE',
  v7_desc: 'Online Products • Shopping • Digital Marketplace',
  v7_status: 'Shopify Powered'
};

hi.sections.business_verticals = {
  eyebrow: 'BHAYA INDIA की मुख्य दिशा',
  title: 'त्योहार • रिटेल • कृषि • विनिर्माण • लॉजिस्टिक्स • निर्यात • ई-कॉमर्स',
  subtitle: 'भाया इंडिया के देशव्यापी व्यावसायिक तंत्र को दिशा देने वाले आधारभूत स्तंभ।',
  explore_direction: 'और जानें',
  v1_title: '1. FESTIVAL (त्योहार)',
  v1_desc: 'त्योहार के उत्पाद, सजावट, पूजा एवं उत्सव सामग्री',
  v1_status: 'सक्रिय',
  v2_title: '2. RETAIL (खुदरा)',
  v2_desc: 'दैनिक उपयोग एवं जनरल उत्पाद — घर और दुकानों के लिए',
  v2_status: 'सक्रिय',
  v3_title: '3. AGRO (कृषि)',
  v3_desc: 'कृषि उत्पाद, किसान सहयोग एवं ग्रामीण अवसर',
  v3_status: 'सक्रिय / विस्तार',
  v4_title: '4. MANUFACTURING (विनिर्माण)',
  v4_desc: 'मेड इन इंडिया उत्पाद एवं प्रत्यक्ष फैक्ट्री निर्माण',
  v4_status: 'सक्रिय',
  v5_title: '5. LOGISTICS (लॉजिस्टिक्स)',
  v5_desc: 'प्रमुख केंद्रों में कुशल वितरण एवं आपूर्ति नेटवर्क',
  v5_status: 'सक्रिय नेटवर्क',
  v6_title: '6. EXPORTS (निर्यात)',
  v6_desc: 'भारत से विश्व तक — भारतीय निर्माताओं को वैश्विक खरीदारों से जोड़ना',
  v6_status: 'सक्रिय डेस्क',
  v7_title: '7. E-COMMERCE (ई-कॉमर्स)',
  v7_desc: 'ऑनलाइन उत्पाद • सीधी शॉपिंग • डिजिटल मार्केटप्लेस',
  v7_status: 'Shopify पावर्ड'
};

en.sections.categories = {
  eyebrow: 'OUR COLLECTION',
  title: 'Curated Product Collections',
  view_all: 'View Complete Catalogue',
  cat_festival: 'Festival',
  cat_textiles: 'Textiles & Fabrics',
  cat_stationery: 'Stationery & Office',
  cat_hampers: 'Gift Hampers',
  cat_home_living: 'Home & Living',
  cat_wholesale: 'Wholesale & Bulk',
  cat_retail: 'Retail',
  catalogue_badge: 'Catalogue',
  explore_cta: 'Explore Collection'
};

hi.sections.categories = {
  eyebrow: 'हमारा संग्रह',
  title: 'प्रमुख उत्पाद श्रेणियां',
  view_all: 'पूरा कैटलॉग देखें',
  cat_festival: 'त्योहार',
  cat_textiles: 'वस्त्र एवं परिधान',
  cat_stationery: 'स्टेशनरी एवं कार्यालय सामग्री',
  cat_hampers: 'उपहार हैंपर्स',
  cat_home_living: 'गृह एवं जीवनशैली',
  cat_wholesale: 'थोक एवं संस्थागत आपूर्ति',
  cat_retail: 'खुदरा',
  catalogue_badge: 'कैटलॉग',
  explore_cta: 'श्रेणी देखें'
};

en.sections.featured = {
  eyebrow: 'Featured Products',
  title: 'Authentic Craftsmanship',
  view_all: 'View All',
  explore_products: 'Explore Products',
  add_to_bag: 'Add to Bag',
  added_to_bag: 'Added to Bag',
  buy_now: 'Buy Now',
  whatsapp_enquiry: 'WhatsApp Enquiry',
  new_arrival: 'New Release',
  coming_soon_title: 'Curated Collections Coming Soon — Products are being synced with Shopify',
  coming_soon_desc: 'Under our strict Truthful Content Policy, each indigenous product and batch is authenticated before public release. Check back shortly or connect directly with our merchant desk.',
  b2b_enquire: 'Commercial Inquiry Desk',
  desk_enquire: 'WhatsApp Desk'
};

hi.sections.featured = {
  eyebrow: 'विशेष उत्पाद',
  title: 'गुणवत्ता और प्रामाणिकता',
  view_all: 'सभी देखें',
  explore_products: 'उत्पाद देखें',
  add_to_bag: 'बैग में जोड़ें',
  added_to_bag: 'बैग में जोड़ा गया',
  buy_now: 'अभी खरीदें',
  whatsapp_enquiry: 'व्हाट्सएप पूछताछ',
  new_arrival: 'नवीनतम संग्रह',
  coming_soon_title: 'सत्यापित संग्रह जल्द उपलब्ध — उत्पाद वर्तमान में शॉपिफाई के साथ सिंक किए जा रहे हैं',
  coming_soon_desc: 'हमारी सख्त गुणवत्ता सत्यापन नीति के तहत, प्रत्येक उत्पाद का सार्वजनिक रिलीज से पहले सत्यापन किया जाता है। कृपया शीघ्र ही पुनः देखें या कस्टम ऑर्डर के लिए सहायता डेस्क से संपर्क करें।',
  b2b_enquire: 'व्यापारिक पूछताछ डेस्क',
  desk_enquire: 'व्हाट्सएप डेस्क'
};

en.sections.brand_story = {
  eyebrow: 'OUR STORY',
  title: 'From a Trusted Merchant Counter to a Pan-India Digital Platform',
  p1: "Built on the foundational promise of 'जहाँ भाया, वहाँ भरोसा', BHAYA INDIA originated with a clear commitment to customer relationships, genuine sourcing, and honest value.",
  quote: '“जहाँ भाया, वहाँ भरोसा”',
  quote_author: 'जहाँ भाया, वहाँ भरोसा — The Bhaya India Quality Pledge',
  p2: 'Today, we bring that same personal dedication into modern e-commerce — connecting customers, local shopkeepers, and verified manufacturers through a unified, trusted platform.',
  read_more: 'Read Our Full Journey'
};

hi.sections.brand_story = {
  eyebrow: 'हमारी कहानी',
  title: 'एक भरोसेमंद व्यापारिक पटल से अखिल भारतीय डिजिटल मंच तक',
  p1: '‘जहाँ भाया, वहाँ भरोसा’ के मूल संकल्प पर स्थापित, BHAYA INDIA की शुरुआत व्यक्तिगत ग्राहक संबंधों, वास्तविक सोर्सिंग और सच्चे मूल्य के साथ हुई।',
  quote: '“जहाँ भाया, वहाँ भरोसा”',
  quote_author: 'जहाँ भाया, वहाँ भरोसा — भाया इंडिया का गुणवत्ता संकल्प',
  p2: 'आज हम उसी समर्पण को आधुनिक ई-कॉमर्स में प्रस्तुत कर रहे हैं — ग्राहकों, स्थानीय दुकानदारों और निर्माताओं को एक एकीकृत, भरोसेमंद मंच से जोड़ते हुए।',
  read_more: 'पूरी यात्रा पढ़ें'
};

en.sections.why_bhaya = {
  eyebrow: 'WHY CHOOSE BHAYA INDIA',
  title: 'Built on Values That Stand the Test of Time',
  subtitle: 'Our foundational commitments guide every transaction — from retail shopping to wholesale consignments with genuine trust.',
  p1_title: 'Authentic Sourcing',
  p1_desc: 'Products selected directly from trusted makers, artisans, and regional producers.',
  p2_title: 'Transparent & Honest Value',
  p2_desc: 'Straightforward communication and honest value that honors both makers and customers.',
  p3_title: 'Curated Variety',
  p3_desc: 'A diverse catalogue spanning festival goods, daily retail essentials, textiles, and bulk items.',
  p4_title: 'Dedicated Support',
  p4_desc: 'Personalized assistance for corporate orders, custom requirements, and quick dispatches.'
};

hi.sections.why_bhaya = {
  eyebrow: 'भाया इंडिया क्यों चुनें?',
  title: 'शाश्वत मूल्यों पर आधारित व्यापार',
  subtitle: 'हमारी बुनियादी प्रतिबद्धताएं हर लेनदेन का मार्गदर्शन करती हैं — खुदरा खरीदारी से लेकर थोक आपूर्ति तक, पूर्ण विश्वास के साथ।',
  p1_title: 'प्रामाणिक सोर्सिंग',
  p1_desc: 'सीधे विश्वसनीय निर्माताओं, कुशल कारीगरों और क्षेत्रीय उत्पादकों से चयनित उत्पाद।',
  p2_title: 'पारदर्शी एवं सच्चा मूल्य',
  p2_desc: 'स्पष्ट संवाद और ईमानदार मूल्य निर्धारण, जो निर्माता और ग्राहक दोनों का सम्मान करता है।',
  p3_title: 'विविध एवं चुनिंदा संग्रह',
  p3_desc: 'त्योहारी सामान, दैनिक खुदरा जरूरतें, उत्कृष्ट वस्त्र और थोक आपूर्ति का समृद्ध कैटलॉग।',
  p4_title: 'समर्पित ग्राहक सेवा',
  p4_desc: 'संस्थागत ऑर्डरों, विशेष आवश्यकताओं और समयबद्ध डिलीवरी के लिए व्यक्तिगत सहायता।'
};

en.sections.bhaya_india_2 = {
  eyebrow: 'FUTURE PLATFORM VISION • COMING SOON',
  title: 'BHAYA INDIA 2.0',
  subheading: 'एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा',
  desc: 'Our future ecosystem connecting customers, local shopkeepers, manufacturers, and logistics under one trusted digital umbrella.',
  cta: 'Explore BHAYA INDIA 2.0 Vision',
  p1_num: '01',
  p1_title: 'Shopkeeper & Retailer Network',
  p1_desc: 'Enabling verified local shopkeepers and retail merchants to join the BHAYA INDIA digital ecosystem.',
  p2_num: '02',
  p2_title: 'Direct Manufacturer Partnerships',
  p2_desc: 'Connecting regional manufacturers directly with customers and institutional buyers across India.',
  p3_num: '03',
  p3_title: 'Wholesale & B2B Supply Hub',
  p3_desc: 'Facilitating transparent product sourcing, bulk allocation, and customized corporate enquiries.',
  p4_num: '04',
  p4_title: 'Integrated Logistics & Marketplace',
  p4_desc: 'Building end-to-end fulfillment, digital storefronts, and multi-seller tools under one trusted umbrella.'
};

hi.sections.bhaya_india_2 = {
  eyebrow: 'भावी विज़न • शीघ्र उपलब्ध',
  title: 'भाया इंडिया 2.0',
  subheading: 'एक प्लेटफॉर्म — हजारों दुकानें — एक भरोसा',
  desc: 'ग्राहकों, स्थानीय दुकानदारों, निर्माताओं और लॉजिस्टिक्स को एक ही भरोसेमंद डिजिटल छत्रछाया में जोड़ने वाला हमारा आगामी तंत्र।',
  cta: 'भाया इंडिया 2.0 विज़न देखें',
  p1_num: '01',
  p1_title: 'दुकानदार एवं विक्रेता नेटवर्क',
  p1_desc: 'स्थानीय खुदरा व्यापारियों और दुकानदारों को BHAYA INDIA डिजिटल तंत्र से जोड़ना।',
  p2_num: '02',
  p2_title: 'प्रत्यक्ष निर्माता सहयोग',
  p2_desc: 'क्षेत्रीय निर्माताओं को सीधे देश भर के ग्राहकों और व्यावसायिक खरीदारों से जोड़ना।',
  p3_num: '03',
  p3_title: 'थोक एवं B2B आपूर्ति हब',
  p3_desc: 'पारदर्शी उत्पाद सोर्सिंग, थोक आवंटन और अनुकूलित कॉर्पोरेट पूछताछ की सुविधा।',
  p4_num: '04',
  p4_title: 'एकीकृत लॉजिस्टिक्स एवं मार्केटप्लेस',
  p4_desc: 'एक ही भरोसेमंद नाम के तहत संपूर्ण पूर्ति, डिजिटल स्टोरफ्रंट और मल्टी-सेलर टूल्स का निर्माण।'
};

en.sections.testimonials = {
  eyebrow: 'Client Perspectives',
  title: 'Voices of Trust & Partnership',
  subtitle: 'Genuine feedback from retail customers and wholesale partners across India.',
  badge: 'Verified Reviews — Coming Soon',
  card_title: 'Customer Feedback Verification Underway',
  card_desc: 'Under our strict Truthful Content Policy, we only publish authenticated reviews from verified order deliveries. Genuine client reviews are being aggregated and will appear here shortly.',
  cta: 'Submit Your Experience →'
};

hi.sections.testimonials = {
  eyebrow: 'ग्राहकों का विश्वास',
  title: 'सच्चे अनुभव एवं विश्वास',
  subtitle: 'भारत भर के खुदरा ग्राहकों और थोक व्यापारियों से प्राप्त वास्तविक प्रतिक्रिया।',
  badge: 'सत्यापन प्रक्रिया जारी',
  card_title: 'ग्राहक समीक्षा — जल्द उपलब्ध',
  card_desc: 'हमारी सख्त सत्यनिष्ठ सामग्री नीति के अनुसार, हम केवल सत्यापित ऑर्डरों से प्राप्त समीक्षाएं प्रकाशित करते हैं। वास्तविक डिलीवर किए गए ऑर्डरों से प्राप्त ग्राहक समीक्षाओं का सत्यापन जारी है।',
  cta: 'अपना अनुभव साझा करें →'
};

en.sections.final_cta = {
  eyebrow: 'GENUINE COMMERCE & WHOLESALE ALLOCATIONS',
  title: 'Ready to Experience Honest Indian Commerce?',
  subtitle: 'Discover curated products across our seven verticals — or connect directly with our merchant desk for bulk and custom requirements.',
  explore_btn: 'Explore Full Catalogue',
  enquire_btn: 'Commercial Inquiry Desk',
  whatsapp_btn: 'WhatsApp Desk'
};

hi.sections.final_cta = {
  eyebrow: 'वास्तविक व्यापार एवं थोक आपूर्ति',
  title: 'सच्चे भारतीय व्यापार का अनुभव करने के लिए तैयार हैं?',
  subtitle: 'हमारे सात मुख्य व्यापारिक स्तंभों के चुनिंदा उत्पादों को देखें — या थोक एवं अनुकूलित आवश्यकताओं के लिए हमारे मर्चेंट डेस्क से संपर्क करें।',
  explore_btn: 'संपूर्ण कैटलॉग देखें',
  enquire_btn: 'व्यापारिक पूछताछ डेस्क',
  whatsapp_btn: 'व्हाट्सएप डेस्क'
};

en.sections.footer = {
  desc: 'A trusted Indian business & e-commerce platform connecting customers, local retailers, wholesalers, and manufacturers with quality products and dependable service.',
  col1_title: 'Company & Vision',
  col2_title: 'Business Ecosystem',
  col3_title: 'Customer Care & Support',
  customer_desk: 'Customer Desk',
  whatsapp_inquiry: 'WhatsApp Inquiries',
  email: 'Email',
  registered_office: 'Registered Office',
  registered_address: 'BHAYA INDIA — Business & E-commerce Desk, India',
  copyright: 'All rights reserved. BHAYA INDIA is committed to authentic Indian commerce.',
  faq: 'FAQ',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions'
};

hi.sections.footer = {
  desc: 'ग्राहकों, स्थानीय खुदरा विक्रेताओं, थोक व्यापारियों और निर्माताओं को गुणवत्तापूर्ण उत्पादों और भरोसेमंद सेवा से जोड़ने वाला विश्वसनीय भारतीय व्यापारिक मंच।',
  col1_title: 'कंपनी एवं विज़न',
  col2_title: 'व्यापारिक तंत्र',
  col3_title: 'ग्राहक सेवा एवं सहायता',
  customer_desk: 'ग्राहक सहायता डेस्क',
  whatsapp_inquiry: 'व्हाट्सएप पूछताछ',
  email: 'ईमेल',
  registered_office: 'पंजीकृत कार्यालय',
  registered_address: 'BHAYA INDIA — व्यापार एवं ई-कॉमर्स डेस्क, भारत',
  copyright: 'सर्वाधिकार सुरक्षित। BHAYA INDIA प्रामाणिक भारतीय व्यापार के लिए समर्पित है।',
  faq: 'सामान्य प्रश्न',
  privacy: 'गोपनीयता नीति',
  terms: 'नियम एवं शर्तें'
};

fs.writeFileSync(enFile, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(hiFile, JSON.stringify(hi, null, 2), 'utf8');
console.log('Successfully updated en.default.json and hi.json!');
