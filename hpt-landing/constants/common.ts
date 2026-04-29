export const headerNavMenus = [
  {
    title: 'AI 에이전트',
    href: '/agent',
    dropdown: null,
  },
  { title: '제품소개', href: '/chat', dropdown: 'product' },
  { title: '플랜안내', href: '/price', dropdown: null },
  { title: '고객사례', href: '/client', dropdown: null },
  { title: '고객지원', href: '/contact', dropdown: 'support' },
];

export const HCC_CONTACT_URL =
  'https://mbisolution.recatch.cc/workflows/ikrixxrhfe';

export const PRODUCT_PATHS = ['/chat', '/hcc', '/chatbot-all'];
export const SUPPORT_PATHS = ['/contact', '/guide'];

export const productDropdownItems = [
  {
    icon: 'NavCardHappytalk',
    description: '클라우드 AICC 솔루션',
    title: '해피톡',
    href: '/chat',
  },
  {
    icon: 'NavCardChatbot',
    description: '전문가가 다 해주는 맞춤 컨설팅',
    title: '다해줌 서비스',
    href: '/chatbot-all',
  },
  {
    icon: 'NavCardSolution',
    description: '우리 기업에 딱 맞는 커스터마이징',
    title: '해피톡 구축형 솔루션',
    href: '/hcc',
  },
];

export const supportDropdownLinks = [
  { title: '도입 문의', href: '/contact', external: false, gtmEvent: '' },
  {
    title: '개발자 센터',
    href: 'https://developer-center.happytalk.io/',
    external: true,
    gtmEvent: 'HEADER_DEV_CENTER',
  },
  {
    title: '해피톡 가이드',
    href: '/guide',
    external: false,
    gtmEvent: '',
  },
];

export const mobileNavMenus = [
  {
    title: null,
    links: [{ title: 'AI 에이전트', href: '/agent' }],
  },
  {
    title: '제품소개',
    links: [
      { title: '해피톡', href: '/chat' },
      { title: '다해줌 서비스', href: '/chatbot-all' },
      { title: '해피톡 구축형 솔루션', href: '/hcc' },
    ],
  },
  {
    title: null,
    links: [{ title: '플랜안내', href: '/price' }],
  },
  {
    title: null,
    links: [{ title: '고객사례', href: '/client' }],
  },
  {
    title: '고객지원',
    links: [
      { title: '도입문의', href: '/contact' },
      { title: '개발자 센터', href: 'https://developer-center.happytalk.io/' },
      {
        title: '해피톡 가이드',
        href: '/guide',
      },
    ],
  },
];

export const footerLinks = [
  {
    title: '약관 및 정책',
    twoColumn: false,
    links: [
      {
        title: '이용약관',
        href: 'https://happytalk.io/auth/terms',
        gtmEvent: 'FOOTER_TERMS',
      },
      {
        title: '개인정보 처리방침',
        href: 'https://happytalk.io/auth/policies',
        gtmEvent: 'FOOTER_PRIVACY_POLICY',
      },
    ],
  },
  {
    title: '리소스',
    twoColumn: false,
    links: [
      {
        title: '블로그',
        href: 'https://blog.happytalk.io/',
        gtmEvent: 'FOOTER_BLOG',
      },
      {
        title: '서비스 소개서',
        href: 'https://sclu.io/share/bulk/file/bfKGJEdhn8Es',
        gtmEvent: 'FOOTER_SERVICE_OVERVIEW',
      },
    ],
  },
  {
    title: '다운로드',
    twoColumn: false,
    links: [
      {
        title: '윈도우 프로그램',
        href: 'https://happytalk.io/desktop_app/download/windows',
        gtmEvent: 'FOOTER_WINDOWS_APP',
      },
      {
        title: '안드로이드 앱',
        href: 'https://play.google.com/store/apps/details?id=com.mbi.happytalkconsultant&hl=ko',
        gtmEvent: 'FOOTER_ANDROID_APP',
      },
      {
        title: '아이폰 앱',
        href: 'https://apps.apple.com/kr/app/%ED%95%B4%ED%94%BC%ED%86%A1-%EA%B3%A0%EA%B0%9D%EC%83%81%EB%8B%B4%EC%9D%84-%EB%8D%94-%EC%9E%98%ED%95%98%EA%B2%8C/id1184789384',
        gtmEvent: 'FOOTER_IOS_APP',
      },
    ],
  },
  {
    title: '블룸에이아이',
    twoColumn: true,
    links: [
      {
        title: '회사소개',
        href: 'https://blumn.ai/',
        gtmEvent: 'FOOTER_COMPANY',
      },
      {
        title: '콜브릿지',
        href: 'https://callbridge.ai/',
        gtmEvent: 'FOOTER_CALL_CENTER',
      },
      {
        title: '헤이데어',
        href: 'https://hey-there.io/',
        gtmEvent: 'FOOTER_HEY-THERE',
      },
      {
        title: '해피싱크',
        href: 'https://www.happysync.io/',
        gtmEvent: 'FOOTER_HAPPYSYNC',
      },
      {
        title: '스마트메시지+',
        href: 'https://smplus.blumn.ai/',
        gtmEvent: 'FOOTER_SMART_MESSAGE_PLUS',
      },
      {
        title: '카카오 알림톡',
        href: 'https://luna-m.ai/',
        gtmEvent: 'FOOTER_KAKAO_ALIMTALK',
      },
    ],
  },
];
