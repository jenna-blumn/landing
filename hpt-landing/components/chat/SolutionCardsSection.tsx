'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import styles from './SolutionCardsSection.style';
import { useLayoutStore } from '@/stores/layoutStore';
import LeftDirectionIcon from '@/assets/svg/left-direction_s16.svg';

import { SOLUTION_CARDS } from '@/constants/product';
import ReviewTossLogo from '@/assets/images/review-toss-logo.png';

const CHAT_OPERATION_IMAGE =
  'https://landing.happytalk.io/_next/static/media/chatting-v2.cb6c1196.png';

const IconGradient = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="oklch(54.6% 0.245 262.881)" />
      <stop offset="100%" stopColor="#18181b" />
    </linearGradient>
  </defs>
);

const ApproachIconGradient = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="oklch(70.7% 0.165 254.624)" />
      <stop offset="100%" stopColor="oklch(76.5% 0.177 163.223)" />
    </linearGradient>
  </defs>
);

const CycleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <ApproachIconGradient id="approachGrad1" />
    <path
      fill="none"
      stroke="url(#approachGrad1)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M14 6.676C8.022 10.134 4 16.597 4 24M14 6.676V14m0-7.324H6.676m0 27.324C10.134 39.978 16.597 44 24 44M6.676 34H14m-7.324 0v7.324m27.324 0C39.978 37.866 44 31.403 44 24M34 41.324V34m0 7.324h7.324m0-27.324C37.866 8.022 31.403 4 24 4m17.324 10H34m7.324 0V6.676"
    />
  </svg>
);

const NetworkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <IconGradient id="issueGrad2" />
    <g
      fill="none"
      stroke="url(#issueGrad2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
    >
      <path d="M20 10h24M20 24h24M20 38h24M5 7l6 6m0-6l-6 6" />
      <circle cx="8" cy="24" r="4" />
      <circle cx="8" cy="38" r="4" />
    </g>
  </svg>
);

const ApproachIssueNetworkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <ApproachIconGradient id="approachGrad2" />
    <path
      fill="none"
      stroke="url(#approachGrad2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m26.829 37.172l10.343-10.343m-16 0L10.829 37.172m16-16l10.343-10.343M10.829 21.172l10.343-10.343M12 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0 16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0 16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0-16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0"
    />
  </svg>
);

const SunRaysIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <ApproachIconGradient id="approachGrad3" />
    <path
      fill="none"
      stroke="url(#approachGrad3)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20m0-32v3m8.485.515l-2.121 2.121M36 24h-3m-.515 8.485l-2.121-2.121M24 36v-3m-8.485-.515l2.121-2.121M12 24h3m.515-8.485l2.121 2.121"
    />
  </svg>
);

const ScatterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <ApproachIconGradient id="approachGrad4" />
    <g fill="none">
      <path
        stroke="url(#approachGrad4)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M13 8c1.5 0 4.05 0 5.014 5.061C18.99 18.18 19.33 22.848 21 24m14 16c-1.5 0-4.05.001-5.014-5.061C29.01 29.82 28.67 25.152 27 24M13 40c1.5 0 4.05.001 5.014-5.061C18.99 29.82 19.33 25.152 21 24M35 8c-1.5 0-4.05 0-5.014 5.061C29.01 18.18 28.67 22.848 27 24"
      />
      <circle r="4" fill="url(#approachGrad4)" transform="matrix(-1 0 0 1 21 24)" />
      <circle r="4" fill="url(#approachGrad4)" transform="matrix(-1 0 0 1 27 24)" />
      <path
        stroke="url(#approachGrad4)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M21 24h-8m14 0h8M7 24H5m38 0h-2M7 8H5m38 0h-2M7 40H5m38 0h-2"
      />
    </g>
  </svg>
);

const IssueRepeatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <IconGradient id="issueOriginalGrad1" />
    <g
      fill="none"
      stroke="url(#issueOriginalGrad1)"
      strokeLinejoin="round"
      strokeWidth={4}
    >
      <path d="M8 28a4 4 0 1 0 0-8a4 4 0 0 0 0 8ZM42 8a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm0 18a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
      <path strokeLinecap="round" d="M32 6H20v36h12M12 24h20" />
    </g>
  </svg>
);

const IssueNetworkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <IconGradient id="issueOriginalGrad2" />
    <path
      fill="none"
      stroke="url(#issueOriginalGrad2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m26.829 37.172l10.343-10.343m-16 0L10.829 37.172m16-16l10.343-10.343M10.829 21.172l10.343-10.343M12 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0 16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0 16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0m0-16a4 4 0 1 1-8 0a4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0a4 4 0 0 1 8 0"
    />
  </svg>
);

const IssueSunRaysIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 56 56"
  >
    <IconGradient id="issueOriginalGrad3" />
    <path
      fill="url(#issueOriginalGrad3)"
      d="M27.988 1.574c-.937 0-1.664.75-1.664 1.688v8.32c0 .938.727 1.688 1.664 1.688c.961 0 1.688-.75 1.688-1.688v-8.32c0-.938-.727-1.688-1.688-1.688M14.793 5.09c-.844.492-1.078 1.5-.633 2.32l4.172 7.219c.492.82 1.476 1.101 2.297.61a1.64 1.64 0 0 0 .61-2.274l-4.15-7.242c-.491-.797-1.476-1.078-2.296-.633m26.437.023c-.843-.469-1.828-.187-2.32.61l-4.172 7.242a1.677 1.677 0 0 0 .633 2.297c.82.445 1.805.187 2.297-.633l4.148-7.219c.47-.82.235-1.828-.586-2.297M5.113 14.77c-.469.843-.187 1.828.61 2.32l7.218 4.172c.82.445 1.829.21 2.297-.61c.469-.843.211-1.828-.61-2.32L7.41 14.16c-.82-.445-1.828-.21-2.297.61m45.797.023c-.492-.844-1.5-1.078-2.32-.633l-7.219 4.172c-.82.492-1.102 1.477-.61 2.32c.47.797 1.454 1.055 2.274.61l7.219-4.172c.82-.492 1.101-1.477.656-2.297m3.516 13.195c0-.937-.75-1.664-1.688-1.664h-8.344c-.937 0-1.664.727-1.664 1.664c0 .961.727 1.688 1.664 1.688h8.344c.938 0 1.688-.727 1.688-1.688m-52.852 0c0 .961.727 1.688 1.664 1.688h8.344c.938 0 1.688-.727 1.688-1.688c0-.937-.75-1.664-1.688-1.664H3.238c-.937 0-1.664.727-1.664 1.664m49.313 13.219c.468-.82.187-1.805-.633-2.297l-7.219-4.172c-.82-.445-1.805-.21-2.297.61c-.445.843-.187 1.828.633 2.32l7.218 4.172c.82.445 1.829.21 2.298-.633m-45.774 0c.469.844 1.477 1.078 2.297.633l7.219-4.172c.82-.492 1.101-1.477.61-2.297c-.47-.844-1.477-1.078-2.298-.633L5.723 38.91c-.797.492-1.079 1.477-.61 2.297m36.094 9.68c.844-.469 1.078-1.477.61-2.297l-4.15-7.219c-.491-.82-1.476-1.102-2.296-.633c-.844.492-1.078 1.477-.633 2.297l4.172 7.219c.492.82 1.477 1.102 2.297.633m-26.414 0c.82.468 1.805.187 2.297-.633l4.148-7.219c.469-.82.235-1.804-.586-2.273c-.867-.469-1.828-.211-2.32.61L14.16 48.59c-.445.82-.21 1.828.633 2.297m13.195 3.539c.961 0 1.688-.75 1.688-1.688v-8.32c0-.937-.727-1.687-1.688-1.687c-.937 0-1.664.75-1.664 1.687v8.32c0 .938.727 1.688 1.664 1.688"
    />
  </svg>
);

const IssueScatterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 48 48"
  >
    <IconGradient id="issueOriginalGrad4" />
    <path
      fill="none"
      stroke="url(#issueOriginalGrad4)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m20 12l4 4l4-4m-4 4V4m-4 32l4-4l4 4m-4-4v12m12-24l-4 4l4 4m-4-4h12m-32-4l4 4l-4 4m4-4H4m20 2a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
    />
  </svg>
);

const ISSUE_ICON_SET = {
  repeat: <IssueRepeatIcon />,
  quality: <NetworkIcon />,
  channel: <IssueSunRaysIcon />,
  operation: <IssueScatterIcon />,
};

const APPROACH_ICON_SET = {
  repeatAutomation: <CycleIcon />,
  qualityStandard: <ApproachIssueNetworkIcon />,
  channelIntegration: <SunRaysIcon />,
  operationOptimize: <ScatterIcon />,
};

