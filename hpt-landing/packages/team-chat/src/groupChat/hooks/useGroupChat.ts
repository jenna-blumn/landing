import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTeamChatContext } from '../../context/TeamChatContext';
import type { CreateGroupChatInput, GroupChatRoom } from '../../types/groupChat';

export interface UseGroupChatResult {
  rooms: GroupChatRoom[];
  loading: boolean;
  error: string | null;
  isWidgetOpen: boolean;
  activeRoomId: string | null;
  refresh: () => Promise<void>;
  setWidgetOpen: (isOpen: boolean) => void;
  setActiveRoom: (roomId: string | null) => void;
  createRoom: (input: CreateGroupChatInput) => Promise<GroupChatRoom>;
}

export function useGroupChat(): UseGroupChatResult {
  const { api, auth, callbacks } = useTeamChatContext();
  const [rooms, setRooms] = useState<GroupChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextRooms = await api.getGroupChatRooms(auth.userId);
      setRooms(nextRooms);
      const unreadCount = nextRooms.reduce((sum, room) => sum + room.unreadCount, 0);
      callbacks.onUnreadCountChange?.(unreadCount);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : '팀 대화를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [api, auth.userId, callbacks]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  useEffect(() => api.onDataUpdated(() => void loadRooms()), [api, loadRooms]);

  const setWidgetOpen = useCallback((isOpen: boolean) => {
    setIsWidgetOpen(isOpen);
    callbacks.onWidgetOpenChange?.(isOpen);
  }, [callbacks]);

  const setActiveRoom = useCallback((roomId: string | null) => {
    setActiveRoomId(roomId);
  }, []);

  const createRoom = useCallback(async (input: CreateGroupChatInput) => {
    const room = await api.createGroupChatRoom(input, auth.userId);
    await loadRooms();
    return room;
  }, [api, auth.userId, loadRooms]);

  return useMemo(
    () => ({
      rooms,
      loading,
      error,
      isWidgetOpen,
      activeRoomId,
      refresh: loadRooms,
      setWidgetOpen,
      setActiveRoom,
      createRoom,
    }),
    [rooms, loading, error, isWidgetOpen, activeRoomId, loadRooms, setWidgetOpen, setActiveRoom, createRoom],
  );
}
