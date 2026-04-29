import styles from './AIFeatureCards.style';

import AyvinWorkflowImg from '@/assets/images/ayvin-workflow-card.png';
import AiAssistantImg from '@/assets/images/ai-assistant-card.png';

export default function AIFeatureCards() {
  return (
    <section css={styles.container}>
      <div css={styles.wrapper}>
        <div css={styles.cardContainer}>
          <img src={AyvinWorkflowImg.src} />
          <div css={styles.textBox}>
            <p>AI 워크플로우</p>
            <p>AI가 업무 프로세스에 따라 스스로 고객을 응대합니다.</p>
          </div>
        </div>
        <div css={styles.cardContainer}>
          <img src={AiAssistantImg.src} />
          <div css={styles.textBox}>
            <p>AI 어시스턴트</p>
            <p>상담사의 업무를 AI가 보조합니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
