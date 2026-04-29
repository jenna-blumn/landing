import styles from './ServiceCardsSection.style';

import HappySyncIcon from '@/assets/images/extra-services/happysync-icon.png';
import HappySyncCard from '@/assets/images/extra-services/happysync-card.png';
import HeyDearIcon from '@/assets/images/extra-services/heydear-icon.png';
import HeyDearCard from '@/assets/images/extra-services/heydear-card.png';
import SmartMsgIcon from '@/assets/images/extra-services/smartmsg-icon.png';
import SmartMsgCard from '@/assets/images/extra-services/smartmsg-card.png';
import TrudyIcon from '@/assets/images/extra-services/trudy-icon.png';
import TrudyCard from '@/assets/images/extra-services/trudy-card.png';
import ArrowRight from '@/assets/images/extra-services/arrow-right.png';

const serviceCards = [
  {
    icon: HappySyncIcon,
    iconStyle: 'large' as const,
    badgeText: '해피싱크 / 마케팅싱크(독립몰)',
    badgeColor: '#4070eb',
    title: (
      <>
        네이버 카카오 방문자
        <br />
        1초만에 회원으로 만들기
      </>
    ),
    description: (
      <>
        고객은 클릭 한번으로 가입과 로그인을 할 수 있고
        <br />
        기업은 회원수와 매출이 늘어납니다.
      </>
    ),
    image: HappySyncCard,
    imageAlt: '해피싱크 서비스 화면',
  },
  {
    icon: HeyDearIcon,
    iconStyle: 'normal' as const,
    badgeText: '헤이데어',
    badgeColor: '#bc5ed3',
    title: (
      <>
        어렵게 찾아온 고객을 사로잡고,
        <br />
        놓치지 않게 회원가입까지!
      </>
    ),
    description: (
      <>
        고객의 행동 패턴을 조합해
        <br />
        개인화된 마케팅 메시지를 보내 관심을 끌어보세요!
        <br />
        헤이데어로 CRM 마케팅, 채팅상담을 모두 한 곳에서 가능해요.
      </>
    ),
    image: HeyDearCard,
    imageAlt: '헤이데어 서비스 화면',
  },
  {
    icon: SmartMsgIcon,
    iconStyle: 'normal' as const,
    badgeText: '스마트메시지 플러스',
    badgeColor: '#438af4',
    title: (
      <>
        고객 행동 기반 CRM 타겟팅 메시지로
        <br />
        고객 재유입과 반복 매출 만들기
      </>
    ),
    description: (
      <>
        장바구니를 찜하고 잊어버린 고객, 적립금을 방치하고 있는 고객,
        <br />
        VIP고객 등 잠재 고객을 깨워보세요!
      </>
    ),
    image: SmartMsgCard,
    imageAlt: '스마트메시지 플러스 서비스 화면',
  },
  {
    icon: TrudyIcon,
    iconStyle: 'normal' as const,
    badgeText: '트루디 통합 인증 서비스',
    badgeColor: '#6887d6',
    title: (
      <>
        주요 인증서를 한 번의 계약으로
        <br />
        간편인증, 성인인증, 전자서명
        <br />
        모두 이용해보세요!
      </>
    ),
    description: (
      <>
        서비스별, 기간별 이용내역 조회가 가능하며 통합 정산관리에 용이해요.
        <br />
        여러 명의 관리자 운영이 가능하며, 등록할 시 기능에 따라
        <br />
        운영여부 설정으로 효율적인 관리를 해보세요!
      </>
    ),
    image: TrudyCard,
    imageAlt: '트루디 통합 인증 서비스 화면',
  },
];

export default function ServiceCardsSection() {
  return (
    <section css={styles.container}>
      <div css={styles.inner}>
        {serviceCards.map((card, index) => (
          <div key={index} css={styles.card}>
            <div css={styles.cardTextArea}>
              <div css={styles.badge}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.icon.src}
                  alt={card.badgeText}
                  css={card.iconStyle === 'large' ? styles.badgeIconLarge : styles.badgeIcon}
                />
                <span css={styles.badgeText(card.badgeColor)}>
                  {card.badgeText}
                </span>
              </div>
              <h3 css={styles.cardTitle}>{card.title}</h3>
              <p css={styles.cardDesc}>{card.description}</p>
              <span css={styles.ctaLink}>
                더 알아보기
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ArrowRight.src} alt="" />
              </span>
            </div>
            <div css={styles.cardImageArea}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image.src} alt={card.imageAlt} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
