import type { Room } from '../../../data/mockData';
import type { ComposerMessage, ScheduledMessageRecord } from '../types';
import { toComposerMessageFromSchedule } from './scheduleUtils';

function mergeMessage(target: Room['messages'][number], message: ComposerMessage): Room['messages'][number] {
  return {
    ...target,
    text: message.text,
    time: message.time,
    channel: message.channel,
    subject: message.subject,
    templateId: message.templateId,
    templateVariables: message.templateVariables,
    byteLength: message.byteLength,
    status: message.status,
    deliveryMode: message.deliveryMode,
    schedule: message.schedule,
  };
}

export function appendComposerMessageToRooms(rooms: Room[], roomId: number, message: ComposerMessage): Room[] {
  return rooms.map((room) => {
    if (room.id !== roomId) return room;

    const nextMessage: Room['messages'][number] = {
      id: message.id,
      sender: message.sender,
      text: message.text,
      time: message.time,
      channel: message.channel,
      subject: message.subject,
      templateId: message.templateId,
      templateVariables: message.templateVariables,
      byteLength: message.byteLength,
      status: message.status,
      deliveryMode: message.deliveryMode,
      schedule: message.schedule,
    };

    const nextMessages = [...room.messages, nextMessage];
    const shouldUpdateActivity = message.deliveryMode !== 'scheduled' || message.schedule?.status === 'sent';

    return {
      ...room,
      messages: nextMessages,
      ...(shouldUpdateActivity
        ? {
            lastMessage: message.text,
            lastActivityTimestamp: Date.now(),
          }
        : {}),
    };
  });
}

export function upsertComposerMessageInRooms(rooms: Room[], roomId: number, message: ComposerMessage): Room[] {
  return rooms.map((room) => {
    if (room.id !== roomId) return room;

    const index = room.messages.findIndex((item) => item.id === message.id);
    const nextMessages =
      index === -1
        ? [...room.messages, {
            id: message.id,
            sender: message.sender,
            text: message.text,
            time: message.time,
            channel: message.channel,
            subject: message.subject,
            templateId: message.templateId,
            templateVariables: message.templateVariables,
            byteLength: message.byteLength,
            status: message.status,
            deliveryMode: message.deliveryMode,
            schedule: message.schedule,
          }]
        : room.messages.map((item, currentIndex) => (currentIndex === index ? mergeMessage(item, message) : item));

    const shouldUpdateActivity = message.deliveryMode !== 'scheduled' || message.schedule?.status === 'sent';

    return {
      ...room,
      messages: nextMessages,
      ...(shouldUpdateActivity
        ? {
            lastMessage: message.text,
            lastActivityTimestamp: Date.now(),
          }
        : {}),
    };
  });
}

export function removeScheduledMessageFromRooms(rooms: Room[], roomId: number, messageId: number): Room[] {
  return rooms.map((room) => {
    if (room.id !== roomId) return room;
    return {
      ...room,
      messages: room.messages.filter((message) => message.id !== messageId),
    };
  });
}

export function hydrateRoomsWithScheduledMessages(rooms: Room[], records: ScheduledMessageRecord[]): Room[] {
  return rooms.map((room) => {
    const roomMessages = records
      .filter((record) => record.roomId === room.id && record.schedule.status === 'sent')
      .map((record) => toComposerMessageFromSchedule(record));
    if (roomMessages.length === 0) return room;

    const existingIds = new Set(room.messages.map((message) => message.id));
    const appended = roomMessages
      .filter((message) => !existingIds.has(message.id))
      .map((message) => ({
        id: message.id,
        sender: message.sender,
        text: message.text,
        time: message.time,
        channel: message.channel,
        subject: message.subject,
        templateId: message.templateId,
        templateVariables: message.templateVariables,
        byteLength: message.byteLength,
        status: message.status,
        deliveryMode: message.deliveryMode,
        schedule: message.schedule,
      }));

    if (appended.length === 0) return room;

    const latestMessage = appended[appended.length - 1];

    return {
      ...room,
      messages: [...room.messages, ...appended],
      lastMessage: latestMessage.text,
      lastActivityTimestamp: Date.now(),
    };
  });
}
