'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import useConnect from '@/hooks/socket/useConnect';
import useEmitEvent from '@/hooks/socket/useEmitEvent';
import useOnEvent from '@/hooks/socket/useOnEvent';
import usePrevChatRoom from '@/hooks/usePrevChatRoom';

import { useChatStore } from '@/stores/chatStore';

import { SocketContext } from '@/contexts/SocketContext';
import WithAxios from '@/components/WithAxios';

interface SocketProviderProps {
  children: ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const { isConnectedSocket, isSocketConnReady } = useChatStore();

  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  const { connect, openChatRoomRequest } = useConnect();
  const { setIngRoom, getIngRoom } = usePrevChatRoom();
  const {
    onConnected,
    onDisconnect,
    onReconnect,
    onReconnectError,
    onReconnectFailed,
    onMessage,
    onGetUserInRoom,
    onSetJoinRoom,
    onSetMessage,
    onGetRoomInfo,
    onGetChatData,
    onSetFinishedRoom,
    onSetAgentMessage,
  } = useOnEvent(socket);

  const { setUserInfo, setJoinRoom } = useEmitEvent(socket);

  const openChatRoom = useCallback(async () => {
    if (!isConnectedSocket) return;

    openChatRoomRequest().then((res) => {
      if (typeof res !== 'undefined' && res.code === 200) {
        const roomId = res.data.room.chatListId;

        setUserInfo();
        setJoinRoom(roomId);
        setIngRoom(roomId);
      }
    });
  }, [isConnectedSocket, openChatRoomRequest]);

  useEffect(() => {
    if (!isSocketConnReady) return;

    const chatListId = getIngRoom();
    if (!chatListId) return;

    setJoinRoom(chatListId);
  }, [isSocketConnReady]);

  useEffect(() => {
    if (isConnectedSocket) return;

    connect({ setSocket });
  }, [connect, isConnectedSocket]);

  useEffect(() => {
    socket?.on('connected', onConnected);
    socket?.on('disconnect', onDisconnect);
    socket?.on('reconnect', onReconnect);
    socket?.on('reconnect_error', onReconnectError);
    socket?.on('reconnect_failed', onReconnectFailed);
    socket?.on('message', onMessage);
    socket?.on('getUserInRoom', onGetUserInRoom);
    socket?.on('setJoinRoom', onSetJoinRoom);
    socket?.on('setMessage', onSetMessage);
    socket?.on('getRoomInfo', onGetRoomInfo);
    socket?.on('getChatData', onGetChatData);
    socket?.on('setFinishedRoom', onSetFinishedRoom);
    socket?.on('setAgentMessage', onSetAgentMessage);

    return () => {
      socket?.off('connected');
      socket?.off('disconnect', onDisconnect);
      socket?.off('reconnect', onReconnect);
      socket?.off('reconnect_error', onReconnectError);
      socket?.off('reconnect_failed', onReconnectFailed);
      socket?.off('message', onMessage);
      socket?.off('getUserInRoom', onGetUserInRoom);
      socket?.off('setJoinRoom', onSetJoinRoom);
      socket?.off('setMessage', onSetMessage);
      socket?.off('getRoomInfo', onGetRoomInfo);
      socket?.off('getChatData', onGetChatData);
      socket?.off('setFinishedRoom', onSetFinishedRoom);
      socket?.off('setAgentMessage', onSetAgentMessage);
    };
  }, [
    socket,
    onConnected,
    onDisconnect,
    onReconnect,
    onReconnectError,
    onReconnectFailed,
    onMessage,
    onSetJoinRoom,
    onSetMessage,
    onGetRoomInfo,
    onGetChatData,
    onSetFinishedRoom,
    onGetUserInRoom,
    onSetAgentMessage,
  ]);

  const contextValue = {
    socket,
    openChatRoom,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      <WithAxios>{children}</WithAxios>
    </SocketContext.Provider>
  );
}
