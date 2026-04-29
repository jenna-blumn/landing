import styles from './DeviceAppsSection.style';

import DesktopDownload from '@/assets/images/extra-services/desktop-download.png';
import IosDownload from '@/assets/images/extra-services/ios-download.png';
import AndroidDownload from '@/assets/images/extra-services/android-download.png';

export default function DeviceAppsSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <h2 css={styles.sectionTitle}>
          내 기기에서 직접 고객을 만나세요
        </h2>

        <div css={styles.cardsWrapper}>
          {/* 데스크탑 앱 */}
          <div css={styles.appCard}>
            <span css={styles.appTitle}>해피톡 데스크탑 앱</span>
            <div css={styles.downloadBadges}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DesktopDownload.src}
                alt="Windows 다운로드"
                css={styles.desktopBadge}
              />
            </div>
          </div>

          {/* 모바일 앱 */}
          <div css={styles.appCard}>
            <span css={styles.appTitle}>해피톡 모바일 상담 앱</span>
            <div css={styles.downloadBadges}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AndroidDownload.src}
                alt="Google Play 다운로드"
                css={styles.mobileBadge}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IosDownload.src}
                alt="App Store 다운로드"
                css={styles.mobileBadge}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
