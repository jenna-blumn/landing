import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 16px 60px;
    background: #edf0f8;

    ${media.desktop} {
      padding: 132px 60px 80px;
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
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    > span {
      background: linear-gradient(90deg, #3a79e3 0%, #2d5eb0 50%, #20437d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
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

  /* 공통 가로 카드 (무료 / 확장 서비스) */
  horizontalCard: css`
    width: 100%;
    max-width: 1200px;
    background: #fff;
    border-radius: 20px;
    padding: 30px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(39, 39, 42, 0.08);
    margin-bottom: 24px;

    ${media.desktop} {
      padding: 30px 40px;
    }
  `,

  horizontalCardInner: css`
    display: flex;
    flex-direction: column;
    gap: 20px;

    ${media.desktop} {
      flex-direction: row;
      align-items: center;
      gap: 40px;
    }
  `,

  horizontalCardLeft: css`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;

    ${media.desktop} {
      width: 340px;
    }

    > img {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
    }
  `,

  horizontalCardInfo: css`
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
      color: #306afe;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }
  `,

  horizontalCardFeatures: css`
    display: flex;
    flex-direction: column;
    gap: 9px;

    > li {
      color: #1a1a1a;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      list-style: disc;
      margin-left: 24px;
    }
  `,

  planGrid: css`
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;

    ${media.desktop} {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  `,

  planCard: css`
    background: #fff;
    border-radius: 20px;
    padding: 30px 20px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(39, 39, 42, 0.08);
    text-align: center;

    ${media.desktop} {
      padding: 30px;
    }
  `,

  planName: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #1a1a1a;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    margin-bottom: 8px;
  `,

  planBadge: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 5px;
    background: #3a79e3;
    color: #fff;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    transform: translateY(-1px);
  `,

  planDesc: css`
    color: #306afe;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 24px;
  `,

  planPrice: css`
    margin-bottom: 8px;
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);

    ${media.desktop} {
      font-size: var(--font-size-48);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }
  `,

  planUnit: css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  `,

  planPriceNote: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 24px;
  `,

  planFeatures: css`
    text-align: left;

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
      list-style: disc;
      margin-left: 24px;
    }
  `,

  buttonGroup: css`
    display: flex;
    gap: 12px;
    margin-top: 40px;

    ${media.desktop} {
      margin-top: 48px;
    }
  `,

  primaryButton: css`
    display: inline-flex;
    padding: 16px 30px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background-color: #306afe;
    color: #ffffff;

    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #2655cb;
    }
  `,

  secondaryButton: css`
    display: none;
    padding: 16px 30px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    background-color: rgba(48, 106, 254, 0.1);
    color: rgba(48, 106, 254, 1);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    border: none;
    cursor: pointer;

    &:hover {
      background-color: rgba(223, 228, 242, 1);
    }

    ${media.desktop} {
      display: inline-flex;
    }
  `,
};
