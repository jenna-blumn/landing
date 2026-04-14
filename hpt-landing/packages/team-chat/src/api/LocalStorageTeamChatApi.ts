import type { ITeamChatApi, SendMessageInput, CreateMentionInput } from './ITeamChatApi';
import type { ChatMember, ChatMessage, MentionGroupRef, MentionRef, ThreadReplyPreview } from '../types/common';
import type { CreateGroupChatInput, GroupChatRoom } from '../types/groupChat';
import type { CreateThreadInput, ThreadRoom } from '../types/thread';
import { generateId, safeJsonParse, toIsoNow, uniqueStrings } from '../utils/chatUtils';
import { mockGroupRooms, mockMembers, mockMentionGroups, mockThreadRooms } from '../data/mockChatData';

const STORAGE_KEY = 'teamChat_state_v1';

interface LocalState {
  threads: ThreadRoom[];
  groupRooms: GroupChatRoom[];
  roomMessages: Record<string, ChatMessage[]>;
  mentions: MentionRef[];
  mentionGroups: MentionGroupRef[];
  groupMembers: Record<string, string[]>;
  agents: ChatMember[];
  contexts: Record<string, string>;
}

function createInitialState(): LocalState {
  return {
    threads: mockThreadRooms,
    groupRooms: mockGroupRooms,
    roomMessages: {},
    mentions: [],
    mentionGroups: mockMentionGroups,
    groupMembers: {},
    agents: mockMembers,
    contexts: {},
  };
}

export class LocalStorageTeamChatApi implements ITeamChatApi {
  private listeners = new Set<() => void>();

  private readState(): LocalState {
    const parsed = safeJsonParse<LocalState>(localStorage.getItem(STORAGE_KEY), createInitialState());
    return parsed;
  }

  private writeState(state: LocalState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    this.listeners.forEach((listener) => listener());
  }

  private getRoomMessages(state: LocalState, roomId: string): ChatMessage[] {
    return state.roomMessages[roomId] ?? [];
  }

  private setRoomMessages(state: LocalState, roomId: string, messages: ChatMessage[]): void {
    state.roomMessages[roomId] = messages;
  }

  private withThreadMessages(state: LocalState, thread: ThreadRoom): ThreadRoom {
    return {
      ...thread,
      messages: this.getRoomMessages(state, thread.id),
    };
  }

  async getThreadsByRoom(contactRoomId: number | string): Promise<ThreadRoom[]> {
    const state = this.readState();
    const roomId = String(contactRoomId);
    return state.threads
      .filter((thread) => String(thread.contactRoomId) === roomId)
      .map((thread) => this.withThreadMessages(state, thread));
  }

  async getThreadByRoom(contactRoomId: number | string): Promise<ThreadRoom | null> {
    const state = this.readState();
    const roomId = String(contactRoomId);
    const thread = state.threads.find((t) => String(t.contactRoomId) === roomId) ?? null;
    return thread ? this.withThreadMessages(state, thread) : null;
  }

  async getActiveThreads(): Promise<ThreadRoom[]> {
    const state = this.readState();
    return state.threads
      .filter((thread) => thread.status === 'active')
      .map((thread) => this.withThreadMessages(state, thread));
  }

  async getMyThreads(userId: string): Promise<ThreadRoom[]> {
    const state = this.readState();
    return state.threads
      .filter((thread) =>
        thread.createdBy === userId ||
        thread.participants.some((participant) => participant.userId === userId),
      )
      .map((thread) => this.withThreadMessages(state, thread))
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }

