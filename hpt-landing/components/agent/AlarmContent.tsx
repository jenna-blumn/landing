import styles from './AlarmContent.style';

import HappytalkIcon from '@/assets/svg/happytalk-icon.svg';
import NavertalkIcon from '@/assets/svg/navertalk-icon.svg';
import SymbolInsta from '@/assets/images/symbol-insta.png';

export default function AlarmContent() {
  return (
    <>
      <div css={styles.card}>
        <img src={SymbolInsta.src} alt="Instagram" css={styles.img(0)} />
      </div>
      <div css={styles.card}>
        <div css={styles.img(1)}>
          <NavertalkIcon />
        </div>
      </div>
      <div css={styles.card}>
        <div css={styles.img(2)}>
          <HappytalkIcon />
        </div>
        <div css={styles.toastText}>
          <p>해피톡 알림</p>
          <span>오늘 오전에 주문한 상품 배송 언제 도착할까요?</span>
        </div>
      </div>
    </>
  );
}
