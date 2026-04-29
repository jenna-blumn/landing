import styles from './ExtraServicesHeroSection.style';
import HeroImage from '@/assets/images/extra-services/hero.png';

export default function ExtraServicesHeroSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.titleArea}>
          <h2 css={styles.mainTitle}>
            비즈니스를 더욱 확장시킬
            <br />
            추가 서비스를 만나보세요
          </h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HeroImage.src}
          alt="추가 서비스 소개"
          css={styles.heroImage}
        />
      </div>
    </section>
  );
}
