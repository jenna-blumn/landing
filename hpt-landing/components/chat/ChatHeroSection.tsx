'use client';

import styles from './ChatHeroSection.style';
import common from '@/styles/common';

import { useEnv } from '@/contexts/EnvContext';

export default function ChatHeroSection() {
  const { HAPPYTALK_COUNSELOR_URL } = useEnv();

  return (
    <section css={styles.container}>
      <div css={styles.textBox}>
        <h1 css={styles.mainTitle}>
          신뢰할 수 있는 상담을 만드는 <br />
          AI 채팅 솔루션
        </h1>
        <p css={styles.description}>
          고객 문의가 신뢰로 이어지도록, <br />
          AI 응대부터 상담사 연결까지 해피톡이 지원합니다.
        </p>
      </div>
      <div css={styles.ctaContainer}>
        <a
          href={`${HAPPYTALK_COUNSELOR_URL}/auth/join`}
          css={common.primaryCta}
          data-gtm-event="CHAT_FREE_START"
        >
          채팅상담 무료시작
        </a>
      </div>
    </section>
  );
}
