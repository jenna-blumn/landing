"use client";

import { useState } from "react";

type FeatureValue = boolean | string;

interface FeatureRow {
  name: string;
  free: FeatureValue;
  starter: FeatureValue;
  pro: FeatureValue;
}

interface FeatureCategory {
  category: string;
  features: FeatureRow[];
}

const featureData: FeatureCategory[] = [
  {
    category: "채팅 채널 연동",
    features: [
      { name: "기본 채널(웹채팅, 카카오톡)", free: true, starter: true, pro: true },
      { name: "확장 채널(네이버톡톡, 인스타그램)", free: false, starter: true, pro: true },
    ],
  },
  {
    category: "AI / 워크플로우",
    features: [
      { name: "워크플로우 빌더(챗봇, AI 에이전트)", free: true, starter: true, pro: true },
      { name: "채널/조건별 멀티 에이전트 구성", free: true, starter: true, pro: true },
      { name: "지식베이스 활용", free: true, starter: true, pro: true },
      { name: "AI 에이전트 자동 답변", free: false, starter: true, pro: true },
    ],
  },
  {
    category: "운영 연동",
    features: [
      { name: "고객 정보 조회", free: true, starter: true, pro: true },
      { name: "주문 및 배송 정보 조회(스마트스토어, 카페 24 등)", free: false, starter: true, pro: true },
      { name: "고객 태그 관리", free: false, starter: true, pro: true },
    ],
  },
  {
    category: "팀 / 조직 관리",
    features: [
      { name: "상담사 계정 추가", free: false, starter: true, pro: true },
      { name: "상담사 변경", free: false, starter: true, pro: true },
      { name: "매니저 계정 추가", free: false, starter: false, pro: true },
      { name: "상담 그룹 단위 관리", free: false, starter: false, pro: true },
    ],
  },
  {
    category: "통계 / 운영 고도화",
    features: [
      { name: "기간별 통계", free: false, starter: true, pro: true },
      { name: "상담사별 통계", free: false, starter: true, pro: true },
      { name: "상담 품질 통계 및 상담 평가", free: false, starter: false, pro: true },
      { name: "상담내역 조회/다운로드", free: false, starter: false, pro: true },
      { name: "통계 리포트/데이터 다운로드", free: false, starter: true, pro: true },
    ],
  },
  {
    category: "자동화",
    features: [
      { name: "시스템 자동/하이브리드 배분", free: false, starter: false, pro: true },
      { name: "Busy Time 안내", free: false, starter: false, pro: true },
      { name: "상담 대기 인원 안내", free: false, starter: false, pro: true },
      { name: "상담 건수 초과 안내", free: false, starter: false, pro: true },
    ],
  },
  {
    category: "브랜딩",
    features: [
      { name: "회사 로고 사용", free: false, starter: true, pro: true },
      { name: "웹채팅 고객 화면 기능/디자인 커스텀", free: false, starter: true, pro: true },
    ],
  },
];

const Check = () => (
  <svg className="w-5 h-5 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Dash = () => (
  <span className="text-gray-300 text-center block">&mdash;</span>
);

function CellValue({ value }: { value: FeatureValue }) {
  if (typeof value === "boolean") {
    return value ? <Check /> : <Dash />;
  }
  return <span className="text-sm text-blue-600 font-medium">{value}</span>;
}

function CategorySection({ category }: { category: FeatureCategory }) {
  return (
    <>
      <tr className="border-b border-gray-100">
        <td colSpan={4} className="py-4 px-2">
          <span className="text-sm font-bold text-gray-800">{category.category}</span>
        </td>
      </tr>
      {category.features.map((feature, idx) => (
        <tr
          key={feature.name}
          className={`border-b border-gray-50 ${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
          }`}
        >
          <td className="py-3.5 pr-4 text-sm text-gray-600 pl-8">{feature.name}</td>
          <td className="py-3.5 px-4 text-center">
            <CellValue value={feature.free} />
          </td>
          <td className="py-3.5 px-4 text-center">
            <CellValue value={feature.starter} />
          </td>
          <td className="py-3.5 px-4 text-center">
            <CellValue value={feature.pro} />
          </td>
        </tr>
      ))}
    </>
  );
}

export default function FeatureComparison() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 bg-white" id="comparison">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <span>플랜 세부 기능 {expanded ? "접기" : "보기"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {expanded && (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">플랜별 기능 비교</h2>
              <p className="text-gray-500 text-sm">각 플랜에서 제공하는 기능을 상세히 비교해보세요.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 pr-4 text-sm font-semibold text-gray-500 w-[40%]">기능</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-500 text-center w-[20%]">Free</th>
                    <th className="py-4 px-4 text-sm font-semibold text-gray-500 text-center w-[20%]">Starter</th>
                    <th className="py-4 px-4 text-sm font-semibold text-center w-[20%]">
                      <span className="text-blue-600 font-bold">Pro</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureData.map((category) => (
                    <CategorySection key={category.category} category={category} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
