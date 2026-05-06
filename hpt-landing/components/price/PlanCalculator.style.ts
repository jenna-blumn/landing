import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const BLUE = 'oklch(54.6% 0.245 262.881)';
const BLUE_LIGHT_BG = 'rgba(37, 99, 235, 0.04)';
const BLUE_LIGHT_BORDER = 'rgba(37, 99, 235, 0.18)';

const rainbowMove = keyframes`
  0% { background-position: 0%; }
  100% { background-position: 200%; }
`;

export default {
  container: css`
    width: 100%;
  `,

  panel: (active: boolean) => css`
    padding: 24px;
    border-radius: 16px;
    transition: all 0.2s ease;
    background: ${active ? BLUE_LIGHT_BG : '#fff'};
    border: 1px solid ${active ? BLUE_LIGHT_BORDER : '#e4e4e7'};

    ${media.desktop} {
      padding: 32px;
    }
  `,

  panelHeader: css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  `,

  panelTitle: css`
    color: #18181b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  groups: css`
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,

  group: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  groupLabel: css`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  categoryIcon: css`
    width: 16px;
    height: 16px;
    color: #71717a;
  `,

  chips: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,

  chip: (active: boolean) => css`
    padding: 8px 14px;
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;
    transition: all 0.15s ease;
    background: #fff;

    ${active
      ? `
        color: ${BLUE};
        border: 1px solid ${BLUE};
      `
      : `
        color: #52525b;
        border: 1px solid #e4e4e7;

        &:hover {
          border-color: ${BLUE_LIGHT_BORDER};
        }
      `}
  `,

  result: css`
    margin-top: 32px;
    padding: 32px;
    border-radius: 16px;
    background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
    border: 1px solid rgba(37, 99, 235, 0.18);
    text-align: center;
  `,

  resultLabel: css`
    color: #71717a;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    margin-bottom: 4px;
  `,

  resultPlan: css`
    color: ${BLUE};
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    margin-bottom: 24px;
  `,

  resultCta: css`
    position: relative;
    display: inline-flex;
    padding: 12px 24px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-family: inherit;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 9999px;
    background:
      linear-gradient(#121213, #121213) padding-box,
      linear-gradient(
          #121213 50%,
          rgba(18, 18, 19, 0.6) 80%,
          rgba(18, 18, 19, 0)
        )
        border-box,
      linear-gradient(
          90deg,
          hsl(0 100% 63%),
          hsl(90 100% 63%),
          hsl(210 100% 63%),
          hsl(195 100% 63%),
          hsl(270 100% 63%)
        )
        border-box;
    background-size: 200%;
    animation: ${rainbowMove} 2s linear infinite;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.95;
    }
  `,

  arrowIcon: css`
    width: 16px;
    height: 16px;
  `,
};
