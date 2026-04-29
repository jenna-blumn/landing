"use client";

const plans = [
  {
    name: "Free",
    price: "0",
    unit: "원",
    description: "상담 운영을 처음 시작하는 팀에 추천",
    badge: null,
    highlight: false,
    features: [
      "최근 상담 내역 확인 (7일)",
      "웹채팅 · 카카오톡 기본 채널 제공",
      "상담 분류 및 기본 자동화 기능 제공",
      "AI 기능 체험 및 테스트 환경 제공",
    ],
    cta: "시작하기",
    ctaStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ctaHref: "https://counselor.happytalk.io/auth/join",
    subtext: "계정 1개 제공",
  },
  {
    name: "Starter",
    price: "35,000",
    unit: "원/월",
    description: "상담 운영을 확장하는 팀에 추천",
    badge: null,
    highlight: false,
    features: [
      "+ Free의 모든 기능",
      "채팅 채널 추가(네이버톡톡, 인스타그램)",
      "주문 정보 연동(카페 24, 스마트스토어)",
      "무제한 상담 응대, 상담 계정 추가",
      "기본 상담 통계 및 리포트",
    ],
    cta: "시작하기",
    ctaStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ctaHref: "https://counselor.happytalk.io/auth/join",
    subtext: "계정당, VAT 별도",
  },
  {
    name: "Pro",
    price: "85,000",
    unit: "원/월",
    description: "상담 운영 자동화가 필요한 팀에 추천",
    badge: "추천",
    highlight: true,
    features: [
      "+ Starter의 모든 기능",
      "상담 자동 배정(자동/하이브리드 배정)",
      "상담 팀 관리(매니저 계정, 그룹별 관리)",
      "상담 상태별 다양한 자동 메시지",
      "상담 품질 통계 및 리포트",
    ],
    cta: "시작하기",
    ctaStyle: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    ctaHref: "https://counselor.happytalk.io/auth/join",
    subtext: "계정당, VAT 별도",
  },
];

export default function PricingCards() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/20 scale-[1.02] z-10"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-bold mb-2 ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className={`text-3xl font-extrabold ${
                      plan.highlight ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-blue-200" : "text-gray-400"
                      }`}
                    >
                      {plan.unit}
                    </span>
                  )}
                </div>
                {plan.subtext && (
                  <p
                    className={`text-xs ${
                      plan.highlight ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {plan.subtext}
                  </p>
                )}
                <p
                  className={`text-sm mt-3 ${
                    plan.highlight ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => {
                  const isInherited = feature.startsWith("+ ");
                  return (
                    <li key={i} className="flex items-start gap-2">
                      {isInherited ? (
                        <span className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <svg
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            plan.highlight ? "text-blue-200" : "text-blue-500"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          isInherited
                            ? plan.highlight ? "text-blue-200" : "text-gray-400"
                            : plan.highlight ? "text-blue-50" : "text-gray-600"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <a
                href={plan.ctaHref}
                target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={plan.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          모든 플랜은 14일 동안 프로 플랜의 모든 기능을 무료로 체험할 수 있습니다.
        </p>
    </div>
  );
}
