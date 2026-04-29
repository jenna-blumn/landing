'use client';

import { useCallback, useState } from 'react';

import useEmitEvent from '@/hooks/socket/useEmitEvent';
import usePrevChatRoom from '@/hooks/usePrevChatRoom';

import { useChatStore } from '@/stores/chatStore';

import { ChatData } from '@/models/chat';
import { AI_MESSAGE_TYPE, AIAgentMessage } from '@/models/aiAgent';

export default function useOnEvent(socket: SocketIOClient.Socket | null) {
  const [userType, setUserType] = useState<string>('');
  const { getRoomInfo, getChatData, setMsgRead } = useEmitEvent(socket);
  const { getIngRoom, removeIngRoom } = usePrevChatRoom();

  const {
    isInitRoomInfo,
    setConnectSocket,
    setLoading,
    setInitRoomInfo,
    setSocketConnectReady,
    setAIRequests,
    updateChatData,
    _getChatData,
    resetChatData,
    resetAIRequests,
  } = useChatStore();

  const onConnected = useCallback(() => {
    setConnectSocket(true);
  }, []);

  const onDisconnect = useCallback((reason: string) => {
    console.log('[Socket] Disconnected:', reason);
  }, []);

  const onReconnect = useCallback(() => {
    console.log('[Socket] Reconnected');
  }, []);

  const onReconnectError = useCallback((error: Error) => {
    console.error('[Socket] Reconnect error:', error);
  }, []);

  const onReconnectFailed = useCallback(() => {
    console.error('[Socket] Reconnect failed');
  }, []);

  const onMessage = useCallback((data: unknown) => {
    console.log('[Socket] Message received:', data);
  }, []);

  const onGetUserInRoom = useCallback(
    (data: { userinfo: { usertype: string } }) => {
      setUserType(data.userinfo.usertype);
    },
    [],
  );

  const onSetJoinRoom = useCallback(
    (data: { result: string; roomid: string }) => {
      if (data.result === 'true') {
        getRoomInfo(data.roomid);
        getChatData(data.roomid);
      }
    },
    [getChatData, getRoomInfo],
  );

  const onSetMessage = useCallback((data: any) => {
    if (data.isEmptyEndMsg) return;

    if (data.user_type !== 'C') {
      setMsgRead(data.msgid, data.roomid);
    }

    if (data.result === 'true') {
      setLoading(false);
      updateChatData(data);
    }
  }, [setMsgRead, setLoading, updateChatData]);

  const onGetRoomInfo = useCallback(
    (data: { info: string; result: string; roomid: string }) => {
      if (data.result === 'false') return;
      const info = JSON.parse(data.info)[0];
      if (info.status === '2' || info.status === '4') {
        removeIngRoom();
      }
      if (!isInitRoomInfo) {
        setInitRoomInfo(true);
      }
    },
    [setInitRoomInfo, isInitRoomInfo, removeIngRoom],
  );

  const onGetChatData = useCallback(
    (data: { result: string; roomid: string; chatdata: string }) => {
      if (data.result === 'false') return;
      const chatData = JSON.parse(data.chatdata).filter((item: any) => {
        return item.contents !== 'EmptyEndMsg';
      }) as ChatData[];

      setLoading(false);

      _getChatData(chatData.reverse());

      chatData.forEach((item: ChatData) => {
        if (item.user_type !== 'C' && item.read_date === null) {
          setMsgRead(item.msg_id, item.chat_list_id);
        }
      });
    },
    [setMsgRead, _getChatData, setLoading],
  );

  const onSetFinishedRoom = useCallback(
    (data: { result: string; roomid: string }) => {
      if (data.result === 'true') {
        removeIngRoom();
        resetChatData();
        setSocketConnectReady(false);
      }
    },
    [removeIngRoom, resetChatData, setSocketConnectReady],
  );

  const onSetAgentMessage = useCallback(
    (data: AIAgentMessage) => {
      const { request_id, message_type } = data;

      if (
        [AI_MESSAGE_TYPE.SESSION_START, AI_MESSAGE_TYPE.SESSION_END].includes(
          message_type,
        )
      ) {
        if (message_type === AI_MESSAGE_TYPE.SESSION_END) {
          resetAIRequests();
        }
        return;
      }

      if (!data.request_id) return;

      setAIRequests(request_id, message_type);
    },
    [resetAIRequests, setAIRequests],
  );

  return {
    userType,
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
  };
}
