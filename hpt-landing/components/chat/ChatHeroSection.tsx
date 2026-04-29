'use client';

import styles from './ChatHeroSection.style';
import common from '@/styles/common';

import { useEnv } from '@/contexts/EnvContext';

export default function ChatHeroSection() {
  const { HAPPYTALK_COUNSELOR_URL } = useEnv();

  return (
    <section css={styles.container}>
      <div css={styles.textBox}>
        <span css={styles.badge}>채팅상담 솔루션</span>
        <h1 css={styles.mainTitle}>
          상담의 흐름을 설계하는 <br />
          AI 채팅 솔루션
        </h1>
        <p css={styles.description}>
          고객 문의부터 AI 자동 응대, 상담사 연결까지 <br />
          채팅상담의 모든 흐름을 하나로 관리하세요.
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
