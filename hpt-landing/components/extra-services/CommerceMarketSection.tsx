import styles from './CommerceMarketSection.style';

import NaverMerchant from '@/assets/images/extra-services/naver-merchant.png';
import Cafe24 from '@/assets/images/extra-services/cafe24.png';

const markets = [
  { name: '네이버 머천트', icon: NaverMerchant },
  { name: '카페24', icon: Cafe24 },
  { name: '고도몰', icon: NaverMerchant },
  { name: '메이크샵', icon: Cafe24 },
];

export default function CommerceMarketSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h2 css={styles.sectionTitle}>
          커머스 마켓을 통해 편리하게 연동하세요
        </h2>
        <div css={styles.grid}>
          {markets.map((market) => (
            <div key={market.name} css={styles.marketCard}>
              <div css={styles.marketTextArea}>
                <span css={styles.marketName}>{market.name}</span>
                <span css={styles.marketLink}>앱 둘러보기</span>
              </div>
              <div css={styles.marketIconArea}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={market.icon.src} alt={market.name} css={styles.marketIcon} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
