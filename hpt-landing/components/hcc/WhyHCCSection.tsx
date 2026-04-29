'use client';

import styles from './WhyHCCSection.style';

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

export default function WhyHCCSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>Target Enterprise</span>
          <h2 css={styles.title}>이런 기업에게 적합합니다</h2>
        </div>
        <div css={styles.grid}>
          <article css={styles.card}>
            <div css={styles.cardTop}>
              <span css={styles.icon}>
                <ShieldIcon />
              </span>
              <div css={styles.cardBody}>
                <h4>내부 보안 정책 및 인증 기준을 충족해야 하는 기업</h4>
              </div>
            </div>
            <a
              href="/dcs-product-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              css={styles.certLink}
            >
              <ShieldIcon />
              품질인증서
            </a>
          </article>

          <article css={styles.card}>
            <div css={styles.cardTop}>
              <span css={styles.icon}>
                <LayersIcon />
              </span>
              <div css={styles.cardBody}>
                <h4>
                  ERP / CRM 등 내부 시스템과
                  <br />
                  데이터 통합이 필요한 기업
                </h4>
              </div>
            </div>
          </article>

          <article css={styles.card}>
            <div css={styles.cardTop}>
              <span css={styles.icon}>
                <UsersIcon />
              </span>
              <div css={styles.cardBody}>
                <h4>
                  대규모 고객 응대를
                  <br />
                  안정적으로 운영해야 하는 조직
                </h4>
              </div>
            </div>
          </article>

          <article css={styles.card}>
            <div css={styles.cardTop}>
              <span css={styles.icon}>
                <MonitorIcon />
              </span>
              <div css={styles.cardBody}>
                <h4>AICC / IPCC 기반 상담 환경이 필요한 기업</h4>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
