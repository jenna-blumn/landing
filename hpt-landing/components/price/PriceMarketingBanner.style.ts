import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  banner: css`
    width: 100%;
    max-width: 1200px;
    background: linear-gradient(90deg, #c2d4f7 0%, #d9f0de 50%, #e9ecce 100%);
    height: 82px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
    padding: 0 24px;

    ${media.desktop} {
      gap: 40px;
      padding: 0 40px;
    }
  `,

  textArea: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 1;
    min-width: 0;
    max-width: 100%;

    ${media.desktop} {
      min-width: 480px;
    }
  `,

  title: css`
    color: #1c2d65;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,

  description: css`
    color: #2d2e53;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  illustration: css`
    display: none;

    ${media.desktop} {
      display: block;
      height: 82px;
      width: auto;
      object-fit: contain;
    }
  `,
};
