import type { Task, TaskStats, CreateTaskInput, UpdateTaskInput, CreateNoticeInput } from '../types/task';

export interface ITaskApi {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(input: CreateTaskInput): Promise<Task>;
  updateTask(input: UpdateTaskInput): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;

  toggleTaskCompletion(id: string): Promise<Task | null>;
  toggleTaskLike(id: string): Promise<Task | null>;
  toggleTaskPin(id: string): Promise<Task | null>;
  reorderTasks(reorderedTasks: Task[]): Promise<void>;

  getTaskStats(): Promise<TaskStats>;

  createNotice(input: CreateNoticeInput): Promise<Task>;
  updateNotice(
    noticeId: string,
    updates: Partial<Pick<Task, 'title' | 'noticeContent' | 'targetAudience' | 'requireReadConfirmation'>>
  ): Promise<Task | null>;
  toggleNoticeRead(id: string): Promise<Task | null>;
  updateNoticeReadStatus(noticeId: string, consultantId: string): Promise<Task | null>;
  getNoticeReadStats(task: Task): { total: number; read: number; unread: number };

  resetTasksToInitial(): Promise<void>;

  onTasksUpdated(callback: () => void): () => void;
}
