'use client';

import ClientLogoGridSection from '@/components/client/ClientLogoGridSection';
import ClientFeaturedSection from '@/components/client/ClientFeaturedSection';
import ClientIndustrySection from '@/components/client/ClientIndustrySection';

export default function ClientPage() {
  return (
    <>
      <ClientLogoGridSection />
      <ClientFeaturedSection />
      <ClientIndustrySection />
    </>
  );
}
