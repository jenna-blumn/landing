import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import iso27001Img from '../assets/iso27001.png';
import daubadgeImg from '../assets/daubadge.png';
import dauCertImg from '../assets/dau-msg-certificate.jpg';

const footerLinks = [
  {
    title: '약관 및 정책',
    links: [
      { label: '서비스 이용약관', href: 'https://www.notion.so/2c5c0b1104dd802a83e4dcd94a5a6e14?pvs=21' },
      { label: '개인정보 처리방침', href: 'https://www.notion.so/2c5c0b1104dd800bb205c2ceb3c40ff7?pvs=21' },
    ],
  },
  {
    title: '블룸에이아이',
    links: [
      { label: '회사소개', href: 'https://blumn.ai/' },
      { label: '해피톡', href: 'https://www.happytalk.io/' },
      { label: '콜브릿지', href: 'https://callbridge.ai/' },
      { label: '헤이데어', href: 'https://hey-there.io/' },
      { label: '해피싱크', href: 'https://www.happysync.io/' },
      { label: '스마트메시지+', href: 'http://smplus.blumn.ai/' },
    ],
  },
];

const Footer = () => {
  const [ismsOpen, setIsmsOpen] = React.useState(false);
  const [dauOpen, setDauOpen] = React.useState(false);

  return (
    <>
    <footer className="bg-white border-t border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        {/* Upper: Brand + Links */}
        <div className="py-12 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Brand + Contact */}
          <div className="shrink-0 lg:w-[240px]">
            <div className="mb-4">
              <span className="font-bold text-lg text-zinc-900" style={{ letterSpacing: '-0.02em' }}>
                루나M
              </span>
            </div>

            <div>
              <p className="text-zinc-500 text-[13px] leading-relaxed">
                <span>csm@blumn.ai</span>
              </p>
              <p className="text-zinc-900 text-2xl font-bold tracking-tight mt-1 mb-4">1644-4998</p>
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
          <div className="grid grid-cols-2 md:grid-cols-[40%_60%] gap-8 md:gap-6 flex-1">
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
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setIsmsOpen(true)} className="cursor-pointer">
                  <img src="https://shoplic.kr/wp-content/uploads/2025/06/ISMS.png" alt="ISMS 인증" className="w-[36px] h-[36px] rounded-full object-cover" />
                </button>
                <img src={iso27001Img} alt="ISO 27001 인증" className="w-[36px] h-[36px] rounded-full object-cover" />
                <button onClick={() => setDauOpen(true)} className="cursor-pointer">
                  <img src={daubadgeImg} alt="DAU 인증" className="w-[36px] h-[36px] rounded-full object-cover" />
                </button>
              </div>
              <p className="text-zinc-400 text-[12px]">© Blumn AI Corp. All rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    {/* ISMS Modal */}
    {ismsOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8" onClick={() => setIsmsOpen(false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setIsmsOpen(false)} className="sticky top-0 float-right text-zinc-400 hover:text-zinc-900 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-lg font-bold text-zinc-900 mb-6">블룸에이아이 정보보호 관리체계 인증 획득</h2>
          <div className="space-y-4 text-[14px] text-zinc-600 leading-relaxed">
            <div>
              <p className="font-semibold text-zinc-900 mb-1">🔒 인증범위</p>
              <p>채팅상담, ARS 콜센터 솔루션 및 고객관리 솔루션 운영<br />(정보통신방법 제47조의7에 따른 인증의 특례)</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900 mb-1">🔒 유효기간</p>
              <p>2025.11.19 ~ 2028.11.18</p>
            </div>
          </div>
          <img src="https://landing.happytalk.io/_next/static/media/isms_certificate.6cdb089a.png" alt="ISMS 인증서" className="w-full rounded-lg mt-6" />
        </div>
      </div>
    )}

    {/* DAU Modal */}
    {dauOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8" onClick={() => setDauOpen(false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setDauOpen(false)} className="sticky top-0 float-right text-zinc-400 hover:text-zinc-900 transition-colors">
            <X size={20} />
          </button>
          <img src={dauCertImg} alt="DAU 메시지 인증서" className="w-full rounded-lg" />
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;
