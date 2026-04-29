import { useCallback, useState } from 'react';

import { useChatStore } from '@/stores/chatStore';
import { ChatMode } from '@/models/chat';
import { sendMessage$ } from '@/api/chat';
import { useAuthStore } from '@/stores/authStore';
import { isDemoMode, buildDemoUserMessage } from '@/lib/demoMode';

export default function useSending() {
  const { resetChatData, setLoading, updateChatData } = useChatStore();
  const { siteId, userId } = useAuthStore();

  const [mode, setMode] = useState<ChatMode>(ChatMode.HERO);
  const [message, setMessage] = useState('');

  const onSendMessage = useCallback(
    async (text?: string) => {
      const msg = text || message;

      if (!msg.trim()) return;

      if (isDemoMode()) {
        updateChatData(buildDemoUserMessage(msg));
        setMessage('');
        return;
      }

      try {
        setLoading(true);

        await sendMessage$({
          siteId,
          userId,
          message: msg,
        });
      } catch (error) {}
    },
    [siteId, userId, message, setLoading, updateChatData],
  );

  const onChangeMessage = (value: string) => {
    setMessage(value);
  };

  const onChangeMode = (mode: ChatMode) => {
    setMode(mode);
  };

  const onReset = () => {
    setMessage('');
    setMode(ChatMode.HERO);
    resetChatData();
  };

  return {
    message,
    mode,
    onChangeMode,
    onChangeMessage,
    onReset,
    onSendMessage,
  };
}
