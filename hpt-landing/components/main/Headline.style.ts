import { media } from '@/styles/breakpoints';
import { css } from '@emotion/react';

export default {
  container: css`
    position: relative;
    width: 100%;
    height: 100vh;
    z-index: 1;
    display: grid;
    place-items: center;
    padding: 0 12px;

    ${media.desktop} {
      height: 100%;
    }
  `,

  description: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;

    ${media.desktop} {
      gap: 24px;
    }
  `,

  title: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;

    > h2 {
      text-align: center;
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
      color: rgba(17, 17, 21, 0.9);

      > strong {
        background:
          linear-gradient(91deg, #bd59ff 3.11%, #2f9bff 50%, #27e62f 96.89%),
          rgba(0, 0, 0, 0.2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    ${media.desktop} {
      > h2 {
        font-size: var(--font-size-48);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
      }
    }
  `,

  descriptionText: css`
    color: #4e4e55;
    text-align: center;
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-21);
      line-height: var(--line-height-tight);
    }
  `,
};
