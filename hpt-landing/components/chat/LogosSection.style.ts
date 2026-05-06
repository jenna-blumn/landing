import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    padding: 40px 20px;
    overflow: hidden;

    ${media.desktop} {
      padding: 60px;
    }
  `,

  logoGrid: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    gap: 12px;
    margin: 0 auto;
    max-width: 1280px;

    ${media.desktop} {
      gap: 20px;
    }
  `,

  logoItem: css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 81px;
    height: 63px;
    overflow: hidden;
    flex-shrink: 0;

    ${media.desktop} {
      width: 108px;
      height: 84px;
    }
  `,

  logoImage: css`
    width: calc(var(--logo-width) * 0.75);
    height: calc(var(--logo-height) * 0.75);
    max-width: none;
    max-height: none;
    object-fit: cover;
    border-radius: calc(var(--logo-radius) * 0.75);
    flex-shrink: 0;

    ${media.desktop} {
      width: var(--logo-width);
      height: var(--logo-height);
      border-radius: var(--logo-radius);
    }
  `,
};
