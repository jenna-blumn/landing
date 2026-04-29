import { css } from '@emotion/react';

export default {
  innerContainer: css`
    position: relative;
    display: flex;
    padding: 58px 57px 58px 58px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    border-radius: 5px;
    background: #f2f4f7;
    width: fit-content;

    > img {
      border-radius: 5px;
      width: 136px;
      aspect-ratio: 2/3;
    }
  `,

  ment: css`
    width: 198px;
    height: 78px;
    position: absolute;
    left: -15px;
    top: 59px;
  `,

  rectangle: css`
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.1) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 10px;
    overflow: hidden;

    > p {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: #171717;
      text-overflow: ellipsis;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  analysis: css`
    display: flex;
    width: 130px;
    height: 38px;
    padding: 10px 11px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: -24px;
    bottom: 83px;
    border-radius: 5px;
    background: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.1) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);

    > p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      color: #171717;
      text-overflow: ellipsis;
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,
};
