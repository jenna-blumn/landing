import { css } from '@emotion/react';

export default {
  container: css`
    display: flex;
    height: 32px;
    width: 100%;
    gap: 4px;
  `,

  item: css`
    height: 100%;
    width: 6px;
    border-radius: 2px;
    background-color: #e74341;
    transition: opacity 0.15s ease-in-out;
  `,
};
