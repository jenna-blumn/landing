import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;

    ${media.desktop} {
      padding: 72px 60px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;

    ${media.desktop} {
      max-width: 1280px;
      gap: 60px;
    }
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  `,

  eyebrow: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.06);
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    > svg {
      width: 14px;
      height: 14px;
    }

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  subtitle: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      > br {
        display: none;
      }
    }
  `,

  skeletonStage: css`
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 20px;
    border: 1px dashed #d4d4d8;
    background: #fafafa;
    padding: 40px 24px;

    ${media.desktop} {
      padding: 80px 56px;
    }
  `,

  skeletonGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    ${media.desktop} {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  `,

  skeletonCard: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 16px;

    ${media.desktop} {
      padding: 32px;
      gap: 18px;
    }
  `,

  skelLine: (width: string, height: number = 12) => css`
    height: ${height}px;
    width: ${width};
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      #ececef 0%,
      #f5f5f7 40%,
      #ececef 80%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s linear infinite;
  `,

  skelChip: css`
    display: inline-block;
    height: 28px;
    width: 64px;
    border-radius: 9999px;
    background: linear-gradient(
      90deg,
      #ececef 0%,
      #f5f5f7 40%,
      #ececef 80%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.8s linear infinite;
  `,

  skelChipRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  `,

  skelMockup: css`
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 14px;
    background:
      radial-gradient(
        circle at 20% 30%,
        rgba(0, 122, 255, 0.08) 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(155, 81, 224, 0.08) 0%,
        transparent 60%
      ),
      linear-gradient(135deg, #f4f4f6 0%, #ebebef 100%);
    background-size:
      100% 100%,
      100% 100%,
      200% 200%;
    border: 1px solid #e4e4e7;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        110deg,
        transparent 30%,
        rgba(255, 255, 255, 0.55) 50%,
        transparent 70%
      );
      background-size: 200% 100%;
      animation: ${shimmer} 2.4s linear infinite;
    }
  `,

  embedNoticeWrapper: css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
  `,

  embedNotice: css`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 28px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid #e4e4e7;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    text-align: center;
    pointer-events: auto;

    ${media.desktop} {
      padding: 22px 36px;
      gap: 12px;
    }
  `,

  noticeBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    background: linear-gradient(
      135deg,
      oklch(54.6% 0.245 262.881),
      #18181b
    );
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-transform: uppercase;
    animation: ${pulse} 2.4s ease-in-out infinite;
  `,

  noticeTitle: css`
    color: #18181b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  noticeDesc: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,
};
