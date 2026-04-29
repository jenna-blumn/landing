import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTeamChatContext } from '../../context/TeamChatContext';
import type { ChatMessage } from '../../types/common';

export interface UseGroupChatMessagesResult {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  sendMessage: (text: string, metadata?: Record<string, unknown>) => Promise<ChatMessage>;
  editMessage: (messageId: string, text: string) => Promise<ChatMessage | null>;
  deleteMessage: (messageId: string) => Promise<boolean>;
}

export function useGroupChatMessages(roomId: string | null): UseGroupChatMessagesResult {
  const { api, auth, callbacks } = useTeamChatContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!roomId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const nextMessages = await api.getGroupMessages(roomId);
      setMessages(nextMessages);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : '팀 대화 메시지를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api, roomId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => api.onDataUpdated(() => void loadMessages()), [api, loadMessages]);

  const sendMessage = useCallback(async (text: string, metadata?: Record<string, unknown>) => {
    if (!roomId) {
      throw new Error('활성 팀 대화방이 없습니다.');
    }

    const message = await api.sendGroupMessage(roomId, {
      senderId: auth.userId,
      senderName: auth.userName,
      text,
      type: 'text',
      metadata,
    });

    callbacks.onMessageSent?.({
      roomId,
      roomType: 'group',
      message,
    });

    await loadMessages();
    return message;
  }, [api, auth.userId, auth.userName, callbacks, loadMessages, roomId]);

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
      editMessage,
      deleteMessage,
    }),
    [messages, loading, error, loadMessages, sendMessage, editMessage, deleteMessage],
  );
}
