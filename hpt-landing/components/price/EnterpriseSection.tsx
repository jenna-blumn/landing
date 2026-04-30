'use client';

import styles from './EnterpriseSection.style';
import common from '@/styles/common';

const ENTERPRISE_FEATURES = [
  {
    title: '서비스 커스터마이징',
    desc: '기업 환경에 맞게 필요한 기능 선택 및 구성',
    badges: ['동시 상담 제한', '상담사 재연결', '실시간 상담 번역'],
  },
  {
    title: 'API 연동 지원',
    desc: '자사 시스템과 직접 연동하여 상담 데이터 활용 가능',
    badges: ['상담 내역 조회', '고객 조회', 'REST API 제공'],
  },
  {
    title: '자체 서비스 연동',
    desc: '상담 중 필요한 업무 별도 이동 없이 한 화면에서 처리 가능',
    badges: ['본인인증', '회원가입', '기존 시스템 연동'],
  },
];

const STEPS = [
  { icon: '📋', label: '상담', duration: '1~2일' },
  { icon: '🔍', label: '요구사항 분석', duration: '1~2주' },
  { icon: '⚙️', label: '맞춤 설정', duration: '2~4주' },
  { icon: '🚀', label: '운영 지원', duration: '지속' },
];

const CUSTOMERS_ROW1 = [
  'CJ 올리브영',
  '쿠팡이츠',
  '우아한형제들',
  '코웨이',
  'KISA',
];
const CUSTOMERS_ROW2 = [
  'LG유플러스',
  '코레일(한국철도공사)',
  '루이비통',
  'SK매직',
  '퍼시스',
];

const ArrowIcon = () => (
  <svg
    css={styles.arrowIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

export default function EnterpriseSection() {
  return (
    <section id="enterprise" css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>Enterprise</span>
          <h2 css={styles.title}>기업 맞춤 상담 플랫폼</h2>
          <p css={styles.subtitle}>
            기업 규모에 맞는 상담 시스템을 설계하고 운영할 수 있도록
            <br />
            맞춤 기능 및 전담 기술 지원을 제공합니다.
          </p>
        </div>

        <div css={styles.featuresCard}>
          <h3 css={styles.featuresTitle}>Enterprise 주요 기능</h3>
          <p css={styles.featuresSub}>Pro의 모든 기능 포함</p>
          <ul css={styles.featuresList}>
            {ENTERPRISE_FEATURES.map((feature) => (
              <li key={feature.title} css={styles.featureItem}>
                <div css={styles.featureBody}>
                  <p css={styles.featureName}>{feature.title}</p>
                  <p css={styles.featureDesc}>{feature.desc}</p>
                </div>
                <div css={styles.badgesRow}>
                  {feature.badges.map((b) => (
                    <span key={b} css={styles.featureBadge}>
                      {b}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div css={styles.stepsBlock}>
          <h3 css={styles.stepsTitle}>도입 절차</h3>
          <p css={styles.stepsNote}>※ 프로젝트 범위에 따라 상이할 수 있습니다.</p>
          <div css={styles.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step.label} css={styles.stepGroup}>
                <div css={styles.step}>
                  <div css={styles.stepIcon}>{step.icon}</div>
                  <span css={styles.stepLabel}>{step.label}</span>
                  <span css={styles.stepDuration}>{step.duration}</span>
                </div>
                {i < STEPS.length - 1 && <div css={styles.stepConnector} />}
              </div>
            ))}
          </div>
        </div>

        <div css={styles.customersBlock}>
          <h3 css={styles.customersTitle}>Enterprise 고객사</h3>
          <div css={styles.customersList}>
            <div css={styles.customersRow}>
              {CUSTOMERS_ROW1.map((customer) => (
                <span key={customer} css={styles.customerChip}>
                  {customer}
                </span>
              ))}
            </div>
            <div css={styles.customersRow}>
              {CUSTOMERS_ROW2.map((customer) => (
                <span key={customer} css={styles.customerChip}>
                  {customer}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div css={styles.ctaCard}>
          <h3 css={styles.ctaTitle}>우리 회사에 필요한 기능이 있나요?</h3>
          <p css={styles.ctaSub}>
            기업 규모에 맞는 상담 시스템, 해피톡이 함께 설계합니다
          </p>
          <a
            href="https://www.happytalk.io/contact"
            target="_blank"
            rel="noopener noreferrer"
            css={[common.primaryCta, styles.ctaButton]}
          >
            도입 문의하기
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
