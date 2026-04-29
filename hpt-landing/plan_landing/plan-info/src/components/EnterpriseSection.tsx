"use client";

const enterpriseFeatures = [
  {
    title: "서비스 커스터마이징",
    desc: "기업 환경에 맞게 필요한 기능 선택 및 구성",
    badges: ["동시 상담 제한", "상담사 재연결", "실시간 상담 번역"],
  },
  {
    title: "API 연동 지원",
    desc: "자사 시스템과 직접 연동하여 상담 데이터 활용 가능",
    badges: ["상담 내역 조회", "고객 조회", "REST API 제공"],
  },
  {
    title: "자체 서비스 연동",
    desc: "상담 중 필요한 업무 별도 이동 없이 한 화면에서 처리 가능",
    badges: ["본인인증", "회원가입", "기존 시스템 연동"],
  },
];

const steps = [
  { icon: "📋", label: "상담", duration: "1~2일" },
  { icon: "🔍", label: "요구사항 분석", duration: "1~2주" },
  { icon: "⚙️", label: "맞춤 설정", duration: "2~4주" },
  { icon: "🚀", label: "운영 지원", duration: "지속" },
];

const customersRow1 = ["CJ 올리브영", "쿠팡이츠", "우아한형제들", "코웨이", "KISA"];
const customersRow2 = ["LG유플러스", "코레일(한국철도공사)", "루이비통", "SK매직", "퍼시스"];

export default function EnterpriseSection() {
  return (
    <section id="enterprise" className="py-20 bg-gray-900 text-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Badge */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full mb-6">
            Enterprise
          </span>
          <h2 className="text-3xl font-bold mb-3">기업 맞춤 상담 플랫폼</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            기업 규모에 맞는 상담 시스템을 설계하고 운영할 수 있도록
            <br />
            맞춤 기능 및 전담 기술 지원을 제공합니다.
          </p>
        </div>

        {/* Features Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-12 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-1">Enterprise 주요 기능</h3>
          <p className="text-gray-400 text-sm mb-6">Pro의 모든 기능 포함</p>
          <ul className="space-y-5">
            {enterpriseFeatures.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-100">{feature.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{feature.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {feature.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-block px-2.5 py-1 text-[11px] font-medium text-blue-200 bg-blue-500/10 border border-blue-400/30 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-bold mb-2">도입 절차</h3>
          <p className="text-center text-xs text-gray-500 mb-8">
            ※ 프로젝트 범위에 따라 상이할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{step.label}</span>
                  <span className="text-[11px] text-blue-300">{step.duration}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-700 mt-[-28px]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customers */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-bold mb-6">Enterprise 고객사</h3>
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-3">
              {customersRow1.map((customer) => (
                <span
                  key={customer}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {customer}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {customersRow2.map((customer) => (
                <span
                  key={customer}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {customer}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">우리 회사에 필요한 기능이 있나요?</h3>
          <p className="text-gray-400 text-sm mb-6">
            기업 규모에 맞는 상담 시스템, 해피톡이 함께 설계합니다
          </p>
          <a href="https://www.happytalk.io/contact" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            도입 문의하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
