import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    overflow: clip;

    ${media.desktop} {
      gap: 20px;
      padding: 72px 60px;
    }
  `,

  testimonial: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 336px;
    padding: 28px 24px;
    margin: 0;
    border-radius: 12px;
    border: 1px solid rgba(39, 39, 42, 0.1);
    background: #fafafa;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.04);

    ${media.desktop} {
      max-width: 880px;
      padding: 48px 56px;
      gap: 24px;
    }
  `,

  testimonialQuote: css`
    margin: 0;
    color: #18181b;
    font-size: var(--font-size-fluid-15-22);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;

    ${media.desktop} {
      font-size: var(--font-size-21);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  testimonialAuthor: css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: #52525b;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      gap: 10px;
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  testimonialLogo: css`
    width: 24px;
    height: 24px;
    object-fit: contain;
    border-radius: 6px;

    ${media.desktop} {
      width: 28px;
      height: 28px;
    }
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

  contentContainer: css`
    position: relative;
    flex-direction: column;
    align-items: center;
    display: flex;
    width: 100%;
    background: transparent;
  `,

  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
    padding-top: 36px;
    width: 336px;
    text-align: left;

    ${media.desktop} {
      padding-top: 72px;
      width: auto;
      text-align: center;
    }
  `,

  title: css`
    color: rgba(17, 17, 21, 0.9);
    font-size: var(--font-size-32);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    letter-spacing: var(--letter-spacing-tight);
    width: 100%;

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

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);

      > br {
        display: none;
      }
    }
  `,

  issueCardsGrid: css`
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;
    max-width: 336px;
    margin-top: 40px;
    overflow: visible;

    ${media.desktop} {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      max-width: 1280px;
      margin-top: 60px;
    }
  `,

  issueCard: css`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 12px;

    ${media.desktop} {
      padding: 28px;
      gap: 20px;
    }
  `,

  invertedCard: css`
    background: #18181b;
    border-color: rgba(255, 255, 255, 0.12);
  `,

  operationBridge: css`
    display: none;

    ${media.desktop} {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      max-width: 1280px;
      margin-top: 0;
      margin-bottom: -36px;
    }
  `,

  bridgeSvgWrap: css`
    position: relative;
    width: 100%;
    height: 248px;
  `,

  bridgeLines: css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    path {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
  `,

  bridgeBaseLines: css`
    path {
      stroke: #f4f4f5;
    }
  `,

  bridgeOverlayLines: css`
    path {
      stroke: oklch(54.6% 0.245 262.881);
    }
  `,

  bridgeImage: css`
    display: block;
    width: 65%;
    max-width: 832px;
    height: auto;
    margin: 0;
    object-fit: contain;
  `,

  issueIcon: css`
    display: inline-flex;
    width: 36px;
    height: 36px;

    > svg {
      width: 100%;
      height: 100%;
    }

    ${media.desktop} {
      width: 40px;
      height: 40px;
    }
  `,

  issueTitle: (isInverted = false) => css`
    color: ${isInverted ? '#fff' : '#18181b'};
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-18);
      line-height: var(--line-height-normal);
    }
  `,

  issueDescription: (isInverted = false) => css`
    color: ${isInverted ? 'rgba(255, 255, 255, 0.68)' : '#52525b'};
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);

    ${media.desktop} {
      font-size: var(--font-size-15);
      line-height: var(--line-height-normal);
    }
  `,

  decorativeBadgeGroup: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: auto;
  `,

  decorativeBadge: css`
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 3px 9px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
    font-size: var(--font-size-13);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
    white-space: nowrap;
  `,

  cardsWrapper: css`
    width: calc(100% + 40px);
    margin-left: -20px;
    padding: 40px 0 20px 0;

    ${media.desktop} {
      width: calc(100% + 120px);
      margin-left: -60px;
      padding: 60px 0 20px 0;
    }
  `,

  swiper: css`
    width: 100%;
    overflow: visible !important;
  `,

  card: (isWhiteCard: boolean) => css`
    display: flex;
    width: 300px;
    height: 460px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    border-radius: 10px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: ${isWhiteCard ? '#fff' : '#18181b'};
    overflow: hidden;

    ${media.desktop} {
      width: 364px;
      height: 460px;
    }
  `,

  cardText: css`
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
  `,

  cardTitle: (isWhiteCard: boolean) => css`
    align-self: stretch;
    color: ${isWhiteCard ? 'rgba(17, 17, 21, 0.9)' : '#fff'};
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  cardDescription: (isWhiteCard: boolean) => css`
    align-self: stretch;
    color: ${isWhiteCard ? '#4E4E55' : 'rgba(255, 255, 255, 0.7)'};
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    letter-spacing: var(--letter-spacing-tight);
  `,

  cardLink: css`
    color: #fff;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
  `,

  cardImage: css`
    width: 100%;
    margin-top: auto;
    object-fit: cover;
    object-position: top;
  `,

  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 32px;

    ${media.desktop} {
      margin-top: 40px;
    }
  `,

  pageButton: css`
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid rgba(39, 39, 42, 0.15);
    background: #fff;
    box-shadow:
      0 -1px 0 0 rgba(0, 0, 0, 0.08) inset,
      0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;

    &:last-of-type svg {
      transform: rotate(180deg);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
};
