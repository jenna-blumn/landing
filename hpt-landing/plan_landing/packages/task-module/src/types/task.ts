export type TaskType = 'sms' | 'callback' | 'followup' | 'notice';
export type TaskStatus = 'pending' | 'delayed' | 'completed';

export interface NoticeReadStatus {
  consultantId: string;
  consultantName: string;
  isRead: boolean;
  readAt: number | null;
}

export interface Task {
  id: string;
  ownerId: string;
  type: TaskType;
  title: string;
  description: string;
  scheduledDate: string | null;
  deadline: string | null;
  status: TaskStatus;
  liked: boolean;
  pinned: boolean;
  pinnedAt: number | null;
  backgroundColor: string | null;
  parentId: string | null;
  roomId: number | null;
  messageId: number | null;
  order: number;
  createdAt: number;
  completedAt: number | null;
  noticeContent?: string;
  author?: string;
  isRead?: boolean;
  targetAudience?: NoticeReadStatus[];
  requireReadConfirmation?: boolean;
}

export type EditFocusTarget = 'title' | 'description' | 'date' | 'deadline';

export interface TaskStats {
  notice: number;
  pending: number;
  delayed: number;
  liked: number;
  completed: number;
}

export interface CreateTaskInput {
  type: TaskType;
  title: string;
  description?: string;
  scheduledDate?: string | null;
  deadline?: string | null;
  parentId?: string | null;
  roomId?: number | null;
  messageId?: number | null;
  backgroundColor?: string | null;
}

export interface CreateNoticeInput {
  title: string;
  noticeContent: string;
  author: string;
  targetAudience: NoticeReadStatus[];
  requireReadConfirmation: boolean;
}

export interface UpdateTaskInput {
  id: string;
  type?: TaskType;
  title?: string;
  description?: string;
  scheduledDate?: string | null;
  deadline?: string | null;
  status?: TaskStatus;
  liked?: boolean;
  pinned?: boolean;
  pinnedAt?: number | null;
  backgroundColor?: string | null;
  parentId?: string | null;
  roomId?: number | null;
  order?: number;
}

export const TASK_TYPES = {
  sms: { label: 'SMS', color: 'bg-blue-500', icon: '\uD83D\uDCAC' },
  callback: { label: '\uCF5C\uBC31', color: 'bg-green-500', icon: '\uD83D\uDCDE' },
  followup: { label: '\uD314\uB85C\uC5C5', color: 'bg-purple-500', icon: '\uD83D\uDCCB' },
  notice: { label: '\uACF5\uC9C0', color: 'bg-indigo-500', icon: '\uD83D\uDCE2' },
} as const;

export const TASK_COLORS: Record<string, { label: string; bg: string; dot: string }> = {
  white:  { label: '\uAE30\uBCF8', bg: 'bg-white',     dot: 'bg-white border border-gray-300' },
  yellow: { label: '\uB178\uB791', bg: 'bg-yellow-50', dot: 'bg-yellow-300' },
  pink:   { label: '\uBD84\uD64D', bg: 'bg-pink-50',   dot: 'bg-pink-300' },
  green:  { label: '\uCD08\uB85D', bg: 'bg-green-50',  dot: 'bg-green-300' },
  blue:   { label: '\uD30C\uB791', bg: 'bg-blue-50',   dot: 'bg-blue-300' },
};

export const TASK_STATUS = {
  pending: { label: '\uB300\uAE30 \uC911', color: 'bg-gray-500' },
  delayed: { label: '\uC9C0\uC5F0', color: 'bg-red-500' },
  completed: { label: '\uC644\uB8CC', color: 'bg-green-500' },
} as const;
