'use client';

import HeroSection from '@/components/hcc/HeroSection';
import WhyHCCSection from '@/components/hcc/WhyHCCSection';
import AdvantagesSection from '@/components/hcc/AdvantagesSection';
import SolutionSection from '@/components/hcc/SolutionSection';
import CaseStudySection from '@/components/hcc/CaseStudySection';
import EnterpriseCTASection from '@/components/hcc/EnterpriseCTASection';

export default function HCCTemplate() {
  return (
    <>
      <HeroSection />
      <WhyHCCSection />
      <AdvantagesSection />
      <SolutionSection />
      <CaseStudySection />
      <EnterpriseCTASection />
    </>
  );
}
