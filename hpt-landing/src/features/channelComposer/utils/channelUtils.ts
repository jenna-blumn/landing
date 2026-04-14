import {
  type MessageChannel,
  type ChannelConfig,
  CHANNEL_CONFIGS,
  ROOM_CHANNEL_TO_DEFAULT,
  ROOM_CHANNEL_TO_AVAILABLE,
} from '../types';

/**
 * 룸의 채널 타입에 따른 기본 메시지 채널 반환
 */
export function getDefaultChannel(roomChannel: string): MessageChannel {
  return ROOM_CHANNEL_TO_DEFAULT[roomChannel] || 'chat';
}

/**
 * 룸의 채널 타입에 따른 사용 가능한 메시지 채널 목록 반환
 */
export function getAvailableChannels(roomChannel: string): MessageChannel[] {
  return ROOM_CHANNEL_TO_AVAILABLE[roomChannel] || ['chat', 'sms', 'alimtalk', 'email'];
}

/**
 * 특정 채널의 UI 설정 반환
 */
export function getChannelConfig(channel: MessageChannel): ChannelConfig {
  return CHANNEL_CONFIGS[channel];
}

/**
 * 채널이 해당 룸에서 사용 가능한지 확인
 */
export function isChannelAvailable(roomChannel: string, messageChannel: MessageChannel): boolean {
  const available = getAvailableChannels(roomChannel);
  return available.includes(messageChannel);
}
