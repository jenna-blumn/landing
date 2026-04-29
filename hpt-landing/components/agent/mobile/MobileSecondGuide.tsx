import SecondGuide from '@/components/agent/SecondGuide';

interface MobileSecondGuideProps {
  isInView: boolean;
  isScenarioDesktop?: boolean;
}

export default function MobileSecondGuide({
  isInView,
  isScenarioDesktop,
}: MobileSecondGuideProps) {
  return <SecondGuide isInView={isInView} isMobile={!isScenarioDesktop} />;
}
