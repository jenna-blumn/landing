export const QUICK_QUESTIONS = [
  {
    id: 'delivery',
    label: '주문했는데 배송은 언제 오나요?',
    gtmEvent: 'AGENT_PRESET_01',
  },
  {
    id: 'cancel',
    label: '주문 취소하고 싶은데 가능한가요?',
    gtmEvent: 'AGENT_PRESET_02',
  },
  {
    id: 'recommend',
    label: '입문용으로 많이 선택하는 상품 추천해 주세요.',
    gtmEvent: 'AGENT_PRESET_03',
  },
  {
    id: 'delayed',
    label: '배송이 너무 늦어요. 언제까지 기다려야 하나요?',
    gtmEvent: 'AGENT_PRESET_04',
  },
  {
    id: 'return',
    label: '반품 신청은 어떻게 하나요?',
    gtmEvent: 'AGENT_PRESET_05',
  },
];

const LOGO_PATH = '/images/logo';

type ChatLogo = {
  name: string;
  src: string;
  frame: {
    width: number;
    height: number;
  };
  radius?: number;
};

export const LOGO_ROW1: ChatLogo[] = [
  { name: '링티', src: `${LOGO_PATH}/logo-ringti.png`, frame: { width: 134, height: 100 } },
  { name: '삼성증권', src: `${LOGO_PATH}/logo-samsung-securities.png`, frame: { width: 88, height: 34 } },
  { name: '뱅샐', src: `${LOGO_PATH}/logo-banksalad.png`, frame: { width: 76, height: 76 } },
  { name: '우리은행', src: `${LOGO_PATH}/logo-woori-bank.png`, frame: { width: 63, height: 60 } },
  { name: '탐탐', src: `${LOGO_PATH}/logo-tomntoms.png`, frame: { width: 64, height: 64 } },
  { name: 'OK저축은행', src: `${LOGO_PATH}/logo-ok-savings-bank.png`, frame: { width: 168, height: 84 } },
  { name: '경기도청', src: `${LOGO_PATH}/logo-gyeonggi.png`, frame: { width: 128, height: 96 } },
  { name: 'AHC', src: `${LOGO_PATH}/logo-ahc.png`, frame: { width: 112, height: 84 } },
  { name: '이즐(캐시비)', src: `${LOGO_PATH}/logo-ezl-cashbee.png`, frame: { width: 136, height: 102 } },
  { name: 'DrG', src: `${LOGO_PATH}/logo-drg.png`, frame: { width: 142, height: 106 } },
  { name: 'Genie', src: `${LOGO_PATH}/logo-genie.png`, frame: { width: 176, height: 132 } },
  { name: '여기어때', src: `${LOGO_PATH}/logo-goodchoice.png`, frame: { width: 152, height: 114 } },
  { name: '토요타', src: `${LOGO_PATH}/logo-toyota.png`, frame: { width: 192, height: 144 } },
  { name: '티오더', src: `${LOGO_PATH}/logo-torder.png`, frame: { width: 176, height: 132 } },
];

export const LOGO_ROW2: ChatLogo[] = [
  { name: '페덱스', src: `${LOGO_PATH}/logo-fedex.png`, frame: { width: 112, height: 84 } },
  { name: '배민커넥트', src: `${LOGO_PATH}/logo-baemin-connect.png`, frame: { width: 146, height: 110 } },
  { name: 'yes24', src: `${LOGO_PATH}/logo-yes24.png`, frame: { width: 162, height: 122 } },
  { name: '영단기', src: `${LOGO_PATH}/logo-youngdangi.png`, frame: { width: 160, height: 120 } },
  { name: 'KB국민카드', src: `${LOGO_PATH}/logo-kb-card.png`, frame: { width: 70, height: 52 } },
  { name: '제주관광', src: `${LOGO_PATH}/logo-jeju-tourism.png`, frame: { width: 126, height: 94 } },
  { name: '코레일', src: `${LOGO_PATH}/logo-korail.png`, frame: { width: 100, height: 50 } },
  { name: '토스', src: `${LOGO_PATH}/logo-toss.png`, frame: { width: 84, height: 84 }, radius: 10 },
  { name: '올리브영', src: `${LOGO_PATH}/logo-olive-young.png`, frame: { width: 60, height: 60 }, radius: 10 },
  { name: '더현대', src: `${LOGO_PATH}/logo-the-hyundai.png`, frame: { width: 60, height: 60 }, radius: 10 },
  { name: '티머니', src: `${LOGO_PATH}/logo-tmoney.png`, frame: { width: 60, height: 60 }, radius: 7 },
  { name: '퍼시스', src: `${LOGO_PATH}/logo-fursys.png`, frame: { width: 144, height: 108 } },
  { name: '캐시비', src: `${LOGO_PATH}/logo-ezl.png`, frame: { width: 60, height: 60 }, radius: 10 },
];
