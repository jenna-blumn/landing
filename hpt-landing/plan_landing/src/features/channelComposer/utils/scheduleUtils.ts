import type { TimeValue } from '@blumnai-studio/blumnai-design-system';
import type { ComposerMessage, MessageScheduleInfo, ScheduledMessageRecord } from '../types';

const bannerFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const metaFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function formatMessageTime(value: string | number | Date): string {
  return timeFormatter.format(new Date(value));
}

export function buildScheduleIso(date: Date, time?: TimeValue): string {
  const next = new Date(date);
  next.setSeconds(0, 0);
  if (time) {
    next.setHours(time.hour, time.minute, 0, 0);
  }
  return next.toISOString();
}

export function isoToDate(value?: string): Date | undefined {
  return value ? new Date(value) : undefined;
}

export function isoToTimeValue(value?: string): TimeValue | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

export function isPastSchedule(value?: string): boolean {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
}

export function formatScheduleBannerText(scheduledAt: string): string {
  return `${bannerFormatter.format(new Date(scheduledAt))}에 보내기를 선택합니다.`;
}

export function formatScheduleMetaText(schedule: MessageScheduleInfo): string {
  switch (schedule.status) {
    case 'scheduled':
      return `예약됨 · ${metaFormatter.format(new Date(schedule.scheduledAt))}`;
    case 'sending':
      return '예약 발송 중';
    case 'failed':
      return '예약 발송 실패';
    case 'canceled':
      return '예약 취소';
    case 'sent':
      return '예약 발송';
    default:
      return '';
  }
}

export function toComposerMessageFromSchedule(record: ScheduledMessageRecord): ComposerMessage {
  const displayTime = record.schedule.sentAt ?? record.schedule.queuedAt;

  return {
    id: record.id,
    sender: 'agent',
    text: record.text,
    time: formatMessageTime(displayTime),
    channel: record.channel,
    subject: record.subject,
    templateId: record.templateId,
    templateVariables: record.templateVariables,
    byteLength: record.byteLength,
    status: record.schedule.status === 'failed' ? 'failed' : record.schedule.status === 'sending' ? 'sending' : 'sent',
    deliveryMode: 'scheduled',
    schedule: record.schedule,
  };
}

export function getScheduleInputError(text: string, scheduledAt?: string): string | null {
  if (!text.trim()) return '메시지를 입력해야 예약할 수 있습니다.';
  if (!scheduledAt) return '예약 일시를 선택해 주세요.';
  if (isPastSchedule(scheduledAt)) return '과거 시각으로는 예약할 수 없습니다.';
  return null;
}
