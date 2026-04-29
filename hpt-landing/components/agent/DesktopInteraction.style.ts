import { css } from '@emotion/react';

export default {
  container: css`
    width: 1496px;
    margin: 0 auto;
    max-width: 95%;
  `,

  wrapper: css`
    width: 100%;
    display: flex;
    gap: 64px;

    @media (min-width: 1440px) {
      gap: 80px;
    }
  `,

  textSection: css`
    flex: 1;
  `,

  textItemWrapper: (isFirst: boolean) => css`
    height: ${isFirst ? '784px' : '600px'};
    display: flex;
    flex-direction: column;

    > h2 {
      text-align: left;
      padding: 20px 0 60px;
      font-size: var(--font-size-48);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);

      .gradient-text {
        font-weight: var(--font-weight-bold);
        margin: 0;
      }
    }
  `,

  textItemTitle: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);

    &:last-of-type {
      margin-bottom: 16px;
    }
  `,

  textItemDescription: css`
    color: #4e4e55;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  imgSection: css`
    width: 100%;
    max-width: 600px;
  `,

  imgWrapper: css`
    position: sticky;
    top: calc((100vh - 420px) / 2);
    width: 100%;
    height: 420px;
  `,

  img: (isInView: boolean) => css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    opacity: ${isInView ? 1 : 0};
    transform: translateY(${isInView ? 0 : '20px'});
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    pointer-events: ${isInView ? 'auto' : 'none'};
    z-index: ${isInView ? 1 : 0};
  `,
};
