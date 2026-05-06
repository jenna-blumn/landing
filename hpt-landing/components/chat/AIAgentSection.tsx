'use client';

import { motion, type Variants } from 'framer-motion';

import styles from './AIAgentSection.style';

const CAPS = [
  {
    title: '상담사의 일을 덜어줘요',
    desc: '분류 / 요약 / 감정 분석 자동 처리',
    badge: 'AI 어시스턴트',
  },
  {
    title: '고객을 직접 응대해요',
    desc: '질문 이해 / 응대 판단 / 자동 답변',
    badge: 'AI 에이전트',
  },
  {
    title: '등록된 정보 기반으로 일관된 답변을 제공해요',
    desc: 'FAQ / 정책 / 카테고리별 지식 관리',
    badge: '지식 기반',
  },
];

const chatBubbleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 12, transformOrigin: '80% 100%' },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 520, damping: 28 },
  },
};

const processingReveal: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.24, ease: 'easeOut' },
  },
};

const resultReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 30 },
  },
};

const flowSequence: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.34, delayChildren: 0.2 } },
};

const viewportCfg = { once: true, amount: 0.25 } as const;

export default function AIAgentSection() {
  return (
    <motion.section
      css={styles.container}
    >
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>해피톡만의 AI, 상담의 핵심을 바꿉니다.</h2>
          <p css={styles.subtitle}>
            AI어시스턴트와 AI에이전트가
            <br />
            상담 품질과 효율을 동시에 끌어올립니다.
          </p>
        </div>

        <div css={styles.grid}>
          <div css={styles.caps}>
            {CAPS.map((cap) => (
              <div key={cap.title} css={styles.cap}>
                <div css={styles.capBody}>
                  <div css={styles.capTitleRow}>
                    <strong>{cap.title}</strong>
                    <span css={styles.capBadge}>{cap.badge}</span>
                  </div>
                  <span>{cap.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            css={styles.flowDiagram}
            initial="hidden"
            whileInView="show"
            viewport={viewportCfg}
            variants={flowSequence}
          >
            <motion.div css={styles.userMsg} variants={chatBubbleReveal}>
              <span>주문 취소하고 싶은데요</span>
              <span css={styles.userAvatar}>👤</span>
            </motion.div>
            <div css={styles.arrow}>
              <span className="dot" />
              <span className="line" />
              <span className="dot" />
            </div>
            <motion.div css={styles.aiProcess} variants={processingReveal}>
              <div css={styles.processTitle}>
                AI가 맥락을 이해하고 판단합니다
                <span css={styles.spinner} aria-hidden="true" />
              </div>
              <div css={styles.processTags}>
                <span css={styles.processTag}>지식베이스 검색</span>
                <span css={styles.processTag}>에이전트 도구 호출</span>
              </div>
            </motion.div>
            <div css={styles.arrow}>
              <span className="dot" />
              <span className="line" />
            </div>
            <motion.div css={styles.split} variants={resultReveal}>
              <span css={styles.branch('ai')}>✨ 자동 답변</span>
              <span css={styles.branch('human')}>👤 상담사 연결</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
