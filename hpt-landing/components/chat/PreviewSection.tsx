'use client';

import styles from './PreviewSection.style';

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
          <h2 css={styles.title}>설치하기 전에 미리 체험해 보세요</h2>
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
