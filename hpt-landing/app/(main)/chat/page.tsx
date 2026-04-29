'use client';

import ChatHeroSection from '@/components/chat/ChatHeroSection';
import LogosSection from '@/components/chat/LogosSection';
import SolutionCardsSection from '@/components/chat/SolutionCardsSection';
import PreviewSection from '@/components/chat/PreviewSection';
import AIAssistantSection from '@/components/chat/AIAssistantSection';
import AIAgentSection from '@/components/chat/AIAgentSection';
import SolutionFlowSection from '@/components/chat/SolutionFlowSection';
import FindSolutionSection from '@/components/chat/FindSolutionSection';
import StatsSection from '@/components/chat/StatsSection';
import CTASection from '@/components/common/CTASection';

export default function ChatPage() {
  return (
    <>
      <ChatHeroSection />
      <LogosSection />
      <SolutionCardsSection />
      <PreviewSection />
      <AIAssistantSection />
      <AIAgentSection />
      <SolutionFlowSection />
      <FindSolutionSection />
      <StatsSection />
      <CTASection gtmEvent="CHAT_SALES_INQUIRY" />
    </>
  );
}