  async createThread(contactRoomId: number | string, input: CreateThreadInput): Promise<ThreadRoom> {
    const state = this.readState();

    // 1:1 정책: 이미 스레드가 있으면 기존 반환 (참여자만 추가)
    const existing = state.threads.find((t) => String(t.contactRoomId) === String(contactRoomId) && t.status === 'active');
    if (existing) {
      const newIds = uniqueStrings([input.createdBy, ...input.participantIds]);
      const existingIds = new Set(existing.participants.map((p) => p.userId));
      const toAdd = newIds.filter((id) => !existingIds.has(id));
      if (toAdd.length > 0) {
        const newMembers = toAdd
          .map((id) => {
            const agent = state.agents.find((a) => a.userId === id);
            if (agent) return { ...agent };
            if (id === input.createdBy) {
              return { userId: id, userName: input.createdBy, role: 'owner' as const, status: 'online' as const, isAiAgent: false };
            }
            return null;
          })
          .filter((a): a is ChatMember => Boolean(a));
        existing.participants = [...existing.participants, ...newMembers];
        this.writeState(state);
      }
      return this.withThreadMessages(state, existing);
    }

    const now = toIsoNow();
    const participantIds = uniqueStrings([input.createdBy, ...input.participantIds]);
    const participants = participantIds
      .map((id) => {
        const agent = state.agents.find((a) => a.userId === id);
        if (agent) return { ...agent };
        // createdBy가 agents 목록에 없을 경우 fallback 참여자 생성
        if (id === input.createdBy) {
          return { userId: id, userName: input.createdBy, role: 'owner' as const, status: 'online' as const, isAiAgent: false };
        }
        return null;
      })
      .filter((agent): agent is ChatMember => Boolean(agent));

    const thread: ThreadRoom = {
      id: generateId('thread'),
      contactRoomId,
      contactName: '스레드',
      createdBy: input.createdBy,
      participants,
      messages: [],
      status: 'active',
      unreadCount: 0,
      createdAt: now,
      lastMessageAt: now,
      originalQuery: input.originalQuery,
      sourceConversationId: String(contactRoomId),
      customerId: input.customerId,
    };

    state.threads = [thread, ...state.threads];
    this.setRoomMessages(state, thread.id, []);

    if (input.initialMessage && input.initialMessage.trim().length > 0) {
      const initialMessage: ChatMessage = {
        id: generateId('msg'),
        senderId: input.createdBy,
        senderName: participants.find((participant) => participant.userId === input.createdBy)?.userName ?? '상담사',
        text: input.initialMessage,
        timestamp: now,
        type: 'text',
      };
      this.setRoomMessages(state, thread.id, [initialMessage]);
      thread.messages = [initialMessage];
      thread.lastMessageAt = now;
    }

    this.writeState(state);
    return this.withThreadMessages(state, thread);
  }

