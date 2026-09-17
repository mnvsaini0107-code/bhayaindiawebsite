"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/locales/en";
import { hi } from "@/locales/hi";

export type Locale = "hi" | "en";

interface LanguageContextType {
  locale: Locale;
  language: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: (key: keyof typeof en, params?: Record<string, string | number>) => string;
  strings: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bhaya_locale") as Locale;
      if (saved === "hi" || saved === "en") {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("bhaya_locale", newLocale);
      document.cookie = `bhaya_locale=${newLocale}; path=/; max-age=31536000`;
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "hi" ? "en" : "hi");
  };

  const currentStrings = locale === "hi" ? (hi as typeof en) : en;

  const t = (key: keyof typeof en, params?: Record<string, string | number>): string => {
    let text = currentStrings[key] || en[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        language: locale,
        setLocale,
        toggleLocale,
        t,
        strings: currentStrings,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: "en" as Locale,
      language: "en" as Locale,
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key: keyof typeof en) => en[key] || (key as string),
      strings: en,
    };
  }
  return context;
}
