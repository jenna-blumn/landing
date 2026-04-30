'use client';

import PriceHeroSection from '@/components/price/PriceHeroSection';
import PlanTabContainer from '@/components/price/PlanTabContainer';
import FeatureComparison from '@/components/price/FeatureComparison';
import EnterpriseSection from '@/components/price/EnterpriseSection';
import AddOnServices from '@/components/price/AddOnServices';
import CTASection from '@/components/common/CTASection';

export default function PricePage() {
  return (
    <>
      <PriceHeroSection />
      <PlanTabContainer />
      <FeatureComparison />
      <EnterpriseSection />
      <AddOnServices />
      <CTASection />
    </>
  );
}
