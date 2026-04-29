import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 16px 40px;
    background: #fff;

    ${media.desktop} {
      padding: 80px 60px 37px;
    }
  `,

  inner: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1194px;
    gap: 40px;

    ${media.desktop} {
      gap: 70px;
    }
  `,

  sectionTitle: css`
    color: #1a1a1a;
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-54);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
    }
  `,

  grid: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
  `,

  marketCard: css`
    background: #f4f9ff;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 160px;

    ${media.desktop} {
      min-height: 200px;
      padding: 24px;
    }
  `,

  marketTextArea: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,

  marketName: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-21);
    }
  `,

  marketLink: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);

    ${media.desktop} {
      font-size: var(--font-size-15);
    }
  `,

  marketIconArea: css`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  `,

  marketIcon: css`
    width: 48px;
    height: 48px;

    ${media.desktop} {
      width: 64px;
      height: 64px;
    }
  `,
};
