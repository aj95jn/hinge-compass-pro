import HeroSection from "@/components/HeroSection";
import PillarsSection from "@/components/PillarsSection";
import TipsSection from "@/components/TipsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <PillarsSection />
      <TipsSection />
      <Footer />
    </main>
  );
};

export default Index;
