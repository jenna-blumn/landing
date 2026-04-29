import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Avatar, Button, Icon, Popover, PopoverTrigger, PopoverContent, PopoverScrollArea, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { Room } from '../../data/mockData';
import ChannelComposer from '../../features/channelComposer/components/ChannelComposer';
import ChannelBadge from '../../features/channelComposer/components/ChannelBadge';
import SchedulePickerDialog from '../../features/channelComposer/components/SchedulePickerDialog';
import { createMessageScheduleApi } from '../../features/channelComposer/api/createMessageScheduleApi';
import { appendComposerMessageToRooms, removeScheduledMessageFromRooms, upsertComposerMessageInRooms } from '../../features/channelComposer/utils/roomMessageUtils';
import { formatScheduleMetaText, toComposerMessageFromSchedule } from '../../features/channelComposer/utils/scheduleUtils';
import type { ComposerMessage, MessageChannel } from '../../features/channelComposer/types';
import { CHANNEL_CONFIGS } from '../../features/channelComposer/types';
import type { CreateTaskInput } from '../../../packages/task-module/src/types/task';
import { generateTaskFromContext } from '../../services/claudeApi';

const TASK_TYPE_COLOR_MAP: Record<string, string> = {
  sms: 'pink',
  callback: 'blue',
  followup: 'yellow',
};

interface ConfirmAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmStyle: 'primary' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmAlertDialog: React.FC<ConfirmAlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmStyle,
  onConfirm,
  onCancel,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent width={320}>
      <AlertDialogHeader className="items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <Icon iconType={['system', 'error-warning']} size={24} color="default-muted" />
        </div>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button buttonStyle="secondary" size="md" onClick={onCancel}>취소</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button buttonStyle={confirmStyle} size="md" onClick={onConfirm}>{confirmLabel}</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

interface ContactRoomAreaProps {
  chatMode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban';
  onCloseRoom: (roomId: number) => void;
  onFocusRoomChange: (roomId: number) => void;
  onSetAlarm: (roomId: number, alarmTimestamp: number | null) => void;
  onSetFlag: (roomId: number, flag: string | null) => void;
  availableRooms: number[];
  allRooms: Room[];
  favoriteRooms: Set<number>;
  onToggleFavorite: (roomId: number) => void;
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number) => void;
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  isAutoAssignment?: boolean;
  isPhoneModeActive?: boolean;
  isHistoricalViewActive?: boolean;
  historicalRoomId?: number | null;
  onCloseHistoricalView?: () => void;
  isManagerMode?: boolean;
  isSearchResultOverlay?: boolean;
  hideComposer?: boolean;
  // 말풍선-할일 연동
  onPrefillTask?: (data: CreateTaskInput, messageId: number) => void;
  onFocusLinkedTask?: (messageId: number) => void;
  taskBadgeMessageIds?: Set<number>;
  scrollToMessageId?: { messageId: number; nonce: number } | null;
  // 북마크
  bookmarkMessageIds?: Set<number>;
  onToggleBookmark?: (messageId: number) => void;
}

