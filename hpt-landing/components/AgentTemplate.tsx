'use client';

import Chatting from '@/components/agent/chat/Chatting';

import SocketProvider from '@/contexts/SocketProvider';
import useAuth from '@/hooks/useAuth';
import InteractionTemplate from '@/components/agent/InteractionTemplate';
import AiBanner from '@/components/agent/AiBanner';
import AyvinIntro from '@/components/agent/AyvinIntro';
import CTASection from '@/components/common/CTASection';

export default function AgentTemplate() {
  useAuth();

  return (
    <>
      <SocketProvider>
        <Chatting />
      </SocketProvider>
      <AiBanner />
      <InteractionTemplate />
      <AyvinIntro />
      <CTASection gtmEvent="AGENT_SALES_INQUIRY" />
    </>
  );
}
