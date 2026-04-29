// 채널 타입 정의
export type Channel = 'all' | 'chat' | 'phone' | 'board' | 'email';

// 채널 설정 타입
export interface ChannelSettings {
  all: boolean;
  chat: boolean;
  phone: boolean;
  board: boolean;
  email: boolean;
}

// 채널 표시 이름 매핑
export const CHANNEL_LABELS: Record<Exclude<Channel, 'all'>, string> = {
  chat: '챗',
  phone: '전화',
  board: '게시판',
  email: '이메일',
};

// 비동기 텍스트 채널 그룹
export const ASYNC_TEXT_CHANNELS = ['chat', 'kakao', 'naver', 'instagram', 'board', 'email'] as const;

// localStorage 키
export const CHANNEL_SETTINGS_STORAGE_KEY = 'mock_channel_settings';
