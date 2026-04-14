export type ChatMessageType = 'text' | 'file' | 'image' | 'system';

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  type: ChatMessageType;
  reactions?: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  mentions?: string[];
  metadata?: Record<string, unknown>;
}

export interface ChatMember {
  userId: string;
  userName: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  isAiAgent?: boolean;
  email?: string;
}

export interface MentionRef {
  id: string;
  messageId: string;
  conversationId: string;
  mentionedAgentId: string;
  mentioningAgentId: string;
  mentionType: 'individual' | 'group_all' | 'group_here' | 'group_custom';
  groupId?: string;
  threadConversationId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MentionGroupRef {
  id: string;
  name: string;
  displayName: string;
  color: string;
  isSystem: boolean;
  description?: string;
}

export interface ThreadReplyPreview {
  replyCount: number;
  firstReply: ChatMessage | null;
  firstReplyAgent: ChatMember | null;
}
