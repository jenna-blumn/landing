'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ChatbotAllPopularSection.style';

type UseCase = {
  id: string;
  label: string;
  title: string;
  description: string;
  checks: string[];
  bubbles: { variant: 'bot' | 'user'; text: React.ReactNode }[];
};

const USE_CASES: UseCase[] = [
  {
    id: 'cs',
    label: 'CS/고객지원',
    title: '단순 반복 문의, 24시간 자동 해결',
    description:
      '반복되는 단순 문의를 에이전트가 24시간 빠르고 정확하게 답변합니다.',
    checks: ['반복 문의 자동 응답', '상담 업무 효율 향상', '고객 대기 시간 최소화'],
    bubbles: [
      {
        variant: 'bot',
        text: (
          <>
            안녕하세요! 고객 지원 센터입니다.
            <br />
            무엇을 도와드릴까요?
          </>
        ),
      },
      { variant: 'user', text: '배송 지연 공지를 봤는데, 제 물건도 늦어지나요?' },
      {
        variant: 'bot',
        text: (
          <>
            고객님의 [243-1123] 주문 건은 현재 <strong>정상 출고</strong>되어
            배송중입니다.
          </>
        ),
      },
      { variant: 'bot', text: '예상 도착일은 내일(금)입니다. 🚚' },
    ],
  },
  {
    id: 'commerce',
    label: '쇼핑몰/커머스',
    title: '쇼핑몰의 핵심 CS를 자동화합니다',
    description:
      '주문 취소, 반품, 교환 접수 등 커머스 특화 문의를 스마트하게 처리합니다.',
    checks: [
      '쇼핑몰 주문/배송 정보 연동',
      '교환/반품 자동 접수 시스템',
      '장바구니 리마인드 메시지',
    ],
    bubbles: [
      {
        variant: 'bot',
        text: (
          <>
            원하시는 업무를 선택해 주세요.
            <br />- 배송 조회
            <br />- 교환/반품 접수
          </>
        ),
      },
      { variant: 'user', text: '교환 접수 할게요' },
      { variant: 'bot', text: '교환하실 상품 1개를 선택해 주세요.' },
      { variant: 'bot', text: '확인 후 반품 택배 접수를 도와드리겠습니다. 😊' },
    ],
  },
  {
    id: 'marketing',
    label: '마케팅',
    title: '자연스러운 상품 추천과 홍보',
    description: '대화 흐름 속에서 신상품을 소개하고 기획전으로 유도합니다.',
    checks: [
      '맞춤형 타겟 메시지 발송',
      '잠재 고객 데이터 자동 분류',
      '자연스러운 이벤트 참여 전환 유도',
    ],
    bubbles: [
      {
        variant: 'bot',
        text: (
          <>
            이번 달 뷰티 기획전이 오픈되었어요! ✨
            <br />
            피부 타입에 맞는 상품을 추천해 드릴까요?
          </>
        ),
      },
      { variant: 'user', text: '네, 저는 건성 타입이에요.' },
      {
        variant: 'bot',
        text: '건성 피부에 딱 맞는 촉촉한 수분 크림 BEST 3를 보여드릴게요!',
      },
      { variant: 'bot', text: '[수분 크림 기획전 바로가기]' },
    ],
  },
  {
    id: 'event',
    label: '이벤트',
    title: '고객 참여를 이끄는 능동형 프로모션',
    description:
      '퀴즈, 룰렛 등 재미있는 이벤트로 채널을 활성화하고 충성 고객을 확보합니다.',
    checks: [
      '채널 친구 바로 등록 유도',
      '경품 자동 지급 시스템',
      '참여형 이벤트 통한 고객 만족도 증대',
    ],
    bubbles: [
      {
        variant: 'bot',
        text: (
          <>
            🎉 가을 맞이 깜짝 이벤트!
            <br />
            룰렛을 돌려 할인 쿠폰을 받아보세요.
          </>
        ),
      },
      { variant: 'user', text: '포인트 룰렛 돌리기' },
      {
        variant: 'bot',
        text: (
          <>
            축하합니다! 🥳
            <br />
            [10,000원 할인 쿠폰]에 당첨되셨습니다.
          </>
        ),
      },
      { variant: 'bot', text: '결제 시 바로 사용하실 수 있어요.' },
    ],
  },
  {
    id: 'booking',
    label: '예약 접수',
    title: '전화 대기 없는 간편한 예약 자동화',
    description: '에이전트에서 실시간 예약과 변경을 간편하게 진행합니다.',
    checks: [
      '24시간 실시간 예약 접수 가능',
      '예약 확인 알림 연동 및 발송',
      '전화 응대 스케줄링 업무 대폭 감소',
    ],
    bubbles: [
      { variant: 'bot', text: '예방 접종을 원하시는 날짜/시간을 알려주세요.' },
      { variant: 'user', text: '이번주 금요일 오후 3시요.' },
      {
        variant: 'bot',
        text: (
          <>
            ✔️ 10월 27일(금) 오후 3시
            <br />
            김해피님 진료 예약이 확정되었습니다.
          </>
        ),
      },
      { variant: 'bot', text: '예약 전날 카카오톡 알림을 보내드릴게요.' },
    ],
  },
  {
    id: 'service',
    label: '서비스',
    title: '똑똑한 서비스 가이드 및 편의 제공',
    description:
      '고객이 자주 찾는 정보를 에이전트가 먼저 제안하여 서비스 경험을 향상시킵니다.',
    checks: [
      '위치 기반 맞춤 정보 제공',
      '복잡한 서비스 매뉴얼 간소화',
      '고객의 긍정적인 브랜드 경험 향상',
    ],
    bubbles: [
      { variant: 'user', text: '가까운 매장이 어딘가요?' },
      {
        variant: 'bot',
        text: "현재 계신 곳에서 가장 가까운 매장은 '강남 본점'이며, 도보 5분 거리입니다. 🚩",
      },
      { variant: 'user', text: '영업 시간도 알려주세요.' },
      {
        variant: 'bot',
        text: (
          <>
            강남 본점 영업 시간은 언제나
            <br />
            오전 9시부터 오후 10시까지입니다!
          </>
        ),
      },
    ],
  },
];

