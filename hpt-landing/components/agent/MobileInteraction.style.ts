import { css } from '@emotion/react';

export default {
  wrapper: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 360px;
    margin: 0 auto;
    padding: 0 12px;

    > h2 {
      color: rgba(17, 17, 21, 0.9);
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
      margin-bottom: 24px;

      .gradient-text {
        font-weight: var(--font-weight-bold);
        margin: 0;
      }
    }

    @media (min-width: 640px) {
      max-width: 640px;
    }

    @media (min-width: 768px) {
      max-width: 768px;
    }
  `,

  item: css`
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media (min-width: 768px) {
      gap: 48px;
    }
  `,

  textItem: css`
    padding-top: 24px;
  `,

  textItemTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    &:last-of-type {
      margin-bottom: 8px;
    }
  `,

  textItemDescription: css`
    color: #4e4e55;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  guideWrapper: (isInView: boolean) => css`
    width: 100%;
    height: 420px;
    margin: 0 auto;
    background-color: #fff;
    opacity: ${isInView ? 1 : 0};
    transform: translateY(${isInView ? 0 : '20px'});
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  `,
};
