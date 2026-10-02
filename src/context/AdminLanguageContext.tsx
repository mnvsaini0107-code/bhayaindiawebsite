"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AdminLang = "en" | "hi";

interface AdminLanguageContextType {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<AdminLang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    leadsCrm: "Leads / CRM",
    mediaLibrary: "Media Library",
    globalSettings: "Global Settings",
    services: "Services",
    portfolio: "Portfolio",
    creatorsTeam: "Creators / Team",
    testimonials: "Reviews / Testimonials",
    publicationsBlog: "Publications / Blog",
    faqs: "FAQs",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    customers: "Customers",
    seoControlCenter: "SEO Control Center",
    analytics: "Analytics",
    siteHealth: "Site Health",
    activityLogs: "Activity Logs",
    viewPublicSite: "View Public Site",
    logout: "Logout",
    searchPlaceholder: "Search products, orders, leads, blogs, media, SEO...",
    adminPortal: "Admin Control Center",
    liveSyncActive: "Live Sync Active",
    administrator: "Store Administrator",
    coreSystem: "CORE SYSTEM",
    websiteCms: "WEBSITE CMS",
    businessCommerce: "BUSINESS / COMMERCE",
    system: "SYSTEM",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    leadsCrm: "लीड्स / ग्राहक पूछताछ",
    mediaLibrary: "मीडिया लाइब्रेरी",
    globalSettings: "ग्लोबल सेटिंग्स",
    services: "सेवाएं",
    portfolio: "पोर्टफोलियो",
    creatorsTeam: "कारीगर / टीम",
    testimonials: "समीक्षाएं / अनुभव",
    publicationsBlog: "प्रकाशन / ब्लॉग",
    faqs: "सामान्य प्रश्न",
    products: "उत्पाद",
    categories: "श्रेणियां",
    orders: "ऑर्डर्स",
    customers: "ग्राहक खाते",
    seoControlCenter: "एसईओ कंट्रोल सेंटर",
    analytics: "एनालिटिक्स",
    siteHealth: "साइट स्वास्थ्य",
    activityLogs: "गतिविधि लॉग",
    viewPublicSite: "वेबसाइट देखें",
    logout: "लॉगआउट",
    searchPlaceholder: "उत्पाद, ऑर्डर्स, लीड्स, ब्लॉग, मीडिया खोजें...",
    adminPortal: "एडमिन कंट्रोल सेंटर",
    liveSyncActive: "लाइव सिंक सक्रिय",
    administrator: "स्टोर एडमिनिस्ट्रेटर",
    coreSystem: "मुख्य प्रणाली",
    websiteCms: "वेबसाइट सीएमएस",
    businessCommerce: "व्यापार / ई-कॉमर्स",
    system: "सिस्टम",
  },
};

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
});

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("bhaya_admin_lang") as AdminLang | null;
    if (saved === "en" || saved === "hi") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: AdminLang) => {
    setLangState(newLang);
    localStorage.setItem("bhaya_admin_lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "hi" : "en");
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <AdminLanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  return useContext(AdminLanguageContext);
}
