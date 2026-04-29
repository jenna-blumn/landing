'use client';

import { useRef, useState, useEffect } from 'react';

import styles from './PlanDetailModal.style';

import PlanDetailSection, {
  type PlanDetailSectionHandle,
} from './PlanDetailSection';
import ScrollDownButton from './ScrollDownButton';

import CloseBtn from '@/assets/svg/close-btn_s24.svg';

export default function PlanDetailModal({ onClose }: { onClose: () => void }) {
  const sectionRef = useRef<PlanDetailSectionHandle>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (sectionRef.current) {
        setIsAtBottom(sectionRef.current.isAtBottom);
      }
    }, 200);
    return () => clearInterval(id);
  }, []);

  const handleScrollDown = () => {
    sectionRef.current?.scrollDown();
  };

  return (
    <div css={styles.container}>
      <div css={styles.modalHeader}>
        <h2>해피톡 플랜 자세히 보기</h2>
        <button onClick={onClose}>
          <CloseBtn />
        </button>
      </div>
      <PlanDetailSection ref={sectionRef} />
      <ScrollDownButton isAtBottom={isAtBottom} onClick={handleScrollDown} />
      <p css={styles.description}>
        <span>*</span> 모든 플랜에서 실시간 상담, 메시지/파일 전송, 상담 분류,
        기본 자동 메시지, 보안 기능 등 핵심 상담 기능을 공통 제공합니다.
      </p>
    </div>
  );
}
