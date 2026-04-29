import { ReactNode } from 'react';
import Link from 'next/link';
import styles from './CTASection.style';

import LineGroup from '@/assets/svg/cta-line-group.svg';
import LineGroupMobile from '@/assets/svg/cta-line-group_mobile.svg';
import CheckCircleIcon from '@/assets/svg/check-circle-icon_s18.svg';

import PartnerKakao from '@/assets/images/partner/partner-kakao.png';
import PartnerNaver from '@/assets/images/partner/partner-naver.png';
import PartnerInstagram from '@/assets/images/partner/partner-instagram.png';
import PartnerArs from '@/assets/images/partner/partner-ars.png';
import PartnerHappytalk from '@/assets/images/partner/partner-happytalk.png';
import PartnerImweb from '@/assets/images/partner/partner-imweb.png';
import PartnerMakeshop from '@/assets/images/partner/partner-makeshop.png';
import PartnerNotion from '@/assets/images/partner/partner-notion.png';
import PartnerNaverStore from '@/assets/images/partner/partner-naver-store.png';
import PartnerCafe24 from '@/assets/images/partner/partner-cafe24.png';
import PartnerFlexG from '@/assets/images/partner/partner-flexg.png';

import { useLayoutStore } from '@/stores/layoutStore';
import { CTA_BADGES } from '@/constants/product';
import DottedGlowEffect from '@/assets/images/dotted-glow-effect.gif';

const partners = [
  PartnerKakao,
  PartnerNaver,
  PartnerInstagram,
  PartnerArs,
  PartnerHappytalk,
  PartnerImweb,
  PartnerMakeshop,
  PartnerNotion,
  PartnerNaverStore,
  PartnerCafe24,
  PartnerFlexG,
];

interface CTASectionProps {
  gtmEvent?: string;
  description?: ReactNode | null;
  ctaText?: string;
  ctaHref?: string;
  badges?: string[];
}

export default function CTASection({
  gtmEvent,
  description = null,
  ctaText = '무료로 시작하기',
  ctaHref = 'https://counselor.happytalk.io/auth/join',
  badges = CTA_BADGES,
}: CTASectionProps) {
  const { isDesktop } = useLayoutStore();

  const LineSvgGroup = isDesktop ? LineGroup : LineGroupMobile;
  const isExternalCta = /^https?:\/\//.test(ctaHref);

  return (
    <div css={styles.container}>
      <div css={styles.dotSection}>
        <img src={DottedGlowEffect.src} />
      </div>
      <div css={styles.titleContainer}>
        <h2>
          지금 바로 <br />
          무료로 시작해보세요
        </h2>
        {description !== null &&
          (description ?? (
            <p>
              14일동안 해피톡의 모든 기능을 <br />
              직접 경험해 볼 수 있어요
            </p>
          ))}
      </div>
      <div css={styles.contentContainer}>
        <LineSvgGroup css={styles.lineGroup} />
        <div css={styles.freeButton}>
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              {...(gtmEvent ? { 'data-gtm-event': gtmEvent } : {})}
            >
              {ctaText}
            </a>
          ) : (
            <Link
              href={ctaHref}
              {...(gtmEvent ? { 'data-gtm-event': gtmEvent } : {})}
            >
              {ctaText}
            </Link>
          )}
        </div>
        <div css={styles.badgeGroup}>
          {badges.map((badge) => (
            <div key={badge} css={styles.badge}>
              <CheckCircleIcon />
              <span>{badge}</span>
            </div>
          ))}
        </div>
        <div css={styles.partnerGroup}>
          <div css={styles.partnerTrack}>
            {isDesktop ? (
              partners.map((partner, i) => (
                <img key={i} src={partner.src} css={styles.partnerImage} />
              ))
            ) : (
              <>
                <div css={styles.partnerSet}>
                  {partners.map((partner, i) => (
                    <img key={i} src={partner.src} css={styles.partnerImage} />
                  ))}
                </div>
                <div css={styles.partnerSet}>
                  {partners.map((partner, i) => (
                    <img
                      key={`c-${i}`}
                      src={partner.src}
                      css={styles.partnerImage}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
