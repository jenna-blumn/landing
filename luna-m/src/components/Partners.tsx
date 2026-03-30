import { useScrollReveal } from "@/hooks/useScrollReveal";
import imwebLogo from "@/assets/imweb-logo.png";

const partners = [
  { name: '여기어때', subName: 'Yeogi', logo: 'https://www.yeogi.com/logo.png', h: 20 },
  { name: '카페24', subName: 'Cafe24', logo: 'https://img.echosting.cafe24.com/imgcafe24com/images/common/cafe24.svg', h: 22 },
  { name: '아임웹', subName: 'imweb', logo: imwebLogo, h: 40 },
  { name: '토스', subName: 'Toss', logo: 'https://static.toss.im/icons/png/4x/icon-toss-logo.png', h: 40 },
  { name: '에이피알', subName: 'APR', logo: 'https://i.namu.wiki/i/PvAWh7m_62KfKKZz8cByA6j9Nt-hRSmrHkbC4qQD4NOHzhu1tmAfCDIuHbBO0R5bVDr6W0VrFpmjL2nLhc5KdA.svg' },
  { name: '젝시믹스', subName: 'Xexymix', logo: 'https://xexymix.jpg3.kr/xexymix/main/mobile/2025/xexy_logo.png', scale: 0.8 },
  { name: '안다르', subName: 'andar', logo: 'https://andar.co.kr/web/upload/category/logo/v2_051cdf9e4f65a789dd144e8faa6a486c_VOrZJRX90X_top.jpg', h: 40 },
  { name: '석플란트치과', subName: 'Seokplant', logo: 'https://clogo.saramin.co.kr/company/logo/201902/27/pnjoh2_uc6u-0_logo.jpg', h: 40 },
  { name: '공구우먼', subName: 'Gongguwoman', logo: 'https://www.09women.com/design/09women/img/main/logo_25ss.png', h: 18 },
  { name: '영원아웃도어', subName: 'Youngone Outdoor', logo: 'https://www.youngonestore.co.kr/cmsstatic/theme/2/Youngone_Outdoor_CI.svg' },
  { name: '롯데호텔', subName: 'LOTTE HOTEL', logo: 'https://www.lottehotel.com/assets/images/common/ico_logo_global_lottehotels_white.svg', invert: true },
  { name: '메디테라피', subName: 'Meditherapy', logo: 'https://meditherapy.co.kr/web_img/25new/meditherapy_black_logo_2025ver.png' },
  { name: '데일리앤코', subName: 'Daily&Co', logo: 'https://cdn.shopify.com/s/files/1/0767/3469/3668/files/logo.svg' },
  { name: '핀다', subName: 'Finda', logo: 'https://image.fnnews.com/resource/media/image/2021/07/29/202107290906268840_e.jpg', h: 22 },
  { name: '돌쇠네농산물', subName: 'Dolfarmer', logo: 'https://www.dolfarmer.com/data/board/sm7396/28/ds_symbol.png' },
  { name: '핫핑', subName: 'Hotping', logo: 'https://hotping.co.kr/renewSkin/img/new/logo.png', h: 20 },
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
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-[180px] object-contain opacity-60 group-hover:opacity-100 mb-2"
                  style={{
                    height: 'h' in partner && partner.h ? partner.h : 32,
                    transition: 'opacity 200ms ease',
                    ...('scale' in partner && partner.scale ? { transform: `scale(${partner.scale})` } : {}),
                    ...('invert' in partner && partner.invert ? { filter: 'invert(1)' } : {}),
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-lg font-bold text-zinc-400 group-hover:text-zinc-700 mb-2 tracking-tight" style={{ transition: 'color 200ms ease' }}>
                  {partner.subName || partner.name}
                </span>
              )}
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
