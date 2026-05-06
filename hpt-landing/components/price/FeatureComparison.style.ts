import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const BLUE = 'oklch(54.6% 0.245 262.881)';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px;
    background: #fff;

    ${media.desktop} {
      padding: 64px 60px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;

    ${media.desktop} {
      max-width: 1280px;
    }
  `,

  toggleWrap: css`
    display: flex;
    justify-content: center;
  `,

  toggle: css`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 9999px;
    background: #fff;
    border: 1px solid #e4e4e7;
    color: #52525b;
    font-family: inherit;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: #18181b;
      color: #18181b;
    }

    ${media.desktop} {
      padding: 12px 20px;
    }
  `,

  chevron: (expanded: boolean) => css`
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
    transform: ${expanded ? 'rotate(180deg)' : 'rotate(0)'};
  `,

  header: css`
    text-align: center;
    margin-top: 32px;
    margin-bottom: 32px;
  `,

  title: css`
    color: #18181b;
    font-size: var(--font-size-24);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 8px;

    ${media.desktop} {
      font-size: var(--font-size-32);
    }
  `,

  subtitle: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  tableWrap: css`
    width: 100%;
    overflow-x: auto;
  `,

  table: css`
    width: 100%;
    border-collapse: collapse;
  `,

  headerRow: css`
    border-bottom: 2px solid #e4e4e7;
  `,

  thFeature: css`
    text-align: left;
    padding: 16px 16px 16px 0;
    width: 40%;
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  thPlan: css`
    text-align: center;
    padding: 16px;
    width: 20%;
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  thPlanHighlight: css`
    text-align: center;
    padding: 16px;
    width: 20%;
    color: ${BLUE};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  categoryRow: css`
    border-bottom: 1px solid #f4f4f5;
  `,

  categoryCell: css`
    padding: 16px 8px;
    color: #18181b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  featureRow: (alt: boolean) => css`
    border-bottom: 1px solid #fafafa;
    background: ${alt ? 'rgba(244, 244, 245, 0.4)' : '#fff'};
  `,

  featureNameCell: css`
    padding: 14px 16px 14px 32px;
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  valueCell: css`
    padding: 14px 16px;
    text-align: center;
  `,

  check: css`
    display: block;
    width: 20px;
    height: 20px;
    margin: 0 auto;
    color: ${BLUE};
  `,

  dash: css`
    display: block;
    color: #d4d4d8;
    text-align: center;
  `,

  cellText: css`
    color: ${BLUE};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
  `,
};
