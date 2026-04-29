import { useState, useCallback, useMemo, useEffect } from 'react';
import type { AiToggleState, ComposerMessage, MessageChannel, RoomLinkToggleState, ScheduledMessageRecord } from '../types';
import { getDefaultChannel, getAvailableChannels } from '../utils/channelUtils';
import { sendMessageNow } from '../api/composerApi';
import { createMessageScheduleApi } from '../api/createMessageScheduleApi';
import type { IMessageScheduleApi } from '../api/IMessageScheduleApi';
import { useTemplateManager } from './useTemplateManager';
import { useSmsComposer } from './useSmsComposer';
import { useEmailComposer } from './useEmailComposer';
import { calculateByteLength } from '../utils/byteCounter';
import { loadRoomLinkEnabled, saveRoomLinkEnabled } from '../api/roomLinkSettingsApi';

interface UseChannelComposerProps {
  roomId: number;
  roomChannel: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  brandId?: string;
  onMessageSent?: (message: ComposerMessage) => void;
  messageScheduleApi?: IMessageScheduleApi;
}

type SendResult = {
  success: boolean;
  channel: MessageChannel;
  recipientInfo?: string;
  mode: 'sent' | 'scheduled';
};

function getRecipientInfo(
  channel: MessageChannel,
  customerName?: string,
  customerPhone?: string,
  customerEmail?: string,
  emailRecipient?: string
): string | undefined {
  if (channel === 'sms' || channel === 'alimtalk') return customerPhone;
  if (channel === 'email') return emailRecipient ?? customerEmail;
  return customerName;
}

