import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import BrandSplash from "@/components/BrandSplash/BrandSplash";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider, Locale } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "BHAYA INDIA — जहाँ भाया, वहाँ भरोसा",
    template: "%s | BHAYA INDIA",
  },
  description:
    "BHAYA INDIA is an Indian Business & E-commerce Platform connecting customers, local businesses and manufacturers on a trusted digital platform.",
  keywords: [
    "Bhaya India",
    "Indian products",
    "business platform",
    "textiles",
    "gift hampers",
    "wholesale",
    "online shopping India",
  ],
  openGraph: {
    siteName: "Bhaya India",
    type: "website",
    locale: "en_IN",
  },
  metadataBase: new URL("https://bhayaindia.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("bhaya_locale")?.value;
  const initialLocale: Locale = rawLocale === "hi" ? "hi" : "en";

  return (
    <html lang={initialLocale === "hi" ? "hi-IN" : "en-IN"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider initialLocale={initialLocale}>
          <CartProvider>
            <BrandSplash />
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

