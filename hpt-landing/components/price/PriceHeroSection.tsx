'use client';

import styles from './PriceHeroSection.style';

export default function PriceHeroSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h1 css={styles.title}>
          AI 상담과 상담 운영을
          <br />
          <span>하나의 플랫폼으로</span>
        </h1>
        <p css={styles.subtitle}>
          상담 자동화부터 AI 상담까지, 서비스 규모에 맞는 플랜을 선택하세요.
        </p>
      </div>
    </section>
  );
}
