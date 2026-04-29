import { css } from '@emotion/react';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    flex: 1 0 0;
    align-self: stretch;
  `,

  wrapper: css`
    height: 100%;
    overflow: hidden;
    display: flex;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 9px;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 5px;
    background: #f2f4f7;

    > h2 {
      color: #38373e;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  content: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 6px;
    align-self: stretch;
  `,

  formBox: css`
    display: flex;
    padding: 6px 6px 6px 9px;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: 6px;
    background: #fff;

    > p {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1 0 0;
      color: #38373e;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }

    > button {
      display: flex;
      padding: 4.5px;
      justify-content: center;
      align-items: center;
      gap: 3px;
      border-radius: 4.5px;
      background: #38373e;
      box-shadow:
        0 -0.75px 0 0 rgba(0, 0, 0, 0.08) inset,
        0 0.75px 1.5px 0 rgba(0, 0, 0, 0.05);
      color: #fff;
      text-shadow: 0 0.375px 0.75px rgba(0, 0, 0, 0.15);
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      border: none;
    }
  `,

  gradientButton: css`
    border-radius: 4.5px;
    background: linear-gradient(
      90deg,
      #19c257 13.78%,
      #3676ff 85.11%
    ) !important;
    box-shadow:
      0 -0.75px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 0.75px 1.5px 0 rgba(0, 0, 0, 0.05);
  `,
};
