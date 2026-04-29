import type { ChatMessage } from './common';

export type DisplayMode = 'floating' | 'embedded' | 'panel';
export type ApiType = 'localStorage' | 'http';

export interface TeamChatModuleConfig {
  displayMode: DisplayMode;
  apiType: ApiType;
  httpBaseUrl?: string;
  portalContainerId?: string;
}

export interface MessageSentPayload {
  roomId: string;
  roomType: 'thread' | 'group';
  message: ChatMessage;
}

export interface TeamChatCallbacks {
  onNavigateToRoom?: (roomId: number | string) => void;
  onThreadOpenChange?: (isOpen: boolean, roomId?: number | string) => void;
  onThreadCountChange?: (count: number) => void;
  onUnreadCountChange?: (count: number) => void;
  onWidgetOpenChange?: (isOpen: boolean) => void;
  onMessageSent?: (payload: MessageSentPayload) => void;
}
