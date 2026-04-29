'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

import styles from './PlanDetailSection.style';

import PlanComparisonTable from './PlanComparisonTable';

import FreeIcon from '@/assets/svg/plan/free-icon.svg';
import StarterIcon from '@/assets/svg/plan/starter-icon.svg';
import ProIcon from '@/assets/svg/plan/pro-icon.svg';
import EnterpriseIcon from '@/assets/svg/plan/enterprise-icon.svg';
import PlusIcon from '@/assets/svg/plus-icon.svg';
import CheckIcon from '@/assets/svg/black-check-icon.svg';
import IdeaIcon from '@/assets/svg/idea-icon-s16.svg';

import {
  PLAN_DETAIL_ITEMS,
  ENTERPRISE_DETAIL_FEATURES,
} from '@/constants/price';

const PLAN_ICONS = [FreeIcon, StarterIcon, ProIcon] as const;

export interface PlanDetailSectionHandle {
  isAtBottom: boolean;
  scrollDown: () => void;
}

const PlanDetailSection = forwardRef<PlanDetailSectionHandle>(
  function PlanDetailSection(_, ref) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const smoothScrollTo = useCallback((target: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const start = container.scrollTop;
      const distance = target - start;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / 400, 1);
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        container.scrollTop = start + distance * ease;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, []);

    const scrollDown = useCallback(() => {
      const container = scrollRef.current;
      if (!container) return;

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (container.scrollTop >= maxScroll - 50) {
        smoothScrollTo(0);
        return;
      }

      const sections = container.querySelectorAll('[data-scroll-section]');
      const containerRect = container.getBoundingClientRect();
      const currentTop = container.scrollTop;

      for (const section of sections) {
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = sectionRect.top - containerRect.top + currentTop;

        if (sectionTop > currentTop + 10) {
          smoothScrollTo(sectionTop);
          return;
        }
      }

      smoothScrollTo(maxScroll);
    }, [smoothScrollTo]);

    useImperativeHandle(ref, () => ({ isAtBottom, scrollDown }), [
      isAtBottom,
      scrollDown,
    ]);

    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;

      const handleScroll = () => {
        const scrollTop = container.scrollTop;
        const maxScroll = container.scrollHeight - container.clientHeight;

        setIsHeaderShrunk(scrollTop > 50);
        setIsAtBottom(scrollTop >= maxScroll - 10);
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <section css={styles.wrapper}>
        {/* 플랜 헤더 (스크롤 밖, 축소 가능) */}
        <div css={styles.headerWrapper}>
          <div css={styles.headerRow}>
            {PLAN_DETAIL_ITEMS.map((plan, i) => {
              const Icon = PLAN_ICONS[i];
              return (
                <div key={plan.name} css={styles.headerCell(isHeaderShrunk)}>
                  <div css={styles.headerCollapsible(isHeaderShrunk)}>
                    <div css={styles.iconWrapper}>
                      <Icon />
                    </div>
                  </div>
                  <p css={styles.planName}>{plan.name}</p>
                  <div css={styles.headerCollapsible(isHeaderShrunk)}>
                    <p css={styles.planDesc}>{plan.description}</p>
                    <p css={styles.planPrice}>
                      <span css={styles.priceValue}>{plan.price}</span>{' '}
                      <span css={styles.priceUnit}>
                        원/월
                        <br />
                        (계정당, VAT 별도)
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div ref={scrollRef} css={styles.scrollArea}>
          <div css={styles.table}>
            <div css={styles.featureRow}>
              {PLAN_DETAIL_ITEMS.map((plan) => (
                <div key={plan.name} css={styles.featureCell}>
                  {plan.includesText && (
                    <div css={styles.includesRow}>
                      <PlusIcon css={styles.plusIcon} />
                      <span>{plan.includesText}</span>
                    </div>
                  )}
                  <ul css={styles.featureList}>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div css={styles.enterprise}>
            <div css={styles.enterpriseRow}>
              <div css={styles.enterpriseTitle}>
                <EnterpriseIcon css={styles.enterpriseIcon} />
                <span>Enterprise</span>
              </div>
              <div css={styles.enterpriseContent}>
                <p css={styles.enterpriseDesc}>
                  맞춤 상담 운영이 필요한 팀에 추천 (상담 계정 10개 이상 사용
                  기업)
                </p>
                <div css={styles.enterpriseFeatures}>
                  {ENTERPRISE_DETAIL_FEATURES.map((feature) => (
                    <div key={feature} css={styles.enterpriseFeature}>
                      <CheckIcon css={styles.checkIcon} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <PlanComparisonTable />

          <div css={styles.infoSection}>
            <div css={styles.infoTitle}>
              <IdeaIcon css={styles.infoTitleIcon} />
              <span>사용량 기반 별도 과금 안내</span>
            </div>
            <ul css={styles.infoBulletList()}>
              <li>
                플랜 결제 방식에 따라 실시간 톡캐시 차감 또는 후불 결제로
                처리됩니다.
              </li>
              <li>아래 확장 기능은 사용량에 따라 별도 과금됩니다.</li>
            </ul>
            <div css={styles.infoSubItems}>
              <p>- 카카오 상담톡: 100원/DAU</p>
              <p>- SMS 발송: 12원/건</p>
              <p>- 알림톡 발송: 8원/건</p>
              <p>- 챗봇 초과 트래픽: 최대 180원/DAU (플랜별 차등 적용)</p>
            </div>
            <ul css={styles.infoBulletList(10)}>
              <li css={styles.infoHighlight}>
                DAU는 하루 동안 실제 이용한 고객 수를 기준으로 하며, 같은 고객이
                당일 여러 번 이용하더라도 추가 과금되지 않습니다.
              </li>
              <li>
                AI 에이전트 자동 응답 과금은 베타 기간 종료 후 공식 오픈
                시점부터 적용됩니다.
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  },
);

export default PlanDetailSection;
