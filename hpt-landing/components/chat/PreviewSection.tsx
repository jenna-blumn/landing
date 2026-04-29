'use client';

import styles from './PreviewSection.style';

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" />
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  </svg>
);

const SkeletonCard = () => (
  <div css={styles.skeletonCard}>
    <div css={styles.skelLine('40%', 16)} />
    <div css={styles.skelLine('80%', 10)} />
    <div css={styles.skelChipRow}>
      <span css={styles.skelChip} />
      <span css={styles.skelChip} />
      <span css={styles.skelChip} />
    </div>
    <div css={styles.skelMockup} />
  </div>
);

export default function PreviewSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        <div css={styles.header}>
          <span css={styles.eyebrow}>
            <EyeIcon />
            설치 전 미리 체험
          </span>
          <h2 css={styles.title}>미리 체험해보세요</h2>
          <p css={styles.subtitle}>
            고객사 웹사이트에 노출되는 채팅 플로팅 버튼을
            <br />
            원하는 스타일로 자유롭게 커스터마이징할 수 있습니다.
          </p>
        </div>

        <div css={styles.skeletonStage}>
          <div css={styles.skeletonGrid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div css={styles.embedNoticeWrapper}>
            <div css={styles.embedNotice}>
              <span css={styles.noticeBadge}>Coming Soon</span>
              <p css={styles.noticeTitle}>인터랙티브 미리보기 준비 중</p>
              <p css={styles.noticeDesc}>
                실제 채팅 위젯을 임베드하는 형태로 제공될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
