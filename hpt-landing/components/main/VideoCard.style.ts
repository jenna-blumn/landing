import { css } from '@emotion/react';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: linear-gradient(166deg, #0c2838 9.72%, #229e37 161.46%);
    overflow: hidden;

    width: 238px;
    height: 300px;

    > video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
};
