"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/locales/en";
import { hi } from "@/locales/hi";

export type Locale = "hi" | "en";

export type IndianLanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "mr"
  | "gu"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "pa"
  | "or"
  | "as";

export interface IndianLanguageOption {
  code: IndianLanguageCode;
  isoCode: string;
  name: string;
  nativeName: string;
  status: "live" | "coming_soon";
}

export const INDIAN_LANGUAGES: IndianLanguageOption[] = [
  { code: "en", isoCode: "EN", name: "English", nativeName: "English", status: "live" },
  { code: "hi", isoCode: "HI", name: "Hindi", nativeName: "हिन्दी", status: "live" },
  { code: "bn", isoCode: "BN", name: "Bengali", nativeName: "বাংলা", status: "coming_soon" },
  { code: "mr", isoCode: "MR", name: "Marathi", nativeName: "मराठी", status: "coming_soon" },
  { code: "gu", isoCode: "GU", name: "Gujarati", nativeName: "ગુજરાતી", status: "coming_soon" },
  { code: "ta", isoCode: "TA", name: "Tamil", nativeName: "தமிழ்", status: "coming_soon" },
  { code: "te", isoCode: "TE", name: "Telugu", nativeName: "తెలుగు", status: "coming_soon" },
  { code: "kn", isoCode: "KN", name: "Kannada", nativeName: "ಕನ್ನಡ", status: "coming_soon" },
  { code: "ml", isoCode: "ML", name: "Malayalam", nativeName: "മലയാളം", status: "coming_soon" },
  { code: "pa", isoCode: "PA", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", status: "coming_soon" },
  { code: "or", isoCode: "OR", name: "Odia", nativeName: "ଓଡ଼ିଆ", status: "coming_soon" },
  { code: "as", isoCode: "AS", name: "Assamese", nativeName: "অসমীয়া", status: "coming_soon" },
];

interface LanguageContextType {
  locale: Locale;
  language: Locale;
  mounted: boolean;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  selectLanguage: (code: IndianLanguageCode) => void;
  availableLanguages: IndianLanguageOption[];
  pendingNotice: IndianLanguageOption | null;
  dismissNotice: () => void;
  t: (key: keyof typeof en, params?: Record<string, string | number>) => string;
  strings: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<IndianLanguageOption | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("bhaya_locale") as Locale;
      if (saved && (saved === "hi" || saved === "en")) {
        setLocaleState((prev) => (prev !== saved ? saved : prev));
        document.cookie = `bhaya_locale=${saved}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setPendingNotice(null);
    try {
      localStorage.setItem("bhaya_locale", newLocale);
      document.cookie = `bhaya_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "hi" ? "en" : "hi");
  };

  const selectLanguage = (code: IndianLanguageCode) => {
    const lang = INDIAN_LANGUAGES.find((l) => l.code === code);
    if (!lang) return;

    if (lang.status === "live") {
      setLocale(code as Locale);
    } else {
      // For upcoming regional languages, trigger truthful notice without breaking UI into mixed languages
      setPendingNotice(lang);
    }
  };

  const dismissNotice = () => {
    setPendingNotice(null);
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
        mounted,
        setLocale,
        toggleLocale,
        selectLanguage,
        availableLanguages: INDIAN_LANGUAGES,
        pendingNotice,
        dismissNotice,
        t,
        strings: currentStrings,
      }}
    >
      {children}

      {/* Indian Regional Language Coming Soon Modal */}
      {pendingNotice && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(18, 52, 86, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 11000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={dismissNotice}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              padding: "32px 28px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 48px rgba(18, 52, 86, 0.3)",
              border: "1px solid rgba(197, 160, 89, 0.3)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(197, 160, 89, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold-dark, #a8833c)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>

            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                background: "rgba(197,160,89,0.15)",
                color: "var(--gold-dark, #a8833c)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: "2px",
                marginBottom: "12px",
              }}
            >
              Translation in Progress • अनुवाद जारी है
            </span>

            <h3
              style={{
                fontFamily: "var(--font-display, serif)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--sapphire, #123456)",
                marginBottom: "10px",
              }}
            >
              {pendingNotice.nativeName} ({pendingNotice.isoCode}) — Coming Soon
            </h3>

            <p
              style={{
                fontSize: "14px",
                color: "var(--gray-600, #555)",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              प्रामाणिक एवं सटीक जानकारी सुनिश्चित करने के लिए <strong>{pendingNotice.nativeName}</strong> भाषा में सम्पूर्ण अनुवाद पर कार्य प्रगति पर है। मिश्रित सामग्री से बचने के लिए यह संस्करण शीघ्र लाइव किया जाएगा।
            </p>

            <p
              style={{
                fontSize: "13px",
                color: "var(--gray-500, #777)",
                lineHeight: 1.5,
                marginBottom: "24px",
              }}
            >
              To maintain the highest editorial and catalog authenticity, our complete <strong>{pendingNotice.name}</strong> translation is underway. Please browse in Hindi or English in the meantime.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setLocale("hi")}
                style={{ fontSize: "13px", padding: "10px 18px" }}
              >
                हिन्दी में जारी रखें
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setLocale("en")}
                style={{ fontSize: "13px", padding: "10px 18px" }}
              >
                Continue in English
              </button>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: "en" as Locale,
      language: "en" as Locale,
      mounted: false,
      setLocale: () => {},
      toggleLocale: () => {},
      selectLanguage: () => {},
      availableLanguages: INDIAN_LANGUAGES,
      pendingNotice: null,
      dismissNotice: () => {},
      t: (key: keyof typeof en) => en[key] || (key as string),
      strings: en,
    };
  }
  return context;
}
