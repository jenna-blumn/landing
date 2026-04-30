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
      max-width: 1280px;
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

  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.06);
    color: #52525b;
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
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

  grid: css`
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;

    ${media.desktop} {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
    }
  `,

  card: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px;
    align-items: center;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 12px;
    text-align: center;

    ${media.desktop} {
      padding: 32px;
    }
  `,

  cardTop: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  `,

  icon: css`
    display: inline-flex;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    > svg {
      width: 100%;
      height: 100%;
    }
  `,

  cardBody: css`
    > h4 {
      color: #18181b;
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      text-align: center;

      ${media.desktop} {
        font-size: var(--font-size-18);
        line-height: var(--line-height-normal);
      }
    }
  `,

  certLink: css`
    display: inline-flex;
    align-self: center;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding: 8px 14px;
    border-radius: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: oklch(54.6% 0.245 262.881);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    text-decoration: none;
    transition: background 0.15s ease;

    &:hover {
      background: #dbeafe;
    }

    > svg {
      width: 14px;
      height: 14px;
    }
  `,
};
