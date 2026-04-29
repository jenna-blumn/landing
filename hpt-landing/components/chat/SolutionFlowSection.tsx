'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import styles from './SolutionFlowSection.style';
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

const FLOW_CARDS = [
  {
    num: 1,
    title: '멀티채널 고객 유입',
    desc: '웹, 카카오톡, 네이버톡톡, 인스타그램 등 다양한 채널에서 들어오는 고객 문의를 한 곳에서 받으세요.',
    tags: ['웹채팅', '카카오톡', '네이버톡톡', '인스타그램'],
  },
  {
    num: 2,
    title: '상담사 배분 & 관리',
    desc: '팀별, 역할별로 상담을 자동 배분하고 실시간 모니터링으로 효율적으로 운영하세요.',
    tags: ['자동 배분', '실시간 모니터링', '팀 관리'],
  },
  {
    num: 3,
    title: '알림톡 · 비즈메시지',
    desc: '주문 확인, 배송 알림, 예약 안내 등 고객에게 필요한 메시지를 카카오 알림톡으로 자동 발송하세요.',
    tags: ['카카오 알림톡', '비즈메시지', '자동 발송'],
  },
  {
    num: 4,
    title: 'AI ARS 상담콜 연동',
    desc: '전화 상담과 채팅 상담을 하나로 연결합니다. AI ARS가 고객 문의를 분류하고 적절한 채널로 안내해요.',
    tags: ['AI ARS', '상담콜', '채널 전환'],
  },
  {
    num: 5,
    title: '운영 데이터 분석',
    desc: '축적된 상담 데이터를 기반으로 문의 유형 트렌드, 상담 품질, 고객 만족도를 분석하세요.',
    tags: ['통계 대시보드', '리포트'],
  },
];

export default function SolutionFlowSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useLayoutStore((state) => state.isDesktop);

  if (isDesktop === null) return null;

  const slideWidth = isDesktop ? 300 : 280;
  const slidesOffset = isDesktop
    ? 60
    : Math.max(0, Math.round((window.innerWidth - slideWidth) / 2));

  const lastVisible = isDesktop ? FLOW_CARDS.length - 4 : FLOW_CARDS.length - 1;

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>솔루션 구성</span>
          <h2 css={styles.title}>
            채팅상담의 모든 흐름을
            <br />
            하나로 설계하세요
          </h2>
          <p css={styles.subtitle}>
            고객 유입부터 상담사 배분, 알림톡 발송, ARS 연동까지
            <br />
            모든 과정을 한 곳에서 관리합니다.
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
            {FLOW_CARDS.map((card) => (
              <SwiperSlide key={card.num} style={{ width: slideWidth }}>
                <article css={styles.card}>
                  <span css={styles.num}>{card.num}</span>
                  <h3 css={styles.cardTitle}>{card.title}</h3>
                  <p css={styles.cardDesc}>{card.desc}</p>
                  <div css={styles.tags}>
                    {card.tags.map((tag) => (
                      <span key={tag} css={styles.tag}>
                        {tag}
                      </span>
                    ))}
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
            aria-label="이전 카드"
          >
            <ChevronLeft />
          </button>
          <button
            css={styles.pageButton}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={activeIndex >= lastVisible}
            aria-label="다음 카드"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