const ISSUE_CARDS = [
  {
    icon: ISSUE_ICON_SET.repeat,
    title: '반복 문의로 상담 속도가 느림',
    description: '반복 문의로 중요한 상담에\n집중하기 어렵습니다.',
  },
  {
    icon: ISSUE_ICON_SET.quality,
    title: '상담사마다 응대 품질이 다름',
    description: '담당자마다 답변이 달라,\n고객 경험이 일정하지 않습니다.',
  },
  {
    icon: ISSUE_ICON_SET.channel,
    title: '채널이 분산되어 관리가 힘듬',
    description: '채널별 관리로\n운영 효율이 떨어집니다.',
  },
  {
    icon: ISSUE_ICON_SET.operation,
    title: '상담 운영 관리가 체계적이지 않음',
    description: '상담 배정 · 관리 기준이 없어\n운영이 비효율적입니다.',
  },
];

const APPROACH_CARDS = [
  {
    icon: APPROACH_ICON_SET.repeatAutomation,
    title: '반복 문의 자동 처리',
    description: '단순 문의는 자동으로 응대하여\n상담 효율을 높입니다.',
    badges: ['자동응답', '반복문의처리'],
  },
  {
    icon: APPROACH_ICON_SET.qualityStandard,
    title: 'AI로 상담 품질 표준화',
    description: '일관된 답변으로\n상담 품질을 유지합니다.',
    badges: ['상담 분류', '템플릿 활용'],
  },
  {
    icon: APPROACH_ICON_SET.channelIntegration,
    title: '다양한 채널 통합 운영',
    description: '여러 채널을 하나로 관리해\n운영을 단순화합니다.',
    badges: ['멀티브랜드', '다양한 채널 연동'],
  },
  {
    icon: APPROACH_ICON_SET.operationOptimize,
    title: '상담 운영 최적화',
    description: '상담배정과 조직 관리를\n효율적으로 운영합니다.',
    badges: ['상담사 관리', '자동 배정'],
  },
];

