import FirstGuide from '@/components/agent/FirstGuide';

interface Props {
  isInView: boolean;
  isScenarioDesktop?: boolean;
}

export default function MobileFirstGuide({
  isInView,
  isScenarioDesktop,
}: Props) {
  return <FirstGuide isInView={isInView} isMobile={!isScenarioDesktop} />;
}
