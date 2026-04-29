import type { ChatMember, ChatMessage } from './common';

export interface ThreadRoom {
  id: string;
  contactRoomId: number | string;
  contactName: string;
  createdBy: string;
  participants: ChatMember[];
  messages: ChatMessage[];
  status: 'active' | 'resolved' | 'closed';
  unreadCount: number;
  createdAt: string;
  lastMessageAt: string;
  originalQuery?: string;
  sourceConversationId?: string;
  customerId?: string;
}

export interface CreateThreadInput {
  createdBy: string;
  participantIds: string[];
  initialMessage?: string;
  customerId?: string;
  originalQuery?: string;
}
