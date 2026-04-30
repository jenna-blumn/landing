'use client';

import HeroSection from '@/components/hcc/HeroSection';
import WhyHCCSection from '@/components/hcc/WhyHCCSection';
import AdvantagesSection from '@/components/hcc/AdvantagesSection';
import SolutionSection from '@/components/hcc/SolutionSection';
import CaseStudySection from '@/components/hcc/CaseStudySection';
import CTASection from '@/components/common/CTASection';

export default function HCCTemplate() {
  return (
    <>
      <HeroSection />
      <WhyHCCSection />
      <AdvantagesSection />
      <SolutionSection />
      <CaseStudySection />
      <CTASection
        gtmEvent="HCC_SALES_INQUIRY"
        title="복잡한 상담을 편리하게!"
      />
    </>
  );
}
