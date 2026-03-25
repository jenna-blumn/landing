// HMR cache bust
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustedPartner from '@/components/TrustedPartner';
import FeaturesBento from '@/components/FeaturesBento';

import ComparisonPricing from '@/components/ComparisonPricing';
import ProcessWorkflow from '@/components/ProcessWorkflow';
import Partners from '@/components/Partners';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <main className="relative z-10">
        <TrustedPartner />
        <div className="relative bg-background">
          <FeaturesBento />
          
          <ComparisonPricing />
          <ProcessWorkflow />
          <Partners />
          <ContactCTA />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
