import { useLayoutStore } from '@/stores/layoutStore';
import CardWrapper from '@/components/main/CardWrapper';
import styles from './HappytalkCard.style';

export default function HappytalkCard() {
  const { isDesktop } = useLayoutStore();

  return (
    <CardWrapper
      title="Happybot API"
      left={isDesktop ? -233 : -178}
      top={-86}
      zIndex={2}
      width={248}
      height={320}
    >
      <div css={styles.container}>
        <div css={styles.wrapper}>
          <h2>개인화 추진 시나리오</h2>
          <div css={styles.content}>
            <div css={styles.formBox}>
              <p>고객 이력 조회</p>
              <button>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>고객 이전 상담 기록 확인</p>
              <button css={styles.gradientButton}>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>고객 등급 조회</p>
              <button>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>고객 데이터 조회</p>
              <button>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>고객 이전 상담 기록 확인</p>
              <button>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>예상 질문 답변 지식 조회</p>
              <button>시나리오편집</button>
            </div>
            <div css={styles.formBox}>
              <p>고객 이전 상담 기록 확인</p>
              <button>시나리오편집</button>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
