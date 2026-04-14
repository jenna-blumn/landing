import type { ChatMember, ChatMessage, MentionGroupRef, MentionRef, ThreadReplyPreview } from '../types/common';
import type { CreateGroupChatInput, GroupChatRoom } from '../types/groupChat';
import type { CreateThreadInput, ThreadRoom } from '../types/thread';

export interface SendMessageInput {
  senderId: string;
  senderName: string;
  text: string;
  type?: 'text' | 'file' | 'image' | 'system';
  metadata?: Record<string, unknown>;
}

export interface CreateMentionInput {
  messageId: string;
  conversationId: string;
  mentionedAgentId: string;
  mentioningAgentId: string;
  mentionType?: 'individual' | 'group_all' | 'group_here' | 'group_custom';
  groupId?: string;
  threadConversationId?: string;
}

export interface ITeamChatApi {
  getThreadsByRoom(contactRoomId: number | string): Promise<ThreadRoom[]>;
  /** 1:1 정책: 해당 룸의 유일한 스레드 반환. 없으면 null */
  getThreadByRoom(contactRoomId: number | string): Promise<ThreadRoom | null>;
  getActiveThreads(): Promise<ThreadRoom[]>;
  getMyThreads(userId: string): Promise<ThreadRoom[]>;
  createThread(contactRoomId: number | string, input: CreateThreadInput): Promise<ThreadRoom>;
  addThreadParticipant(threadId: string, userId: string): Promise<void>;
  getThreadParticipantMembers(threadId: string): Promise<ChatMember[]>;
  sendThreadMessage(threadId: string, input: SendMessageInput): Promise<ChatMessage>;
  getThreadMessages(threadId: string, options?: { limit?: number }): Promise<ChatMessage[]>;
  resolveThread(threadId: string): Promise<void>;
  getThreadCount(userId?: string): Promise<number>;

  createMentionForMessage(input: CreateMentionInput): Promise<MentionRef>;
  getMentionByMessageId(messageId: string): Promise<MentionRef | null>;
  getUnreadMentionCount(userId: string): Promise<number>;
  markMentionAsRead(mentionId: string): Promise<void>;
  getThreadReplyPreviewByMessageId(messageId: string): Promise<ThreadReplyPreview | null>;
  getThreadReplyPreviewByConversationId(threadConversationId: string): Promise<ThreadReplyPreview | null>;

  getGroupChatRooms(userId?: string): Promise<GroupChatRoom[]>;
  createGroupChatRoom(input: CreateGroupChatInput, creatorId: string): Promise<GroupChatRoom>;
  sendGroupMessage(roomId: string, input: SendMessageInput): Promise<ChatMessage>;
  getGroupMessages(roomId: string, options?: { limit?: number }): Promise<ChatMessage[]>;

  getMentionGroups(): Promise<MentionGroupRef[]>;
  getGroupMemberIds(groupId: string): Promise<string[]>;
  getAgents(): Promise<ChatMember[]>;
  getAgentById(agentId: string): Promise<ChatMember | null>;
  getAgentByName(name: string): Promise<ChatMember | null>;

  getContextForConversation(conversationId: string): Promise<string | null>;
  linkContextFromConversation(teamConversationId: string, sourceConversationId: string, contextSummary: string): Promise<void>;

  toggleReaction(messageId: string, emoji: string, userId: string): Promise<void>;
  markAsRead(roomId: string): Promise<void>;
  editMessage(messageId: string, text: string): Promise<ChatMessage | null>;
  deleteMessage(messageId: string): Promise<boolean>;
  onDataUpdated(callback: () => void): () => void;
}
