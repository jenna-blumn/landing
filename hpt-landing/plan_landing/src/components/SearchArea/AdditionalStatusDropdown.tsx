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
  AdditionalStatusFilter,
  ChannelFilter,
  ChatAdditionalStatus,
  PhoneAdditionalStatus,
  CHAT_STATUS_OPTIONS,
  PHONE_STATUS_OPTIONS,
} from '../../features/search/types';

interface AdditionalStatusDropdownProps {
  value: AdditionalStatusFilter;
  onChange: (value: AdditionalStatusFilter) => void;
  channelFilter: ChannelFilter;
}

const AdditionalStatusDropdown: React.FC<AdditionalStatusDropdownProps> = ({
  value,
  onChange,
  channelFilter,
}) => {
  const [tempValue, setTempValue] = useState<AdditionalStatusFilter>(value);

  const showChat = channelFilter.chat.enabled;
  const showPhone = channelFilter.phone.enabled;

  const toggleChatStatus = (status: ChatAdditionalStatus) => {
    setTempValue(prev => ({
      ...prev,
      chatStatuses: prev.chatStatuses.includes(status)
        ? prev.chatStatuses.filter(s => s !== status)
        : [...prev.chatStatuses, status],
    }));
  };

  const togglePhoneStatus = (status: PhoneAdditionalStatus) => {
    setTempValue(prev => ({
      ...prev,
      phoneStatuses: prev.phoneStatuses.includes(status)
        ? prev.phoneStatuses.filter(s => s !== status)
        : [...prev.phoneStatuses, status],
    }));
  };

  const applySelection = () => {
    onChange(tempValue);
  };

  // 칩 텍스트
  const getChipText = (): string => {
    const parts: string[] = [];

    if (showChat && value.chatStatuses.length > 0) {
      if (value.chatStatuses.length === 1) {
        const label = CHAT_STATUS_OPTIONS.find(o => o.value === value.chatStatuses[0])?.label;
        parts.push(label || '');
      } else {
        const firstLabel = CHAT_STATUS_OPTIONS.find(o => o.value === value.chatStatuses[0])?.label;
        parts.push(`${firstLabel} 외 ${value.chatStatuses.length - 1}건`);
      }
    }

    if (showPhone && value.phoneStatuses.length > 0) {
      if (value.phoneStatuses.length === 1) {
        const label = PHONE_STATUS_OPTIONS.find(o => o.value === value.phoneStatuses[0])?.label;
        parts.push(label || '');
      } else {
        const firstLabel = PHONE_STATUS_OPTIONS.find(o => o.value === value.phoneStatuses[0])?.label;
        parts.push(`${firstLabel} 외 ${value.phoneStatuses.length - 1}건`);
      }
    }

    if (parts.length === 0) return '추가 상태';
    return `추가 상태: ${parts.join(', ')}`;
  };

  const isActive = (showChat && value.chatStatuses.length > 0) || (showPhone && value.phoneStatuses.length > 0);

  const handleClear = () => {
    onChange({ chatStatuses: [], phoneStatuses: [] });
  };

  // 채팅/전화 모두 비활성이면 렌더링 안함
  if (!showChat && !showPhone) return null;

  return (
    <div className="flex items-center">
      <DropdownMenu onOpenChange={(open) => { if (open) setTempValue(value); }}>
        <DropdownMenuTrigger asChild>
          <Button
            buttonStyle={isActive ? 'primary' : 'secondary'}
            size="xs"
            shape="pill"
            tailIcon={<Icon iconType={['arrows', 'arrow-down-s']} size={12} className="flex-shrink-0" />}
            className={`max-w-[220px] ${isActive ? 'rounded-r-none border-r-0' : ''}`}
          >
            <span className="truncate">{getChipText()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent width={180}>
          {/* 채팅 섹션 */}
          {showChat && (
            <div className="p-2">
              <DropdownMenuLabel>
                <div className="flex items-center gap-1.5">
                  <Icon iconType={['communication', 'chat-1']} size={12} color="success" />
                  <span>채팅</span>
                </div>
              </DropdownMenuLabel>
              {CHAT_STATUS_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    checked={tempValue.chatStatuses.includes(option.value)}
                    onCheckedChange={() => toggleChatStatus(option.value)}
                    label={<span className="text-xs text-gray-700">{option.label}</span>}
                  />
                </div>
              ))}
            </div>
          )}

          {showChat && showPhone && <DropdownMenuSeparator />}

          {/* 전화 섹션 */}
          {showPhone && (
            <div className="p-2">
              <DropdownMenuLabel>
                <div className="flex items-center gap-1.5">
                  <Icon iconType={['device', 'phone']} size={12} color="informative" />
                  <span>전화</span>
                </div>
              </DropdownMenuLabel>
              {PHONE_STATUS_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    checked={tempValue.phoneStatuses.includes(option.value)}
                    onCheckedChange={() => togglePhoneStatus(option.value)}
                    label={<span className="text-xs text-gray-700">{option.label}</span>}
                  />
                </div>
              ))}
            </div>
          )}

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

export default AdditionalStatusDropdown;
