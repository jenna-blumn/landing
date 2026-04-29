import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 16px 60px;
    background: #fff;

    ${media.desktop} {
      padding: 120px 60px 80px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1194px;
    gap: 30px;

    ${media.desktop} {
      gap: 40px;
    }
  `,

  title: css`
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
    }
  `,

  tabs: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  `,

  tab: (isActive: boolean) => css`
    padding: 5px 16px;
    border: 1px solid ${isActive ? '#1a1a1a' : 'transparent'};
    border-radius: 50px;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: ${isActive ? '#1a1a1a' : 'rgba(26, 26, 26, 0.7)'};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
      color: #1a1a1a;
    }

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  `,

  logoCard: css`
    position: relative;
    border: 1px solid #eee;
    border-radius: 10px;
    aspect-ratio: 278.5 / 159;
    background-size: cover;
    background-position: center;
    width: 100%;
    max-width: 278.5px;

    &:hover > div {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.5);
    }
  `,

  logoCardOverlay: css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 10px;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    opacity: 0;
    transition: all 0.3s;

    vertical-align: middle;
    text-align: center;
  `,

  bottomArea: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `,

  searchBox: css`
    position: relative;
    display: flex;
    align-items: center;

    input {
      width: 180px;
      height: 34px;
      padding: 8.5px 36px 8.5px 13px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 0;
      font-size: var(--font-size-15);
      color: #1a1a1a;
      background: #fff;
      outline: none;

      &::placeholder {
        color: #999;
      }
    }
  `,

  searchIcon: css`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }
  `,

  pagination: css`
    display: flex;
    align-items: center;
    gap: 8.5px;
  `,

  pageButton: (disabled: boolean) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${disabled ? 'default' : 'pointer'};
    padding: 4px;

    svg {
      width: 13px;
      height: 13.5px;
    }

    path {
      stroke: ${disabled ? '#ccc' : '#1a1a1a'};
    }
  `,

  pageNumber: (isActive: boolean) => css`
    font-size: var(--font-size-13);
    font-weight: ${isActive
      ? 'var(--font-weight-semibold)'
      : 'var(--font-weight-regular)'};
    line-height: var(--line-height-normal);
    color: ${isActive ? '#1a1a1a' : 'rgba(26, 26, 26, 0.4)'};
    cursor: pointer;
    padding: 0 2px;

    &:hover {
      color: #1a1a1a;
    }
  `,
};