export default function SolutionCardsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const bridgeRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: bridgeProgress } = useScroll({
    target: bridgeRef,
    offset: ['start 90%', 'end 30%'],
  });
  const bridgePathLength = useTransform(bridgeProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useLayoutStore((state) => state.isDesktop);

  if (isDesktop === null) return null;

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === SOLUTION_CARDS.length - 1;

  const slideWidth = isDesktop ? 364 : 300;
  const slidesOffset = isDesktop
    ? 204
    : Math.round((window.innerWidth - slideWidth) / 2);

  const onSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  const onClickPrev = () => {
    swiperRef.current?.slidePrev();
  };

  const onClickNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section css={styles.container}>
      <figure css={styles.testimonial}>
        <blockquote css={styles.testimonialQuote}>
          “해피톡 채팅상담솔루션과 챗봇을 도입해 상담 효율성을 대폭
          향상시켰습니다. 챗봇 도입 후 상담사 상담 접수 건수는 30% 이상
          감소했습니다”
        </blockquote>
        <figcaption css={styles.testimonialAuthor}>
          <img
            src={ReviewTossLogo.src}
            alt="토스"
            css={styles.testimonialLogo}
          />
          <span>토스</span>
        </figcaption>
      </figure>
      <div css={styles.contentContainer}>
        <div css={styles.header}>
          <span css={styles.badge}>상담 운영 과제</span>
          <h2 css={styles.title}>이런 상담 운영 문제를 겪고 있지 않나요?</h2>
          <p css={styles.subtitle}>
            많은 기업이 공통적으로 겪는 상담 운영의 핵심 과제입니다.
          </p>
        </div>
        <div css={styles.issueCardsGrid}>
          {ISSUE_CARDS.map((card) => (
            <article key={card.title} css={styles.issueCard}>
              <span css={styles.issueIcon}>{card.icon}</span>
              <h3 css={styles.issueTitle()}>{card.title}</h3>
              <p css={styles.issueDescription()}>
                {card.description.split('\n').map((line, idx, arr) => (
                  <span key={idx}>
                    {line}
                    {idx < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
        <div css={styles.operationBridge} ref={bridgeRef}>
          <div css={styles.bridgeSvgWrap}>
            <svg
              viewBox="0 0 1280 248"
              preserveAspectRatio="none"
              aria-hidden="true"
              css={[styles.bridgeLines, styles.bridgeBaseLines]}
            >
              <path d="M152.5 0V84Q152.5 124 192.5 124H600Q640 124 640 164V248" />
              <path d="M477.5 0V84Q477.5 124 517.5 124H600Q640 124 640 164" />
              <path d="M802.5 0V84Q802.5 124 762.5 124H680Q640 124 640 164" />
              <path d="M1127.5 0V84Q1127.5 124 1087.5 124H680Q640 124 640 164" />
            </svg>
            <svg
              viewBox="0 0 1280 248"
              preserveAspectRatio="none"
              aria-hidden="true"
              css={[styles.bridgeLines, styles.bridgeOverlayLines]}
            >
              <motion.path
                d="M152.5 0V84Q152.5 124 192.5 124H600Q640 124 640 164V248"
                style={{ pathLength: bridgePathLength }}
              />
              <motion.path
                d="M477.5 0V84Q477.5 124 517.5 124H600Q640 124 640 164"
                style={{ pathLength: bridgePathLength }}
              />
              <motion.path
                d="M802.5 0V84Q802.5 124 762.5 124H680Q640 124 640 164"
                style={{ pathLength: bridgePathLength }}
              />
              <motion.path
                d="M1127.5 0V84Q1127.5 124 1087.5 124H680Q640 124 640 164"
                style={{ pathLength: bridgePathLength }}
              />
            </svg>
          </div>
          <img src={CHAT_OPERATION_IMAGE} alt="" css={styles.bridgeImage} />
          <div css={styles.bridgeSvgWrap}>
            <svg
              viewBox="0 0 1280 248"
              preserveAspectRatio="none"
              aria-hidden="true"
              css={[styles.bridgeLines, styles.bridgeBaseLines]}
            >
              <path d="M640 0V248" />
            </svg>
            <svg
              viewBox="0 0 1280 248"
              preserveAspectRatio="none"
              aria-hidden="true"
              css={[styles.bridgeLines, styles.bridgeOverlayLines]}
            >
              <motion.path
                d="M640 0V248"
                style={{ pathLength: bridgePathLength }}
              />
            </svg>
          </div>
        </div>
      </div>
      <div css={styles.contentContainer}>
        <div css={styles.header}>
          <span css={styles.badge}>해피톡의 접근</span>
          <h2 css={styles.title}>해피톡은 상담 운영을 이렇게 바꿉니다</h2>
          <p css={styles.subtitle}>
            문제 해결 중심의 설계로 상담 운영을 근본적으로 개선합니다.
          </p>
        </div>
        <div css={styles.issueCardsGrid}>
          {APPROACH_CARDS.map((card) => (
            <article key={card.title} css={[styles.issueCard, styles.invertedCard]}>
              <span css={styles.issueIcon}>{card.icon}</span>
              <h3 css={styles.issueTitle(true)}>{card.title}</h3>
              <p css={styles.issueDescription(true)}>
                {card.description.split('\n').map((line, idx, arr) => (
                  <span key={idx}>
                    {line}
                    {idx < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div css={styles.decorativeBadgeGroup}>
                {card.badges.map((badge) => (
                  <span key={badge} css={styles.decorativeBadge}>
                    {badge}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        {/* BACKUP: Swiper 솔루션 카드 영역 (필요 시 복원)
        <div css={styles.cardsWrapper}>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={onSlideChange}
            slidesPerView="auto"
            spaceBetween={isDesktop ? 20 : 12}
            slidesOffsetBefore={slidesOffset}
            slidesOffsetAfter={slidesOffset}
            css={styles.swiper}
          >
            {SOLUTION_CARDS.map((card) => (
              <SwiperSlide key={card.id} style={{ width: slideWidth }}>
                <div css={styles.card(card.isWhiteCard)}>
                  <div css={styles.cardText}>
                    <h3 css={styles.cardTitle(card.isWhiteCard)}>
                      {card.title}
                    </h3>
                    <p css={styles.cardDescription(card.isWhiteCard)}>
                      {card.description.split('\n').map((line, idx) => (
                        <span key={idx}>
                          {line}
                          {idx < card.description.split('\n').length - 1 && (
                            <br />
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                  <img
                    src={isDesktop ? card.image : card.imageMobile}
                    css={styles.cardImage}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div css={styles.pagination}>
          <button
            css={styles.pageButton}
            onClick={onClickPrev}
            disabled={isFirst}
          >
            <LeftDirectionIcon />
          </button>
          <button
            css={styles.pageButton}
            onClick={onClickNext}
            disabled={isLast}
          >
            <LeftDirectionIcon />
          </button>
        </div>
        */}
      </div>
    </section>
  );
}
