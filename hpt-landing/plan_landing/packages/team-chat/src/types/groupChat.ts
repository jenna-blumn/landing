import type { ChatMember, ChatMessage } from './common';

export interface GroupChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  members: ChatMember[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
  sourceConversationId?: string;
}

export interface CreateGroupChatInput {
  name: string;
  type: 'direct' | 'group' | 'channel';
  memberIds: string[];
  sourceConversationId?: string;
}
