import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTeamChatContext } from '../../context/TeamChatContext';
import type { CreateThreadInput, ThreadRoom } from '../../types/thread';

export interface UseThreadResult {
  threads: ThreadRoom[];
  /** 1:1 정책: 현재 선택된 룸의 유일한 스레드 (없으면 null) */
  roomThread: ThreadRoom | null;
  loading: boolean;
  error: string | null;
  isPanelOpen: boolean;
  activeThreadId: string | null;
  refresh: () => Promise<void>;
  setActiveThread: (threadId: string | null) => void;
  setPanelOpen: (isOpen: boolean, roomId?: number | string) => void;
  createThread: (input: Omit<CreateThreadInput, 'createdBy'>) => Promise<ThreadRoom>;
  addParticipant: (threadId: string, userId: string) => Promise<void>;
  resolveThread: (threadId: string) => Promise<void>;
}

export function useThread(): UseThreadResult {
  const { api, auth, selectedRoom, callbacks } = useTeamChatContext();
  const [threads, setThreads] = useState<ThreadRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpenState] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 사이드바 인박스용: 전체 스레드 목록
      const allThreads = await api.getMyThreads(auth.userId);
      setThreads(allThreads);
      callbacks.onThreadCountChange?.(allThreads.filter((thread) => thread.status === 'active').length);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : '스레드를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api, auth.userId, callbacks]);

  // 1:1 정책: 현재 룸의 유일한 스레드 derivation
  const roomThread = useMemo(() => {
    if (!selectedRoom) return null;
    return threads.find(
      (t) => String(t.contactRoomId) === String(selectedRoom.id) && t.status === 'active',
    ) ?? null;
  }, [threads, selectedRoom]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => api.onDataUpdated(() => void loadThreads()), [api, loadThreads]);

  const setPanelOpen = useCallback((isOpen: boolean, roomId?: number | string) => {
    setIsPanelOpenState(isOpen);
    callbacks.onThreadOpenChange?.(isOpen, roomId);
  }, [callbacks]);

  const setActiveThread = useCallback((threadId: string | null) => {
    setActiveThreadId(threadId);
  }, []);

  const createThread = useCallback(async (input: Omit<CreateThreadInput, 'createdBy'>) => {
    if (!selectedRoom) {
      throw new Error('선택된 상담 Room이 없습니다.');
    }

    const thread = await api.createThread(selectedRoom.id, {
      ...input,
      createdBy: auth.userId,
    });
    await loadThreads();
    return thread;
  }, [api, auth.userId, loadThreads, selectedRoom]);

  const addParticipant = useCallback(async (threadId: string, userId: string) => {
    await api.addThreadParticipant(threadId, userId);
    await loadThreads();
  }, [api, loadThreads]);

  const resolveThread = useCallback(async (threadId: string) => {
    await api.resolveThread(threadId);
    await loadThreads();
  }, [api, loadThreads]);

  return useMemo(
    () => ({
      threads,
      roomThread,
      loading,
      error,
      isPanelOpen,
      activeThreadId,
      refresh: loadThreads,
      setActiveThread,
      setPanelOpen,
      createThread,
      addParticipant,
      resolveThread,
    }),
    [threads, roomThread, loading, error, isPanelOpen, activeThreadId, loadThreads, setActiveThread, setPanelOpen, createThread, addParticipant, resolveThread],
  );
}
