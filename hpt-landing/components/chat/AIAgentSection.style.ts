import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    background: #1e293b;

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

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border: 2px solid transparent;
    border-radius: 9999px;
    background:
      linear-gradient(#1e293b, #1e293b) padding-box,
      linear-gradient(
          90deg,
          #4cdec1 0%,
          #24b9e8 23.08%,
          #3e76f9 100%
        )
        border-box;
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  title: css`
    color: #fff;
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
    color: rgba(255, 255, 255, 0.72);
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

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: stretch;
    }
  `,

  caps: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 28px;
    background: #334155;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;

    ${media.desktop} {
      padding: 36px;
      gap: 16px;
    }
  `,

  cap: css`
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    background: #475569;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  `,

  capEmoji: css`
    font-size: var(--font-size-21);
    line-height: var(--line-height-tight);

    ${media.desktop} {
      font-size: var(--font-size-32);
    }
  `,

  capBody: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;

    > div > strong,
    > strong {
      color: #fff;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-21);
        line-height: var(--line-height-tight);
      }
    }

    > span {
      color: rgba(255, 255, 255, 0.6);
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-15);
        line-height: var(--line-height-normal);
      }
    }
  `,

  capTitleRow: css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  `,

  capBadge: css`
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 9999px;
    background: rgba(76, 222, 193, 0.16);
    color: #7ee9d2;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    white-space: nowrap;
  `,

  capOutcome: css`
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
  `,

  capOutcomeLabel: css`
    color: rgba(255, 255, 255, 0.6);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,

  capOutcomeText: css`
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: var(--font-size-13) !important;
    font-weight: var(--font-weight-regular) !important;
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15) !important;
    }
  `,

  flowDiagram: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px;
    background: #334155;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    align-items: center;
    justify-content: center;

    ${media.desktop} {
      padding: 36px;
    }
  `,

  userMsg: css`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #475569;
    border-radius: 16px;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  userAvatar: css`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: oklch(54.6% 0.245 262.881);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-13);
  `,

  arrow: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    > .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.32);
    }

    > .line {
      width: 2px;
      height: 18px;
      background: rgba(255, 255, 255, 0.32);
    }
  `,

  aiProcess: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    background: linear-gradient(
      135deg,
      oklch(54.6% 0.245 262.881),
      #18181b
    );
    border-radius: 14px;
    color: #fff;
    text-align: center;
  `,

  processTitle: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,

  spinner: css`
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    border: 2px solid rgba(255, 255, 255, 0.32);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ${spin} 0.75s linear infinite;
  `,

  processTags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  `,

  processTag: css`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  split: css`
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;
  `,

  branch: (variant: 'ai' | 'human') => css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 14px;
    border-radius: 12px;
    background: ${variant === 'ai'
      ? 'rgba(76, 222, 193, 0.12)'
      : 'rgba(245, 158, 11, 0.12)'};
    color: ${variant === 'ai' ? '#7ee9d2' : '#fbbf24'};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  ctaWrapper: css`
    display: flex;
    justify-content: center;
    width: 100%;
  `,

  ctaButton: css`
    color: #18181b;
    background:
      linear-gradient(#fff, #fff) padding-box,
      linear-gradient(
          #fff 50%,
          rgba(255, 255, 255, 0.6) 80%,
          rgba(255, 255, 255, 0)
        )
        border-box,
      linear-gradient(
          90deg,
          hsl(0 100% 63%),
          hsl(90 100% 63%),
          hsl(210 100% 63%),
          hsl(195 100% 63%),
          hsl(270 100% 63%)
        )
        border-box;
    background-size: 200%;

    > svg {
      width: 16px;
      height: 16px;
    }
  `,
};
