import { css } from '@emotion/react';

export default {
  container: css`
    max-width: 1100px;
    height: 657px;
    max-height: 80vh;
    width: auto;
    overflow: hidden;
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  `,

  modalHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;

    h2 {
      color: #38373e;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    > button {
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      background-color: rgba(56, 55, 62, 0.2);
      border: none;
      outline: none;
      cursor: pointer;
      display: grid;
      place-items: center;

      svg path {
        fill: #000;
      }
    }
  `,

  description: css`
    color: #a4acb9;
    text-align: center;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    flex-shrink: 0;

    > span {
      display: inline-block;
      transform: translateY(3px);
    }
  `,
};
