import { ArrowRight } from 'lucide-react';

const footerLinks = [
  {
    title: '약관 및 정책',
    links: [
      { label: '이용약관', href: 'https://happytalk.io/auth/terms' },
      { label: '개인정보 처리방침', href: 'https://happytalk.io/auth/policies' },
    ],
  },
  {
    title: '리소스',
    links: [
      { label: '블로그', href: 'https://blog.happytalk.io/' },
      { label: '서비스 소개서', href: 'https://sclu.io/share/bulk/file/bfKGJEdhn8Es' },
    ],
  },
  {
    title: '다운로드',
    links: [
      { label: '윈도우 프로그램', href: 'https://happytalk.io/desktop_app/download/windows' },
      { label: '안드로이드 앱', href: 'https://play.google.com/store/apps/details?id=com.mbi.happytalkconsultant&hl=ko' },
      { label: '아이폰 앱', href: 'https://apps.apple.com/kr/app/%ED%95%B4%ED%94%BC%ED%86%A1-%EA%B3%A0%EA%B0%9D%EC%83%81%EB%8B%B4%EC%9D%84-%EB%8D%94-%EC%9E%98%ED%95%98%EA%B2%8C/id1184789384' },
    ],
  },
  {
    title: '블룸에이아이',
    links: [
      { label: '회사소개', href: 'https://blumn.ai/' },
      { label: '콜브릿지', href: 'https://callbridge.ai/' },
      { label: '헤이데어', href: 'https://hey-there.io/' },
      { label: '해피싱크', href: 'https://www.happysync.io/' },
      { label: '스마트메시지+', href: 'https://lunasoft.co.kr/home/main/page/service/smartmsgPlusIntro' },
      { label: '카카오 알림톡', href: 'https://lunasoft.co.kr/home/main/page/service/lunatalk' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        {/* Upper: Brand + Links */}
        <div className="py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Brand + Contact */}
          <div className="shrink-0 lg:w-[240px]">
            <div className="mb-8">
              <span className="font-bold text-lg text-zinc-900" style={{ letterSpacing: '-0.02em' }}>
                루나M
              </span>
            </div>

            <div className="mb-6">
              <p className="text-zinc-500 text-[13px] leading-relaxed">
                <span>24시간 고객센터</span>
                <span className="mx-1.5 text-zinc-300">·</span>
                <span>help@blumn.ai</span>
              </p>
              <p className="text-zinc-900 text-2xl font-bold tracking-tight mt-1">1666-5263</p>
            </div>

            <a
              href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg px-4 py-2 text-[13px] transition-colors"
            >
              도입 문의하기 <ArrowRight size={14} />
            </a>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 flex-1">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <p className="text-zinc-400 text-[13px] font-medium mb-4">{section.title}</p>
                {section.title === '블룸에이아이' ? (
                  <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Company Info + Copyright */}
        <div className="py-8 border-t border-zinc-100">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="font-bold text-zinc-700 text-[13px] mb-1.5">(주)블룸에이아이</p>
              <div className="space-y-0.5 text-zinc-400 text-[12px] leading-relaxed">
                <p>서울 중구 서소문로 89, 순화빌딩 6층, 대표이사: 김범수, 박진영</p>
                <p>사업자등록번호: 773-87-00356 통신판매업 신고번호: 제 2024-서울중구-1646호</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-zinc-400 text-[12px]">© Blumn AI Corp. All rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
