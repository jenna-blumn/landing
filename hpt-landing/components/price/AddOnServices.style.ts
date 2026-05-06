import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const BLUE = 'oklch(54.6% 0.245 262.881)';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 20px;
    background: #fafafa;

    ${media.desktop} {
      padding: 96px 60px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    ${media.desktop} {
      max-width: 1280px;
    }
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    margin-bottom: 56px;
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-42);
    }
  `,

  subtitle: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    max-width: 520px;
  `,

  body: css`
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${media.desktop} {
      flex-direction: row;
    }
  `,

  nav: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;

    ${media.desktop} {
      flex-direction: column;
      width: 260px;
      flex-shrink: 0;
      overflow: visible;
    }
  `,

  navItem: (active: boolean) => css`
    width: 100%;
    min-width: 200px;
    padding: 16px 20px;
    border-radius: 12px;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;

    ${active
      ? `
        background: #fff;
        border: 1px solid #d4d4d8;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      `
      : `
        background: transparent;
        border: 1px solid transparent;

        &:hover {
          background: rgba(255, 255, 255, 0.7);
          border-color: #e4e4e7;
        }
      `}

    ${media.desktop} {
      min-width: 0;
    }
  `,

  navItemTop: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  navItemName: (active: boolean) => css`
    color: ${active ? '#18181b' : '#3f3f46'};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  chevronIcon: css`
    width: 16px;
    height: 16px;
    color: #71717a;
    flex-shrink: 0;
    display: none;

    ${media.desktop} {
      display: block;
    }
  `,

  navBadge: (variant: 'beta' | 'free') => css`
    display: inline-block;
    margin-top: 8px;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    ${variant === 'beta'
      ? `
        background: rgba(124, 58, 237, 0.12);
        color: #6d28d9;
      `
      : `
        background: rgba(34, 197, 94, 0.12);
        color: #15803d;
      `}
  `,

  detail: css`
    flex: 1;
    min-width: 0;
  `,

  detailCard: css`
    padding: 32px;
    border-radius: 16px;
    background: #fff;
    border: 1px solid #e4e4e7;

    ${media.desktop} {
      padding: 40px;
    }
  `,

  detailLabel: css`
    display: inline-block;
    margin-bottom: 16px;
    padding: 2px 10px;
    border-radius: 9999px;
    background: rgba(37, 99, 235, 0.1);
    color: ${BLUE};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  detailTitle: css`
    color: #18181b;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 8px;
  `,

  detailDesc: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 24px;

    ${media.desktop} {
      font-size: var(--font-size-13);
    }
  `,

  featuresBlock: css`
    margin-bottom: 24px;
  `,

  featuresHeader: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  `,

  featuresList: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,

  featureItem: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  checkIcon: css`
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${BLUE};
  `,

  featureText: css`
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-13);
    }
  `,

  freeBox: css`
    padding: 16px;
    border-radius: 12px;
    background: #fafafa;
    border: 1px solid #e4e4e7;
  `,

  freeTitle: css`
    color: #18181b;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
  `,

  freeStatus: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-top: 4px;
  `,
};