export function useChannelComposer({
  roomId,
  roomChannel,
  customerName,
  customerPhone,
  customerEmail,
  brandId,
  onMessageSent,
  messageScheduleApi: injectedMessageScheduleApi,
}: UseChannelComposerProps) {
  const messageScheduleApi = useMemo(
    () => injectedMessageScheduleApi ?? createMessageScheduleApi({ apiType: 'localStorage' }),
    [injectedMessageScheduleApi]
  );

  const defaultChannel = useMemo(() => getDefaultChannel(roomChannel), [roomChannel]);
  const availableChannels = useMemo(() => getAvailableChannels(roomChannel), [roomChannel]);
  const [activeChannel, setActiveChannel] = useState<MessageChannel>(defaultChannel);

  const [isKindActive, setIsKindActive] = useState(false);
  const [isSpellCheckActive, setIsSpellCheckActive] = useState(false);
  const aiToggles: AiToggleState = useMemo(
    () => ({
      isKindActive,
      isSpellCheckActive,
      toggleKind: () => setIsKindActive((value) => !value),
      toggleSpellCheck: () => setIsSpellCheckActive((value) => !value),
    }),
    [isKindActive, isSpellCheckActive]
  );

  const [isRoomLinkEnabled, setIsRoomLinkEnabled] = useState(() => loadRoomLinkEnabled());
  const roomLinkToggle: RoomLinkToggleState = useMemo(
    () => ({
      isRoomLinkEnabled,
      toggleRoomLink: () =>
        setIsRoomLinkEnabled((prev) => {
          const next = !prev;
          saveRoomLinkEnabled(next);
          return next;
        }),
    }),
    [isRoomLinkEnabled]
  );

  const [chatText, setChatText] = useState('');
  const smsState = useSmsComposer({ brandId });

  const autoFillData = useMemo(
    () => ({
      ...(customerName && { customerName }),
      ...(customerPhone && { customerPhone }),
    }),
    [customerName, customerPhone]
  );

  const smsTemplateState = useTemplateManager({
    channelType: 'sms',
    autoFillData,
  });

  const alimtalkTemplateState = useTemplateManager({
    channelType: 'alimtalk',
    autoFillData,
  });

  const emailState = useEmailComposer({
    customerEmail,
    customerName,
  });

  const [isSending, setIsSending] = useState(false);
  const [lastSendResult, setLastSendResult] = useState<SendResult | null>(null);
  const [scheduledAt, setScheduledAt] = useState<string | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [editingScheduledRecordId, setEditingScheduledRecordId] = useState<number | null>(null);
  const resetSmsComposer = smsState.reset;
  const clearSmsTemplateSelection = smsTemplateState.clearSelection;
  const clearAlimtalkTemplateSelection = alimtalkTemplateState.clearSelection;
  const resetEmailComposer = emailState.reset;

  useEffect(() => {
    setScheduledAt(undefined);
    setIsScheduleDialogOpen(false);
  }, [activeChannel]);

  useEffect(() => {
    setChatText('');
    resetSmsComposer();
    clearSmsTemplateSelection();
    clearAlimtalkTemplateSelection();
    resetEmailComposer();
    setLastSendResult(null);
    setScheduledAt(undefined);
    setEditingScheduledRecordId(null);
  }, [
    roomId,
    clearAlimtalkTemplateSelection,
    clearSmsTemplateSelection,
    resetEmailComposer,
    resetSmsComposer,
  ]);

  const canSend = useMemo(() => {
    if (isSending) return false;

    switch (activeChannel) {
      case 'chat':
        return chatText.trim() !== '';
      case 'sms':
        if (smsTemplateState.selectedTemplate) {
          return smsTemplateState.isValid;
        }
        return smsState.text.trim() !== '' && !smsState.isOverLimit;
      case 'alimtalk':
        return alimtalkTemplateState.isValid;
      case 'email':
        return emailState.isValid;
      default:
        return false;
    }
  }, [activeChannel, alimtalkTemplateState.isValid, chatText, emailState.isValid, isSending, smsState.isOverLimit, smsState.text, smsTemplateState.isValid, smsTemplateState.selectedTemplate]);

  const isScheduleSupported = activeChannel !== 'chat';

  const resolvePayload = useCallback(() => {
    let text = '';
    const options: {
      subject?: string;
      templateId?: string;
      templateVariables?: Record<string, string>;
      byteLength?: number;
    } = {};

    switch (activeChannel) {
      case 'chat':
        text = chatText.trim();
        break;
      case 'sms':
        if (smsTemplateState.selectedTemplate) {
          text = smsTemplateState.previewText;
          options.templateId = smsTemplateState.selectedTemplateId || undefined;
          options.templateVariables = { ...smsTemplateState.variables };
        } else {
          text = smsState.text.trim();
        }
        options.byteLength = calculateByteLength(text);
        break;
      case 'alimtalk':
        text = alimtalkTemplateState.previewText;
        options.templateId = alimtalkTemplateState.selectedTemplateId || undefined;
        options.templateVariables = { ...alimtalkTemplateState.variables };
        break;
      case 'email':
        text = emailState.bodyWithSignature;
        options.subject = emailState.subject;
        break;
    }

    return { text, options };
  }, [
    activeChannel,
    alimtalkTemplateState.previewText,
    alimtalkTemplateState.selectedTemplateId,
    alimtalkTemplateState.variables,
    chatText,
    emailState.bodyWithSignature,
    emailState.subject,
    smsState.text,
    smsTemplateState.previewText,
    smsTemplateState.selectedTemplate,
    smsTemplateState.selectedTemplateId,
    smsTemplateState.variables,
  ]);

  const resetInputState = useCallback(() => {
    switch (activeChannel) {
      case 'chat':
        setChatText('');
        break;
      case 'sms':
        smsState.reset();
        smsTemplateState.clearSelection();
        break;
      case 'alimtalk':
        alimtalkTemplateState.clearSelection();
        break;
      case 'email':
        emailState.reset();
        break;
    }

    setScheduledAt(undefined);
    setEditingScheduledRecordId(null);
  }, [activeChannel, alimtalkTemplateState, emailState, smsState, smsTemplateState]);

  const enterRescheduleMode = useCallback(
    (record: ScheduledMessageRecord) => {
      setActiveChannel(record.channel);
      setScheduledAt(record.schedule.scheduledAt);
      setEditingScheduledRecordId(record.id);

      switch (record.channel) {
        case 'sms':
          smsTemplateState.clearSelection();
          smsState.setText(record.text);
          break;
        case 'alimtalk':
          alimtalkTemplateState.clearSelection();
          break;
        case 'email':
          emailState.setBody(record.text);
          if (record.subject) emailState.setSubject(record.subject);
          break;
      }
    },
    [alimtalkTemplateState, emailState, smsState, smsTemplateState]
  );

  const cancelRescheduleEdit = useCallback(() => {
    setEditingScheduledRecordId(null);
    resetInputState();
  }, [resetInputState]);

  const handleSend = useCallback(async () => {
    if (!canSend) return;

    setIsSending(true);

    try {
      const { text, options } = resolvePayload();
      const emailRecipient = emailState.toRecipients[0]?.email;
      const recipientInfo = getRecipientInfo(
        activeChannel,
        customerName,
        customerPhone,
        customerEmail,
        emailRecipient
      );

      if (scheduledAt && activeChannel !== 'chat') {
        if (editingScheduledRecordId !== null) {
          await messageScheduleApi.cancelScheduledMessage(editingScheduledRecordId);
          setEditingScheduledRecordId(null);
        }

        await messageScheduleApi.createScheduledMessage({
          roomId,
          channel: activeChannel,
          text,
          subject: options.subject,
          templateId: options.templateId,
          templateVariables: options.templateVariables,
          byteLength: options.byteLength,
          recipientInfo,
          scheduledAt,
        });

        resetInputState();
        setLastSendResult({
          success: true,
          channel: activeChannel,
          recipientInfo,
          mode: 'scheduled',
        });
        return;
      }

      const message = await sendMessageNow(roomId, activeChannel, text, {
        ...options,
        roomLinkEnabled: isRoomLinkEnabled,
      });
      onMessageSent?.(message);
      resetInputState();
      setLastSendResult({
        success: true,
        channel: activeChannel,
        recipientInfo,
        mode: 'sent',
      });
    } catch {
      setLastSendResult({
        success: false,
        channel: activeChannel,
        mode: scheduledAt && activeChannel !== 'chat' ? 'scheduled' : 'sent',
      });
    } finally {
      setIsSending(false);
    }
  }, [
    activeChannel,
    canSend,
    customerEmail,
    customerName,
    customerPhone,
    editingScheduledRecordId,
    emailState.toRecipients,
    isRoomLinkEnabled,
    messageScheduleApi,
    onMessageSent,
    resetInputState,
    resolvePayload,
    roomId,
    scheduledAt,
  ]);

  const clearLastSendResult = useCallback(() => {
    setLastSendResult(null);
  }, []);

  const handleCancel = useCallback(() => {
    switch (activeChannel) {
      case 'sms':
        smsTemplateState.clearSelection();
        smsState.setText('');
        break;
      case 'alimtalk':
        alimtalkTemplateState.clearSelection();
        break;
    }
  }, [activeChannel, alimtalkTemplateState, smsState, smsTemplateState]);

  const inputText = useMemo(() => {
    switch (activeChannel) {
      case 'chat':
        return chatText;
      case 'sms':
        return smsTemplateState.selectedTemplate ? smsTemplateState.previewText : smsState.text;
      case 'alimtalk':
        return alimtalkTemplateState.previewText;
      case 'email':
        return emailState.body;
      default:
        return '';
    }
  }, [activeChannel, alimtalkTemplateState.previewText, chatText, emailState.body, smsState.text, smsTemplateState.previewText, smsTemplateState.selectedTemplate]);

  const setInputText = useCallback(
    (text: string) => {
      switch (activeChannel) {
        case 'chat':
          setChatText(text);
          break;
        case 'sms':
          smsState.setText(text);
          break;
        case 'email':
          emailState.setBody(text);
          break;
      }
    },
    [activeChannel, emailState, smsState]
  );

  const isInputReadOnly =
    activeChannel === 'alimtalk' || (activeChannel === 'sms' && smsTemplateState.selectedTemplate !== null);

  return {
    activeChannel,
    setActiveChannel,
    defaultChannel,
    availableChannels,
    aiToggles,
    roomLinkToggle,
    inputText,
    setInputText,
    isInputReadOnly,
    chatText,
    setChatText,
    smsState,
    smsTemplateState,
    alimtalkTemplateState,
    emailState,
    canSend,
    isSending,
    handleSend,
    handleCancel,
    lastSendResult,
    clearLastSendResult,
    scheduledAt,
    setScheduledAt,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen,
    isScheduleSupported,
    editingScheduledRecordId,
    enterRescheduleMode,
    cancelRescheduleEdit,
  };
}
