'use client';

import ChatHeroSection from '@/components/chat/ChatHeroSection';
import LogosSection from '@/components/chat/LogosSection';
import SolutionCardsSection from '@/components/chat/SolutionCardsSection';
import PreviewSection from '@/components/chat/PreviewSection';
import AIAgentSection from '@/components/chat/AIAgentSection';
import StatsSection from '@/components/chat/StatsSection';
import CTASection from '@/components/common/CTASection';

export default function ChatPage() {
  return (
    <>
      <ChatHeroSection />
      <LogosSection />
      <SolutionCardsSection />
      <StatsSection />
      <AIAgentSection />
      <PreviewSection />
      <CTASection gtmEvent="CHAT_SALES_INQUIRY" />
    </>
  );
}
