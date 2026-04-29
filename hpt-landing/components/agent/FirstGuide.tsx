import styles from './FirstGuide.style';
import AlarmContent from '@/components/agent/AlarmContent';
import ScenarioContent from '@/components/agent/ScenarioContent';

import MainLineSvg from '@/assets/svg/scenario-main-line.svg';
import MainLineMobileSvg from '@/assets/svg/scenario-main-line_mobile.svg';

interface Props {
  isInView: boolean;
  isMobile?: boolean;
}

export default function FirstGuide({ isInView, isMobile }: Props) {
  const LineSvg = isMobile ? MainLineMobileSvg : MainLineSvg;

  return (
    <div css={styles.container}>
      {isInView && (
        <div css={styles.wrapper}>
          <AlarmContent />
          <LineSvg css={styles.lineSvg} />
          <ScenarioContent isMobile={isMobile} />
        </div>
      )}
    </div>
  );
}
