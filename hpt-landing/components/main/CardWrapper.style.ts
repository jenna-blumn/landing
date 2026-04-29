import { css } from '@emotion/react';

// left: ${left ? `calc(-100% - ${left}px)` : 'auto'};

export default {
  container: (
    top: number,
    zIndex: number,
    left?: number,
    right?: number,
  ) => css`
    display: inline-flex;
    align-items: center;
    gap: -3px;
    position: absolute;
    left: ${left ? `${left}px` : 'auto'};
    right: ${right ? `${right}px` : 'auto'};
    top: ${top}px;
    z-index: ${zIndex};
    transform: translateX(${left ? '-100%' : '100%'});
  `,

  wrapper: (width?: number, height?: number) => css`
    position: relative;
    display: flex;
    width: ${width ? `${width}px` : 'fit-content'};
    height: ${height ? `${height}px` : 'fit-content'};
    padding: 5px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  `,

  title: css`
    display: flex;
    height: 25px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    align-self: stretch;
    color: #525252;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,
};
