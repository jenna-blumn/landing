import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0 24px 0;
    background: #edf1f5;
    position: relative;
    gap: 60px;

    ${media.desktop} {
      padding: 48px 0 24px 0;
    }
  `,

  swiperWrapper: css`
    width: 100%;
    position: relative;
  `,

  swiper: css`
    width: 100%;
  `,

  overlay: (isVisible: boolean) => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? 'fadeIn 0.4s ease-in-out forwards' : 'none'};

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  navigationWrapper: css`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 24px;

    ${media.desktop} {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 1194px;
      margin-top: 0;
      pointer-events: none;
    }
  `,

  card: css`
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    max-width: 90vw;
    margin: 0 auto;

    ${media.desktop} {
      flex-direction: row;
      max-width: 1194px;
      height: 406px;
    }
  `,

  cardImage: css`
    width: 100%;
    height: 250px;
    object-fit: cover;

    ${media.desktop} {
      width: 508px;
      height: 406px;
      flex-shrink: 0;
    }
  `,

  cardContent: css`
    background: #fff;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;

    ${media.desktop} {
      padding: 39px 40px;
      gap: 0;
    }
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #5988fe;
    border-radius: 20px;
    padding: 6px 16px;
    width: fit-content;
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      width: 130px;
      height: 36px;
    }
  `,

  companyName: css`
    color: #484848;
    font-size: var(--font-size-21);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-tight);

    ${media.desktop} {
      font-size: var(--font-size-32);
      line-height: var(--line-height-tight);
      margin-top: 39px;
    }
  `,

  description: css`
    color: #1a1a1a;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
      margin-top: 20px;
    }
  `,

  ctaButton: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f4f7ff;
    border-radius: 8px;
    padding: 10px 16px;
    width: fit-content;
    cursor: pointer;
    margin-top: 16px;

    span {
      color: #5988fe;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-bold);
    }

    .arrow {
      color: #306afe;
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
    }

    ${media.desktop} {
      margin-top: 24px;
      height: 42px;
      padding: 0 16px 0 20px;
    }
  `,

  navigation: css`
    display: flex;
    justify-content: center;
    gap: 16px;

    ${media.desktop} {
      width: 100%;
      justify-content: space-between;
      padding: 0 20px;
    }
  `,

  navButton: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    color: #1a1a1a;
    transition: all 0.2s;
    pointer-events: auto;

    &:hover {
      background: #f5f5f5;
    }

    &.swiper-button-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    ${media.desktop} {
      width: 52px;
      height: 52px;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  `,

  dotsContainer: css`
    display: flex;
    align-items: center;

    > div {
      cursor: pointer;

      span {
        margin: 5px 7px;
        display: block;
        width: 20px;
        height: 2px;
        background-color: #c4c4c4;

        &.active {
          background-color: #1a1a1a;
        }
      }
    }
  `,
};
