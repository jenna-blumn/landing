import React, { useState } from 'react';
import {
  Button,
  Icon,
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@blumnai-studio/blumnai-design-system';
import {
  ChannelFilter,
  CHAT_SUB_CHANNEL_OPTIONS,
  MOCK_PHONE_NUMBERS,
  ChatSubChannel,
} from '../../features/search/types';
import { Channel } from '../../types/channel';

interface ChannelFilterDropdownProps {
  value: ChannelFilter;
  onChange: (value: ChannelFilter) => void;
  selectedChannel: Channel;
}

const ChannelFilterDropdown: React.FC<ChannelFilterDropdownProps> = ({ value, onChange, selectedChannel: _selectedChannel }) => {
  const [tempValue, setTempValue] = useState<ChannelFilter>(value);

  const toggleChatSubChannel = (channel: ChatSubChannel) => {
    setTempValue(prev => {
      const current = prev.chat.subChannels;
      const updated = current.includes(channel)
        ? current.filter(c => c !== channel)
        : [...current, channel];

      const enabled = updated.length > 0;

      return { ...prev, chat: { enabled, subChannels: updated } };
    });
  };

  const toggleAllChatSubChannels = () => {
    setTempValue(prev => {
      const isAllSelected = prev.chat.enabled && prev.chat.subChannels.length === 0;

      if (isAllSelected) {
        return {
          ...prev,
          chat: { enabled: false, subChannels: [] },
        };
      } else {
        return {
          ...prev,
          chat: { enabled: true, subChannels: [] },
        };
      }
    });
  };

  const togglePhoneNumber = (number: string) => {
    setTempValue(prev => {
      const current = prev.phone.subChannels;
      const updated = current.includes(number)
        ? current.filter(n => n !== number)
        : [...current, number];

      const enabled = updated.length > 0;

      return { ...prev, phone: { enabled, subChannels: updated } };
    });
  };

  const toggleAllPhoneNumbers = () => {
    setTempValue(prev => {
      const isAllSelected = prev.phone.enabled && prev.phone.subChannels.length === 0;

      if (isAllSelected) {
        return {
          ...prev,
          phone: { enabled: false, subChannels: [] },
        };
      } else {
        return {
          ...prev,
          phone: { enabled: true, subChannels: [] },
        };
      }
    });
  };

  const applySelection = () => {
    onChange(tempValue);
  };

  // 칩 텍스트 생성
  const getChipText = (): string => {
    const parts: string[] = [];

    if (value.chat.enabled) {
      if (value.chat.subChannels.length === 0 || value.chat.subChannels.length === CHAT_SUB_CHANNEL_OPTIONS.length) {
        parts.push('채팅(전체)');
      } else if (value.chat.subChannels.length === 1) {
        const label = CHAT_SUB_CHANNEL_OPTIONS.find(o => o.value === value.chat.subChannels[0])?.label;
        parts.push(`채팅(${label})`);
      } else {
        const firstLabel = CHAT_SUB_CHANNEL_OPTIONS.find(o => o.value === value.chat.subChannels[0])?.label;
        parts.push(`채팅(${firstLabel} 외 ${value.chat.subChannels.length - 1}건)`);
      }
    }

    if (value.phone.enabled) {
      if (value.phone.subChannels.length === 0 || value.phone.subChannels.length === MOCK_PHONE_NUMBERS.length) {
        parts.push('전화(전체)');
      } else if (value.phone.subChannels.length === 1) {
        const label = MOCK_PHONE_NUMBERS.find(o => o.value === value.phone.subChannels[0])?.label;
        parts.push(`전화(${label})`);
      } else {
        const firstLabel = MOCK_PHONE_NUMBERS.find(o => o.value === value.phone.subChannels[0])?.label;
        parts.push(`전화(${firstLabel} 외 ${value.phone.subChannels.length - 1}건)`);
      }
    }

    if (parts.length === 0) return '채널';
    if (value.chat.enabled && value.phone.enabled &&
        value.chat.subChannels.length === 0 && value.phone.subChannels.length === 0) {
      return '채널: 전체';
    }
    return `채널: ${parts.join(', ')}`;
  };

  const isActive = !(
    value.chat.enabled && value.phone.enabled &&
    value.chat.subChannels.length === 0 && value.phone.subChannels.length === 0
  );

  const handleClear = () => {
    onChange({
      chat: { enabled: true, subChannels: [] },
      phone: { enabled: true, subChannels: [] },
    });
  };

  return (
    <div className="flex items-center">
      <DropdownMenu onOpenChange={(open) => { if (open) setTempValue(value); }}>
        <DropdownMenuTrigger asChild>
          <Button
            buttonStyle={isActive ? 'primary' : 'secondary'}
            size="xs"
            shape="pill"
            tailIcon={<Icon iconType={['arrows', 'arrow-down-s']} size={12} className="flex-shrink-0" />}
            className={`max-w-[280px] ${isActive ? 'rounded-r-none border-r-0' : ''}`}
          >
            <span className="truncate">{getChipText()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent width={220}>
          {/* 채팅 섹션 */}
          <div className="p-2">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Icon iconType={['communication', 'chat-1']} size={14} color="success" />
                <span>채팅</span>
              </div>
            </DropdownMenuLabel>

            <div className="ml-2">
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded border-b border-gray-50 mb-0.5">
                <Checkbox
                  checked={tempValue.chat.enabled && tempValue.chat.subChannels.length === 0}
                  onCheckedChange={() => toggleAllChatSubChannels()}
                  label={<span className="text-xs text-gray-600 font-medium">전체</span>}
                />
              </div>
              {CHAT_SUB_CHANNEL_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    checked={tempValue.chat.enabled && (tempValue.chat.subChannels.length === 0 || tempValue.chat.subChannels.includes(option.value))}
                    onCheckedChange={() => toggleChatSubChannel(option.value)}
                    label={<span className="text-xs text-gray-600">{option.label}</span>}
                  />
                </div>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* 전화 섹션 */}
          <div className="p-2">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Icon iconType={['device', 'phone']} size={14} color="informative" />
                <span>전화</span>
              </div>
            </DropdownMenuLabel>

            <div className="ml-2">
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded border-b border-gray-50 mb-0.5">
                <Checkbox
                  checked={tempValue.phone.enabled && tempValue.phone.subChannels.length === 0}
                  onCheckedChange={() => toggleAllPhoneNumbers()}
                  label={<span className="text-xs text-gray-600 font-medium">전체</span>}
                />
              </div>
              {MOCK_PHONE_NUMBERS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    checked={tempValue.phone.enabled && (tempValue.phone.subChannels.length === 0 || tempValue.phone.subChannels.includes(option.value))}
                    onCheckedChange={() => togglePhoneNumber(option.value)}
                    label={<span className="text-xs text-gray-600">{option.label}</span>}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 적용 버튼 */}
          <DropdownMenuSeparator />
          <div className="p-2 flex items-center justify-center">
            <Button
              onClick={applySelection}
              buttonStyle="primary"
              size="xs"
            >
              적용
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {isActive && (
        <Button
          onClick={(e) => { e.stopPropagation(); handleClear(); }}
          variant="iconOnly"
          buttonStyle="primary"
          size="xs"
          leadIcon={<Icon iconType={['system', 'close']} size={12} />}
          className="rounded-l-none border-l-0"
        />
      )}
    </div>
  );
};

export default ChannelFilterDropdown;
