'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import styles from './CaseStudySection.style';
import { useLayoutStore } from '@/stores/layoutStore';

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CASES = [
  {
    industry: '저축은행',
    client: '오케이저축은행',
    logo: 'https://www.oksavingsbank.com/assets/images/renewal2/common/logo.png',
    challenge: '대출 및 상품 문의 증가로 상담 처리 부담 확대',
    solution:
      '상품 안내와 대출 조회를 비대면으로 처리하고 필요 시 상담으로 자연스럽게 연결',
  },
  {
    industry: '카드',
    client: 'KB국민카드',
    logo: 'https://img1.kbcard.com/LT/images_r/common/kbcard_Logo_v3.png',
    challenge: '카드 발급·한도 관련 반복 문의로 업무 효율 저하',
    solution: '고객이 직접 발급 및 정보를 확인하도록 구성하여 상담 개입을 최소화',
  },
  {
    industry: '증권',
    client: '삼성증권',
    logo: 'https://www.samsungpop.com/ux/images/common/header/new_samsungpop.gif',
    challenge: '복잡한 금융 용어로 고객 이해도 차이 발생',
    solution: '용어를 쉽게 안내하고 대화 기반으로 필요한 정보를 빠르게 탐색',
  },
  {
    industry: '은행',
    client: '우리은행',
    logo: 'https://simg.wooribank.com/img/intro/header/h1_01.png',
    challenge: '기존 상담 환경의 채널 확장성과 대응 한계',
    solution: '채팅 기반 응대를 추가하여 다양한 채널에서 일관된 상담 경험 제공',
  },
  {
    industry: '생명보험',
    client: '삼성생명',
    logo: 'https://www.samsunglife.com/assets/img/logo-samsung-new.90bff41a.png',
    challenge: 'AI 응대와 상담사 연결 흐름 단절',
    solution: 'AICC 기반 응대와 상담 연결을 통합하여 끊김 없는 상담 흐름 제공',
  },
  {
    industry: '생명보험',
    client: '교보생명',
    logo: 'https://resource.kyobo.com/dgt/web/pc/common/img/common/ci_kyobo_header.png',
    challenge: '임직원 지원과 고객 응대가 동시에 요구되는 운영 부담',
    solution: '업무 지원과 고객 응대를 분리 구성하여 운영 효율과 응대 품질 개선',
  },
  {
    industry: '홈쇼핑',
    client: '현대홈쇼핑',
    logo: 'https://image.hmall.com/m/img/co/logo-hmall@2x.png?SF=webp',
    challenge: '주문 및 입점사 문의 처리 과정의 복잡성 증가',
    solution: '3자 협업 구조를 적용하여 고객·상담사·입점사가 함께 대응',
  },
  {
    industry: '핀테크',
    client: 'TOSS 증권',
    logo: 'https://static.toss.im/png-icons/securities/logo_securities_mono_black_korean_300.png',
    challenge: '상담 전환 시 화면 이동으로 인한 고객 이탈 발생',
    solution: '서비스 흐름 내 상담을 이어지게 구성하여 이탈 없이 상담 경험 제공',
  },
];

export default function CaseStudySection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useLayoutStore((state) => state.isDesktop);

  if (isDesktop === null) return null;

  const slideWidth = isDesktop ? 290 : 280;
  const slidesOffset = isDesktop
    ? 60
    : Math.max(0, Math.round((window.innerWidth - slideWidth) / 2));
  const visiblePerView = isDesktop ? 4 : 1;
  const lastIndex = CASES.length - visiblePerView;

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>Case Studies</span>
          <h2 css={styles.title}>산업별 구축 사례</h2>
          <p css={styles.subtitle}>
            금융, 보험, 커머스, 핀테크 등 다양한 산업에서
            <br />
            기업 상담 환경 설계 경험을 보유하고 있습니다.
          </p>
        </div>

        <div css={styles.sliderWrapper}>
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            slidesPerView="auto"
            spaceBetween={isDesktop ? 20 : 12}
            slidesOffsetBefore={slidesOffset}
            slidesOffsetAfter={slidesOffset}
            css={styles.swiper}
          >
            {CASES.map((c) => (
              <SwiperSlide
                key={`${c.industry}-${c.client}`}
                style={{ width: slideWidth }}
              >
                <article css={styles.card}>
                  <div css={styles.cardTop}>
                    <img src={c.logo} alt={c.client} css={styles.logo} />
                  </div>
                  <h3 css={styles.client}>{c.client}</h3>
                  <div css={styles.detail}>
                    <span css={styles.detailLabel}>Challenge</span>
                    <p css={styles.detailText}>{c.challenge}</p>
                  </div>
                  <div css={styles.detail}>
                    <span css={styles.detailLabel}>Solution</span>
                    <p css={styles.detailText}>{c.solution}</p>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div css={styles.pagination}>
          <button
            css={styles.pageButton}
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={activeIndex === 0}
            aria-label="이전 사례"
          >
            <ChevronLeft />
          </button>
          <button
            css={styles.pageButton}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={activeIndex >= lastIndex}
            aria-label="다음 사례"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
