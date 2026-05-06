'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './HeroSection.style';
import HeroNew from '@/assets/images/hcc/hero_new.png';

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function HeroSection() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, (y) => y * 0.1);

  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h1 css={styles.title}>
          금융·대기업이 선택한
          <br />
          <span className="highlight">엔터프라이즈 상담 인프라</span>
        </h1>
        <p css={styles.subtitle}>
          기간계 시스템과 유연하게 연결되는
          <br />
          기업 맞춤형 고객 상담 환경을 제공합니다.
        </p>
        <div css={styles.buttons}>
          <Link
            href="/contact"
            css={styles.primaryBtn}
            data-gtm-event="HCC_INQUIRY"
          >
            도입 문의
            <ArrowRight />
          </Link>
        </div>
      </div>
      <motion.div css={styles.flowImageWrap} style={{ y: imageY }}>
        <img src={HeroNew.src} alt="" css={styles.flowImage} />
      </motion.div>
    </section>
  );
}
