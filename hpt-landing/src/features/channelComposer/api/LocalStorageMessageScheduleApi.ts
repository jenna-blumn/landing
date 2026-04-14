import type { IMessageScheduleApi, CreateScheduledMessageInput, UpdateScheduledMessageInput, UpdateScheduledMessageStatusInput } from './IMessageScheduleApi';
import type { ScheduledMessageRecord } from '../types';
import { generateNumericId } from '../../../utils/idUtils';

const STORAGE_KEY = 'channelComposer_messageSchedules_v1';
const UPDATED_EVENT = 'channel-composer-message-schedules-updated';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function sortSchedules(records: ScheduledMessageRecord[]): ScheduledMessageRecord[] {
  return [...records].sort((a, b) => {
    const first = new Date(a.schedule.queuedAt).getTime();
    const second = new Date(b.schedule.queuedAt).getTime();
    return first - second;
  });
}

export function getStoredScheduledMessagesSnapshot(): ScheduledMessageRecord[] {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScheduledMessageRecord[];
    return Array.isArray(parsed) ? sortSchedules(parsed) : [];
  } catch {
    return [];
  }
}

export class LocalStorageMessageScheduleApi implements IMessageScheduleApi {
  // TODO(server): 운영에서는 예약 저장/수정/취소를 서버 API가 담당해야 하며 localStorage 구현은 목업 전용이다.
  private emitUpdated(): void {
    if (!isBrowser()) return;
    window.dispatchEvent(new Event(UPDATED_EVENT));
  }

  private read(): ScheduledMessageRecord[] {
    return getStoredScheduledMessagesSnapshot();
  }

  private write(records: ScheduledMessageRecord[]): void {
    if (!isBrowser()) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortSchedules(records)));
      this.emitUpdated();
    } catch {
      // Ignore storage failures in mock mode.
    }
  }

  async createScheduledMessage(input: CreateScheduledMessageInput): Promise<ScheduledMessageRecord> {
    const now = new Date().toISOString();
    const nextRecord: ScheduledMessageRecord = {
      id: generateNumericId(),
      roomId: input.roomId,
      channel: input.channel,
      text: input.text,
      subject: input.subject,
      templateId: input.templateId,
      templateVariables: input.templateVariables,
      byteLength: input.byteLength,
      recipientInfo: input.recipientInfo,
      deliveryMode: 'scheduled',
      schedule: {
        scheduledAt: input.scheduledAt,
        queuedAt: now,
        status: 'scheduled',
      },
    };

    const records = this.read();
    records.push(nextRecord);
    this.write(records);
    return nextRecord;
  }

  async getScheduledMessages(): Promise<ScheduledMessageRecord[]> {
    return this.read();
  }

  async getScheduledMessagesByRoom(roomId: number): Promise<ScheduledMessageRecord[]> {
    return this.read().filter((record) => record.roomId === roomId);
  }

  async getScheduledMessageById(id: number): Promise<ScheduledMessageRecord | null> {
    return this.read().find((record) => record.id === id) ?? null;
  }

  async updateScheduledMessage(id: number, input: UpdateScheduledMessageInput): Promise<ScheduledMessageRecord | null> {
    const records = this.read();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return null;

    const nextRecord: ScheduledMessageRecord = {
      ...records[index],
      ...(input.recipientInfo !== undefined ? { recipientInfo: input.recipientInfo } : {}),
      schedule: {
        ...records[index].schedule,
        ...(input.scheduledAt ? { scheduledAt: input.scheduledAt } : {}),
        status: 'scheduled',
        canceledAt: undefined,
        errorMessage: undefined,
      },
    };

    records[index] = nextRecord;
    this.write(records);
    return nextRecord;
  }

  async updateScheduledMessageStatus(
    id: number,
    input: UpdateScheduledMessageStatusInput
  ): Promise<ScheduledMessageRecord | null> {
    const records = this.read();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return null;

    const nextRecord: ScheduledMessageRecord = {
      ...records[index],
      schedule: {
        ...records[index].schedule,
        status: input.status,
        sentAt: input.sentAt,
        canceledAt: input.canceledAt,
        errorMessage: input.errorMessage,
      },
    };

    records[index] = nextRecord;
    this.write(records);
    return nextRecord;
  }

  async cancelScheduledMessage(id: number): Promise<boolean> {
    const records = this.read();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return false;

    const nextRecord: ScheduledMessageRecord = {
      ...records[index],
      schedule: {
        ...records[index].schedule,
        status: 'canceled',
        canceledAt: new Date().toISOString(),
      },
    };

    records[index] = nextRecord;
    this.write(records);
    return true;
  }

  async getDueScheduledMessages(referenceTime: string = new Date().toISOString()): Promise<ScheduledMessageRecord[]> {
    const target = new Date(referenceTime).getTime();
    return this.read().filter((record) => {
      if (record.schedule.status !== 'scheduled') return false;
      return new Date(record.schedule.scheduledAt).getTime() <= target;
    });
  }

  onSchedulesUpdated(callback: () => void): () => void {
    if (!isBrowser()) return () => undefined;

    const handler = () => callback();
    const storageHandler = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener(UPDATED_EVENT, handler);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener(UPDATED_EVENT, handler);
      window.removeEventListener('storage', storageHandler);
    };
  }
}
