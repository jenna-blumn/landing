import { css, keyframes } from '@emotion/react';
import { media } from '@/styles/breakpoints';

const typingPulse = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
  40% { transform: scale(1); opacity: 1; }
`;

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;

    ${media.desktop} {
      padding: 72px 60px;
    }
  `,

  inner: css`
    width: 100%;
    max-width: 336px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    ${media.desktop} {
      max-width: 1280px;
      gap: 48px;
    }
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  subtitle: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  tabs: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  `,

  tab: (active: boolean) => css`
    display: inline-flex;
    align-items: center;
    padding: 10px 18px;
    border-radius: 9999px;
    border: 1px solid ${active ? '#18181b' : '#e4e4e7'};
    background: ${active ? '#18181b' : '#fff'};
    color: ${active ? '#fff' : '#52525b'};
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      ${!active && 'border-color: #18181b; color: #18181b;'}
    }

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
      padding: 12px 20px;
    }
  `,

  contentWrap: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    width: 100%;
    padding: 32px 32px 0;
    background: #fafafa;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    overflow: hidden;

    ${media.desktop} {
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      padding: 48px 48px 0;
      align-items: end;
    }
  `,

  textCol: css`
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${media.desktop} {
      align-self: start;
      padding-top: 120px;
    }

    > h3 {
      color: #18181b;
      font-size: var(--font-size-21);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-32);
        line-height: var(--line-height-tight);
      }
    }

    > p {
      color: #52525b;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      ${media.desktop} {
        font-size: var(--font-size-18);
        line-height: var(--line-height-normal);
      }
    }
  `,

  checkList: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    > li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      color: #18181b;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);

      &::before {
        content: '✓';
        flex-shrink: 0;
        color: oklch(54.6% 0.245 262.881);
        font-weight: var(--font-weight-bold);
      }
    }
  `,

  mockup: css`
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 450px;
    margin: 0 auto;
    align-self: end;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-bottom: none;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    flex-shrink: 0;

    ${media.desktop} {
      width: 320px;
      height: 450px;
    }
  `,

  mockupHeader: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 16px;
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  `,

  mockupHeaderDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
  `,

  mockupHeaderTitle: css`
    color: #18181b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  mockupBody: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    background: #fafafa;
  `,

  bubble: (variant: 'bot' | 'user') => css`
    align-self: ${variant === 'bot' ? 'flex-start' : 'flex-end'};
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 14px;
    background: ${variant === 'bot' ? '#f4f4f5' : 'oklch(54.6% 0.245 262.881)'};
    color: ${variant === 'bot' ? '#18181b' : '#fff'};
    font-size: var(--font-size-15);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    > strong {
      font-weight: var(--font-weight-bold);
    }
  `,

  typingBubble: css`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 12px 14px;
  `,

  typingDot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.5;
    animation: ${typingPulse} 1.2s infinite ease-in-out;

    &:nth-of-type(2) {
      animation-delay: 0.18s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.36s;
    }
  `,
};
