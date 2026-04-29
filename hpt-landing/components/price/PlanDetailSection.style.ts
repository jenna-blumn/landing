import { css } from '@emotion/react';
import { media } from '@/styles/breakpoints';

export default {
  wrapper: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    * {
      font-family: 'Inter', 'SUIT Variable';
    }
  `,

  /* ── 헤더 (스크롤 밖, 축소 가능) ── */

  headerWrapper: css`
    background: #fff;
    border: 1px solid #efeff0;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    flex-shrink: 0;
  `,

  /* ── 스크롤 영역 ── */

  scrollArea: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  `,

  headerRow: css`
    display: flex;
  `,

  headerCell: (shrunk: boolean) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${shrunk ? '0' : '12px'};
    padding: ${shrunk ? '10px 20px' : '20px'};
    border-bottom: 1px solid #efeff0;
    transition:
      gap 0.3s ease,
      padding 0.3s ease;

    &:not(:first-of-type) {
      border-left: 1px solid #efeff0;
    }
  `,

  headerCollapsible: (shrunk: boolean) => css`
    overflow: hidden;
    max-height: ${shrunk ? '0' : '200px'};
    opacity: ${shrunk ? 0 : 1};
    transition:
      max-height 0.3s ease,
      opacity 0.2s ease;
  `,

  iconWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 30px;
      height: 30px;
    }
  `,

  planName: css`
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    color: #38373e;
    letter-spacing: var(--letter-spacing-tight);
  `,

  planDesc: css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: #8a8a8e;
    letter-spacing: var(--letter-spacing-tight);
    text-align: center;
    margin-bottom: 12px;
  `,

  planPrice: css`
    text-align: center;
  `,

  priceValue: css`
    font-size: var(--font-size-18);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-normal);
    color: #38373e;
    letter-spacing: var(--letter-spacing-tight);
  `,

  priceUnit: css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: #8a8a8e;
    letter-spacing: var(--letter-spacing-tight);
  `,

  /* ── 플랜 feature 목록 ── */

  table: css`
    border: 1px solid #efeff0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    flex-shrink: 0;
  `,

  featureRow: css`
    display: flex;
  `,

  featureCell: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px 20px 20px 12px;

    &:not(:first-of-type) {
      border-left: 1px solid #efeff0;
    }
  `,

  includesRow: css`
    display: flex;
    align-items: center;
    gap: 5px;
    padding-left: 6px;
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: #4578f9;
    letter-spacing: var(--letter-spacing-tight);
  `,

  plusIcon: css`
    width: 15px;
    height: 14px;
    flex-shrink: 0;
  `,

  featureList: css`
    display: flex;
    flex-direction: column;
    gap: 12px;

    > li {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
      list-style: disc;
      margin-left: 21px;
    }
  `,

  /* ── Enterprise 배너 ── */

  enterprise: css`
    background: rgba(199, 80, 46, 0.1);
    border-radius: 8px;
    padding: 20px;
    flex-shrink: 0;
  `,

  enterpriseRow: css`
    display: flex;
    flex-direction: column;
    gap: 16px;

    ${media.desktop} {
      flex-direction: row;
      align-items: flex-start;
      gap: 60px;
      padding: 0 40px;
    }
  `,

  enterpriseTitle: css`
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;

    > span {
      font-size: var(--font-size-18);
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
      white-space: nowrap;
    }
  `,

  enterpriseIcon: css`
    width: 30px;
    height: 30px;
  `,

  enterpriseContent: css`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 4px;
  `,

  enterpriseDesc: css`
    font-size: var(--font-size-15);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
    color: #8a8a8e;
    letter-spacing: var(--letter-spacing-tight);
  `,

  enterpriseFeatures: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 20px;
    padding: 10px 0;
  `,

  enterpriseFeature: css`
    display: flex;
    align-items: center;
    gap: 8px;

    > span {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
      white-space: nowrap;
    }
  `,

  checkIcon: css`
    width: 13px;
    height: 10px;
    flex-shrink: 0;
  `,

  /* ── 사용량 과금 안내 ── */

  infoSection: css`
    background: #f4f5f5;
    border-bottom: 1px solid rgba(140, 140, 156, 0.12);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  infoTitle: css`
    display: flex;
    align-items: center;
    gap: 5px;

    > span {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  infoTitleIcon: css`
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  `,

  infoBulletList: (gap = 5) => css`
    list-style: disc;
    padding-left: 21px;
    display: flex;
    flex-direction: column;
    gap: ${gap}px;

    > li {
      font-size: var(--font-size-15);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #38373e;
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  infoSubItems: css`
    padding-left: 22px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    > p {
      font-size: var(--font-size-13);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-normal);
      color: #8a8a8e;
      letter-spacing: var(--letter-spacing-tight);
    }
  `,

  infoHighlight: css`
    color: #ff4713 !important;
  `,
};
