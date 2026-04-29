import { media } from '@/styles/breakpoints';
import { css } from '@emotion/react';

export default {
  overlay: (isDesktopOnly: boolean) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    justify-content: center;
    align-items: center;

    ${isDesktopOnly && media.desktop} {
      display: flex;
    }
  `,

  content: css`
    display: flex;
    width: auto;
    max-height: 80vh;
    max-width: calc(90vw - 24px);
    position: relative;
  `,

  closeButton: css`
    z-index: 11;
    position: absolute;
    width: 34px;
    height: 34px;
    right: -12px;
    top: -12px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: none;
    outline: none;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);

    svg path {
      fill: #111115;
    }
  `,
};
