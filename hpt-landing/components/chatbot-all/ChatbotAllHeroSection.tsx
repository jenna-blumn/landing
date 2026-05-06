'use client';

import Link from 'next/link';
import styles from './ChatbotAllHeroSection.style';
import common from '@/styles/common';

export default function ChatbotAllHeroSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h1 css={styles.title}>
          복잡한 AI 에이전트,
          <br />
          <span className="highlight">전문가가 알아서 다-해드립니다</span>
        </h1>
        <p css={styles.description}>
          기획부터 워크플로우 설계, 맞춤 세팅까지.
          <br />
          해피톡 전문가가 우리 기업에 딱 맞는 자동응답을 완성해 드립니다.
        </p>
        <div css={styles.actions}>
          <Link
            href="/contact"
            css={common.primaryCta}
            data-gtm-event="CHATBOT_ALL_INQUIRY"
          >
            도입 문의하기
          </Link>
          <a href="#service-desc" css={styles.textBtn}>
            어떻게 세팅되나요? →
          </a>
        </div>
      </div>
    </section>
  );
}
