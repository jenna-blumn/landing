import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const VIOLET = '#7c3aed';

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
    padding: 10px 16px;
    border-radius: 12px;
    background: linear-gradient(
      to right,
      rgba(245, 243, 255, 0.6),
      #fff,
      rgba(254, 243, 199, 0.45)
    );
    border: 1px solid rgba(124, 58, 237, 0.18);
    text-decoration: none;
    transition: border-color 0.15s ease;

    &:hover {
      border-color: rgba(124, 58, 237, 0.4);
    }
  `,

  bannerLeft: css`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  `,

  bannerIconWrap: css`
    display: none;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${VIOLET};
    align-items: center;
    justify-content: center;

    ${media.desktop} {
      display: inline-flex;
    }
  `,

  bannerIcon: css`
    width: 14px;
    height: 14px;
    color: #fff;
  `,

  bannerText: css`
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    color: #18181b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  bannerTitle: css`
    color: ${VIOLET};
  `,

  bannerSub: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
  `,

  bannerCta: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    color: #3f3f46;
    font-size: var(--font-size-13);
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
