import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 20px 60px;
    text-align: center;
    overflow: hidden;

    ${media.desktop} {
      padding: 132px 60px 80px;
    }
  `,

  inner: css`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
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

    > .highlight {
      background: linear-gradient(
        135deg,
        oklch(54.6% 0.245 262.881),
        #18181b
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  description: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  actions: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
  `,

  textBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 16px 16px;
    color: #18181b;
    font-family: inherit;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;

    &:hover {
      color: oklch(54.6% 0.245 262.881);
    }
  `,
};
