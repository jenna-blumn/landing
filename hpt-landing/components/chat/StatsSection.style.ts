import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 72px 12px;
    background: #fff;
    width: 360px;
    margin: 0 auto;

    ${media.desktop} {
      width: auto;
      padding: 72px 60px;
    }
  `,

  title: css`
    color: #0a0e0fdc;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  content: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    width: 100%;
    max-width: 1280px;
    margin-top: 40px;

    ${media.desktop} {
      margin-top: 60px;
    }
  `,

  statsGrid: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-self: stretch;

    ${media.desktop} {
      flex-direction: row;
      gap: 20px;
    }
  `,

  statCard: css`
    display: flex;
    min-height: 180px;

    &:first-of-type {
      min-height: 240px;
    }

    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    border-radius: 16px;
    background: #f0f1e9;
    overflow: hidden;

    ${media.desktop} {
      flex: 1 1 0;
      min-height: 0;
      padding: 20px 20px 30px;

      &:first-of-type {
        min-height: 0;
      }
    }
  `,

  statNumber: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    .animated-gradient-text {
      cursor: default;
      margin: 0;
    }

    .text-content {
      text-align: right;
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      padding: 20px 0;

      br {
        display: none;
      }
    }
  `,

  statText: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
    margin-top: auto;
  `,

  statTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  statDescription: css`
    color: #6f6f77;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  footnote: css`
    color: #6f6f77;
    width: 100%;
    text-align: right;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,
};
