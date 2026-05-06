'use client';

import styles from './EnterpriseCTASection.style';

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

export default function EnterpriseCTASection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h2 css={styles.title}>
          엔터프라이즈 상담 인프라,
          <br />
          지금 도입 상담을 진행해보세요
        </h2>
        <p css={styles.description}>
          기업 환경을 분석하고 최적의 상담 인프라 설계 방안을 제안합니다.
        </p>
        <div css={styles.ctaGroup}>
          <a
            href="/dcs-product-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            css={styles.secondaryCta}
            data-gtm-event="HCC_PRODUCT_GUIDE_DOWNLOAD"
          >
            <FileIcon />
            서비스 소개서
          </a>
          <a
            href="https://mbisolution.recatch.cc/workflows/ikrixxrhfe"
            target="_blank"
            rel="noopener noreferrer"
            css={styles.primaryCta}
            data-gtm-event="HCC_SALES_INQUIRY"
          >
            도입 문의하기
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
