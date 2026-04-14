import type { GroupChatRoom } from '../types/groupChat';
import type { ChatMember, MentionGroupRef } from '../types/common';
import type { ThreadRoom } from '../types/thread';

export const mockMembers: ChatMember[] = [
  {
    userId: '00000000-0000-0000-0000-000000000001',
    userName: '김상담',
    role: 'owner',
    status: 'online',
    isAiAgent: false,
  },
  {
    userId: '00000000-0000-0000-0000-000000000002',
    userName: '박대리',
    role: 'member',
    status: 'online',
    isAiAgent: false,
  },
  {
    userId: '00000000-0000-0000-0000-000000000003',
    userName: 'AI 상담사',
    role: 'member',
    status: 'online',
    isAiAgent: true,
  },
];

export const mockMentionGroups: MentionGroupRef[] = [
  {
    id: 'group_all',
    name: 'all',
    displayName: '전체',
    color: 'blue',
    isSystem: true,
  },
  {
    id: 'group_here',
    name: 'here',
    displayName: '현재 접속',
    color: 'green',
    isSystem: true,
  },
];

export const mockThreadRooms: ThreadRoom[] = [];
export const mockGroupRooms: GroupChatRoom[] = [];
