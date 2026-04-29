import Link from 'next/link';
import styles from './ChatbotSection.style';

import CommonFeatureIcon from '@/assets/images/price/common-feature-icon.png';

export default function ChatbotSection() {
  return (
    <section css={styles.container}>
      <div css={styles.titleArea}>
        <h2 css={styles.mainTitle}>
          <span>AI 챗봇,</span> 직접 만들기 막막하다면?
        </h2>
        <p css={styles.subtitle}>
          상담 흐름을 아는 전문가가 AI챗봇을 우리 회사에 맞게 처음부터 끝까지
          세팅해드립니다.
        </p>
      </div>

      {/* 공통 사항 */}
      <div css={styles.card}>
        <div css={styles.cardInner}>
          <div css={styles.cardLeft}>
            <img src={CommonFeatureIcon.src} alt="공통 사항" />
            <div css={styles.cardInfo}>
              <h3>공통 사항</h3>
              <p>챗봇 제작 다~해줌</p>
            </div>
          </div>
          <div css={styles.cardContent}>
            <div css={styles.cardColumn}>
              <h4>제작범위</h4>
              <ul>
                <li>카카오톡, 웹 등 제공 채널 협의</li>
                <li>직접 편집기능 제공</li>
                <li>추가 개발지원 협의 후 가능</li>
              </ul>
            </div>
            <div css={styles.cardColumn}>
              <h4>제작기간 기준</h4>
              <ul>
                <li>콘텐츠 확정 이후의 구축기간</li>
                <li>기획 종료 후 변경 요청 시 협의 필요</li>
              </ul>
            </div>
            <div css={styles.cardColumn}>
              <h4>제작대행 완료 후 지원</h4>
              <ul>
                <li>무료 S/W 업데이트</li>
                <li>카카오 발생 비용 고객 부담 (이벤트 API 비용 등 발생 시)</li>
                <li>사용 메뉴얼 제공</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div css={styles.buttonGroup}>
        <Link href="/contact" css={styles.primaryButton}>
          다해줌 문의하기
        </Link>
      </div>
    </section>
  );
}
