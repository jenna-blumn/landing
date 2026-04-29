import { css } from '@emotion/react';

export default {
  container: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,

  mainContainer: css`
    height: 1040px;
  `,
};
