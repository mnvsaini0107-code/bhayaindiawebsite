import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us — Our Story, Values & Mission | BHAYA INDIA",
  description:
    "BHAYA INDIA एक भारतीय Business & E-commerce Platform है, जो स्थानीय खुदरा व्यापारियों, थोक विक्रेताओं और निर्माताओं को आधुनिक डिजिटल कॉमर्स से जोड़ता है। Local to Online • Local to India.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutClient />
      <Footer />
    </>
  );
}
