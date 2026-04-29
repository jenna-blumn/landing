import React, { useCallback } from 'react';
import { Button, Icon, Select, Textarea } from '@blumnai-studio/blumnai-design-system';
import type { TextareaToolbarAction } from '@blumnai-studio/blumnai-design-system';
import type { EmailSignature, MessageChannel } from '../types';
import { CHANNEL_CONFIGS } from '../types';

interface ComposerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  canSend: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  activeChannel: MessageChannel;
  byteInfo?: string;
  isOverLimit?: boolean;
  charCountInfo?: string;
  isOverCharLimit?: boolean;
  signatures?: EmailSignature[];
  selectedSignatureId?: string | null;
  onSignatureChange?: (id: string) => void;
  hideSendButton?: boolean;
  compact?: boolean;
  scheduleControl?: React.ReactNode;
  scheduleHeader?: React.ReactNode;
}

const ComposerInput: React.FC<ComposerInputProps> = ({
  value,
  onChange,
  onSend,
  canSend,
  disabled = false,
  readOnly = false,
  placeholder = '\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694.\n\uC5EC\uB7EC \uC904 \uC785\uB825\uC740 Shift + Enter\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.',
  activeChannel,
  byteInfo,
  isOverLimit,
  charCountInfo,
  isOverCharLimit,
  signatures,
  selectedSignatureId,
  onSignatureChange,
  hideSendButton = false,
  compact = false,
  scheduleControl,
  scheduleHeader,
}) => {
  const config = CHANNEL_CONFIGS[activeChannel];
  const isChat = activeChannel === 'chat';
  const isSmsOrAlimtalk = activeChannel === 'sms' || activeChannel === 'alimtalk';

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isChat && event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (canSend && !disabled) {
          onSend();
        }
      }
    },
    [canSend, disabled, isChat, onSend]
  );

  const showCharCounter = isSmsOrAlimtalk && Boolean(charCountInfo);
  const showByteCounter = isSmsOrAlimtalk && Boolean(byteInfo) && !showCharCounter;
  const counterText = showCharCounter ? charCountInfo : showByteCounter ? byteInfo : null;
  const isCounterOverLimit = showCharCounter ? isOverCharLimit : isOverLimit;
  const inputSurfaceClass = isSmsOrAlimtalk
    ? 'bg-gray-50 focus-within:bg-white transition-colors duration-150'
    : 'bg-white';

  const getToolbarActions = (): TextareaToolbarAction[] => {
    switch (activeChannel) {
      case 'chat':
        return [
          { key: 'auth', icon: ['system', 'shield-check'] },
          { key: 'attach', icon: ['business', 'attachment'] },
          { key: 'emoji', icon: ['user', 'emotion'] },
          { key: 'template', icon: ['editor', 'list-unordered'] },
          { key: 'cta', icon: ['editor', 'link'] },
        ];
      case 'sms':
      case 'alimtalk':
      case 'email':
        return [
          { key: 'attach', icon: ['business', 'attachment'] },
          { key: 'emoji', icon: ['user', 'emotion'] },
        ];
      default:
        return [];
    }
  };

  const renderToolbarTrailing = () => (
    <div className="flex items-center gap-1.5">
      {counterText && (
        <span className={`text-xs ${isCounterOverLimit ? 'font-medium text-red-500' : 'text-gray-400'}`}>
          {counterText}
          {showByteCounter && isOverLimit && ' (글자수 초과)'}
        </span>
      )}

      {scheduleControl}

      {activeChannel === 'email' && signatures && onSignatureChange && (
        <Select
          variant="default"
          options={[
            { id: '__none__', label: '서명 없음' },
            ...signatures.map((signature) => ({
              id: signature.id,
              label: signature.name,
            })),
          ]}
          value={selectedSignatureId || '__none__'}
          onChange={(nextValue) => onSignatureChange(nextValue === '__none__' ? '' : nextValue)}
          size="sm"
        />
      )}

      {!hideSendButton && (
        <Button
          onClick={onSend}
          disabled={!canSend || disabled}
          variant="iconOnly"
          buttonStyle="primary"
          size="sm"
          leadIcon={<Icon iconType={['business', 'send-plane']} size={15} />}
          className={`h-8 w-8 ${canSend && !disabled ? `${config.color} text-white hover:opacity-90` : ''}`}
          title={config.sendButtonLabel}
        />
      )}
    </div>
  );

  return (
    <div
      className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 ${inputSurfaceClass} ${
        compact ? '' : ''
      }`}
    >
      {scheduleHeader && <div className="border-b border-gray-200 bg-gray-50">{scheduleHeader}</div>}
      <Textarea
        value={value}
        onChange={(event) => !readOnly && onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        minRows={2}
        maxRows={compact ? undefined : 8}
        textareaStyle="soft"
        size="sm"
        showToolbar
        toolbarActions={getToolbarActions()}
        toolbarTrailing={renderToolbarTrailing()}
        className={`${compact ? "h-full flex-1 min-h-0 [&>div]:h-full [&>div]:min-h-0 [&>div]:flex [&>div]:flex-col [&>div]:border-0 [&>div]:rounded-none [&_textarea]:flex-1 [&_textarea]:h-full [&_textarea]:min-h-0 [&_textarea]:overflow-y-auto [&_[data-slot='textarea-toolbar']]:mt-auto [&_[data-slot='textarea-toolbar']]:rounded-none [&_[data-slot='textarea-toolbar']]:border-x-0 [&_[data-slot='textarea-toolbar']]:border-b-0" : 'flex-1 min-h-0 [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:border-0 [&>div]:rounded-none [&_textarea]:flex-1 [&_textarea]:min-h-0 [&_textarea]:overflow-y-auto'} ${
          readOnly ? '[&_textarea]:cursor-default [&_textarea]:bg-gray-50 [&_textarea]:text-gray-500' : ''
        }`}
      />
    </div>
  );
};

export default ComposerInput;
