// ===== 음성 메모 이벤트 =====

/** 음성 지시로 생성된 메모를 해당 textarea에 전달하는 CustomEvent 이름 */
export const VOICE_MEMO_EVENT = 'voice-memo-fill';

/** VOICE_MEMO_EVENT의 detail 페이로드 */
export interface VoiceMemoEventDetail {
  type: 'customer_memo' | 'consultation_note';
  content: string;
}

// ===== 메시지 채널 타입 =====

/** 발송 가능한 메시지 채널 */
export type MessageChannel = 'chat' | 'sms' | 'alimtalk' | 'email';

/** 메시지 발송 상태 */
export type MessageSendStatus = 'sending' | 'sent' | 'delivered' | 'failed';

/** 예약 메시지 상태 */
export type ScheduledMessageStatus = 'scheduled' | 'sending' | 'sent' | 'failed' | 'canceled';

/** 메시지 전달 방식 */
export type MessageDeliveryMode = 'immediate' | 'scheduled';

/** SMS 타입 */
export type SmsType = 'sms' | 'lms';

/** 예약 발송 메타 정보 */
export interface MessageScheduleInfo {
  scheduledAt: string;
  queuedAt: string;
  status: ScheduledMessageStatus;
  sentAt?: string;
  canceledAt?: string;
  errorMessage?: string;
}

// ===== 확장 메시지 타입 =====

/** 메시지 작성기에서 사용하는 메시지 모델 */
export interface ComposerMessage {
  id: number;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
  channel?: MessageChannel;
  subject?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  byteLength?: number;
  status?: MessageSendStatus;
  deliveryMode?: MessageDeliveryMode;
  schedule?: MessageScheduleInfo;
  roomLinkEnabled?: boolean;
}

/** 예약 큐에 저장되는 메시지 레코드 */
export interface ScheduledMessageRecord {
  id: number;
  roomId: number;
  channel: Exclude<MessageChannel, 'chat'>;
  text: string;
  subject?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  byteLength?: number;
  recipientInfo?: string;
  deliveryMode: 'scheduled';
  schedule: MessageScheduleInfo;
}

// ===== 공용 템플릿 타입 =====

/** 템플릿 변수 정의 */
export interface TemplateVariable {
  key: string;
  label: string;
  defaultValue?: string;
  required: boolean;
}

/** 템플릿 버튼 */
export interface TemplateButton {
  type: 'web_link' | 'app_link' | 'delivery_tracking';
  name: string;
  url?: string;
}

/** SMS/알림톡 공용 템플릿 인터페이스 */
export interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: TemplateVariable[];
  isFavorite: boolean;
  channelType: 'sms' | 'alimtalk';
  buttons?: TemplateButton[];
  status?: 'approved' | 'pending' | 'rejected';
  createdAt: number;
  updatedAt: number;
}

// ===== SMS 타입 =====

/** SMS 발신 번호 */
export interface SmsSenderNumber {
  id: string;
  number: string;
  label: string;
  brandId?: string;
  isDefault: boolean;
}

// ===== 이메일 타입 =====

/** 이메일 수신자 */
export interface EmailRecipient {
  email: string;
  name?: string;
  type: 'to' | 'cc' | 'bcc';
}

/** 이메일 서명 */
export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

// ===== 채널 설정 =====

/** 채널별 UI 설정 */
export interface ChannelConfig {
  id: MessageChannel;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  sendMechanism: 'enter' | 'button';
  sendButtonLabel: string;
}

/** 채널별 UI 설정 맵 */
export const CHANNEL_CONFIGS: Record<MessageChannel, ChannelConfig> = {
  chat: {
    id: 'chat',
    label: '채팅',
    shortLabel: '채팅',
    icon: 'MessageCircle',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgLight: 'bg-white',
    borderColor: 'border-blue-200',
    sendMechanism: 'enter',
    sendButtonLabel: '전송',
  },
  sms: {
    id: 'sms',
    label: 'SMS / LMS',
    shortLabel: 'SMS',
    icon: 'Smartphone',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    borderColor: 'border-green-200',
    sendMechanism: 'button',
    sendButtonLabel: 'SMS 발송',
  },
  alimtalk: {
    id: 'alimtalk',
    label: '알림톡',
    shortLabel: '알림톡',
    icon: 'Bell',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    sendMechanism: 'button',
    sendButtonLabel: '알림톡 발송',
  },
  email: {
    id: 'email',
    label: '이메일',
    shortLabel: '이메일',
    icon: 'Mail',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    sendMechanism: 'button',
    sendButtonLabel: '이메일 발송',
  },
};

/** 룸 채널과 기본 메시지 채널 매핑 */
export const ROOM_CHANNEL_TO_DEFAULT: Record<string, MessageChannel> = {
  chat: 'chat',
  kakao: 'chat',
  naver: 'chat',
  instagram: 'chat',
  phone: 'sms',
};

/** 룸 채널별 사용 가능한 메시지 채널 목록 */
export const ROOM_CHANNEL_TO_AVAILABLE: Record<string, MessageChannel[]> = {
  chat: ['chat', 'sms', 'alimtalk', 'email'],
  kakao: ['chat', 'sms', 'alimtalk', 'email'],
  naver: ['chat', 'sms', 'alimtalk', 'email'],
  instagram: ['chat', 'sms', 'alimtalk', 'email'],
  phone: ['sms', 'alimtalk', 'email'],
};

// ===== 컴포저 상태 =====

/** SMS 입력 모드 */
export type SmsInputMode = 'direct' | 'template';

/** 입력창 툴바 액션 */
export type ToolbarAction = 'auth' | 'attach' | 'emoji' | 'template' | 'cta' | 'link';

/** AI 토글 상태 */
export interface AiToggleState {
  isKindActive: boolean;
  isSpellCheckActive: boolean;
  toggleKind: () => void;
  toggleSpellCheck: () => void;
}

/** 대화방 연결 토글 상태 */
export interface RoomLinkToggleState {
  isRoomLinkEnabled: boolean;
  toggleRoomLink: () => void;
}

/** 컴포저 전체 상태 */
export interface ComposerState {
  activeChannel: MessageChannel;
  chatText: string;
  smsText: string;
  smsInputMode: SmsInputMode;
  smsSenderNumberId: string | null;
  selectedSmsTemplateId: string | null;
  selectedAlimtalkTemplateId: string | null;
  templateVariables: Record<string, string>;
  emailSubject: string;
  emailBody: string;
  emailTo: EmailRecipient[];
  emailCc: EmailRecipient[];
  emailSignatureId: string | null;
}
