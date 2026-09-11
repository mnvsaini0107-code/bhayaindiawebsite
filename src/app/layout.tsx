import type { Metadata } from "next";
import "./globals.css";
import BrandSplash from "@/components/BrandSplash/BrandSplash";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: {
    default: "Bhaya India — जहाँ भाया, वहाँ भरोसा",
    template: "%s | Bhaya India",
  },
  description:
    "Bhaya India is a premium Indian business offering quality textiles, stationery, gift hampers, electronics and homeware. Trusted craftsmanship, delivered across India.",
  keywords: [
    "Bhaya India",
    "Indian products",
    "premium textiles",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <CartProvider>
          <BrandSplash />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
