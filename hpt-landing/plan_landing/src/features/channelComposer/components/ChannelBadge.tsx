import React from 'react';
import type { MessageChannel } from '../types';
import { CHANNEL_CONFIGS } from '../types';

interface ChannelBadgeProps {
  channel: MessageChannel;
  size?: 'sm' | 'xs';
}

const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel, size = 'xs' }) => {
  // 채팅은 기본 채널이므로 뱃지 표시하지 않음
  if (channel === 'chat') return null;

  const config = CHANNEL_CONFIGS[channel];
  const sizeClasses = size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-[10px] px-1 py-px';

  return (
    <span
      className={`inline-flex items-center font-medium rounded ${sizeClasses} ${config.color} text-white`}
    >
      {config.shortLabel}
    </span>
  );
};

export default ChannelBadge;
