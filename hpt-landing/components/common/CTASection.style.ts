import { css, keyframes } from '@emotion/react';

import { media } from '@/styles/breakpoints';

const marquee = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export default {
  container: css`
    position: relative;
    display: flex;
    width: 100%;
    padding: 48px 12px 56px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background-color: #f5f5f5;
    overflow: hidden;

    ${media.desktop} {
      padding: 48px 60px 72px;
    }
  `,

  dotSection: css`
    position: absolute;
    width: 540px;
    height: 540px;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    border-radius: 320px;
    background: radial-gradient(
      206.3% 50% at 50% 50%,
      rgba(245, 245, 245, 0) 0%,
      #f5f5f5 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 0%,
      black 40%,
      transparent 70%
    );
    mask-image: radial-gradient(
      ellipse at center,
      black 0%,
      black 40%,
      transparent 70%
    );

    ${media.desktop} {
      width: 1300px;
      height: 640px;
      top: auto;
      bottom: -89px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,

  titleContainer: css`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    text-align: center;

    > h2 {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }

    > p {
      color: #4e4e55;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      gap: 16px;

      > h2 {
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);

        > br {
          display: none;
        }
      }

      > p {
        font-size: var(--font-size-21);
        line-height: var(--line-height-tight);

        > br {
          display: none;
        }
      }
    }
  `,

  contentContainer: css`
    position: relative;
    width: 100%;
    max-width: 624px;
    height: 294px;
    display: flex;
    flex-direction: column;
    align-items: center;

    ${media.desktop} {
      width: 624px;
      height: 226px;
    }
  `,

  freeButton: css`
    position: relative;
    margin-top: 19px;

    a {
      width: 220px;
      height: 64px;
      display: inline-flex;
      padding: 18px 24px;
      justify-content: center;
      align-items: center;
      border: 2.4px solid rgba(0, 0, 0, 0.2);
      background: #11181c;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1);
      color: #fff;
      text-align: center;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      a {
        width: 291px;
      }
    }
  `,

  lineGroup: css`
    position: absolute;
    left: 30px;

    ${media.desktop} {
      left: 76px;
    }
  `,

  badgeGroup: css`
    position: absolute;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    top: 119px;

    ${media.desktop} {
      flex-direction: row;
      gap: 30px;
      top: 122px;
    }
  `,

  badge: css`
    display: flex;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    gap: 6px;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;

    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);

    > span {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  partnerGroup: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );

    ${media.desktop} {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      width: fit-content;
      overflow: visible;
      -webkit-mask-image: none;
      mask-image: none;
    }
  `,

  partnerTrack: css`
    display: flex;
    align-items: flex-start;
    width: max-content;
    animation: ${marquee} 20s linear infinite;

    ${media.desktop} {
      gap: 24px;
      animation: none;
      width: auto;
      transform: none;
    }
  `,

  partnerSet: css`
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding-right: 24px;
  `,

  partnerImage: css`
    display: flex;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `,
};
