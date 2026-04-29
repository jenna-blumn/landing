'use client';

import ChatbotAllHeroSection from '@/components/chatbot-all/ChatbotAllHeroSection';
import ChatbotAllEmpathySection from '@/components/chatbot-all/ChatbotAllEmpathySection';
import ChatbotAllProcessSection from '@/components/chatbot-all/ChatbotAllProcessSection';
import ChatbotAllStatsSection from '@/components/chatbot-all/ChatbotAllStatsSection';
import ChatbotAllPopularSection from '@/components/chatbot-all/ChatbotAllPopularSection';
import ChatbotAllAdvantagesSection from '@/components/chatbot-all/ChatbotAllAdvantagesSection';
import CTASection from '@/components/common/CTASection';

export default function ChatbotAllPage() {
  return (
    <>
      <ChatbotAllHeroSection />
      <ChatbotAllEmpathySection />
      <ChatbotAllProcessSection />
      <ChatbotAllStatsSection />
      <ChatbotAllPopularSection />
      <ChatbotAllAdvantagesSection />
      <CTASection
        gtmEvent="CHATBOT_ALL_SALES_INQUIRY"
        description={null}
        ctaText="무료로 시작하기"
        ctaHref="https://counselor.happytalk.io/auth/join"
        badges={['14일 무료체험', '가입 즉시 상담 시작', '합리적인 플랜']}
      />
    </>
  );
}
