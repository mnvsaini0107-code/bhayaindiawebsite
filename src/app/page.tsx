import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import CategoryShowcase from "@/components/CategoryShowcase/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import BrandStory from "@/components/BrandStory/BrandStory";
import WhyBhayaIndia from "@/components/WhyBhayaIndia/WhyBhayaIndia";
import BhayaIndia2 from "@/components/BhayaIndia2/BhayaIndia2";
import Testimonials from "@/components/Testimonials/Testimonials";
import FinalCTA from "@/components/FinalCTA/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CategoryShowcase />
        <FeaturedProducts />
        <BrandStory />
        <WhyBhayaIndia />
        <BhayaIndia2 />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
