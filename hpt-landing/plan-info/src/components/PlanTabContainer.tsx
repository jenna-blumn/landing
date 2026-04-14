"use client";

import { useState } from "react";
import PlanCalculator from "./PlanCalculator";
import PricingCards from "./PricingCards";

export default function PlanTabContainer() {
  const [activeTab, setActiveTab] = useState<"recommend" | "all">("recommend");

  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("recommend")}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
              activeTab === "recommend"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            추천 플랜 찾기
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
              activeTab === "all"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            전체 플랜 보기
          </button>
        </div>

        {/* Content */}
        {activeTab === "recommend" ? (
          <PlanCalculator />
        ) : (
          <>
            {/* Enterprise banner above plan cards */}
            <a
              href="#enterprise"
              className="group mb-5 rounded-xl bg-gradient-to-r from-violet-50 via-white to-amber-50 border border-violet-100 px-4 py-2.5 flex items-center justify-between gap-3 hover:border-violet-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="hidden sm:flex flex-shrink-0 w-7 h-7 rounded-lg bg-violet-600 items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                  <span className="text-violet-600">기업 맞춤 상담 플랫폼</span>
                  <span className="ml-2 text-[11px] font-normal text-gray-500">Enterprise 플랜</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 flex-shrink-0">
                어떻게 세팅되나요?
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <PricingCards />
          </>
        )}
      </div>
    </section>
  );
}
