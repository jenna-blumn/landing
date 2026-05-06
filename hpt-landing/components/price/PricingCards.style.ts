import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const BLUE = 'oklch(54.6% 0.245 262.881)';

export default {
  container: css`
    width: 100%;
  `,

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      align-items: stretch;
    }
  `,

  card: (highlight: boolean) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 28px;
    border-radius: 16px;
    transition: all 0.2s ease;

    ${highlight
      ? `
        background:
          linear-gradient(#fff, #fff) padding-box,
          linear-gradient(135deg, ${BLUE}, #818cf8) border-box;
        border: 2px solid transparent;
        box-shadow: 0 12px 32px -8px rgba(37, 99, 235, 0.18);
        z-index: 1;
      `
      : `
        background: #fff;
        border: 1px solid #e4e4e7;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      `}

    ${media.desktop} {
      padding: 32px;
      ${highlight ? 'transform: scale(1.02);' : ''}
    }
  `,

  badgeWrap: css`
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 9999px;
    background: #fbbf24;
    color: #78350f;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  cardHeader: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 24px;
  `,

  planName: (highlight: boolean) => css`
    margin-bottom: 4px;
    color: ${highlight ? BLUE : '#18181b'};
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
  `,

  priceRow: css`
    display: flex;
    align-items: baseline;
    gap: 4px;
  `,

  price: () => css`
    color: #18181b;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
  `,

  unit: () => css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
  `,

  subtext: () => css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  description: () => css`
    margin-top: 8px;
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  features: css`
    list-style: none;
    padding: 0;
    margin: 0 0 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  `,

  featureItem: css`
    display: flex;
    align-items: flex-start;
    gap: 8px;
  `,

  iconSpacer: css`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  `,

  checkIcon: () => css`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
    color: ${BLUE};
  `,

  featureText: (_highlight: boolean, isInherited: boolean) => css`
    color: ${isInherited ? '#71717a' : '#52525b'};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  cta: (highlight: boolean) => css`
    display: block;
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    text-align: center;
    text-decoration: none;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    transition: all 0.15s ease;

    ${highlight
      ? `
        background: ${BLUE};
        color: #fff;
        box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.3);

        &:hover {
          opacity: 0.92;
        }
      `
      : `
        background: #fff;
        color: #3f3f46;
        border: 1px solid #d4d4d8;

        &:hover {
          background: #fafafa;
        }
      `}
  `,

  note: css`
    margin-top: 24px;
    text-align: center;
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,
};
