import CardWrapper from '@/components/main/CardWrapper';
import styles from './AnalysisCard.style';

import MainCardImg from '@/assets/images/main-card-img.png';
import AnalysisLoading from '@/assets/svg/analysis-loading_s16.svg';
import { useLayoutStore } from '@/stores/layoutStore';

export default function AnalysisCard() {
  const { isDesktop } = useLayoutStore();

  return (
    <CardWrapper
      title="AI 에이전트"
      right={isDesktop ? -223 : -191}
      top={-39}
      zIndex={2}
    >
      <div css={styles.innerContainer}>
        <img src={MainCardImg.src} />
      </div>
      <div css={styles.ment}>
        <div css={styles.rectangle}>
          <p>{`user_status = analyze_sentiment(input); // 감정 분석 실행if (user_status == "LOW_SATISFACTION") { // 상담 만족도가 낮은 고객이므로 친절하게 응대 set_tone("super_kind");  // 딱딱하지 않게 이모지 추가 🌟 add_emoji = true;  response = generate_reply(context); }`}</p>
        </div>
      </div>
      <div css={styles.analysis}>
        <AnalysisLoading />
        <p>자동 만족도 분석...</p>
      </div>
    </CardWrapper>
  );
}
