'use client';

import { create } from 'zustand';

import {
  ChatData,
  ChatState,
  ChatStore,
  CustomerInfo,
  RoomInfo,
} from '@/models/chat';
import { AI_MESSAGE_TYPE } from '@/models/aiAgent';

const initialState: ChatState = {
  isAIReady: false,
  isInitRoomInfo: false,
  isConnectedSocket: false,
  isSocketConnReady: false,
  isLoading: false,
  chatData: [],
  customer: {
    id: 0,
    uuid: '',
  },
  room: {
    chatListId: '',
    firstStatus: -2,
  },
  isLoadedChatData: false,
  pendingMessage: null,

  aiRequests: {},
};

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,
  setConnectSocket: (isConnectedSocket: boolean) => set({ isConnectedSocket }),
  setSocketConnectReady: (isSocketConnReady: boolean) =>
    set({ isSocketConnReady }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  getCustomerInfo: (customer: CustomerInfo) => set({ customer }),
  getRoomInfo: (room: RoomInfo) => set({ room }),
  updateChatData: (chatData: ChatData) =>
    set((state) => {
      return {
        isAIReady: true,
        chatData: [...state.chatData, chatData],
      };
    }),
  setInitRoomInfo: (isInitRoomInfo: boolean) => set({ isInitRoomInfo }),
  _getChatData: (chatData: ChatData[]) =>
    set(() => {
      if (chatData.length === 0) {
        return {
          isLoadedChatData: true,
          chatData: [],
        };
      }

      return {
        isAIReady: true,
        isLoadedChatData: true,
        chatData,
      };
    }),
  resetChatData: () =>
    set({
      chatData: [],
      pendingMessage: null,
      isLoadedChatData: false,
      isAIReady: false,
      aiRequests: {},
    }),
  resetAIRequests: () => set({ aiRequests: {} }),
  setPendingMessage: (message: string | null) =>
    set({ pendingMessage: message }),
  setAIRequests: (requestId: string, messageType: AI_MESSAGE_TYPE) =>
    set((state) => {
      const currentRequests = { ...state.aiRequests };

      if (requestId in currentRequests) {
        if (messageType === AI_MESSAGE_TYPE.RESPONSE) {
          delete currentRequests[requestId];
        } else {
          currentRequests[requestId] = messageType;
        }
      } else {
        if (messageType !== AI_MESSAGE_TYPE.RESPONSE) {
          currentRequests[requestId] = messageType;
        }
      }

      return { aiRequests: currentRequests };
    }),
}));
