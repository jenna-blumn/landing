import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 60px 20px;
    background: #0f172a;

    ${media.desktop} {
      padding: 96px 60px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    width: 100%;
    max-width: 880px;
    text-align: center;
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
    }
  `,

  description: css`
    color: rgba(255, 255, 255, 0.72);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-21);
      line-height: var(--line-height-tight);
    }
  `,

  ctaGroup: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 336px;

    ${media.desktop} {
      flex-direction: row;
      justify-content: center;
      max-width: none;
      gap: 16px;
    }
  `,

  primaryCta: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 9999px;
    background: #fff;
    color: #0f172a;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.92;
    }

    > svg {
      width: 16px;
      height: 16px;
    }
  `,

  secondaryCta: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 9999px;
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.32);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    > svg {
      width: 16px;
      height: 16px;
    }
  `,
};
