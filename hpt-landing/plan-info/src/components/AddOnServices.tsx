"use client";

import { useState } from "react";

const planAllowances = [
  { plan: "Free", allowance: "-" },
  { plan: "Starter", allowance: "10건" },
  { plan: "Pro", allowance: "15건" },
  { plan: "Enterprise", allowance: "별도 협의" },
];

interface Addon {
  id: string;
  name: string;
  label: string;
  badgeText: string;
  title: string;
  description: string;
  features: string[];
  isPaid: boolean;
  status: string | null;
}

const addons: Addon[] = [
  {
    id: "assistant",
    name: "AI 어시스턴트",
    label: "상담 지원",
    badgeText: "무료 제공",
    title: "상담사를 돕는 AI",
    description:
      "상담 내용을 분석하여 분류, 요약, 감정 분석을 자동 수행합니다.",
    features: [
      "상담 내용 자동 분류",
      "상담 종료 후 자동 요약",
      "고객 감정 분석",
    ],
    isPaid: false,
    status: "현재 무료 제공",
  },
  {
    id: "agent",
    name: "AI 에이전트",
    label: "자동 응대",
    badgeText: "사용량 기반 과금",
    title: "고객을 직접 응대하는 AI",
    description:
      "고객 문의를 이해하고 자동 응대하거나 상담사 연결을 수행합니다.",
    features: [
      "질문 맥락 이해 및 응대 유형 자동 판단",
      "자동 답변 또는 상담 연결",
      "시스템과 연동해 실제 데이터 조회 가능",
    ],
    isPaid: true,
    status: null,
  },
  {
    id: "knowledge",
    name: "지식베이스",
    label: "지식 기반",
    badgeText: "무료 제공",
    title: "지식 등록 기반 자동 응답",
    description: "일관된 상담을 제공할 수 있도록 AI를 학습합니다",
    features: [
      "텍스트 · 파일 기반 지식 등록",
      "카테고리별 지식 체계화",
      "회사 기준에 맞는 답변 생성",
    ],
    isPaid: false,
    status: "현재 무료 제공",
  },
];

export default function AddOnServices() {
  const [selected, setSelected] = useState("agent");

  const current = addons.find((a) => a.id === selected)!;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-3 block">
            확장서비스
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            필요한 만큼 사용하는 AI 기능
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            필요한 기능만 선택해 사용하고, 사용량에 따라 비용이 발생합니다.
          </p>
        </div>

        {/* List + Detail */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - List */}
          <div className="lg:w-[260px] flex-shrink-0">
            <nav className="flex flex-row lg:flex-col gap-2">
              {addons.map((addon) => {
                const active = addon.id === selected;
                return (
                  <button
                    key={addon.id}
                    onClick={() => {
                      setSelected(addon.id);
                    }}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all ${
                      active
                        ? "bg-white shadow-md border border-blue-200 ring-1 ring-blue-100"
                        : "bg-transparent border border-transparent hover:bg-white/60 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            active ? "text-blue-600" : "text-gray-700"
                          }`}
                        >
                          {addon.name}
                        </p>
                      </div>
                      {active && (
                        <svg
                          className="w-4 h-4 text-blue-500 flex-shrink-0 hidden lg:block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        addon.id === "agent"
                          ? "text-orange-600 bg-orange-50"
                          : "text-green-700 bg-green-50"
                      }`}
                    >
                      {addon.badgeText}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right - Detail */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl p-8 lg:p-10 bg-white border border-gray-200">
              {/* Label */}
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-4 bg-blue-50 text-blue-600">
                {current.label}
              </span>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {current.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {current.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  주요 기능
                </p>
                <ul className="space-y-2.5">
                  {current.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <svg
                        className="w-4 h-4 flex-shrink-0 text-blue-500"
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
                      <span className="text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Agent: plan allowance table */}
              {current.isPaid && (
                <>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-800">
                        플랜별 무료 제공 건수
                      </p>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        프로모션 진행 중
                      </span>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-blue-100">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-50 text-gray-500">
                            <th className="text-left px-4 py-2.5 font-medium">
                              플랜
                            </th>
                            <th className="text-right px-4 py-2.5 font-medium">
                              무료 제공 건수
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {planAllowances.map((row) => (
                            <tr
                              key={row.plan}
                              className="border-t border-blue-100 bg-white"
                            >
                              <td className="px-4 py-2.5 text-gray-700 font-medium">
                                {row.plan}
                              </td>
                              <td className="px-4 py-2.5 text-right text-gray-600">
                                {row.allowance}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      ※ 무료 사용량은 월 기준으로 제공됩니다
                    </p>
                  </div>

                  {/* Billing policy + highlight */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-gray-800">무료 제공 건수 초과 시</span>{" "}
                      고객기준(DAU)/일단위 <span className="font-bold text-blue-700">1,000원</span> 과금
                    </p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      한 고객에게 여러 번 응대해도 추가 비용 없이 효율적으로 사용할 수 있습니다.
                    </p>
                  </div>
                </>
              )}

              {/* Free addons: status box */}
              {!current.isPaid && current.status && (
                <div className="rounded-xl p-4 bg-green-50 border border-green-100">
                  <p className="text-lg font-bold text-green-700">무료</p>
                  <p className="text-xs mt-0.5 text-green-600">
                    {current.status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
