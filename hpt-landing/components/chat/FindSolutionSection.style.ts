import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

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

    ${media.desktop} {
      padding: 40px;
      gap: 20px;
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
