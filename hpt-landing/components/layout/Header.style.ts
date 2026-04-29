import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';
import { HeaderTheme } from '@/models/main';

export default {
  header: (theme: HeaderTheme | null) => css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    padding: 10px 12px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(17, 17, 21, 0.9);
    background-color: ${theme === HeaderTheme.BLUR ? 'transparent' : '#fff'};
  `,

  container: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    ${media.desktop} {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      width: 1496px;
      max-width: 90vw;
      gap: 0;
    }
  `,

  logo: css`
    justify-self: start;
    cursor: pointer;
  `,

  menu: css`
    justify-self: center;
    display: none;
    align-items: center;
    justify-content: center;

    ${media.desktop} {
      display: flex;
      gap: 3px;
    }
  `,

  menuItem: (isActive: boolean) => css`
    display: flex;
    position: relative;
    min-width: 60px;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: inherit;
    text-align: center;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    cursor: pointer;

    &:hover {
      border-radius: 6px;
      background-color: rgba(39, 39, 42, 0.1);
    }

    ${isActive &&
    css`
      border-radius: 6px;
      background-color: rgba(39, 39, 42, 0.1);
    `}
  `,

  logoWrapper: css`
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    > svg {
      display: block;
      cursor: pointer;
      transform: translateY(-2px);

      ${media.desktop} {
        display: none;
      }
    }
  `,

  buttonGroup: css`
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 8px;

    > a {
      display: flex;
      min-width: 60px;
      padding: 8px 16px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      text-align: center;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      border-radius: 6px;
      border: none;

      &:first-of-type {
        color: rgba(17, 17, 21, 0.9);
        background-color: rgba(255, 255, 255, 0);
      }

      &:last-of-type {
        color: #fff;
        background-color: rgba(17, 17, 21, 0.9);
      }

      ${media.desktop} {
        &:first-of-type {
          color: inherit;
        }
      }
    }
  `,

  dropdownMenu: (isHidden: boolean) => css`
    > div {
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease;
    }

    ${!isHidden &&
    css`
      &:hover > div {
        opacity: 1;
        pointer-events: auto;
      }
    `}
  `,

  solutionDropDown: css`
    display: inline-flex;
    position: absolute;
    top: 45px;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    border-radius: 10px;
    border: 1px solid #d7dbdf;
    background: #fff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
    }
  `,

  solutionItem: css`
    display: flex;
    width: 320px;
    padding: 12px;
    align-items: center;
    gap: 12px;
    border-radius: 6px;

    &:hover {
      background-color: #161f34;

      > div p {
        color: #fff;
      }
    }
  `,

  textBox: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;

    > p {
      color: #18181b;
    }
  `,

  supportDropDown: css`
    display: inline-flex;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    position: absolute;
    top: 45px;
    border-radius: 10px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
    background: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
    }

    > a {
      display: flex;
      width: 224px;
      padding: 12px;
      align-items: center;
      gap: 12px;
      color: #18181b;
      border-radius: 6px;

      &:hover {
        background-color: #161f34;
        color: #fff;
      }
    }
  `,

  mobileOnly: css`
    display: inline;

    ${media.desktop} {
      display: none;
    }
  `,

  desktopOnly: css`
    display: none;

    ${media.desktop} {
      display: inline;
    }
  `,
};
