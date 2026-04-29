'use client';

import { useCallback } from 'react';

import { useAuthStore } from '@/stores/authStore';

export default function useEmitEvent(socket: SocketIOClient.Socket | null) {
  const { userId, siteId } = useAuthStore();

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (!socket?.connected) {
        console.warn('[Socket] Cannot emit, socket is not connected');
        return;
      }
      socket.emit(event, data);
    },
    [socket],
  );

  const setUserInfo = useCallback(() => {
    emit('setUserinfo', {
      siteId,
      userid: userId,
      username: '',
      usertype: 'C',
      clientType: 'clientBrowser',
      siteServiceType: '',
      siteDesignVersion: 1,
      currentPage: 'notCounselorPage',
      managerId: '',
      authCode: '',
    });
  }, [emit, userId, siteId]);

  const setJoinRoom = useCallback(
    (roomId: string) => {
      emit('setJoinRoom', {
        roomid: roomId,
        ver: '1.0',
        clientType: 'clientBrowser',
      });
    },
    [emit],
  );

  const sendMessage = useCallback(
    (roomId: string, message: string) => {
      emit('sendMessage', {
        roomid: roomId,
        message,
      });
    },
    [emit],
  );

  const getRoomInfo = useCallback(
    (roomId: string) => {
      socket?.emit('getRoomInfo', {
        roomid: roomId,
      });
    },
    [socket],
  );

  const getChatData = useCallback(
    (roomId: string) => {
      socket?.emit('getChatData', {
        roomid: roomId,
        limit: 30,
      });
    },
    [socket],
  );

  const setMsgRead = useCallback(
    (msgId: string, roomId: string) => {
      socket?.emit('setMsgRead', {
        msgid: msgId,
        roomid: roomId,
      });
    },
    [socket],
  );

  return {
    emit,
    sendMessage,
    setUserInfo,
    setJoinRoom,
    setMsgRead,
    getRoomInfo,
    getChatData,
  };
}
