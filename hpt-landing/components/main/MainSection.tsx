import Link from 'next/link';
import styles from './MainSection.style';
import common from '@/styles/common';

import MainVector5 from '@/assets/svg/main-vector-5.svg';
import MainVector6 from '@/assets/svg/main-vector-6.svg';
import MainVector3 from '@/assets/svg/main-vector-3.svg';
import ChatPreview from '@/components/main/ChatPreview';
import HappytalkCard from '@/components/main/HappytalkCard';
import AnalysisCard from '@/components/main/AnalysisCard';
import VideoCard from '@/components/main/VideoCard';
import ProgressCard from '@/components/main/ProgressCard';

import MainVectorLeft from '@/assets/images/main-vector-left.png';
import MainVectorRight from '@/assets/images/main-vector-right.png';

export default function MainSection() {
  return (
    <div css={styles.container} data-header-theme="blur">
      <div css={styles.backgroundWrapper}>
        <div css={styles.gradientBottom} />
        <div css={styles.gradientTop} />
        <div css={styles.contentWrapper}>
          <MainVector5 css={styles.vectorRelative(69, -230)} />
          <MainVector6 css={styles.vectorRelative(143, -230)} />
          <MainVector3 css={styles.vectorRelative(142, -72)} />
          <ChatPreview />
          <HappytalkCard />
          <VideoCard />
          <AnalysisCard />
          <ProgressCard />
          {/* <MainVector8 css={styles.vectorRelative(151, 1044)} />
          <MainVector7 css={styles.vectorRelative(71, -634)} /> */}
          <img src={MainVectorLeft.src} css={styles.vectorRelative(71, -634)} />
          {/* <img
            src={MainVectorRight.src}
            css={styles.vectorRelative(151, 970)}
          /> */}
          <img
            src={MainVectorRight.src}
            css={[styles.vectorRelative(151, 970), styles.rightVector]}
          />
        </div>
      </div>
      <div css={styles.headerWrapper}>
        <div css={styles.headerContainer}>
          <h2 css={styles.title}>
            상담을 넘어{` `}
            <br />
            업무까지 수행하는 AI
          </h2>
          <Link
            href="/agent"
            css={common.primaryCta}
            data-gtm-event="MAIN_AGENT_FREE_TRIAL"
          >
            AI 에이전트 바로 체험하기
          </Link>
        </div>
      </div>
    </div>
  );
}
