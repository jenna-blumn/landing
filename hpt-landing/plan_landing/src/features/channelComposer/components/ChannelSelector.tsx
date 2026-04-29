import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import type { MessageChannel } from '../types';
import { CHANNEL_CONFIGS } from '../types';

interface ChannelSelectorProps {
  activeChannel: MessageChannel;
  defaultChannel: MessageChannel;
  availableChannels: MessageChannel[];
  onChannelChange: (channel: MessageChannel) => void;
  disabled?: boolean;
}

const CHANNEL_ICONS: Record<MessageChannel, React.ReactNode> = {
  chat: <Icon iconType={['communication', 'chat-1']} size={14} />,
  sms: <Icon iconType={['device', 'smartphone']} size={14} />,
  alimtalk: <Icon iconType={['media', 'notification']} size={14} />,
  email: <Icon iconType={['business', 'mail']} size={14} />,
};

const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  activeChannel,
  defaultChannel,
  availableChannels,
  onChannelChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeConfig = CHANNEL_CONFIGS[activeChannel];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        buttonStyle="ghost"
        size="xs"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 font-medium rounded-lg border transition-colors ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : `${activeConfig.bgLight} ${activeConfig.textColor} ${activeConfig.borderColor} hover:opacity-80`
        }`}
      >
        {CHANNEL_ICONS[activeChannel]}
        <span>{activeConfig.shortLabel}</span>
        <Icon iconType={['arrows', 'arrow-down-s']} size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {availableChannels.map((channel) => {
            const config = CHANNEL_CONFIGS[channel];
            const isActive = channel === activeChannel;
            const isDefault = channel === defaultChannel;

            return (
              <Button
                key={channel}
                buttonStyle="ghost"
                size="xs"
                onClick={() => {
                  onChannelChange(channel);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors ${
                  isActive
                    ? `${config.bgLight} ${config.textColor} font-medium`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded ${config.color} text-white`}>
                  {CHANNEL_ICONS[channel]}
                </span>
                <span className="flex-1 text-left">{config.label}</span>
                {isDefault && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    기본
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
