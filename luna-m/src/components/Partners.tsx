import { useScrollReveal } from "@/hooks/useScrollReveal";

const partners = [
  { name: '뤼이드', subName: 'Riiid · 산타토익', logo: 'https://cdn.prod.website-files.com/646ac796e1c3936a52c88397/646ac796e1c3936a52c8840e_img_logo_santa_gnb.png' },
  { name: '에코마케팅', subName: '× 대웅제약', logo: 'https://opening-attachments.greetinghr.com/20230717/c77a8e44-7b1a-4f68-8230-9c94222503e1/ECHOmarketing_BI.png' },
  { name: 'LG생활건강', subName: '닥터그루트 · 밀리언뷰티', logo: 'https://www.careshop.co.kr/ecm_upload/news/news_17007014641060.jpg' },
  { name: '안다르', subName: 'andar', logo: 'https://cdn.itnk.co.kr/news/photo/202308/71855_37235_743.jpg' },
  { name: '에이피알', subName: 'APR', logo: 'https://i.namu.wiki/i/PvAWh7m_62KfKKZz8cByA6j9Nt-hRSmrHkbC4qQD4NOHzhu1tmAfCDIuHbBO0R5bVDr6W0VrFpmjL2nLhc5KdA.svg' },
  { name: '젝시믹스', subName: 'Xexymix', logo: 'https://xexymix.jpg3.kr/xexymix/main/mobile/2025/xexy_logo.png', scale: 0.8 },
  { name: '카카오모빌리티', subName: '오늘의픽업', logo: 'https://t1.kakaocdn.net/kakaomobility/company_website/images/logo.svg' },
  { name: '동국제약', subName: 'DK SHOP', logo: 'https://m.edkshop.com/web/upload/img/dkmain_logo_mobile1.png' },
  { name: '인생네컷', subName: 'Life Four Cuts', logo: 'https://cdn.imweb.me/thumbnail/20260304/ee2c0ed34edf8.png' },
  { name: '셀퓨전씨', subName: 'CellfusionC', logo: 'https://cellfusionc.co.kr/web/upload/logo.svg' },
  { name: '클릭앤퍼니', subName: 'Clicknfunny', logo: 'https://www.clicknfunny.com/design/smblue111/wib/img/logo.svg' },
  { name: '그리티', subName: 'Grittee · 감탄브라', logo: 'https://www.gritee.com/data/skin/respon_default/images/skin/logo.svg' },

  { name: '365MC', subName: '', logo: 'https://www.365mc.co.kr/v2/i365mc/images/intro/why_bi.png', invert: true },
  { name: '랩노쉬', subName: 'by 이그니스', logo: 'https://labnosh.com/web/upload/category/logo/v2_614ae989071df0b30e0e58f18599837f_T9tcIF1E9t_top.jpg', scale: 0.8 },
];

const Partners = () => {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal(0.2);
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal(0.1);

  return (
    <section className="relative z-20 bg-zinc-50/50 py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-14 scroll-reveal ${headerRevealed ? 'revealed' : ''}`}>
          <span className="badge-section mb-5 inline-flex">
            파트너사
          </span>
          <h2 className="heading-2 text-zinc-900 mb-4">
            루나M을 도입한 대표 파트너사
          </h2>
          <p className="desc-text max-w-lg">
            다양한 업계의 선도 기업들이 루나M과 함께 성장하고 있습니다
          </p>
        </div>

        {/* Partner Grid */}
        <div ref={gridRef} className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 scroll-reveal ${gridRevealed ? 'revealed' : ''}`}>
          {partners.map((partner, index) => (
            <div key={index} className="group partner-item flex flex-col items-center justify-center min-h-[96px] scroll-reveal-item" style={{ '--reveal-i': index } as React.CSSProperties}>
              {'logo' in partner && partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-8 max-w-[180px] object-contain opacity-60 group-hover:opacity-100 mb-2" style={{ transition: 'opacity 200ms ease', ...('invert' in partner && partner.invert ? { filter: 'invert(1)' } : {}), ...('scale' in partner && partner.scale ? { transform: `scale(${partner.scale})` } : {}) }} />
              ) : null}
              <span className="text-[13px] font-semibold text-zinc-800 text-center leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-zinc-600 mt-8">
          외 다수의 파트너사와 함께하고 있습니다
        </p>
      </div>
    </section>
  );
};

export default Partners;
