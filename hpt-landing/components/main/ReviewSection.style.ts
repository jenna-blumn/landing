import { css } from '@emotion/react';

import { media } from '@/styles/breakpoints';

export default {
  container: css`
    width: 100%;
    padding: 60px 0;
    background-color: #f5f5f5;
    flex-direction: column;
    align-items: center;
    display: flex;

    ${media.desktop} {
      padding: 72px 60px;
    }
  `,

  textBox: css`
    display: flex;
    width: 100%;
    max-width: 360px;
    padding: 0 12px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;

    > h2 {
      color: #0a0e0fdc;
      font-size: var(--font-size-32);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
      text-align: center;
    }

    ${media.desktop} {
      width: 1496px;
      max-width: 90vw;
      padding: 0;
      align-items: flex-start;

      > h2 {
        font-size: var(--font-size-48);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        letter-spacing: var(--letter-spacing-tight);
        text-align: left;

        > br:last-of-type {
          display: none;
        }
      }
    }
  `,

  reviewContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    padding: 30px 12px 0;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;

    ${media.desktop} {
      flex-direction: row;
      width: 1496px;
      max-width: 90vw;
      padding: 60px 0 0;
      gap: 20px;
    }
  `,

  reviewCard: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    align-self: stretch;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;

    ${media.desktop} {
      flex: 1 1 0;
      transition: flex 0.3s ease;
    }
  `,

  imageContainer: css`
    height: 270px;
    align-self: stretch;
    width: 100%;
    position: relative;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    ${media.desktop} {
      height: 320px;
    }
  `,

  blur: css`
    position: absolute;
    width: 100%;
    height: 108px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 90%);
    bottom: 0;
  `,

  reviewContent: css`
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    align-self: stretch;
    flex: 1;
    margin-top: -120px;
    position: relative;
  `,

  logo: css`
    display: flex;
    width: 54px;
    height: 54px;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;

    ${media.desktop} {
      width: 64px;
      height: 64px;
    }
  `,

  from: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;

    > p {
      color: #0a0e0fdc;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
    }

    ${media.desktop} {
      > p {
        &:first-of-type {
          display: block;
        }
      }
    }
  `,

  reviewText: css`
    color: #0a0e0fdc;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
      letter-spacing: var(--letter-spacing-tight);
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
};
