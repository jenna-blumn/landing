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
      linear-gradient(#fff, #fff) padding-box,
      linear-gradient(
          90deg,
          #4cdec1 0%,
          #24b9e8 23.08%,
          #3e76f9 100%
        )
        border-box;
    color: #18181b;
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
    background: #fafafa;
    border: 1px solid #e4e4e7;
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
    background: #fff;
    border: 1px solid #e4e4e7;
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
    flex-direction: column;
    gap: 6px;

    > strong {
      color: #18181b;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-15);
        line-height: var(--line-height-normal);
      }
    }

    > span {
      color: #71717a;
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

  capTags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  `,

  capTag: css`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: #f4f4f5;
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  flowDiagram: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px;
    background: #fff;
    border: 1px solid #e4e4e7;
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
    background: #f4f4f5;
    border-radius: 16px;
    color: #18181b;
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
      background: #d4d4d8;
    }

    > .line {
      width: 2px;
      height: 18px;
      background: #d4d4d8;
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
    background: ${variant === 'ai' ? '#eef4ff' : '#fff7e6'};
    color: ${variant === 'ai' ? 'oklch(54.6% 0.245 262.881)' : '#b45309'};
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
    > svg {
      width: 16px;
      height: 16px;
    }
  `,
};