  async addThreadParticipant(threadId: string, userId: string): Promise<void> {
    const state = this.readState();
    const thread = state.threads.find((item) => item.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    if (thread.participants.some((participant) => participant.userId === userId)) {
      return;
    }

    const member = state.agents.find((agent) => agent.userId === userId);
    if (!member) {
      throw new Error('Agent not found');
    }

    thread.participants.push({ ...member });
    this.writeState(state);
  }

  async getThreadParticipantMembers(threadId: string): Promise<ChatMember[]> {
    const state = this.readState();
    const thread = state.threads.find((item) => item.id === threadId);
    return thread?.participants ?? [];
  }

  async sendThreadMessage(threadId: string, input: SendMessageInput): Promise<ChatMessage> {
    const state = this.readState();
    const thread = state.threads.find((item) => item.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    const message: ChatMessage = {
      id: generateId('msg'),
      senderId: input.senderId,
      senderName: input.senderName,
      text: input.text,
      timestamp: toIsoNow(),
      type: input.type ?? 'text',
      metadata: input.metadata,
    };

    const messages = this.getRoomMessages(state, threadId);
    messages.push(message);
    this.setRoomMessages(state, threadId, messages);
    thread.lastMessageAt = message.timestamp;

    this.writeState(state);
    return message;
  }

  async getThreadMessages(threadId: string, options?: { limit?: number }): Promise<ChatMessage[]> {
    const state = this.readState();
    const messages = this.getRoomMessages(state, threadId);
    if (!options?.limit) {
      return messages;
    }
    return messages.slice(-options.limit);
  }

  async resolveThread(threadId: string): Promise<void> {
    const state = this.readState();
    const thread = state.threads.find((item) => item.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    thread.status = 'resolved';
    this.writeState(state);
  }

  async getThreadCount(userId?: string): Promise<number> {
    const threads = userId ? await this.getMyThreads(userId) : await this.getActiveThreads();
    return threads.filter((thread) => thread.status === 'active').length;
  }

  async createMentionForMessage(input: CreateMentionInput): Promise<MentionRef> {
    const state = this.readState();
    const mention: MentionRef = {
      id: generateId('mention'),
      messageId: input.messageId,
      conversationId: input.conversationId,
      mentionedAgentId: input.mentionedAgentId,
      mentioningAgentId: input.mentioningAgentId,
      mentionType: input.mentionType ?? 'individual',
      groupId: input.groupId,
      threadConversationId: input.threadConversationId,
      isRead: false,
      createdAt: toIsoNow(),
    };
    state.mentions = [mention, ...state.mentions];
    this.writeState(state);
    return mention;
  }

  async getMentionByMessageId(messageId: string): Promise<MentionRef | null> {
    const state = this.readState();
    return state.mentions.find((mention) => mention.messageId === messageId) ?? null;
  }

  async getUnreadMentionCount(userId: string): Promise<number> {
    const state = this.readState();
    return state.mentions.filter((mention) => mention.mentionedAgentId === userId && !mention.isRead).length;
  }

  async markMentionAsRead(mentionId: string): Promise<void> {
    const state = this.readState();
    const mention = state.mentions.find((item) => item.id === mentionId);
    if (!mention) {
      return;
    }
    mention.isRead = true;
    this.writeState(state);
  }

  async getThreadReplyPreviewByMessageId(messageId: string): Promise<ThreadReplyPreview | null> {
    const mention = await this.getMentionByMessageId(messageId);
    if (!mention?.threadConversationId) {
      return null;
    }
    return this.getThreadReplyPreviewByConversationId(mention.threadConversationId);
  }

  async getThreadReplyPreviewByConversationId(threadConversationId: string): Promise<ThreadReplyPreview | null> {
    const messages = await this.getThreadMessages(threadConversationId);
    const replyMessages = messages.filter((message) => message.type !== 'system' && !message.isDeleted);
    const firstReply = replyMessages[0] ?? null;
    if (!firstReply) {
      return {
        replyCount: 0,
        firstReply: null,
        firstReplyAgent: null,
      };
    }
    const firstReplyAgent = await this.getAgentById(firstReply.senderId);
    return {
      replyCount: replyMessages.length,
      firstReply,
      firstReplyAgent,
    };
  }

  async getGroupChatRooms(userId?: string): Promise<GroupChatRoom[]> {
    const state = this.readState();
    if (!userId) {
      return state.groupRooms;
    }
    return state.groupRooms.filter((room) => room.members.some((member) => member.userId === userId));
  }

  async createGroupChatRoom(input: CreateGroupChatInput, creatorId: string): Promise<GroupChatRoom> {
    const state = this.readState();
    const memberIds = uniqueStrings([creatorId, ...input.memberIds]);
    const members = memberIds
      .map((id) => state.agents.find((agent) => agent.userId === id))
      .filter((agent): agent is ChatMember => Boolean(agent))
      .map((agent) => ({ ...agent }));

    const room: GroupChatRoom = {
      id: generateId('group'),
      name: input.name,
      type: input.type,
      members,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      createdAt: toIsoNow(),
      updatedAt: toIsoNow(),
      sourceConversationId: input.sourceConversationId,
    };

    state.groupRooms = [room, ...state.groupRooms];
    this.setRoomMessages(state, room.id, []);
    this.writeState(state);
    return room;
  }

  async sendGroupMessage(roomId: string, input: SendMessageInput): Promise<ChatMessage> {
    const state = this.readState();
    const room = state.groupRooms.find((item) => item.id === roomId);
    if (!room) {
      throw new Error('Group chat room not found');
    }

    const message: ChatMessage = {
      id: generateId('msg'),
      senderId: input.senderId,
      senderName: input.senderName,
      text: input.text,
      timestamp: toIsoNow(),
      type: input.type ?? 'text',
      metadata: input.metadata,
    };

    const messages = this.getRoomMessages(state, roomId);
    messages.push(message);
    this.setRoomMessages(state, roomId, messages);
    room.lastMessage = message;
    room.updatedAt = message.timestamp;

    this.writeState(state);
    return message;
  }

  async getGroupMessages(roomId: string, options?: { limit?: number }): Promise<ChatMessage[]> {
    const state = this.readState();
    const messages = this.getRoomMessages(state, roomId);
    if (!options?.limit) {
      return messages;
    }
    return messages.slice(-options.limit);
  }

  async getMentionGroups(): Promise<MentionGroupRef[]> {
    const state = this.readState();
    return state.mentionGroups;
  }

  async getGroupMemberIds(groupId: string): Promise<string[]> {
    const state = this.readState();
    return state.groupMembers[groupId] ?? [];
  }

  async getAgents(): Promise<ChatMember[]> {
    const state = this.readState();
    return state.agents;
  }

  async getAgentById(agentId: string): Promise<ChatMember | null> {
    const state = this.readState();
    return state.agents.find((agent) => agent.userId === agentId) ?? null;
  }

  async getAgentByName(name: string): Promise<ChatMember | null> {
    const state = this.readState();
    return state.agents.find((agent) => agent.userName === name) ?? null;
  }

  async getContextForConversation(conversationId: string): Promise<string | null> {
    const state = this.readState();
    return state.contexts[conversationId] ?? null;
  }

  async linkContextFromConversation(teamConversationId: string, _sourceConversationId: string, contextSummary: string): Promise<void> {
    const state = this.readState();
    state.contexts[teamConversationId] = contextSummary;
    this.writeState(state);
  }

  async toggleReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    const state = this.readState();
    const roomEntries = Object.entries(state.roomMessages);
    for (const [, messages] of roomEntries) {
      const message = messages.find((item) => item.id === messageId);
      if (!message) {
        continue;
      }
      const reactions = message.reactions ?? [];
      const target = reactions.find((reaction) => reaction.emoji === emoji);
      if (!target) {
        reactions.push({ emoji, userIds: [userId] });
      } else if (target.userIds.includes(userId)) {
        target.userIds = target.userIds.filter((id) => id !== userId);
      } else {
        target.userIds.push(userId);
      }
      message.reactions = reactions.filter((reaction) => reaction.userIds.length > 0);
      break;
    }
    this.writeState(state);
  }

  async markAsRead(roomId: string): Promise<void> {
    const state = this.readState();
    const thread = state.threads.find((item) => item.id === roomId);
    if (thread) {
      thread.unreadCount = 0;
    }
    const group = state.groupRooms.find((item) => item.id === roomId);
    if (group) {
      group.unreadCount = 0;
    }
    this.writeState(state);
  }

  async editMessage(messageId: string, text: string): Promise<ChatMessage | null> {
    const state = this.readState();
    const roomEntries = Object.entries(state.roomMessages);
    for (const [, messages] of roomEntries) {
      const message = messages.find((item) => item.id === messageId);
      if (!message) {
        continue;
      }
      message.text = text;
      message.isEdited = true;
      this.writeState(state);
      return message;
    }
    return null;
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const state = this.readState();
    const roomEntries = Object.entries(state.roomMessages);
    for (const [, messages] of roomEntries) {
      const message = messages.find((item) => item.id === messageId);
      if (!message) {
        continue;
      }
      message.isDeleted = true;
      message.text = '[삭제된 메시지]';
      this.writeState(state);
      return true;
    }
    return false;
  }

  onDataUpdated(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
