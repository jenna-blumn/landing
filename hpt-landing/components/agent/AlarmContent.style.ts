import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const delay = 200;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export default {
  card: css`
    position: absolute;
    display: flex;
    border-radius: 12px;
    border: 1px solid #a8a29e;
    background: #fff;
    left: 50%;
    opacity: 0;
    transition:
      opacity ${delay}ms ease,
      transform ${delay}ms ease;
    transform: translate(-50%, -10px);
    animation: ${fadeIn} ${delay}ms ease forwards;
    gap: 8px;
    align-items: center;

    &:nth-of-type(1) {
      width: 218px;
      top: 50px;
      z-index: 1;
      padding: 10px 15px;
      animation-delay: ${delay}ms;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    &:nth-of-type(2) {
      width: 266px;
      top: 37px;
      z-index: 2;
      padding: 10px 15px;
      animation-delay: ${delay * 2}ms;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    &:nth-of-type(3) {
      width: 291px;
      top: 14px;
      z-index: 3;
      padding: 16px 12px;
      animation-delay: ${delay * 3}ms;
      box-shadow: 0 7px 10px 2px rgba(0, 0, 0, 0.1);
    }

    ${media.desktop} {
      gap: 16px;

      &:nth-of-type(1) {
        width: 258px;
        top: 42px;
        padding: 10px 15px;
      }
      &:nth-of-type(2) {
        width: 314px;
        top: 29px;
        padding: 10px 15px;
      }
      &:nth-of-type(3) {
        width: 344px;
        top: 0;
        padding: 18px 15px;
      }
    }
  `,

  img: (idx: number) => css`
    width: 36px;
    height: 36px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    ${media.desktop} {
      width: 40px;
      height: 40px;
    }

    ${idx === 1 &&
    css`
      background-color: #00c63b;
    `}
    ${idx === 2 &&
    css`
      background-color: #5988fe;
    `}
  `,

  toastText: css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    > p {
      color: #000;
      text-align: justify;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    > span {
      color: #525252;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    ${media.desktop} {
      gap: 4.78px;

      > p {
        font-size: var(--font-size-15);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      }

      > span {
        font-size: var(--font-size-13);
        line-height: var(--line-height-normal);
        letter-spacing: var(--letter-spacing-tight);
      }
    }
  `,
};
