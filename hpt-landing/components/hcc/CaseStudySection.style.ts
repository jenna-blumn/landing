import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    background: #fafafa;
    overflow: clip;

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

  sliderWrapper: css`
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 4px 0;

    ${media.desktop} {
      width: calc(100% + 120px);
      margin-left: -60px;
    }
  `,

  swiper: css`
    width: 100%;
    overflow: visible !important;
  `,

  card: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 28px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    height: 100%;
    min-height: 300px;
  `,

  industry: css`
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(39, 39, 42, 0.06);
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  client: css`
    margin-top: 8px;
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-22);
      line-height: var(--line-height-tight);
    }
  `,

  detail: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  detailLabel: css`
    color: oklch(54.6% 0.245 262.881);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-transform: uppercase;
  `,

  detailText: css`
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  `,

  pageButton: css`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    color: #18181b;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    > svg {
      width: 16px;
      height: 16px;
    }
  `,
};
