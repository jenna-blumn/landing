'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from './PriceHeroSection.style';

import FreeIcon from '@/assets/images/price/free-icon.png';
import AddonIcon from '@/assets/images/price/addon-icon.png';
import PriceMarketingBanner from '@/components/price/PriceMarketingBanner';
import { FREE_PLAN, PAID_PLANS, ADDON_SERVICE } from '@/constants/price';
import Modal from '@/components/common/Modal';
import PlanDetailModal from '@/components/price/PlanDetailModal';

export default function PriceHeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickModalOpenButton = () => {
    setIsModalOpen(true);
  };

  const onClickModalCloseButton = () => {
    setIsModalOpen(false);
  };

  return (
    <section css={styles.container}>
      <div css={styles.titleArea}>
        <h2 css={styles.mainTitle}>
          <span>AI 상담과 상담 운영 자동화</span>를 합리적인 가격으로
        </h2>
        <p css={styles.subtitle}>
          가입 후 모든 기능을 체험할 수 있는 Trial이 제공됩니다.
        </p>
      </div>

      {/* 마케팅 띠배너 */}
      <PriceMarketingBanner />

      {/* 무료 플랜 */}
      <div css={styles.horizontalCard}>
        <div css={styles.horizontalCardInner}>
          <div css={styles.horizontalCardLeft}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FreeIcon.src} alt={FREE_PLAN.title} />
            <div css={styles.horizontalCardInfo}>
              <h3>{FREE_PLAN.title}</h3>
              <p>{FREE_PLAN.description}</p>
            </div>
          </div>
          <ul css={styles.horizontalCardFeatures}>
            {FREE_PLAN.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 유료 플랜 그리드 */}
      <div css={styles.planGrid}>
        {PAID_PLANS.map((plan) => (
          <div key={plan.name} css={styles.planCard}>
            <div css={styles.planName}>
              {plan.name}
              {plan.badge && <span css={styles.planBadge}>{plan.badge}</span>}
            </div>
            <div css={styles.planDesc}>{plan.description}</div>
            <div css={styles.planPrice}>
              {plan.price === '별도협의' ? (
                <span>{plan.price}</span>
              ) : (
                <>
                  {plan.price}
                  <span css={styles.planUnit}>원/월</span>
                </>
              )}
            </div>
            <div css={styles.planPriceNote}>{plan.priceNote}</div>
            <div css={styles.planFeatures}>
              <h4>{plan.baseText}</h4>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 확장 서비스 */}
      <div css={styles.horizontalCard}>
        <div css={styles.horizontalCardInner}>
          <div css={styles.horizontalCardLeft}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AddonIcon.src} alt={ADDON_SERVICE.title} />
            <div css={styles.horizontalCardInfo}>
              <h3>{ADDON_SERVICE.title}</h3>
              <p>{ADDON_SERVICE.description}</p>
            </div>
          </div>
          <ul css={styles.horizontalCardFeatures}>
            {ADDON_SERVICE.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      <div css={styles.buttonGroup}>
        <button css={styles.secondaryButton} onClick={onClickModalOpenButton}>
          플랜별 기능 보기
        </button>
        <Link href="/contact" css={styles.primaryButton}>
          가입 도입 문의
        </Link>
      </div>
      {isModalOpen && (
        <Modal isDesktopOnly hideCloseButton onClose={onClickModalCloseButton}>
          <PlanDetailModal onClose={onClickModalCloseButton} />
        </Modal>
      )}
    </section>
  );
}
