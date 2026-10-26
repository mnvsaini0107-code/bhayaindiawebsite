import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TestimonialsClient from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Customer Reviews — ग्राहक समीक्षा | BHAYA INDIA",
  description:
    "Verified feedback and reviews from retail customers and wholesale business partners across India.",
};

export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <TestimonialsClient />
      <Footer />
    </>
  );
}
