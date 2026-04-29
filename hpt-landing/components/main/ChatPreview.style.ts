import { css } from '@emotion/react';

import common from '@/styles/common';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    position: relative;
    overflow: hidden;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 336px;
    height: 450px;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;

    ${media.desktop} {
      width: 520px;
      height: 529px;
    }
  `,

  wrapper: css`
    width: 330px;
    height: 420px;
    border-radius: 12px;
    border: 1px solid rgba(39, 39, 42, 0.4);
    background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 120px;
      z-index: 20;
      pointer-events: none;
      border-radius: 12px 12px 0 0;
      background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
    }

    ${media.desktop} {
      width: 100%;
      height: 529px;
      border-radius: 16px;

      &::after {
        border-radius: 16px 16px 0 0;
      }
    }
  `,

  chatList: css`
    display: flex;
    width: 292px;
    height: 457.838px;
    flex-direction: column;
    justify-content: flex-end;
    bottom: 81px;
    align-items: flex-start;
    gap: 24px;
    ${common.absoluteCenterX}

    ${media.desktop} {
      width: 440px;
      bottom: 108px;
    }
  `,

  inputContainer: css`
    ${common.absoluteCenterX}
    bottom: 0;
    width: 336px;
    height: 54px;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    display: flex;

    border-radius: 42px;
    border: 1px solid #171717;
    background: #fff;
    box-shadow:
      0 40px 11px 0 rgba(0, 0, 0, 0),
      0 26px 10px 0 rgba(0, 0, 0, 0),
      0 14px 9px 0 rgba(0, 0, 0, 0.01),
      0 6px 6px 0 rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);

    ${media.desktop} {
      width: 480px;
      bottom: 24px;
    }
  `,

  desktopIcon: css`
    display: none;

    ${media.desktop} {
      display: inline;
    }
  `,
  mobileIcon: css`
    display: inline;

    ${media.desktop} {
      display: none;
    }
  `,

  input: css`
    flex: 1 0 0;
    color: #0a0e0fdc;
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      > br {
        display: none;
      }

      display: flex;
      padding: 8px 16px 8px 12px;
      align-items: center;
      gap: -12px;
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  inputBtn: css`
    display: flex;
    width: 38px;
    height: 38px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 999px;
    background: #e4e4e7;
  `,
};
