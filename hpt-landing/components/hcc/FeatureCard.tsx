import styles from './FeatureCard.style';

import { FeatureCardData } from '@/constants/hcc';

export default function FeatureCard({
  image,
  alt,
  titles,
  features,
}: FeatureCardData) {
  return (
    <div css={styles.card}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} css={styles.cardImage} />
      )}
      {titles.length > 0 && (
        <div css={styles.cardTitles}>
          {titles.map((title, index) => (
            <p key={index} css={styles.cardTitle}>
              {title}
            </p>
          ))}
        </div>
      )}
      {features.length > 0 && (
        <ul css={styles.features}>
          {features.map((feature, index) => (
            <li key={index} css={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
