import CardWrapper from '@/components/main/CardWrapper';
import RandomProgress from '@/components/main/RandomProgress';
import styles from './ProgressCard.style';

import MainCardIconGroup from '@/assets/svg/main-card-icon-group.svg';
import { useLayoutStore } from '@/stores/layoutStore';

export default function ProgressCard() {
  const { isDesktop } = useLayoutStore();

  return (
    <CardWrapper
      title="AI 에이전트"
      right={isDesktop ? -93 : -61}
      top={221}
      zIndex={1}
    >
      <div css={styles.container}>
        <RandomProgress />
        <MainCardIconGroup />
      </div>
    </CardWrapper>
  );
}
