import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Customer Desk & Business Inquiries | BHAYA INDIA",
  description:
    "Get in touch with Bhaya India for product enquiries, wholesale requests, or general questions. WhatsApp, phone and email available.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactClient />
      <Footer />
    </>
  );
}

