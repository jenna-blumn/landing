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

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  `,

  card: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 32px 24px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 12px;
    text-align: center;
  `,

  value: css`
    .animated-gradient-text {
      cursor: default;
      margin: 0;
    }

    .text-content {
      font-size: var(--font-size-48);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    span {
      margin-left: 2px;
    }

    ${media.desktop} {
      .text-content {
        font-size: var(--font-size-54);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
      }
    }
  `,

  label: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,
};
