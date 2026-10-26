import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import BrandStory from "@/components/BrandStory/BrandStory";
import WhyBhayaIndia from "@/components/WhyBhayaIndia/WhyBhayaIndia";
import BusinessVerticals from "@/components/BusinessVerticals/BusinessVerticals";
import CategoryShowcase from "@/components/CategoryShowcase/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import B2BSection from "@/components/B2BSection/B2BSection";
import SellerSection from "@/components/SellerSection/SellerSection";
import ManufacturerSection from "@/components/ManufacturerSection/ManufacturerSection";
import BhayaIndia2 from "@/components/BhayaIndia2/BhayaIndia2";
import FounderStory from "@/components/FounderStory/FounderStory";
import GalleryPreview from "@/components/GalleryPreview/GalleryPreview";
import HomeFAQ from "@/components/HomeFAQ/HomeFAQ";
import CustomerDesk from "@/components/CustomerDesk/CustomerDesk";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero />

        {/* 2. Short BHAYA INDIA Introduction */}
        <BrandStory />

        {/* 3. Why BHAYA INDIA / Trust */}
        <WhyBhayaIndia />

        {/* 4. Core Business Directions */}
        <BusinessVerticals />

        {/* 5. E-commerce / Shop */}
        <CategoryShowcase />
        <FeaturedProducts />

        {/* 6. B2B */}
        <B2BSection />

        {/* 7. Become a Seller */}
        <SellerSection />

        {/* 8. Manufacturer / Brand Partner */}
        <ManufacturerSection />

        {/* 9. BHAYA INDIA 2.0 / Future Vision */}
        <BhayaIndia2 />

        {/* 10. Founder Story / About */}
        <FounderStory />

        {/* 11. Gallery */}
        <GalleryPreview />

        {/* 12. FAQ */}
        <HomeFAQ />

        {/* 13. Customer Desk / Contact */}
        <CustomerDesk />
      </main>
      {/* 14. Footer */}
      <Footer />
    </>
  );
}
