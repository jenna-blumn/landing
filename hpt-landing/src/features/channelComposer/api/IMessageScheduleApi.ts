import type { ScheduledMessageRecord, ScheduledMessageStatus } from '../types';

export interface CreateScheduledMessageInput {
  roomId: number;
  channel: ScheduledMessageRecord['channel'];
  text: string;
  subject?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  byteLength?: number;
  recipientInfo?: string;
  scheduledAt: string;
}

export interface UpdateScheduledMessageInput {
  scheduledAt?: string;
  recipientInfo?: string;
}

export interface UpdateScheduledMessageStatusInput {
  status: ScheduledMessageStatus;
  sentAt?: string;
  canceledAt?: string;
  errorMessage?: string;
}

export interface IMessageScheduleApi {
  createScheduledMessage(input: CreateScheduledMessageInput): Promise<ScheduledMessageRecord>;
  getScheduledMessages(): Promise<ScheduledMessageRecord[]>;
  getScheduledMessagesByRoom(roomId: number): Promise<ScheduledMessageRecord[]>;
  getScheduledMessageById(id: number): Promise<ScheduledMessageRecord | null>;
  updateScheduledMessage(id: number, input: UpdateScheduledMessageInput): Promise<ScheduledMessageRecord | null>;
  updateScheduledMessageStatus(
    id: number,
    input: UpdateScheduledMessageStatusInput
  ): Promise<ScheduledMessageRecord | null>;
  cancelScheduledMessage(id: number): Promise<boolean>;
  getDueScheduledMessages(referenceTime?: string): Promise<ScheduledMessageRecord[]>;
  onSchedulesUpdated(callback: () => void): () => void;
}
