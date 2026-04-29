import React, { useMemo, useState } from 'react';
import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import { CalendarClock } from 'lucide-react';
import type { ComposerMessage } from '../types';
import { formatCharCountInfo, isOverCharLimit as checkOverCharLimit } from '../utils/byteCounter';
import { createMessageScheduleApi } from '../api/createMessageScheduleApi';
import { useChannelComposer } from '../hooks/useChannelComposer';
import { useComposerResize } from '../hooks/useComposerResize';
import { useRoomScheduledMessages } from '../hooks/useRoomScheduledMessages';
import { useVoiceInstruction } from '../hooks/useVoiceInstruction';
import { formatScheduleBannerText } from '../utils/scheduleUtils';
import ComposerTopBar from './ComposerTopBar';
import ComposerInput from './ComposerInput';
import TemplateArea from './TemplateArea';
import EmailHeaderFields from './EmailHeaderFields';
import SendConfirmation from './SendConfirmation';
import SchedulePickerPopover from './SchedulePickerPopover';
import ScheduledMessagesPopover from './ScheduledMessagesPopover';

interface ChannelComposerProps {
  roomId: number;
  roomChannel: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  brandId?: string;
  isCompleted?: boolean;
  onSendMessage: (message: ComposerMessage) => void;
}

const ChannelComposer: React.FC<ChannelComposerProps> = ({
  roomId,
  roomChannel,
  customerName,
  customerPhone,
  customerEmail,
  brandId,
  isCompleted = false,
  onSendMessage,
}) => {
  const messageScheduleApi = useMemo(
    () => createMessageScheduleApi({ apiType: 'localStorage' }),
    []
  );
  const [isScheduledListOpen, setIsScheduledListOpen] = useState(false);

  const composer = useChannelComposer({
    roomId,
    roomChannel,
    customerName,
    customerPhone,
    customerEmail,
    brandId,
    onMessageSent: onSendMessage,
    messageScheduleApi,
  });

  const voiceInstruction = useVoiceInstruction(
    (generatedText) => {
      composer.setInputText(generatedText);
    },
    {
      activeChannel: composer.activeChannel === 'alimtalk' ? undefined : composer.activeChannel,
      onEmailSubjectGenerated: (subject) => {
        composer.emailState.setSubject(subject);
      },
    },
  );

  const { activeRecords, activeCount } = useRoomScheduledMessages(roomId, messageScheduleApi);

  const isSmsOrAlimtalk = composer.activeChannel === 'sms' || composer.activeChannel === 'alimtalk';

  const minComposerHeight = isSmsOrAlimtalk ? 460 : composer.activeChannel === 'email' ? 240 : 180;
  const defaultComposerHeight = isSmsOrAlimtalk ? 500 : composer.activeChannel === 'email' ? 260 : 220;
  const { composerHeight, isResizing, resizeHandleProps } = useComposerResize({
    hasTemplateArea: isSmsOrAlimtalk,
    minHeight: minComposerHeight,
    defaultHeight: defaultComposerHeight,
  });

  const currentTemplateState = useMemo(() => {
    if (composer.activeChannel === 'sms') return composer.smsTemplateState;
    if (composer.activeChannel === 'alimtalk') return composer.alimtalkTemplateState;
    return null;
  }, [composer.activeChannel, composer.alimtalkTemplateState, composer.smsTemplateState]);

  const effectiveCharCountInfo = useMemo(
    () => formatCharCountInfo(composer.inputText),
    [composer.inputText]
  );

  const effectiveIsOverCharLimit = useMemo(
    () => checkOverCharLimit(composer.inputText.length),
    [composer.inputText]
  );

  const isRescheduleEditing = composer.editingScheduledRecordId !== null;

  const scheduleHeader = composer.scheduledAt ? (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs text-blue-600"
        onClick={() => composer.setIsScheduleDialogOpen(true)}
      >
        {isRescheduleEditing && (
          <span className="flex-shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            재예약 중
          </span>
        )}
        <span className="truncate">{formatScheduleBannerText(composer.scheduledAt)}</span>
        <Icon iconType={['arrows', 'arrow-down-s']} size={12} />
      </button>
      <Button
        type="button"
        variant="iconOnly"
        buttonStyle="ghost"
        size="2xs"
        leadIcon={<Icon iconType={['system', 'close']} size={12} />}
        title={isRescheduleEditing ? '재예약 취소' : '일정 제거'}
        onClick={() => {
          if (isRescheduleEditing) {
            composer.cancelRescheduleEdit();
          } else {
            composer.setScheduledAt(undefined);
          }
        }}
      />
    </div>
  ) : null;

  const scheduleControl = composer.isScheduleSupported ? (
    <SchedulePickerPopover
      open={composer.isScheduleDialogOpen}
      initialScheduledAt={composer.scheduledAt}
      messageText={composer.inputText}
      onOpenChange={composer.setIsScheduleDialogOpen}
      onConfirm={composer.setScheduledAt}
      trigger={
        <Button
          type="button"
          disabled={!composer.canSend && !composer.scheduledAt}
          variant="iconOnly"
          buttonStyle={composer.scheduledAt ? 'soft' : 'secondary'}
          colorOverride={composer.scheduledAt ? 'blue' : undefined}
          size="sm"
          leadIcon={<CalendarClock size={15} />}
          title="예약"
          onClick={() => composer.setIsScheduleDialogOpen(true)}
        />
      }
    />
  ) : null;

  if (isCompleted) {
    return (
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <span>상담이 종료되었습니다</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col border-t border-gray-200 bg-gray-50 transition-colors duration-200"
      style={{ height: composerHeight }}
    >
      <div
        className={`flex h-1.5 flex-shrink-0 cursor-row-resize items-center justify-center transition-colors ${
          isResizing ? 'bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        {...resizeHandleProps}
      >
        <div className={`h-0.5 w-8 rounded-full ${isResizing ? 'bg-blue-500' : 'bg-gray-400'}`} />
      </div>

      <ComposerTopBar
        activeChannel={composer.activeChannel}
        defaultChannel={composer.defaultChannel}
        availableChannels={composer.availableChannels}
        onChannelChange={composer.setActiveChannel}
        aiToggles={composer.aiToggles}
        roomLinkToggle={composer.activeChannel !== 'chat' ? composer.roomLinkToggle : undefined}
        isListening={voiceInstruction.isListening}
        isGenerating={voiceInstruction.isGenerating}
        sttText={voiceInstruction.sttText}
        onVoiceInstructionToggle={voiceInstruction.toggleListening}
        onVoiceInstructionFinish={voiceInstruction.finishListeningAndGenerate}
        voiceLanguage={voiceInstruction.targetLanguage}
        onVoiceLanguageChange={voiceInstruction.setTargetLanguage}
        showFallbackModal={voiceInstruction.showFallbackModal}
        pendingContent={voiceInstruction.pendingContent}
        onResolveFallback={voiceInstruction.resolveFallback}
        onCancelFallback={voiceInstruction.cancelFallback}
        scheduledMessagesControl={
          activeCount > 0 ? (
            <ScheduledMessagesPopover
              open={isScheduledListOpen}
              onOpenChange={setIsScheduledListOpen}
              records={activeRecords}
              scheduleApi={messageScheduleApi}
              onReschedule={composer.enterRescheduleMode}
            />
          ) : undefined
        }
      />

      {composer.activeChannel === 'email' && (
        <EmailHeaderFields emailState={composer.emailState} />
      )}

      {isSmsOrAlimtalk && currentTemplateState && (
        <TemplateArea
          templateState={currentTemplateState}
          channelType={composer.activeChannel === 'sms' ? 'sms' : 'alimtalk'}
          customerName={customerName}
          customerPhone={customerPhone}
          inputValue={composer.inputText}
          onInputChange={composer.setInputText}
          onSend={composer.handleSend}
          canSend={composer.canSend}
          isSending={composer.isSending}
          isInputReadOnly={composer.isInputReadOnly}
          activeChannel={composer.activeChannel}
          charCountInfo={effectiveCharCountInfo}
          isOverCharLimit={effectiveIsOverCharLimit}
          byteInfo={composer.smsState.byteInfo}
          isOverLimit={composer.smsState.isOverLimit}
          senderNumbers={composer.smsState.senderNumbers}
          selectedSenderId={composer.smsState.selectedSenderId}
          onSenderChange={composer.smsState.setSelectedSenderId}
          brandId={brandId}
          onCancel={composer.handleCancel}
          scheduleControl={scheduleControl}
          scheduleHeader={scheduleHeader}
        />
      )}

      {!isSmsOrAlimtalk && (
        <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-1">
          <ComposerInput
            value={composer.inputText}
            onChange={composer.setInputText}
            onSend={composer.handleSend}
            canSend={composer.canSend}
            disabled={composer.isSending}
            readOnly={composer.isInputReadOnly}
            activeChannel={composer.activeChannel}
            byteInfo={composer.smsState.byteInfo}
            isOverLimit={composer.smsState.isOverLimit}
            signatures={composer.emailState.signatures}
            selectedSignatureId={composer.emailState.selectedSignatureId}
            onSignatureChange={composer.emailState.setSelectedSignatureId}
            scheduleControl={scheduleControl}
            scheduleHeader={scheduleHeader}
          />
        </div>
      )}

      {composer.lastSendResult && (
        <div className="relative">
          <SendConfirmation
            channel={composer.lastSendResult.channel}
            success={composer.lastSendResult.success}
            recipientInfo={composer.lastSendResult.recipientInfo}
            mode={composer.lastSendResult.mode}
            onDismiss={composer.clearLastSendResult}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelComposer;
