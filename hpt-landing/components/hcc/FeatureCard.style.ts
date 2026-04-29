import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  card: css`
    background-color: #fff;
    border-radius: 20px;
    padding: 30px 20px;
    min-height: 400px;
    width: 100%;
    max-width: 378px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.desktop} {
      flex: 1;
      max-width: none;
    }
  `,

  cardImage: css`
    width: 90%;
    max-width: 304px;
    height: auto;
    margin-bottom: 5px;
  `,

  cardTitles: css`
    text-align: center;
    margin-bottom: 5px;
  `,

  cardTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-21);
    }
  `,

  features: css`
    list-style: disc;
    padding-left: 24px;
    margin-top: 30px;
  `,

  featureItem: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,
};
