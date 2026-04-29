import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 16px;
    background: #fffad1;

    ${media.desktop} {
      padding: 80px 60px;
    }
  `,

  titleArea: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    margin-bottom: 40px;

    ${media.desktop} {
      margin-bottom: 60px;
    }
  `,

  mainTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    > span {
      color: #9d630e;
    }

    ${media.desktop} {
      font-size: var(--font-size-32);
    }
  `,

  subtitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-21);
    }
  `,

  card: css`
    width: 100%;
    max-width: 1200px;
    background: #fff;
    border-radius: 20px;
    padding: 30px 20px;
    margin-bottom: 24px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(39, 39, 42, 0.08);

    ${media.desktop} {
      padding: 30px 40px;
    }
  `,

  cardInner: css`
    display: flex;
    flex-direction: column;
    gap: 20px;

    ${media.desktop} {
      flex-direction: row;
      align-items: flex-start;
      gap: 40px;
    }
  `,

  cardLeft: css`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;

    > img {
      width: 45px;
      height: 45px;
      flex-shrink: 0;
    }
  `,

  cardInfo: css`
    display: flex;
    flex-direction: column;
    gap: 4px;

    > h3 {
      color: #1a1a1a;
      font-size: var(--font-size-21);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }

    > p {
      color: #e7a02e;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }
  `,

  cardContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${media.desktop} {
      flex-direction: row;
      gap: 24px;
    }
  `,

  cardColumn: css`
    flex: 1;

    > h4 {
      color: #1a1a1a;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      margin-bottom: 4px;
    }

    > ul {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    > ul > li {
      color: #1a1a1a;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      list-style: disc;
      margin-left: 24px;
    }
  `,

  buttonGroup: css`
    display: flex;
    gap: 12px;
    margin-top: 24px;
  `,

  primaryButton: css`
    display: inline-flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
    background: #484848;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    border: none;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
      background: #3a3a3a;
    }
  `,
};
