"use client";

import { useState } from "react";

const teamSizeOptions = [
  { id: "team_solo", label: "혼자 운영", tier: "free" },
  { id: "team_single", label: "단일 부서 운영", tier: "starter" },
  { id: "team_multi_dept", label: "다중 부서 운영", tier: "pro" },
];

const featureCategories = [
  {
    name: "채팅 채널",
    icon: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    features: [
      { id: "ch_web", label: "웹채팅", tier: "free" },
      { id: "ch_kakao", label: "카카오톡", tier: "free" },
      { id: "ch_naver", label: "네이버톡톡", tier: "starter" },
      { id: "ch_insta", label: "인스타그램", tier: "starter" },
    ],
  },
  {
    name: "상담 운영",
    icon: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    features: [
      { id: "mgmt_manual", label: "수동 운영", tier: "free" },
      { id: "mgmt_stats", label: "상담 이력 확인", tier: "starter" },
      { id: "mgmt_order", label: "주문 정보 연동(카페 24, 스마트스토어)", tier: "starter" },
      { id: "mgmt_report", label: "상담 데이터 분석 리포트", tier: "pro" },
    ],
  },
  {
    name: "자동화 및 확장",
    icon: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    features: [
      { id: "auto_status_msg", label: "상담 상태별 자동 메시지", tier: "pro" },
      { id: "auto_assign", label: "자동 상담 배정", tier: "pro" },
      { id: "ext_api", label: "API 제공", tier: "enterprise" },
      { id: "ext_custom", label: "맞춤 연동 지원", tier: "enterprise" },
    ],
  },
];

export default function PlanCalculator() {
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const tierRank: Record<string, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  };

  const getRecommendedPlan = (): string => {
    let maxTier = "free";

    // 팀 규모 tier
    if (selectedTeamSize) {
      const teamOption = teamSizeOptions.find((o) => o.id === selectedTeamSize);
      if (teamOption && tierRank[teamOption.tier] > tierRank[maxTier]) {
        maxTier = teamOption.tier;
      }
    }

    // 기능 선택 tier
    const selected = featureCategories
      .flatMap((c) => c.features)
      .filter((f) => selectedFeatures.includes(f.id));

    for (const f of selected) {
      if (tierRank[f.tier] > tierRank[maxTier]) {
        maxTier = f.tier;
      }
    }

    return maxTier;
  };

  const showResult = selectedTeamSize !== null || selectedFeatures.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* 필요 기능 선택 */}
        <div className={`p-6 rounded-2xl border transition-all ${selectedFeatures.length > 0 ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-white"}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold text-gray-900">
              필요 기능 선택
            </span>
          </div>

          <div className="space-y-6">
            {/* 팀 규모 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-500">팀 구조</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teamSizeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedTeamSize(selectedTeamSize === opt.id ? null : opt.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTeamSize === opt.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {featureCategories.map((category) => (
              <div key={category.name}>
                {/* Category label */}
                <div className="flex items-center gap-2 mb-3">
                  {category.icon}
                  <span className="text-sm font-medium text-gray-500">{category.name}</span>
                </div>
                {/* Feature chips */}
                <div className="flex flex-wrap gap-2">
                  {category.features.map((feat) => (
                    <button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedFeatures.includes(feat.id)
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {feat.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Result */}
      {showResult && (() => {
        const plan = getRecommendedPlan();
        const isEnterprise = plan === "enterprise";
        return (
          <div className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-center">
            <p className="text-sm text-gray-500 mb-1">위 조건으로 상담했을 때 추천 플랜은</p>
            <p className="text-xl font-bold text-blue-600 mb-6">
              {plan === "free" && "프리 플랜"}
              {plan === "starter" && "스타터 플랜"}
              {plan === "pro" && "프로 플랜"}
              {plan === "enterprise" && "엔터프라이즈 플랜"}
              을 안내해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {isEnterprise ? (
                <a
                  href="https://www.happytalk.io/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  도입 문의하기
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              ) : (
                <a
                  href="https://counselor.happytalk.io/auth/join"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  14일 무료로 시작하기
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
