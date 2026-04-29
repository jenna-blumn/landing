import { css } from '@emotion/react';

export default {
  overlay: (isOpen: boolean) => css`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100lvh;
    background: #fff;
    z-index: 100;
    padding: 10px 12px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    overflow: hidden;

    @media (max-width: 960px) {
      display: ${isOpen ? 'flex' : 'none'};
    }
  `,

  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  `,

  logoWrapper: css`
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: stretch;
  `,

  buttonWrapper: css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1 0 0;
    gap: 8px;

    > a {
      display: flex;
      min-width: 60px;
      padding: 8px 16px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0);
      color: rgba(17, 17, 21, 0.9);
      border: none;
      text-align: center;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);

      &:last-of-type {
        color: #fff;
        background-color: rgba(17, 17, 21, 0.9);
      }
    }
  `,

  closeButton: css`
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    background-color: #18181b;
    border-radius: 4px;
    border: none;
    outline: none;
  `,

  menuList: css`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    flex: 1;
  `,

  menuItem: css`
    display: flex;
    padding: 16px 24px;
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,

  buttonGroup: css`
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    > button {
      display: flex;
      padding: 16px;
      justify-content: center;
      align-items: center;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      border-radius: 8px;
      border: none;
      cursor: pointer;

      &:first-of-type {
        color: rgba(17, 17, 21, 0.9);
        background-color: #f4f4f5;
      }

      &:last-of-type {
        color: #fff;
        background-color: rgba(17, 17, 21, 0.9);
      }
    }
  `,

  navMenuContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
  `,

  navMenuGroup: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;
  `,

  divider: css`
    display: flex;
    margin: 12px 0;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    width: 100%;
    height: 1px;
    background-color: rgba(39, 39, 42, 0.1);
  `,

  navMenuGroupTitle: css`
    display: flex;
    padding: 8px 0;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    color: #6f6f77;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  navMenuItem: css`
    display: flex;
    padding: 8px 0;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,
};