export default function ChatbotAllPopularSection() {
  const [activeId, setActiveId] = useState(USE_CASES[0].id);
  const active = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  const [revealedCount, setRevealedCount] = useState(0);
  const [pendingVariant, setPendingVariant] = useState<
    'bot' | 'user' | null
  >(null);

  useEffect(() => {
    setRevealedCount(0);
    setPendingVariant(null);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    active.bubbles.forEach((bubble, i) => {
      if (i === 0) {
        elapsed += 250;
      } else {
        elapsed += 150;
        const variant = bubble.variant;
        timers.push(
          setTimeout(() => setPendingVariant(variant), elapsed),
        );
        elapsed += 750;
      }
      timers.push(
        setTimeout(() => {
          setPendingVariant(null);
          setRevealedCount(i + 1);
        }, elapsed),
      );
      elapsed += 280;
    });

    return () => timers.forEach(clearTimeout);
  }, [activeId, active.bubbles]);

  return (
    <section id="usecases" css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>이런 에이전트(챗봇)를 만들 수 있어요</h2>
          <p css={styles.subtitle}>
            업무 효율은 높이고 고객 만족도는 올리는 인기 에이전트 기능
          </p>
        </div>

        <div css={styles.tabs}>
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              css={styles.tab(uc.id === activeId)}
              onClick={() => setActiveId(uc.id)}
            >
              {uc.label}
            </button>
          ))}
        </div>

        <div css={styles.contentWrap}>
          <div css={styles.textCol}>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
            <ul css={styles.checkList}>
              {active.checks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div css={styles.mockup}>
            <div css={styles.mockupHeader}>
              <span css={styles.mockupHeaderDot} />
              <span css={styles.mockupHeaderTitle}>해피톡 상담</span>
            </div>
            <div css={styles.mockupBody}>
              {active.bubbles.slice(0, revealedCount).map((b, i) => (
                <motion.div
                  key={`${activeId}-${i}`}
                  css={styles.bubble(b.variant)}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {b.text}
                </motion.div>
              ))}
              <AnimatePresence>
                {pendingVariant && (
                  <motion.div
                    key={`${activeId}-typing`}
                    css={[
                      styles.bubble(pendingVariant),
                      styles.typingBubble,
                    ]}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span css={styles.typingDot} />
                    <span css={styles.typingDot} />
                    <span css={styles.typingDot} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
