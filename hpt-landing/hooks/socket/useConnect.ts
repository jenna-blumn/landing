'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useCallback } from 'react';

import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';

import { openChatRoom$ } from '@/api/chat';

import useAiAgent from '@/hooks/useAiAgent';
import { useEnv } from '@/contexts/EnvContext';
import {
  isDemoMode,
  DEMO_ROOM,
  DEMO_CUSTOMER,
  createDemoChatData,
} from '@/lib/demoMode';

const socketOption = {
  transports: ['websocket'],
  forceNew: true,
  autoConnect: true,
  reconnection: true,
  timeout: 10000,
  reconnectionDelay: 1000,
  query: {
    Ver: 'V2',
  },
};

export default function useConnect() {
  const { siteId, categoryId, divisionId, userId } = useAuthStore();
  const {
    getCustomerInfo,
    getRoomInfo,
    setConnectSocket,
    setSocketConnectReady,
    _getChatData,
  } = useChatStore();
  const { fetchAiAgentStatus } = useAiAgent();
  const { SOCKET_URL } = useEnv();

  const connect = useCallback(
    async ({
      setSocket,
    }: {
      setSocket: Dispatch<SetStateAction<SocketIOClient.Socket | null>>;
    }) => {
      if (isDemoMode()) {
        setConnectSocket(true);
        return;
      }
      const io = (await import('socket.io-client')).default;
      setSocket(io.connect(SOCKET_URL, socketOption));
    },
    [SOCKET_URL, setConnectSocket],
  );

  const openChatRoomRequest = useCallback(async () => {
    if (isDemoMode()) {
      getCustomerInfo(DEMO_CUSTOMER);
      getRoomInfo(DEMO_ROOM);
      _getChatData(createDemoChatData());
      setSocketConnectReady(true);
      return { code: 200, data: { room: DEMO_ROOM, customer: DEMO_CUSTOMER } };
    }

    if (!siteId || !categoryId || !divisionId) return;

    try {
      const {
        data: {
          result: { data, code },
        },
      } = await openChatRoom$({
        siteId,
        userId,
        categoryId,
        divisionId,
      });

      if (code === 200) {
        getCustomerInfo(data.customer);
        getRoomInfo({
          chatListId: data.room.chatListId,
          firstStatus: data.room.firstStatus,
        });
        setSocketConnectReady(true);
        fetchAiAgentStatus({
          roomId: data.room.chatListId,
          siteId: siteId as string,
        });
      }

      return { code, data };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Network Error') return;
        return;
      }
    }
  }, [
    siteId,
    userId,
    categoryId,
    divisionId,
    getCustomerInfo,
    getRoomInfo,
    setSocketConnectReady,
    _getChatData,
    fetchAiAgentStatus,
  ]);

  return {
    openChatRoomRequest,
    connect,
  };
}
