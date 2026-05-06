import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    background: #fafafa;

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

      > br {
        display: none;
      }
    }
  `,

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  `,

  card: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 24px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 12px;
    text-align: center;

    ${media.desktop} {
      padding: 36px 28px;
      gap: 16px;
    }
  `,

  cardIcon: css`
    display: inline-flex;
    width: 40px;
    height: 40px;
    line-height: var(--line-height-tight);

    > svg {
      width: 100%;
      height: 100%;
    }

    ${media.desktop} {
      width: 48px;
      height: 48px;
    }
  `,

  cardTitle: css`
    color: #18181b;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  cardDesc: css`
    color: #52525b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  ctaWrapper: css`
    display: flex;
    justify-content: center;
    width: 100%;
  `,

  ctaButton: css`
    display: inline-flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-family: inherit;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    border-radius: 9999px;
    background: linear-gradient(97deg, #19c257 -7%, #3676ff 78.19%);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.92;
    }
  `,
};
