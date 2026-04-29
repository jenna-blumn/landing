'use client';

import styles from './ChatbotAllEmpathySection.style';

const EMPATHY_CARDS = [
  { icon: '🧩', text: '워크플로우(시나리오) 설계가 어렵습니다' },
  { icon: '🤔', text: '자동화가 필요하지만 어디서부터 시작할지 모르겠습니다' },
  { icon: '😟', text: '에이전트를 직접 만들었지만 잘 되고 있는지 확신이 없습니다' },
  { icon: '⚙️', text: '유지보수와 운영 부담이 큽니다' },
];

export default function ChatbotAllEmpathySection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <h2 css={styles.title}>이런 고민 있으신가요?</h2>
        </div>
        <div css={styles.grid}>
          {EMPATHY_CARDS.map((c, i) => (
            <article key={i} css={styles.card}>
              <span css={styles.icon}>{c.icon}</span>
              <p css={styles.cardText}>{c.text}</p>
            </article>
          ))}
        </div>
        <p css={styles.transition}>
          그래서, <strong>해피톡이 대신 설계하고 완성해드립니다</strong>
        </p>
      </div>
    </section>
  );
}
