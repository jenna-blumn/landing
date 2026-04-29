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
  `,

  stepsStack: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  `,

  stepCard: css`
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 12px;
  `,

  stepNum: css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: oklch(54.6% 0.245 262.881);
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  stepBody: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  `,

  stepTitle: css`
    color: #18181b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  stepDesc: css`
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  whyChoose: css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
    width: 100%;
    padding: 32px;
    background: #f1f5f9;
    border-radius: 12px;

    ${media.desktop} {
      flex-direction: row;
      align-items: center;
      gap: 48px;
    }
  `,

  whyChooseTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: left;
    flex-shrink: 0;

    ${media.desktop} {
      width: 280px;
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);

      > br {
        display: block;
      }
    }
  `,

  featuresGrid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      flex: 1;
    }
  `,

  featureCard: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    text-align: left;
    align-items: flex-start;

    ${media.desktop} {
      padding: 28px;
    }
  `,

  featureIcon: css`
    display: inline-flex;
    width: 48px;
    height: 48px;
    color: transparent;
    background: linear-gradient(
      135deg,
      oklch(70.4% 0.14 182.503),
      oklch(42.4% 0.199 265.638)
    );
    background-clip: text;
    -webkit-background-clip: text;

    svg {
      width: 48px;
      height: 48px;
    }
  `,

  featureTitle: css`
    color: #18181b;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  featureDesc: css`
    color: #52525b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,
};
