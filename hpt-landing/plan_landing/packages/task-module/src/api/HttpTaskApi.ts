import type { Task, TaskStats, CreateTaskInput, UpdateTaskInput, CreateNoticeInput } from '../types/task';
import type { ITaskApi } from './ITaskApi';
import { EventBus } from '../utils/eventBus';

export class HttpTaskApi implements ITaskApi {
  private baseUrl: string;
  private token: string;
  private userId: string;
  private eventBus: EventBus;

  constructor(baseUrl: string, token: string, userId: string) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.userId = userId;
    this.eventBus = new EventBus();
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'X-User-Id': this.userId,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  private emitUpdate(): void {
    this.eventBus.emit('tasks-updated');
  }

  async getTasks(): Promise<Task[]> {
    return this.request('GET', '/api/v1/tasks');
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.request('GET', `/api/v1/tasks/${id}`);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const result = await this.request<Task>('POST', '/api/v1/tasks', input);
    this.emitUpdate();
    return result;
  }

  async updateTask(input: UpdateTaskInput): Promise<Task | null> {
    const { id, ...updates } = input;
    const result = await this.request<Task>('PUT', `/api/v1/tasks/${id}`, updates);
    this.emitUpdate();
    return result;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.request('DELETE', `/api/v1/tasks/${id}`);
    this.emitUpdate();
    return true;
  }

  async toggleTaskCompletion(id: string): Promise<Task | null> {
    const result = await this.request<Task>('POST', `/api/v1/tasks/${id}/toggle-completion`);
    this.emitUpdate();
    return result;
  }

  async toggleTaskLike(id: string): Promise<Task | null> {
    const result = await this.request<Task>('POST', `/api/v1/tasks/${id}/toggle-like`);
    this.emitUpdate();
    return result;
  }

  async toggleTaskPin(id: string): Promise<Task | null> {
    const result = await this.request<Task>('POST', `/api/v1/tasks/${id}/toggle-pin`);
    this.emitUpdate();
    return result;
  }

  async reorderTasks(reorderedTasks: Task[]): Promise<void> {
    const taskIds = reorderedTasks.map(t => t.id);
    await this.request('PUT', '/api/v1/tasks/reorder', { taskIds });
    this.emitUpdate();
  }

  async getTaskStats(): Promise<TaskStats> {
    return this.request('GET', '/api/v1/tasks/stats');
  }

  async createNotice(input: CreateNoticeInput): Promise<Task> {
    const result = await this.request<Task>('POST', '/api/v1/notices', input);
    this.emitUpdate();
    return result;
  }

  async updateNotice(
    noticeId: string,
    updates: Partial<Pick<Task, 'title' | 'noticeContent' | 'targetAudience' | 'requireReadConfirmation'>>
  ): Promise<Task | null> {
    const result = await this.request<Task>('PUT', `/api/v1/notices/${noticeId}`, updates);
    this.emitUpdate();
    return result;
  }

  async toggleNoticeRead(id: string): Promise<Task | null> {
    const result = await this.request<Task>('POST', `/api/v1/notices/${id}/toggle-read`);
    this.emitUpdate();
    return result;
  }

  async updateNoticeReadStatus(noticeId: string, consultantId: string): Promise<Task | null> {
    const result = await this.request<Task>('PUT', `/api/v1/notices/${noticeId}/read-status`, { consultantId });
    this.emitUpdate();
    return result;
  }

  getNoticeReadStats(task: Task): { total: number; read: number; unread: number } {
    if (!task.targetAudience) {
      return { total: 0, read: 0, unread: 0 };
    }
    const total = task.targetAudience.length;
    const read = task.targetAudience.filter(s => s.isRead).length;
    return { total, read, unread: total - read };
  }

  async resetTasksToInitial(): Promise<void> {
    await this.request('POST', '/api/v1/tasks/reset');
    this.emitUpdate();
  }

  onTasksUpdated(callback: () => void): () => void {
    return this.eventBus.on('tasks-updated', callback);
  }
}
