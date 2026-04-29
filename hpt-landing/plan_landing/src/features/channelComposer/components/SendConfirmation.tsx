import React, { useEffect } from 'react';
import { Icon } from '@blumnai-studio/blumnai-design-system';
import type { MessageChannel } from '../types';
import { CHANNEL_CONFIGS } from '../types';

interface SendConfirmationProps {
  channel: MessageChannel;
  success: boolean;
  recipientInfo?: string;
  mode: 'sent' | 'scheduled';
  onDismiss: () => void;
}

const SendConfirmation: React.FC<SendConfirmationProps> = ({
  channel,
  success,
  recipientInfo,
  mode,
  onDismiss,
}) => {
  const config = CHANNEL_CONFIGS[channel];

  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  const actionLabel = mode === 'scheduled' ? '예약 완료' : '발송 완료';
  const failureLabel = mode === 'scheduled' ? '예약 실패' : '발송 실패';

  return (
    <div
      className={`absolute bottom-full left-1/2 z-50 mb-2 flex -translate-x-1/2 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium shadow-lg ${
        success ? 'border border-gray-200 bg-white text-gray-700' : 'border border-red-200 bg-red-50 text-red-700'
      }`}
      onClick={onDismiss}
    >
      {success ? (
        <Icon iconType={['system', 'checkbox-circle']} size={14} color="success" />
      ) : (
        <Icon iconType={['system', 'close-circle']} size={14} color="destructive" />
      )}
      <span>
        {success
          ? `${config.shortLabel} ${actionLabel}${recipientInfo ? ` (${recipientInfo})` : ''}`
          : `${config.shortLabel} ${failureLabel}`}
      </span>
    </div>
  );
};

export default SendConfirmation;
