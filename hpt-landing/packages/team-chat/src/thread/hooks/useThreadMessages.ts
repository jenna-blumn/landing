import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTeamChatContext } from '../../context/TeamChatContext';
import type { ChatMessage } from '../../types/common';

export interface UseThreadMessagesResult {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  sendMessage: (text: string, metadata?: Record<string, unknown>) => Promise<ChatMessage>;
  sendSystemMessage: (text: string) => Promise<void>;
  editMessage: (messageId: string, text: string) => Promise<ChatMessage | null>;
  deleteMessage: (messageId: string) => Promise<boolean>;
}

export function useThreadMessages(threadId: string | null): UseThreadMessagesResult {
  const { api, auth, callbacks } = useTeamChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!threadId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const nextMessages = await api.getThreadMessages(threadId);
      setMessages(nextMessages);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : '스레드 메시지를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api, threadId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => api.onDataUpdated(() => void loadMessages()), [api, loadMessages]);

  const sendMessage = useCallback(async (text: string, metadata?: Record<string, unknown>) => {
    if (!threadId) {
      throw new Error('활성 스레드가 없습니다.');
    }

    const message = await api.sendThreadMessage(threadId, {
      senderId: auth.userId,
      senderName: auth.userName,
      text,
      type: 'text',
      metadata,
    });

    callbacks.onMessageSent?.({
      roomId: threadId,
      roomType: 'thread',
      message,
    });

    await loadMessages();
    return message;
  }, [api, auth.userId, auth.userName, callbacks, loadMessages, threadId]);

  const sendSystemMessage = useCallback(async (text: string) => {
    if (!threadId) return;
    await api.sendThreadMessage(threadId, {
      senderId: 'system',
      senderName: '시스템',
      text,
      type: 'system',
    });
    await loadMessages();
  }, [api, threadId, loadMessages]);

  const editMessage = useCallback(async (messageId: string, text: string) => {
    const updated = await api.editMessage(messageId, text);
    await loadMessages();
    return updated;
  }, [api, loadMessages]);

  const deleteMessage = useCallback(async (messageId: string) => {
    const ok = await api.deleteMessage(messageId);
    await loadMessages();
    return ok;
  }, [api, loadMessages]);

  return useMemo(
    () => ({
      messages,
      loading,
      error,
      refresh: loadMessages,
      sendMessage,
      sendSystemMessage,
      editMessage,
      deleteMessage,
    }),
    [messages, loading, error, loadMessages, sendMessage, sendSystemMessage, editMessage, deleteMessage],
  );
}
