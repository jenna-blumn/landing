import common from '@/styles/common';
import styles from './Headline.style';

export default function Headline() {
  return (
    <section css={styles.container}>
      <div css={styles.description}>
        <div css={styles.title}>
          <h2>
            해피톡의 <strong>AI 에이전트</strong>
            를 <br css={common.mobileBr} />
            소개합니다
          </h2>
        </div>
        <p css={styles.descriptionText}>
          해피톡 AI 에이전트는 알아서 일하는 AI와 <br css={common.mobileBr} />
          신뢰할 수 있는 시나리오를
          <br css={common.desktopBr} />
          완벽하게 통합한 <br css={common.mobileBr} />
          하이브리드 에이전트입니다.
        </p>
      </div>
    </section>
  );
}
