import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';
import FlowCard1 from '@/assets/images/flow/flow-card-1.png';
import FlowCard6 from '@/assets/images/flow/flow-card-6.png';

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
    gap: 40px;

    ${media.desktop} {
      max-width: 900px;
      gap: 60px;
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

      > br {
        display: none;
      }
    }
  `,

  subtitle: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  `,

  option: (variant: 'cloud' | 'onprem') => css`
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 32px;
    border-radius: 16px;
    background: ${variant === 'cloud'
      ? 'linear-gradient(135deg, oklch(54.6% 0.245 262.881), #18181b)'
      : '#fff'};
    border: ${variant === 'cloud' ? 'none' : '1px solid #e4e4e7'};
    color: ${variant === 'cloud' ? '#fff' : '#18181b'};
    isolation: isolate;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -2;
      background-image: url(${variant === 'cloud' ? FlowCard1.src : FlowCard6.src});
      background-repeat: no-repeat;
      background-size: ${variant === 'cloud' ? '120% auto' : '115% auto'};
      background-position: ${variant === 'cloud' ? 'center bottom' : 'center bottom'};
      opacity: ${variant === 'cloud' ? 0.32 : 0.42};
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: ${variant === 'cloud'
        ? 'linear-gradient(135deg, rgba(84, 57, 224, 0.94), rgba(24, 24, 27, 0.82))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.76))'};
    }

    ${media.desktop} {
      padding: 40px;
      gap: 20px;

      &::before {
        background-size: ${variant === 'cloud' ? '118% auto' : '112% auto'};
      }
    }
  `,

  optionLabel: (variant: 'cloud' | 'onprem') => css`
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: 6px 12px;
    border-radius: 9999px;
    background: ${variant === 'cloud'
      ? 'rgba(255, 255, 255, 0.18)'
      : 'rgba(39, 39, 42, 0.06)'};
    color: ${variant === 'cloud' ? '#fff' : '#52525b'};
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  optionTitle: (variant: 'cloud' | 'onprem') => css`
    color: ${variant === 'cloud' ? '#fff' : '#18181b'};
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-32);
      line-height: var(--line-height-tight);
    }
  `,

  optionDesc: (variant: 'cloud' | 'onprem') => css`
    color: ${variant === 'cloud' ? 'rgba(255, 255, 255, 0.8)' : '#52525b'};
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    flex: 1;

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  optionBtnBase: css`
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 9999px;
    font-family: inherit;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.9;
    }

    > svg {
      width: 16px;
      height: 16px;
    }

    ${media.desktop} {
      padding: 12px 24px;
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  optionBtnTone: (variant: 'cloud' | 'onprem') => css`
    background: ${variant === 'cloud' ? '#fff' : '#18181b'};
    color: ${variant === 'cloud' ? '#18181b' : '#fff'};
  `,
};
