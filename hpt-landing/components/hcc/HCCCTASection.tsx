'use client';

import styles from './HCCCTASection.style';
import { HCC_CONTACT_URL } from '@/constants/common';

export default function HCCCTASection() {
  return (
    <section css={styles.container} data-header-theme="dark">
      <div css={styles.inner}>
        <div css={styles.textContent}>
          클라우드 기반 해피톡 구축형 솔루션으로
          <br />
          신뢰성과 효율성을 겸비한 고객 커뮤니케이션 시스템을 제공합니다.
        </div>
        <a href={HCC_CONTACT_URL} target="_blank" rel="noopener noreferrer" css={styles.button}>
          도입문의
        </a>
      </div>
    </section>
  );
}
