"use client";

const linkColumns = [
  {
    title: "약관 및 정책",
    links: ["이용약관", "개인정보 처리방침"],
  },
  {
    title: "리소스",
    links: ["블로그", "서비스 소개서"],
  },
  {
    title: "다운로드",
    links: ["윈도우 프로그램", "안드로이드 앱", "아이폰 앱"],
  },
];

const blumnServices = [
  ["회사소개", "해피싱크"],
  ["콜브릿지", "스마트메시지+"],
  ["헤이데어", "카카오 알림톡"],
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-gray-200">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="mb-5">
              <span className="text-gray-900 font-bold text-xl tracking-tight">happytalk</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              24시간 고객센터 <span className="mx-1 text-gray-300">|</span> help@blumn.ai
            </p>
            <p className="text-lg font-bold text-gray-900 mb-5">1666-5263</p>
            <a
              href="https://www.happytalk.io/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              도입 문의하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Link columns */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-gray-900 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Blumn AI services */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-gray-900 mb-4">블룸에이아이</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {blumnServices.flat().map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 leading-relaxed">
              (주)블룸에이아이 &nbsp; 서울 중구 서소문로 89, 순화빌딩 6층, 대표이사: 김범수, 박진영 &nbsp; 사업자등록번호: 773-87-00356 &nbsp; 통신판매업 신고번호: 제 2024-서울중구-1646호
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              © Blumn AI Corp. All rights Reserved.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
              ISMS
            </span>
            <span className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
              ISMS-P
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
