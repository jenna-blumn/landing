import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 16px 80px;
    background: #fff;

    ${media.desktop} {
      padding: 110px 60px 80px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1194px;
  `,

  titleArea: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    margin-bottom: 40px;

    ${media.desktop} {
      gap: 20px;
      margin-bottom: 60px;
    }
  `,

  title: css`
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-42);
      line-height: var(--line-height-tight);
    }
  `,

  subtitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  content: css`
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;

    ${media.desktop} {
      flex-direction: row;
      gap: 0;
    }
  `,

  accordion: css`
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    padding: 8px;

    ${media.desktop} {
      width: 472px;
      padding: 16px 8px;
      gap: 0;
    }
  `,

  accordionItem: (isActive: boolean) => css`
    background: ${isActive ? '#e9f1fe' : '#fdfdfd'};
    border-radius: ${isActive ? '20px' : '8px'};
    padding: ${isActive ? '25px 26px 26px' : '14px 28px'};
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: ${isActive ? '12px' : '0'};

    ${!isActive &&
    `
      & + & {
        border-top: none;
      }
    `}

    ${media.desktop} {
      margin-bottom: ${isActive ? '16px' : '0'};
    }
  `,

  accordionTitle: (isActive: boolean) => css`
    color: ${isActive ? '#306afe' : '#1a1a1a'};
    font-size: ${isActive ? 'var(--font-size-18)' : 'var(--font-size-15)'};
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: ${isActive ? 'var(--font-size-22)' : 'var(--font-size-18)'};
    }
  `,

  accordionContent: css`
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  `,

  accordionDescription: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  accordionLink: css`
    color: #306afe;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    letter-spacing: var(--letter-spacing-tight);
    cursor: pointer;

    ${media.desktop} {
      font-size: var(--font-size-18);
    }
  `,

  imageArea: css`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    ${media.desktop} {
      width: 708px;
      padding: 13px 8px 13px 29px;
    }
  `,

  industryImage: (isActive: boolean) => css`
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    opacity: ${isActive ? 1 : 0};
    transition: opacity 0.4s ease-in-out;

    &:first-of-type {
      position: relative;
    }
  `,
};
