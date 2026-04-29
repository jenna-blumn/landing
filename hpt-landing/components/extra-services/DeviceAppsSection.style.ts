import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 16px 40px;
    background: #fff;

    ${media.desktop} {
      padding: 80px 60px 60px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1194px;
    gap: 40px;

    ${media.desktop} {
      gap: 60px;
    }
  `,

  sectionTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }
  `,

  cardsWrapper: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
  `,

  appCard: css`
    background: #f4f9ff;
    border-radius: 20px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${media.desktop} {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 30px 40px;
    }
  `,

  appTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-21);
    }
  `,

  downloadBadges: css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    ${media.desktop} {
      gap: 16px;
    }
  `,

  desktopBadge: css`
    height: 48px;
    width: auto;

    ${media.desktop} {
      height: 65px;
    }
  `,

  mobileBadge: css`
    height: 48px;
    width: auto;

    ${media.desktop} {
      height: 70px;
    }
  `,
};
