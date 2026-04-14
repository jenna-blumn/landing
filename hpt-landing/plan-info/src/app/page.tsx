import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlanTabContainer from "@/components/PlanTabContainer";
import FeatureComparison from "@/components/FeatureComparison";
import EnterpriseSection from "@/components/EnterpriseSection";
import AddOnServices from "@/components/AddOnServices";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PlanTabContainer />
        <FeatureComparison />
        <EnterpriseSection />
        <AddOnServices />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
