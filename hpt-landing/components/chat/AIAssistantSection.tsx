'use client';

import styles from './AIAssistantSection.style';

export default function AIAssistantSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.badge}>AI 어시스턴트</span>
          <h2 css={styles.title}>상담 분류를 미리 설정해두세요</h2>
          <p css={styles.subtitle}>
            상담 분류를 미리 세팅해두면, <br />
            AI가 상담 내용을 읽고 가장 적합한 분류를 자동으로 찾아줘요.
          </p>
        </div>

        <div css={styles.grid}>
          <div css={styles.block}>
            <div css={styles.blockHeader}>
              <h3>AI가 상담을 자동 분류해요</h3>
              <p>
                상담 분류를 미리 세팅해두면, AI가 상담 내용을 읽고
                <br />
                가장 적합한 분류를 자동으로 찾아줘요.
              </p>
            </div>
            <div css={styles.classifyTags}>
              <span css={styles.classTag('primary')}>상품문의</span>
              <span css={styles.classTag('outline')}>배송문의</span>
              <span css={styles.classTag('outline')}>결제문의</span>
            </div>
            <div css={styles.classifyConnector}>
              <svg viewBox="0 0 120 32">
                <path d="M60 0 C60 14, 100 14, 100 32" />
                <path d="M60 0 C60 14, 20 14, 20 32" />
              </svg>
            </div>
            <div css={styles.classifyTags}>
              <span css={styles.classTag('outline')}>재고문의</span>
              <span css={styles.classTag('outline')}>상품제안</span>
              <span css={styles.classTag('outline')}>불만접수</span>
            </div>
            <div css={styles.classifyDemo}>
              <div css={styles.demoMessage}>
                <span>물건이 다 깨져서 왔어요.</span>
                <span css={styles.demoLabel}>최적</span>
              </div>
              <div css={styles.demoTranslation}>
                We regret to inform you that your product arrived damaged.
              </div>
            </div>
          </div>

          <div css={styles.block}>
            <div css={styles.blockHeader}>
              <h3>상담 종료 후 정리까지, AI가 도와줘요</h3>
              <p>
                상담이 끝나면 AI가 대화 내용을 자동으로 요약하고,
                <br />
                핵심 정보를 정리해줍니다.
              </p>
            </div>
            <div css={styles.summaryCard}>
              <div css={styles.summaryHeader}>
                <h4>상담 요약</h4>
                <span css={styles.aiBadge}>AI 생성 · 배송문의</span>
              </div>
              <ul css={styles.summaryList}>
                <li>고객이 배송 일정에 대해 문의함.</li>
                <li>출고 예정일과 예상 도착일 안내 완료, 상담 종료</li>
              </ul>
              <div css={styles.emotion}>
                고객 감정 <span /> 긍정
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
