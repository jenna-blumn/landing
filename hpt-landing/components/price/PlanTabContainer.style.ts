import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 20px 40px;
    background: #fff;

    ${media.desktop} {
      padding: 32px 60px 56px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    ${media.desktop} {
      max-width: 1280px;
    }
  `,

  tabs: css`
    display: flex;
    flex-direction: row;
    gap: 40px;
    width: 100%;
    border-bottom: 1px solid #f2f4f7;
    margin-bottom: 32px;
  `,

  tab: (active: boolean) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0 12px 0;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    color: ${active ? '#18181b' : 'rgb(138, 138, 142)'};
    cursor: pointer;
    transition: color 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #18181b;
      border-radius: 1px;
      opacity: ${active ? 1 : 0};
      transition: opacity 0.3s ease;
    }
  `,

  banner: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
    padding: 14px 20px;
    border-radius: 12px;
    background: linear-gradient(
      90deg,
      hsla(230, 70%, 24%, 1) 0%,
      hsla(0, 0%, 0%, 1) 100%
    );
    border: 1px solid transparent;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.92;
    }
  `,

  bannerLeft: css`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  `,

  bannerText: css`
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  bannerTitle: css`
    color: #fff;
  `,

  bannerSub: css`
    color: #a1a1aa;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
  `,

  bannerCta: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  bannerArrow: css`
    width: 12px;
    height: 12px;
    transition: transform 0.15s ease;
  `,
};
