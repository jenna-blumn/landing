import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const delay = 200;

const drawUpToDown = keyframes`
  0% {
    clip-path: inset(0 0 100% 0);
  }
  100% {
    clip-path: inset(0 0 0% 0);
  }
`;

const styles = {
  container: css`
    width: 100%;
    height: 100%;

    ${media.desktop} {
      padding: 0 120px 49px;
    }
  `,

  wrapper: css`
    width: 100%;
    height: 100%;
    position: relative;
  `,

  lineSvg: css`
    position: absolute;
    left: calc(50% - 4px);
    top: 84px;
    z-index: 4;

    > path {
      clip-path: inset(0 0 100% 0);
      animation: ${drawUpToDown} ${delay}ms ease forwards;
      animation-delay: ${delay * 4}ms;
    }

    ${media.desktop} {
      width: 8px;
      height: 90px;
      top: 78px;
    }
  `,
};

export default styles;
