'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './ChatbotAllProcessSection.style';

const STEPS = [
  {
    num: '01',
    title: '워크플로우 설계',
    desc: '대화 흐름과 시나리오를 전문가가 설계합니다.',
  },
  {
    num: '02',
    title: 'AI 에이전트 설정',
    desc: '고객 문의를 이해하고 자동 응답하는 AI를 완성합니다.',
  },
  {
    num: '03',
    title: '채널 연동 및 테스트',
    desc: '운영 채널에 바로 연결하고 테스트합니다.',
  },
  {
    num: '04',
    title: '운영 최적화 및 개선',
    desc: '오픈 후, 운영 데이터를 기반으로 최적화합니다.',
  },
];

const FEATURES = [
  { icon: '🚀', title: '빠른 도입, 바로 운영', desc: '빠르게 도입하고 바로 운영할 수 있습니다.' },
  { icon: '🔒', title: '유연한 운영 구조', desc: '복잡한 설정없이 운영 가능한 환경을 제공합니다.' },
  { icon: '📈', title: '지속적인 개선', desc: '완성 이후에도 지속적으로 개선됩니다.' },
];

export default function ChatbotAllProcessSection() {
  const [revealed, setRevealed] = useState(0);
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setRevealed(1);
    };

    if (!('IntersectionObserver' in window) || !stepsRef.current) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(stepsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (revealed === 0 || revealed >= STEPS.length) return;
    const id = setTimeout(() => setRevealed((n) => n + 1), 900);
    return () => clearTimeout(id);
  }, [revealed]);

  return (
    <section id="service-desc" css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>All-in-One</span>
          <h2 css={styles.title}>컨설팅부터 세팅, 운영까지 전 과정 지원</h2>
          <p css={styles.subtitle}>
            직접 만들 필요 없습니다. 해피톡 전문가가 모든 과정을 대신합니다.
          </p>
        </div>

        <div ref={stepsRef} css={styles.stepsStack}>
          <AnimatePresence initial={false}>
            {STEPS.slice(0, revealed).map((step) => (
              <motion.article
                key={step.num}
                css={styles.stepCard}
                layout
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              >
                <span css={styles.stepNum}>{step.num}</span>
                <div css={styles.stepBody}>
                  <h3 css={styles.stepTitle}>{step.title}</h3>
                  <p css={styles.stepDesc}>{step.desc}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div css={styles.whyChoose}>
          <h3 css={styles.whyChooseTitle}>
            왜 <br />
            다-해줌을
            <br />
            선택할까요?
          </h3>
          <div css={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <article key={f.title} css={styles.featureCard}>
                <span css={styles.featureIcon}>{f.icon}</span>
                <h4 css={styles.featureTitle}>{f.title}</h4>
                <p css={styles.featureDesc}>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
