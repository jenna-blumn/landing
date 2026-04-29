'use client';

import dynamic from 'next/dynamic';

import MainSection from '@/components/main/MainSection';
import SpecialSection from '@/components/main/SpecialSection';
import ReviewSection from '@/components/main/ReviewSection';
import CTASection from '@/components/common/CTASection';

const ExperienceSection = dynamic(() => import('./main/ExperienceSection'), {
  ssr: false,
});

export default function MainTemplate() {
  return (
    <>
      <MainSection />
      <SpecialSection />
      <ExperienceSection />
      <ReviewSection />
      <CTASection gtmEvent="MAIN_SALES_INQUIRY" />
    </>
  );
}
