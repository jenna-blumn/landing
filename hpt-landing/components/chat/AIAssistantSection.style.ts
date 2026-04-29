import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

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
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.06);
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
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
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
  `,

  block: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 28px;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 16px;

    ${media.desktop} {
      padding: 40px;
      gap: 24px;
    }
  `,

  blockHeader: css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    > h3 {
      color: #18181b;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-21);
        line-height: var(--line-height-tight);
      }
    }

    > p {
      color: #6f6f77;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        > br {
          display: none;
        }
      }
    }
  `,

  classifyTags: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  `,

  classTag: (variant: 'primary' | 'outline') => {
    if (variant === 'primary') {
      return css`
        padding: 8px 14px;
        border-radius: 9999px;
        background: oklch(54.6% 0.245 262.881);
        color: #fff;
        font-size: var(--font-size-13);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      `;
    }
    return css`
      padding: 8px 14px;
      border-radius: 9999px;
      background: #fff;
      border: 1px solid #d4d4d8;
      color: #52525b;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    `;
  },

  classifyConnector: css`
    display: flex;
    justify-content: center;
    height: 32px;

    > svg {
      width: 120px;
      height: 32px;
      stroke: oklch(54.6% 0.245 262.881);
      stroke-width: 2;
      stroke-dasharray: 4 4;
      fill: none;
    }
  `,

  classifyDemo: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 18px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e4e4e7;
  `,

  demoMessage: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #18181b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  demoLabel: css`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: #dcfce7;
    color: #166534;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  demoTranslation: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  summaryCard: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 22px 24px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #e8eaed;
  `,

  summaryHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > h4 {
      color: #18181b;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
    }
  `,

  aiBadge: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    background: #eef4ff;
    color: oklch(54.6% 0.245 262.881);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  summaryList: css`
    list-style: disc;
    padding-left: 18px;
    margin: 0;
    color: #555;
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    > li + li {
      margin-top: 4px;
    }
  `,

  emotion: css`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #18181b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    > span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      display: inline-block;
    }
  `,
};
