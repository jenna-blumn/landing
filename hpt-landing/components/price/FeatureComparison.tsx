'use client';

import { useState } from 'react';

import styles from './FeatureComparison.style';

type FeatureValue = boolean | string;

interface FeatureRow {
  name: string;
  free: FeatureValue;
  starter: FeatureValue;
  pro: FeatureValue;
}

interface FeatureCategory {
  category: string;
  features: FeatureRow[];
}

const FEATURE_DATA: FeatureCategory[] = [
  {
    category: '채팅 채널 연동',
    features: [
      {
        name: '기본 채널(웹채팅, 카카오톡)',
        free: true,
        starter: true,
        pro: true,
      },
      {
        name: '확장 채널(네이버톡톡, 인스타그램)',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: 'AI / 워크플로우',
    features: [
      {
        name: '워크플로우 빌더(챗봇, AI 에이전트)',
        free: true,
        starter: true,
        pro: true,
      },
      {
        name: '채널/조건별 멀티 에이전트 구성',
        free: true,
        starter: true,
        pro: true,
      },
      { name: '지식베이스 활용', free: true, starter: true, pro: true },
      { name: 'AI 에이전트 자동 답변', free: false, starter: true, pro: true },
    ],
  },
  {
    category: '운영 연동',
    features: [
      { name: '고객 정보 조회', free: true, starter: true, pro: true },
      {
        name: '주문 및 배송 정보 조회(스마트스토어, 카페 24 등)',
        free: false,
        starter: true,
        pro: true,
      },
      { name: '고객 태그 관리', free: false, starter: true, pro: true },
    ],
  },
  {
    category: '팀 / 조직 관리',
    features: [
      { name: '상담사 계정 추가', free: false, starter: true, pro: true },
      { name: '상담사 변경', free: false, starter: true, pro: true },
      { name: '매니저 계정 추가', free: false, starter: false, pro: true },
      { name: '상담 그룹 단위 관리', free: false, starter: false, pro: true },
    ],
  },
  {
    category: '통계 / 운영 고도화',
    features: [
      { name: '기간별 통계', free: false, starter: true, pro: true },
      { name: '상담사별 통계', free: false, starter: true, pro: true },
      {
        name: '상담 품질 통계 및 상담 평가',
        free: false,
        starter: false,
        pro: true,
      },
      {
        name: '상담내역 조회/다운로드',
        free: false,
        starter: false,
        pro: true,
      },
      {
        name: '통계 리포트/데이터 다운로드',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
  {
    category: '자동화',
    features: [
      {
        name: '시스템 자동/하이브리드 배분',
        free: false,
        starter: false,
        pro: true,
      },
      { name: 'Busy Time 안내', free: false, starter: false, pro: true },
      { name: '상담 대기 인원 안내', free: false, starter: false, pro: true },
      { name: '상담 건수 초과 안내', free: false, starter: false, pro: true },
    ],
  },
  {
    category: '브랜딩',
    features: [
      { name: '회사 로고 사용', free: false, starter: true, pro: true },
      {
        name: '웹채팅 고객 화면 기능/디자인 커스텀',
        free: false,
        starter: true,
        pro: true,
      },
    ],
  },
];

const Check = () => (
  <svg css={styles.check} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const Dash = () => <span css={styles.dash}>—</span>;

function CellValue({ value }: { value: FeatureValue }) {
  if (typeof value === 'boolean') {
    return value ? <Check /> : <Dash />;
  }
  return <span css={styles.cellText}>{value}</span>;
}

const Chevron = ({ expanded }: { expanded: boolean }) => (
  <svg
    css={styles.chevron(expanded)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default function FeatureComparison() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.toggleWrap}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            css={styles.toggle}
          >
            <span>플랜 세부 기능 {expanded ? '접기' : '보기'}</span>
            <Chevron expanded={expanded} />
          </button>
        </div>

        {expanded && (
          <>
            <div css={styles.header}>
              <h2 css={styles.title}>플랜별 기능 비교</h2>
              <p css={styles.subtitle}>
                각 플랜에서 제공하는 기능을 상세히 비교해보세요.
              </p>
            </div>

            <div css={styles.tableWrap}>
              <table css={styles.table}>
                <thead>
                  <tr css={styles.headerRow}>
                    <th css={styles.thFeature}>기능</th>
                    <th css={styles.thPlan}>Free</th>
                    <th css={styles.thPlan}>Starter</th>
                    <th css={styles.thPlanHighlight}>Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_DATA.map((category) => (
                    <CategorySection
                      key={category.category}
                      category={category}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CategorySection({ category }: { category: FeatureCategory }) {
  return (
    <>
      <tr css={styles.categoryRow}>
        <td colSpan={4} css={styles.categoryCell}>
          {category.category}
        </td>
      </tr>
      {category.features.map((feature, idx) => (
        <tr
          key={feature.name}
          css={styles.featureRow(idx % 2 === 1)}
        >
          <td css={styles.featureNameCell}>{feature.name}</td>
          <td css={styles.valueCell}>
            <CellValue value={feature.free} />
          </td>
          <td css={styles.valueCell}>
            <CellValue value={feature.starter} />
          </td>
          <td css={styles.valueCell}>
            <CellValue value={feature.pro} />
          </td>
        </tr>
      ))}
    </>
  );
}
