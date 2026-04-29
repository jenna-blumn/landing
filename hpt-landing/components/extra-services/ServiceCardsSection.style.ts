import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 16px;
    background: #fff;

    ${media.desktop} {
      padding: 65px 60px 10px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1194px;
    gap: 32px;

    ${media.desktop} {
      gap: 55px;
    }
  `,

  card: css`
    display: flex;
    flex-direction: column;
    background: #fafff4;
    border-radius: 20px;
    padding: 30px 20px;
    gap: 24px;

    ${media.desktop} {
      flex-direction: row;
      align-items: center;
      padding: 40px;
      gap: 0;
    }
  `,

  cardTextArea: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;

    ${media.desktop} {
      padding-right: 40px;
    }
  `,

  cardImageArea: css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 100%;
      max-width: 531px;
      height: auto;
    }
  `,

  badge: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  badgeIcon: css`
    width: 45px;
    height: 45px;
    flex-shrink: 0;

    ${media.desktop} {
      width: 48px;
      height: 48px;
    }
  `,

  badgeIconLarge: css`
    width: 52px;
    height: 52px;
    flex-shrink: 0;

    ${media.desktop} {
      width: 68px;
      height: 67px;
    }
  `,

  badgeText: (color: string) => css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    color: ${color};

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,

  cardTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-32);
      line-height: var(--line-height-tight);
    }
  `,

  cardDesc: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  ctaLink: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    text-decoration: none;
    cursor: pointer;
    margin-top: 8px;

    ${media.desktop} {
      font-size: var(--font-size-15);
    }

    > img {
      width: 20px;
      height: 20px;

      ${media.desktop} {
        width: 29px;
        height: 29px;
      }
    }
  `,
};
