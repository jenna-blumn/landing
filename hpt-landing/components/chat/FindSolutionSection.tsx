'use client';

import Link from 'next/link';
import styles from './FindSolutionSection.style';

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function FindSolutionSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>
            우리 회사에 맞는
            <br />
            상담 솔루션을 찾으세요
          </h2>
          <p css={styles.subtitle}>
            스타트업부터 대기업까지, 규모에 맞는 서비스를 제공합니다.
          </p>
        </div>

        <div css={styles.grid}>
          <article css={styles.option('cloud')}>
            <span css={styles.optionLabel('cloud')}>✨ 처음 도입할 때</span>
            <h3 css={styles.optionTitle('cloud')}>채팅상담이 낯설어요</h3>
            <p css={styles.optionDesc('cloud')}>
              복잡한 설치 과정 없이, 가입 후 즉시 사용할 수 있는 클라우드 기반
              상담 솔루션입니다.
            </p>
            <Link
              href="/contact"
              css={[styles.optionBtnBase, styles.optionBtnTone('cloud')]}
              data-gtm-event="CHAT_FREE_START"
            >
              무료로 시작하기
              <ArrowRight />
            </Link>
          </article>

          <article css={styles.option('onprem')}>
            <span css={styles.optionLabel('onprem')}>
              🔒 구축형이 필요한 경우
            </span>
            <h3 css={styles.optionTitle('onprem')}>보안·연동이 중요해요</h3>
            <p css={styles.optionDesc('onprem')}>
              고객사의 클라우드에 직접 구축되어 보안과 시스템 통합, 맞춤 설계를
              모두 충족하는 구축형 상담 솔루션입니다.
            </p>
            <Link
              href="/hcc"
              css={[styles.optionBtnBase, styles.optionBtnTone('onprem')]}
              data-gtm-event="CHAT_HCC_LEARN_MORE"
            >
              해피톡 HCC 알아보기
              <ArrowRight />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
