import { useLayoutStore } from '@/stores/layoutStore';
import CardWrapper from '@/components/main/CardWrapper';
import styles from './VideoCard.style';

export default function VideoCard() {
  const { isDesktop } = useLayoutStore();

  return (
    <CardWrapper
      title="AI가 고객 답변을 해석중.."
      left={isDesktop ? -75 : -40}
      top={187}
      zIndex={1}
      height={340}
      width={248}
    >
      <div css={styles.container}>
        <video autoPlay loop muted playsInline>
          <source src="/videos/letter-glitch.mp4" type="video/mp4" />
        </video>
      </div>
    </CardWrapper>
  );
}
