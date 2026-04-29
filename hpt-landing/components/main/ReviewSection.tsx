import styles from './ReviewSection.style';
import { REVIEW_ITEMS } from '@/constants/main';

export default function ReviewSection() {
  return (
    <div css={styles.container}>
      <div css={styles.textBox}>
        <h2>
          이미 많은 기업이
          <br />
          80%이상의 자동화를 <br />
          경험하고 있어요
        </h2>
      </div>
      <div css={styles.reviewContainer}>
        {REVIEW_ITEMS.map((item) => (
          <div key={item.id} css={styles.reviewCard}>
            <div css={styles.imageContainer}>
              <img src={item.image.src} alt={item.company} />
              <div css={styles.blur} />
            </div>
            <div css={styles.reviewContent}>
              <img css={styles.logo} src={item.logo.src} alt={item.company} />
              <div css={styles.from}>
                <p>{item.company}</p>
              </div>
              <p css={styles.reviewText}>{item.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
