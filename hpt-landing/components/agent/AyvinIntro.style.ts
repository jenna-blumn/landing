import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

import AyvinIntroFirst from '@/assets/images/ayvin-intro-first.png';
import AyvinIntroSecond from '@/assets/images/ayvin-intro-second.png';

export default {
  container: css`
    width: 100%;
    padding: 72px 0;
    background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
    ${media.desktop} {
      padding: 72px 60px;
    }
  `,

  wrapper: css`
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;

    ${media.desktop} {
      max-width: 100%;
      padding: 0;
    }
  `,

  titleSection: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    > svg {
      width: 110px;
      height: 110px;
    }

    > h2 {
      text-align: center;
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    > p {
      text-align: center;
      color: #52525b;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      > h2 {
        font-size: var(--font-size-48);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
      }

      > p {
        font-size: var(--font-size-18);
        line-height: var(--line-height-normal);
      }
    }
  `,

  introSection: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${media.desktop} {
      width: 1496px;
      max-width: 95vw;
      flex-direction: row;
      gap: 20px;
    }
  `,

  introItem: css`
    position: relative;
    height: 400px;
    padding: 40px;
    border-radius: 16px;
    flex-shrink: 0;
    background-color: #18181b;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;

    > h2 {
      color: #fff;
      font-size: var(--font-size-21);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    > a {
      opacity: 1;
    }

    ${media.desktop} {
      height: 450px;
      padding: 40px 40px 0 40px;

      > h2 {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
      }

      > a {
        opacity: 0;
      }

      &:hover {
        box-shadow: 0 0 15px 5px rgba(167, 208, 98, 0.4);

        > a {
          opacity: 1;
        }
      }
    }
  `,

  introItemArrowButton: css`
    display: flex;
    padding: 20px;
    align-items: center;
    gap: 10px;
    border-radius: 100px;
    background: #fafafa;
    cursor: pointer;
    margin-top: auto;
    margin-left: auto;
    border: none;
    outline: none;
    transition: opacity 0.3s ease;
    position: relative;
    z-index: 1;
    isolation: isolate;

    ${media.desktop} {
      width: 72px;
      height: 72px;
      margin-bottom: 40px;
    }
  `,

  firstItem: css`
    width: 100%;

    ${media.desktop} {
      flex: 1;
    }
  `,

  secondItem: css`
    width: 100%;

    ${media.desktop} {
      width: 435px;
    }
  `,

  introItemDescription: css`
    color: rgba(255, 255, 255, 0.5);
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    > span {
      color: #fff;
    }

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  introItemImageWrapper: (paddingTop?: number) => css`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding-top: ${paddingTop ? `${paddingTop}px` : 0};
    pointer-events: none;
  `,

  introItemImage: (isFirst: boolean) => css`
    width: 100%;
    height: 100%;
    background: url(${isFirst ? AyvinIntroFirst.src : AyvinIntroSecond.src})
      ${isFirst
        ? '50% / cover no-repeat'
        : '-5.811px -17.58px / 97.022% 107.955% no-repeat'};
    mix-blend-mode: color-dodge;
  `,
};