const ContactRoomArea: React.FC<ContactRoomAreaProps> = ({
  allRooms,
  selectedRoomId,
  setAllRooms,
  isPhoneModeActive = false,
  isManagerMode = false,
  isSearchResultOverlay = false,
  hideComposer = false,
  onPrefillTask,
  onFocusLinkedTask,
  taskBadgeMessageIds = new Set(),
  scrollToMessageId = null,
  bookmarkMessageIds = new Set(),
  onToggleBookmark,
}) => {
  const roomList = Array.isArray(allRooms) ? allRooms : [];
  const selectedRoom = roomList.find(r => r.id === selectedRoomId);
  const messageScheduleApi = useMemo(
    () => createMessageScheduleApi({ apiType: 'localStorage' }),
    []
  );
  const [isOnHold, setIsOnHold] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [showManagerActionModal, setShowManagerActionModal] = useState<string | null>(null);
  const [isPhoneMessageComposerOn, setIsPhoneMessageComposerOn] = useState(true);
  const [editingScheduledMessageId, setEditingScheduledMessageId] = useState<number | null>(null);

  // 말풍선 hover 상태 및 메시지 ref (scroll-to-message용)
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // 할일 AI 생성 상태
  const [generatingTaskMsgId, setGeneratingTaskMsgId] = useState<number | null>(null);

  // scrollToMessageId 변화 시 해당 메시지로 스크롤
  // nonce 필드로 인해 같은 messageId라도 매 요청마다 새 객체가 전달되어 effect가 재실행됨
  useEffect(() => {
    if (scrollToMessageId) {
      const el = messageRefs.current.get(scrollToMessageId.messageId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [scrollToMessageId]);

  const isCompleted = selectedRoom?.contactStatus === 'closed';
  const isUnassignedContact = selectedRoom?.contactStatus === 'ai-response'
                           || selectedRoom?.contactStatus === 'assignment-waiting';
  const shouldHideComposer = hideComposer || (isSearchResultOverlay && isUnassignedContact);
  const isPhoneWorkspaceMode = isPhoneModeActive === true && !isSearchResultOverlay;
  const shouldShowComposer = !isPhoneWorkspaceMode || isPhoneMessageComposerOn;

  // selectedRoomId 변경 시 isAssigned 리셋
  useEffect(() => {
    setIsAssigned(false);
  }, [selectedRoomId]);

  const handleCompleteConsultation = () => {
    if (!selectedRoomId) return;
    setAllRooms(prev => prev.map(r =>
      r.id === selectedRoomId
        ? { ...r, contactStatus: 'closed' as const, status: 'closed' as const }
        : r
    ));
    setIsOnHold(false);
    setShowCompleteModal(false);
  };

  // 상담 시작 핸들러 (AI응대/배정대기 → 상담사 배정)
  const handleStartConsultation = () => {
    if (!selectedRoomId) return;
    setAllRooms(prev => prev.map(r =>
      r.id === selectedRoomId
        ? {
            ...r,
            contactStatus: 'responding' as const,
            consultantName: '김상담',
            status: 'active' as const,
          }
        : r
    ));
    setIsAssigned(true);
  };

  const handleResumeConsultation = () => {
    if (!selectedRoomId) return;
    setAllRooms(prev => prev.map(r =>
      r.id === selectedRoomId
        ? { ...r, contactStatus: 'responding' as const, status: 'active' as const }
        : r
    ));
    setShowResumeModal(false);
  };

  // 메시지 발송 핸들러
  const handleSendMessage = useCallback((message: ComposerMessage) => {
    if (!selectedRoomId) return;
    setAllRooms((prev) => appendComposerMessageToRooms(prev, selectedRoomId, message));
  }, [selectedRoomId, setAllRooms]);

  // Fallback messages if none exist
  const getFallbackMessages = (): Room['messages'] => {
    if (!selectedRoom) return [];
    return [
      { id: 1, sender: 'customer' as const, text: `안녕하세요, ${selectedRoom.contactName}입니다. ${selectedRoom.conversationTopic} 건으로 문의드립니다.`, time: '10:30 AM' },
      { id: 2, sender: 'agent' as const, text: `안녕하세요 고객님, 담당 상담사입니다. 문의하신 ${selectedRoom.conversationTopic} 내용 확인 중에 있습니다.`, time: '10:31 AM' },
      { id: 3, sender: 'customer' as const, text: `네, 확인 부탁드립니다.`, time: '10:32 AM' },
    ];
  };

  const messages = (selectedRoom?.messages || getFallbackMessages()).filter(
    (message) => message.deliveryMode !== 'scheduled' || message.schedule?.status === 'sent'
  );
  const editingScheduledMessage = messages.find((message) => message.id === editingScheduledMessageId);

  const handleCancelScheduledMessage = useCallback(async (messageId: number) => {
    if (!selectedRoomId) return;
    await messageScheduleApi.cancelScheduledMessage(messageId);
    setAllRooms((prev) => removeScheduledMessageFromRooms(prev, selectedRoomId, messageId));
  }, [messageScheduleApi, selectedRoomId, setAllRooms]);

  const handleConfirmReschedule = useCallback(async (scheduledAt: string) => {
    if (!selectedRoomId || editingScheduledMessageId === null) return;
    const updatedRecord = await messageScheduleApi.updateScheduledMessage(editingScheduledMessageId, {
      scheduledAt,
    });

    if (!updatedRecord) return;

    setAllRooms((prev) =>
      upsertComposerMessageInRooms(prev, selectedRoomId, toComposerMessageFromSchedule(updatedRecord))
    );

    setEditingScheduledMessageId(null);
  }, [editingScheduledMessageId, messageScheduleApi, selectedRoomId, setAllRooms]);

  // ── 말풍선-할일 AI 생성 ──────────────────────────────────────────
  const handleCreateTaskFromMessage = useCallback(async (msg: typeof messages[0]) => {
    if (!onPrefillTask || generatingTaskMsgId !== null) return;

    setGeneratingTaskMsgId(msg.id);

    // 선택된 메시지 기준 앞뒤 3개 컨텍스트 수집
    const msgIndex = messages.findIndex((m) => m.id === msg.id);
    const start = Math.max(0, msgIndex - 3);
    const end = Math.min(messages.length, msgIndex + 4);
    const contextMessages = messages.slice(start, end).map((m) => ({
      sender: m.sender,
      text: m.text,
      time: m.time,
    }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const aiResult = await generateTaskFromContext(
        { messages: contextMessages, selectedMessageText: msg.text },
        controller.signal,
      );

      clearTimeout(timeoutId);

      const taskData: CreateTaskInput = {
        type: aiResult.type,
        title: aiResult.title,
        description: aiResult.description,
        scheduledDate: aiResult.scheduledDate ?? new Date().toISOString().split('T')[0],
        backgroundColor: TASK_TYPE_COLOR_MAP[aiResult.type] ?? 'yellow',
        roomId: selectedRoom?.id ?? null,
        messageId: msg.id,
      };

      onPrefillTask(taskData, msg.id);
    } catch {
      // 폴백: followup 타입 + 말풍선 텍스트 앞 30자
      const fallbackTitle = msg.text.slice(0, 30) + (msg.text.length > 30 ? '...' : '');
      const fallbackData: CreateTaskInput = {
        type: 'followup',
        title: fallbackTitle,
        description: 'AI 자동 생성에 실패했습니다. 직접 입력해주세요.',
        scheduledDate: new Date().toISOString().split('T')[0],
        backgroundColor: 'yellow',
        roomId: selectedRoom?.id ?? null,
        messageId: msg.id,
      };
      onPrefillTask(fallbackData, msg.id);
    } finally {
      setGeneratingTaskMsgId(null);
    }
  }, [onPrefillTask, generatingTaskMsgId, messages, selectedRoom]);

  if (!selectedRoomId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
        대화방을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 메시지 타임라인 */}
      <div className="relative flex-1 min-h-0">
      <ScrollArea orientation="vertical" maxHeight="100%" className="h-full bg-gray-50">
        <div className="p-4 space-y-4">
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const msgChannel = msg.channel;
          const isLinked = taskBadgeMessageIds.has(msg.id);
          const isBookmarked = bookmarkMessageIds.has(msg.id);
          const showTaskIcon = hoveredRowId === msg.id || isLinked;
          const showBookmarkIcon = hoveredRowId === msg.id || isBookmarked;
          const scheduleMetaText =
            msg.schedule?.status === 'sent' ? formatScheduleMetaText(msg.schedule) : null;
          const canManageScheduledMessage =
            !isCustomer &&
            msg.deliveryMode === 'scheduled' &&
            msg.schedule?.status === 'scheduled';

          // 할일 연결 아이콘 (calendar-clock 또는 체크 또는 로딩)
          const isGeneratingThis = generatingTaskMsgId === msg.id;
          const taskIconBtn = onPrefillTask && showTaskIcon ? (
            <div className="flex-shrink-0 flex items-center justify-center self-start mt-1">
              <button
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 ${
                  isGeneratingThis
                    ? 'bg-blue-50 border border-blue-200 text-blue-500 cursor-wait'
                    : isLinked
                    ? 'bg-green-50 text-green-600 border border-green-200 cursor-pointer hover:bg-green-100 hover:border-green-300'
                    : 'bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-blue-500 hover:border-blue-300 cursor-pointer'
                }`}
                onClick={() => {
                  if (isGeneratingThis) return;
                  if (isLinked) { onFocusLinkedTask?.(msg.id); return; }
                  void handleCreateTaskFromMessage(msg);
                }}
                disabled={isGeneratingThis}
                title={isGeneratingThis ? 'AI 할일 생성 중...' : isLinked ? '연결된 할일 보기' : '이 메시지로 할일 생성'}
              >
                {isGeneratingThis
                  ? <Icon iconType={['system', 'loader-4']} size={14} className="animate-spin" />
                  : isLinked
                  ? <Icon iconType={['system', 'checkbox-circle']} size={14} />
                  : <Icon iconType={['system', 'time']} size={14} />
                }
              </button>
            </div>
          ) : null;

          // 북마크 아이콘 버튼
          const bookmarkIconBtn = onToggleBookmark && showBookmarkIcon ? (
            <div className="flex-shrink-0 flex items-center justify-center self-start mt-1">
              <button
                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 ${
                  isBookmarked
                    ? 'bg-amber-50 text-amber-500 border border-amber-200 cursor-pointer hover:bg-amber-100 hover:border-amber-300'
                    : 'bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-amber-500 hover:border-amber-300 cursor-pointer'
                }`}
                onClick={() => onToggleBookmark(msg.id)}
                title={isBookmarked ? '북마크 해제' : '북마크'}
              >
                <Icon iconType={['business', 'bookmark-3']} size={14} isFill={isBookmarked} />
              </button>
            </div>
          ) : null;

          return (
            <div
              key={msg.id}
              ref={(el) => {
                if (el) messageRefs.current.set(msg.id, el);
                else messageRefs.current.delete(msg.id);
              }}
              className={`flex items-start gap-2 ${!isCustomer ? 'justify-end' : ''}`}
              onMouseEnter={() => setHoveredRowId(msg.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              {isCustomer && (
                <div className="pt-0.5">
                  <Avatar variant="initials" initials={selectedRoom?.contactName.charAt(0) || ''} size="md" color="#60a5fa" />
                </div>
              )}
              <div className={`flex-1 ${!isCustomer ? 'flex items-start justify-end gap-2' : 'flex items-start gap-2'}`}>
                {/* 상담사 말풍선 왼쪽에 북마크 → 할일 순 */}
                {!isCustomer && bookmarkIconBtn}
                {!isCustomer && taskIconBtn}
                <div className="max-w-md">
                  {/* 이메일 제목 표시 */}
                  {msg.subject && (
                    <div className="text-[10px] text-gray-500 mb-1">
                      제목: {msg.subject}
                    </div>
                  )}
                  <div className={`rounded-lg p-3 ${
                    isCustomer
                      ? 'bg-gray-200 text-gray-700'
                      : msgChannel && CHANNEL_CONFIGS[msgChannel as MessageChannel]
                        ? `${CHANNEL_CONFIGS[msgChannel as MessageChannel].color} ${msgChannel === 'alimtalk' ? 'text-yellow-900' : 'text-white'}`
                        : 'bg-blue-500 text-white'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${!isCustomer ? 'justify-end' : ''}`}>
                    {msgChannel && <ChannelBadge channel={msgChannel} />}
                    <p className="text-xs text-gray-500">{msg.time}</p>
                    {scheduleMetaText && (
                      <p
                        className={`text-xs ${
                          msg.schedule?.status === 'failed'
                            ? 'text-red-500'
                            : msg.schedule?.status === 'sending'
                              ? 'text-amber-600'
                              : 'text-gray-500'
                        }`}
                      >
                        {scheduleMetaText}
                      </p>
                    )}
                    {canManageScheduledMessage && (
                      <>
                        <Button
                          type="button"
                          buttonStyle="ghost"
                          size="2xs"
                          onClick={() => setEditingScheduledMessageId(msg.id)}
                        >
                          재예약
                        </Button>
                        <Button
                          type="button"
                          buttonStyle="ghost"
                          size="2xs"
                          onClick={() => void handleCancelScheduledMessage(msg.id)}
                        >
                          취소
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {/* 고객 말풍선 바로 우측에 할일 → 북마크 순 */}
                {isCustomer && taskIconBtn}
                {isCustomer && bookmarkIconBtn}
              </div>
              {!isCustomer && (
                <div className="pt-0.5">
                  <Avatar variant="initials" initials="상" size="md" color="#4ade80" />
                </div>
              )}
            </div>
          );
        })}
        </div>
      </ScrollArea>

      {/* 플로팅 북마크 리스트 버튼 */}
      {bookmarkMessageIds.size > 0 && (
        <div className="absolute top-2 right-4 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <span>
                <Button
                  variant="iconOnly"
                  buttonStyle="secondary"
                  size="xs"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/95 shadow-sm"
                  leadIcon={<Icon iconType={['business', 'bookmark-3']} size={14} isFill />}
                  title={`북마크 ${bookmarkMessageIds.size}개`}
                >
                  <span className="ml-0.5 text-xs font-medium text-amber-600">{bookmarkMessageIds.size}</span>
                </Button>
              </span>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" width={280}>
              <div className="py-1">
                <div className="px-3 py-1.5 text-xs font-medium text-gray-500">북마크 ({bookmarkMessageIds.size})</div>
                <PopoverScrollArea maxHeight={240}>
                  {messages
                    .filter((m) => bookmarkMessageIds.has(m.id))
                    .map((m) => (
                      <button
                        key={m.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start gap-2 group"
                        onClick={() => {
                          const el = messageRefs.current.get(m.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                      >
                        <Icon iconType={['business', 'bookmark-3']} size={12} isFill className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 line-clamp-2">{m.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{m.sender === 'customer' ? '고객' : '상담사'} · {m.time}</p>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark?.(m.id);
                          }}
                          title="북마크 해제"
                        >
                          <Icon iconType={['system', 'close']} size={12} className="text-gray-400" />
                        </button>
                      </button>
                    ))}
                </PopoverScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      </div>

      {/* 멀티채널 컴포저 또는 상담 시작 버튼 — hideComposer 시 전체 숨김 */}
      {!hideComposer && (shouldHideComposer && !isAssigned ? (
        <div className="border-t bg-gray-50 p-4">
          {isManagerMode ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleStartConsultation}
                buttonStyle="primary"
                size="md"
              >
                상담 시작
              </Button>
              <Button
                onClick={() => setShowManagerActionModal('waiting')}
                buttonStyle="secondary"
                size="md"
              >
                상담 대기로 전환
              </Button>
              <Button
                onClick={() => setShowManagerActionModal('connect')}
                buttonStyle="secondary"
                size="md"
              >
                상담사 즉시 연결
              </Button>
              <Button
                onClick={() => setShowManagerActionModal('end')}
                buttonStyle="secondary"
                size="md"
              >
                상담 종료
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button
                onClick={handleStartConsultation}
                buttonStyle="primary"
                size="md"
              >
                상담 시작
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={`relative ${shouldShowComposer ? '' : 'hidden'}`}>
          <ChannelComposer
            roomId={selectedRoomId}
            roomChannel={selectedRoom?.channel || 'chat'}
            customerName={selectedRoom?.contactName}
            customerPhone={selectedRoom?.customerPhone}
            customerEmail={selectedRoom?.customerEmail}
            brandId={selectedRoom?.brand}
            isCompleted={isCompleted}
            onSendMessage={handleSendMessage}
          />
        </div>
      ))}

      {/* Function Buttons Bar - hideComposer 또는 AI응대/배정대기이고 아직 배정 전이면 숨김 */}
      <SchedulePickerDialog
        open={editingScheduledMessage !== undefined && editingScheduledMessage !== null}
        initialScheduledAt={editingScheduledMessage?.schedule?.scheduledAt}
        messageText={editingScheduledMessage?.text ?? ''}
        onOpenChange={(open) => {
          if (!open) {
            setEditingScheduledMessageId(null);
          }
        }}
        onConfirm={(scheduledAt) => {
          void handleConfirmReschedule(scheduledAt);
        }}
      />

      {!hideComposer && !(shouldHideComposer && !isAssigned) && (
      <div className="border-t border-gray-200 bg-white px-3 py-2 flex items-center gap-1.5">
        {/* 좌측 그룹 */}
        <Button
          variant="iconOnly"
          buttonStyle="secondary"
          size="2xs"
          leadIcon={<Icon iconType={['system', 'add']} size={14} />}
          title="더보기"
        />

        {isPhoneWorkspaceMode ? (
          <Button
            onClick={() => setIsPhoneMessageComposerOn((prev) => !prev)}
            buttonStyle={isPhoneMessageComposerOn ? 'primary' : 'secondary'}
            size="xs"
            leadIcon={<Icon iconType={['system', 'settings']} size={13} />}
          >
            메시지 보내기
          </Button>
        ) : (
          <Button
            buttonStyle="secondary"
            size="xs"
            leadIcon={<Icon iconType={['system', 'settings']} size={13} />}
          >
            상담사 변경요청
          </Button>
        )}

        <Button
          buttonStyle="secondary"
          size="xs"
          leadIcon={<Icon iconType={['system', 'filter']} size={13} />}
        >
          상담내용 검토요청
        </Button>

        <Button
          buttonStyle="secondary"
          size="xs"
          leadIcon={<Icon iconType={['system', 'time']} size={13} />}
        >
          알람 설정
        </Button>

        {/* 우측 그룹 */}
        <div className="ml-auto flex items-center gap-1.5">
          {!isCompleted && (
            <Button
              onClick={() => setIsOnHold(!isOnHold)}
              variant="iconOnly"
              buttonStyle="ghost"
              size="xs"
              className={isOnHold ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100' : ''}
              title={isOnHold ? '보류 중' : '진행'}
              leadIcon={isOnHold ? <Icon iconType={['media', 'pause']} size={14} /> : <Icon iconType={['media', 'play']} size={14} />}
            />
          )}

          {isCompleted ? (
            <Button
              onClick={() => setShowResumeModal(true)}
              buttonStyle="ghost"
              size="xs"
              leadIcon={<Icon iconType={['system', 'checkbox-circle']} size={13} />}
              className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
            >
              완료된 상담
            </Button>
          ) : (
            <Button
              onClick={() => setShowCompleteModal(true)}
              variant="iconOnly"
              buttonStyle="destructive"
              size="xs"
              leadIcon={<Icon iconType={['system', 'logout-box']} size={14} />}
              title="상담 완료"
            />
          )}
        </div>
      </div>
      )}

      {/* Complete Confirmation Modal */}
      <ConfirmAlertDialog
        open={showCompleteModal}
        onOpenChange={setShowCompleteModal}
        title="상담 완료"
        description="상담을 완료하시겠습니까?"
        confirmLabel="완료"
        confirmStyle="destructive"
        onConfirm={handleCompleteConsultation}
        onCancel={() => setShowCompleteModal(false)}
      />

      {/* Resume Confirmation Modal */}
      <ConfirmAlertDialog
        open={showResumeModal}
        onOpenChange={setShowResumeModal}
        title="상담 재개"
        description="상담을 재개하시겠습니까?"
        confirmLabel="재개"
        confirmStyle="primary"
        onConfirm={handleResumeConsultation}
        onCancel={() => setShowResumeModal(false)}
      />

      {/* 매니저 액션 모달: 상담 대기로 전환 */}
      <ConfirmAlertDialog
        open={showManagerActionModal === 'waiting'}
        onOpenChange={() => setShowManagerActionModal(null)}
        title="상담 대기로 전환"
        description="이 상담을 대기 상태로 전환하시겠습니까?"
        confirmLabel="전환"
        confirmStyle="primary"
        onConfirm={() => setShowManagerActionModal(null)}
        onCancel={() => setShowManagerActionModal(null)}
      />

      {/* 매니저 액션 모달: 상담사 즉시 연결 */}
      <ConfirmAlertDialog
        open={showManagerActionModal === 'connect'}
        onOpenChange={() => setShowManagerActionModal(null)}
        title="상담사 즉시 연결"
        description="상담사에게 즉시 연결하시겠습니까?"
        confirmLabel="연결"
        confirmStyle="primary"
        onConfirm={() => setShowManagerActionModal(null)}
        onCancel={() => setShowManagerActionModal(null)}
      />

      {/* 매니저 액션 모달: 상담 종료 */}
      <ConfirmAlertDialog
        open={showManagerActionModal === 'end'}
        onOpenChange={() => setShowManagerActionModal(null)}
        title="상담 종료"
        description="이 상담을 종료하시겠습니까?"
        confirmLabel="종료"
        confirmStyle="destructive"
        onConfirm={() => setShowManagerActionModal(null)}
        onCancel={() => setShowManagerActionModal(null)}
      />
    </div>
  );
};

export default React.memo(ContactRoomArea);
