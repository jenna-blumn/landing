import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const BLUE = 'oklch(54.6% 0.245 262.881)';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 20px;
    background: #18181b;
    color: #fff;
    scroll-margin-top: 80px;

    ${media.desktop} {
      padding: 96px 60px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;

    ${media.desktop} {
      max-width: 1280px;
    }
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 16px;
    border-radius: 9999px;
    background: ${BLUE};
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 16px;
  `,

  title: css`
    color: #fff;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-42);
    }
  `,

  subtitle: css`
    color: #d4d4d8;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    max-width: 520px;

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,

  featuresCard: css`
    width: 100%;
    padding: 32px;
    border-radius: 16px;
    background: rgba(39, 39, 42, 0.5);
    border: 1px solid #3f3f46;
  `,

  featuresTitle: css`
    color: #fff;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 4px;
  `,

  featuresSub: css`
    color: #a1a1aa;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 24px;
  `,

  featuresList: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
    }
  `,

  featureItem: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: #18181b;
    border: 1px solid #3f3f46;
    border-radius: 12px;
  `,

  featureBody: css`
    flex: 1;
    min-width: 0;
  `,

  featureName: css`
    color: #f4f4f5;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,

  featureDesc: css`
    color: #a1a1aa;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-top: 4px;
  `,

  badgesRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  `,

  featureBadge: css`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 9999px;
    background: rgba(96, 165, 250, 0.1);
    border: 1px solid rgba(96, 165, 250, 0.3);
    color: #93c5fd;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  stepsBlock: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  stepsTitle: css`
    color: #fff;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 8px;
    text-align: center;
  `,

  stepsNote: css`
    color: #d4d4d8;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 32px;
    text-align: center;
  `,

  stepsRow: css`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    gap: 12px;
    width: 100%;
  `,

  stepGroup: css`
    display: flex;
    align-items: stretch;
    gap: 12px;
    flex: 1 1 0;
    min-width: 140px;
  `,

  step: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
    padding: 24px 20px;
    background: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 16px;
  `,

  stepIcon: css`
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  `,

  stepLabel: css`
    color: #d4d4d8;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    text-align: center;
  `,

  stepDuration: css`
    color: #93c5fd;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  stepConnector: css`
    flex-shrink: 0;
    width: 16px;
    height: 1px;
    background: #3f3f46;
    align-self: center;
  `,

  customersBlock: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  customersTitle: css`
    color: #fff;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 24px;
    text-align: center;
  `,

  customersList: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `,

  customersRow: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  `,

  customerChip: css`
    padding: 8px 16px;
    border-radius: 9999px;
    background: #27272a;
    border: 1px solid #3f3f46;
    color: #d4d4d8;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  ctaCard: css`
    width: 100%;
    max-width: 720px;
    padding: 32px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba(37, 99, 235, 0.18),
      rgba(99, 102, 241, 0.18)
    );
    border: 1px solid rgba(37, 99, 235, 0.32);
    text-align: center;
  `,

  ctaTitle: css`
    color: #fff;
    font-size: var(--font-size-24);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 8px;
  `,

  ctaSub: css`
    color: #a1a1aa;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 24px;
  `,

  ctaButton: css`
    > svg {
      width: 16px;
      height: 16px;
    }
  `,

  arrowIcon: css`
    width: 16px;
    height: 16px;
  `,
};
