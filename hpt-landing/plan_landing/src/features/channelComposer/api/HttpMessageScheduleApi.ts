import type { IMessageScheduleApi, CreateScheduledMessageInput, UpdateScheduledMessageInput, UpdateScheduledMessageStatusInput } from './IMessageScheduleApi';
import type { ScheduledMessageRecord } from '../types';

export class HttpMessageScheduleApi implements IMessageScheduleApi {
  // TODO(server): 실제 엔드포인트 확정 후 요청/응답 스키마를 서버 규격에 맞게 연결한다.
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
  ) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Message schedule API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async createScheduledMessage(input: CreateScheduledMessageInput): Promise<ScheduledMessageRecord> {
    return this.request('POST', '/api/v1/message-schedules', input);
  }

  async getScheduledMessages(): Promise<ScheduledMessageRecord[]> {
    return this.request('GET', '/api/v1/message-schedules');
  }

  async getScheduledMessagesByRoom(roomId: number): Promise<ScheduledMessageRecord[]> {
    return this.request('GET', `/api/v1/message-schedules?roomId=${roomId}`);
  }

  async getScheduledMessageById(id: number): Promise<ScheduledMessageRecord | null> {
    return this.request('GET', `/api/v1/message-schedules/${id}`);
  }

  async updateScheduledMessage(id: number, input: UpdateScheduledMessageInput): Promise<ScheduledMessageRecord | null> {
    return this.request('PATCH', `/api/v1/message-schedules/${id}`, input);
  }

  async updateScheduledMessageStatus(
    id: number,
    input: UpdateScheduledMessageStatusInput
  ): Promise<ScheduledMessageRecord | null> {
    return this.request('PATCH', `/api/v1/message-schedules/${id}/status`, input);
  }

  async cancelScheduledMessage(id: number): Promise<boolean> {
    await this.request('DELETE', `/api/v1/message-schedules/${id}`);
    return true;
  }

  async getDueScheduledMessages(referenceTime?: string): Promise<ScheduledMessageRecord[]> {
    const query = referenceTime ? `?referenceTime=${encodeURIComponent(referenceTime)}` : '';
    return this.request('GET', `/api/v1/message-schedules/due${query}`);
  }

  onSchedulesUpdated(_callback: () => void): () => void {
    // TODO(server): 서버 이벤트 또는 polling 전략이 확정되면 클라이언트 상태 동기화를 연결한다.
    return () => undefined;
  }
}
