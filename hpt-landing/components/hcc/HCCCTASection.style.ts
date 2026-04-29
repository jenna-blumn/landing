import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    width: 100%;

    position: relative;
    padding: 60px 20px 80px;
    background-color: rgba(0, 0, 0, 0.55);
    background-image: url('/images/hcc/cta-background.png');
    background-size: cover;
    background-position: center;
    background-blend-mode: darken;

    ${media.desktop} {
      padding: 80px 73.5px;
    }
  `,

  inner: css`
    margin: 0 auto;
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;

    ${media.desktop} {
      align-items: flex-start;
    }
  `,

  textContent: css`
    display: flex;
    flex-direction: column;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    color: #fff;
    text-align: center;

    ${media.desktop} {
      text-align: left;
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  button: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 11.8px 25px 13.2px;
    background-color: #fff;
    border-radius: 10px;
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    text-decoration: none;
    transition: background-color 0.3s ease;
    width: fit-content;

    &:hover {
      background-color: #f0f0f0;
    }

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,
};
