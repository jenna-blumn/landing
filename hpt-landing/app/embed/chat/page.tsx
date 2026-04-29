'use client';

import ChatCard from '@/components/agent/chat/ChatCard';
import SocketProvider from '@/contexts/SocketProvider';
import useAuth from '@/hooks/useAuth';

export default function EmbedChatPage() {
  useAuth();

  return (
    <SocketProvider>
      <ChatCard isEmbedChat />
    </SocketProvider>
  );
}
