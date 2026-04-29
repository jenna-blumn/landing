import type { ComposerMessage, MessageChannel } from '../types';
import { generateNumericId } from '../../../utils/idUtils';
import { formatMessageTime } from '../utils/scheduleUtils';

const DELAY_MS = 300;

interface SendMessageNowOptions {
  messageId?: number;
  subject?: string;
  templateId?: string;
  templateVariables?: Record<string, string>;
  byteLength?: number;
  roomLinkEnabled?: boolean;
}

/**
 * 메시지 즉시 발송 mock API.
 * 실제 운영에서는 서버가 발송을 수행해야 하므로 현재 구현은 UI 목업용이다.
 */
export async function sendMessageNow(
  _roomId: number,
  channel: MessageChannel,
  text: string,
  options?: SendMessageNowOptions
): Promise<ComposerMessage> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();

      const message: ComposerMessage = {
        id: options?.messageId ?? generateNumericId(),
        sender: 'agent',
        text,
        time: formatMessageTime(now),
        channel,
        status: 'sent',
        deliveryMode: 'immediate',
        ...(options?.subject && { subject: options.subject }),
        ...(options?.templateId && { templateId: options.templateId }),
        ...(options?.templateVariables && { templateVariables: options.templateVariables }),
        ...(options?.byteLength && { byteLength: options.byteLength }),
        ...(options?.roomLinkEnabled && { roomLinkEnabled: options.roomLinkEnabled }),
      };

      resolve(message);
    }, DELAY_MS);
  });
}
