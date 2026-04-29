"use client";

import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">happytalk</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              AI 에이전트
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              채팅상담
            </a>
            <a href="#" className="text-sm font-semibold text-blue-600">
              플랜안내
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              고객사례
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              고객지원
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              체험판 무료 시작
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-600 py-2">AI 에이전트</a>
              <a href="#" className="text-sm text-gray-600 py-2">채팅상담</a>
              <a href="#" className="text-sm font-semibold text-blue-600 py-2">플랜안내</a>
              <a href="#" className="text-sm text-gray-600 py-2">고객사례</a>
              <a href="#" className="text-sm text-gray-600 py-2">고객지원</a>
              <a href="#" className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg text-center">
                체험판 무료 시작
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
