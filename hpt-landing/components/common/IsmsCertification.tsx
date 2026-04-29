import styles from './IsmsCertification.style';

import BlumnLogo from '@/assets/images/blumn_logo.png';
import IsmsCertificate from '@/assets/images/isms_certificate.png';

export default function IsmsCertification() {
  return (
    <div css={styles.container}>
      <img css={styles.logo} src={BlumnLogo.src} alt="Blumn Logo" />
      <h2>블룸에이아이 정보보호 관리체계 인증 획득</h2>
      <hr css={styles.divider} />
      <ul css={styles.textContent}>
        <li>
          <strong css={styles.title}>🔒 인증범위</strong>
          <strong css={styles.boldText}>
            채팅상담, ARS 콜센터 솔루션 및 고객관리 솔루션 운영
          </strong>
          <br />
          <span css={styles.description}>
            (정보통신방법 제47조의7에 따른 인증의 특례)
          </span>
        </li>
        <li>
          <strong css={styles.title}>🔒 유효기간</strong>
          <strong css={styles.boldText}>2025.11.19 ~ 2028.11.18</strong>
        </li>
      </ul>
      <img css={styles.certImg} src={IsmsCertificate.src} alt="ISMS 인증" />
    </div>
  );
}
