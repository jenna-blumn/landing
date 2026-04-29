import { css } from '@emotion/react';

export default {
  wrapper: css`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    border: 1px solid rgba(140, 140, 156, 0.12);
    border-radius: 8px;
    overflow: hidden;
  `,

  categoryTitle: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 20px;
    background: #f4f5f5;
    border-top: 1px solid rgba(140, 140, 156, 0.12);
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: #38373e;
    letter-spacing: var(--letter-spacing-tight);

    &:first-of-type {
      border-top: none;
    }
  `,

  dataRow: css`
    display: flex;
  `,

  planColumn: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;

    &:not(:first-of-type) {
      border-left: 1px solid rgba(140, 140, 156, 0.12);
    }
  `,

  featureItem: css`
    display: flex;
    align-items: center;
    gap: 8px;

    > span {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
      white-space: pre-line;
    }
  `,

  featureDisabled: css`
    > span {
      color: #c5c5c7;
    }
  `,

  checkIcon: (available: boolean) => css`
    width: 12px;
    height: 9px;
    flex-shrink: 0;
    color: ${available ? '#5676F6' : '#c5c5c7'};
  `,
};
