'use client';

import ExtraServicesHeroSection from '@/components/extra-services/ExtraServicesHeroSection';
import ServiceCardsSection from '@/components/extra-services/ServiceCardsSection';
import CommerceMarketSection from '@/components/extra-services/CommerceMarketSection';
import DeviceAppsSection from '@/components/extra-services/DeviceAppsSection';
import CTASection from '@/components/common/CTASection';

export default function ExtraServicesPage() {
  return (
    <>
      <ExtraServicesHeroSection />
      <ServiceCardsSection />
      <CommerceMarketSection />
      <DeviceAppsSection />
      <CTASection />
    </>
  );
}
