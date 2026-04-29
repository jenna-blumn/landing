import { css } from '@emotion/react';

export default {
  wrapper: css`
    position: relative;
    border-radius: 16px;
    padding: 1px;
    overflow: hidden;
  `,
  gradient: css`
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #5bb6ff 0%, #59d3a0 45%, #ffe072 100%);
    border-radius: 16px;
  `,
  inner: css`
    position: relative;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0 18px 70px rgba(0, 0, 0, 0.1);
  `,
};
