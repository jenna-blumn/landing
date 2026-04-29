import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useThread, ThreadMessageList, ThreadComposer, ThreadInviteModal, useThreadMessages, useTeamChatContext } from '@deskit/team-chat';
import type { ChatMessage } from '@deskit/team-chat';
import { Button, Icon, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { generateCustomerReply, generateThreadAutoReply } from '../../services/claudeApi';

interface ThreadModeLayoutProps {
  onExitThreadMode?: () => void;
  currentRoomId?: number | null;
  currentRoomName?: string;
  /** Right panel content (ChatRoomHeader + ContactRoomArea) rendered by parent */
  rightPanel: React.ReactNode;
  /** Original contact room messages for AI context */
  originalMessages?: Array<{ id: number; sender: string; text: string; time: string }>;
}

const MIN_WIDTH_PERCENT = 25;
const MAX_WIDTH_PERCENT = 75;

const ThreadModeLayout: React.FC<ThreadModeLayoutProps> = ({
  onExitThreadMode,
  currentRoomId,
  currentRoomName,
  rightPanel,
  originalMessages,
}) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { roomThread, activeThreadId, setActiveThread, setPanelOpen, createThread, loading } = useThread();
  const { messages, sendMessage } = useThreadMessages(activeThreadId);
  const { auth, api } = useTeamChatContext();

  // 마운트 시 패널 열기 (모달 오픈은 로딩 완료 후 별도 useEffect에서 처리)
  useEffect(() => {
    setPanelOpen(true, currentRoomId ?? undefined);

    return () => {
      setPanelOpen(false);
      setActiveThread(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // roomThread가 로딩 후 발견되면 자동 활성화
  useEffect(() => {
    if (roomThread && !activeThreadId) {
      setActiveThread(roomThread.id);
    }
  }, [roomThread, activeThreadId, setActiveThread]);

  // 로딩 완료 후에도 스레드가 없으면 모달 자동 오픈
  useEffect(() => {
    if (!loading && !roomThread && !activeThreadId && !isInviteOpen) {
      setIsInviteOpen(true);
    }
  }, [loading, roomThread, activeThreadId, isInviteOpen]);

  const activeThread = roomThread ?? null;

  // ── 리사이저 ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const clampedWidth = Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, newLeftWidth));
    setLeftWidthPercent(clampedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // ── AI 스레드 자동 응답 ──
  const handleSendWithAutoReply = useCallback(async (text: string) => {
    if (!activeThreadId) return;

    await sendMessage(text);

    setIsGeneratingReply(true);
    try {
      const aiReplyText = await generateThreadAutoReply({
        originalMessages: (originalMessages || []).map(m => ({
          sender: m.sender,
          text: m.text,
          time: m.time,
        })),
        threadMessages: messages.map(m => ({
          senderName: m.senderName,
          text: m.text,
          type: m.type,
        })),
        customerName: currentRoomName || '고객',
        originalQuery: activeThread?.originalQuery,
        latestUserMessage: text,
      });

      await api.sendThreadMessage(activeThreadId, {
        senderId: 'ai-assistant',
        senderName: 'AI 상담사',
        text: aiReplyText,
        type: 'text',
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'AI 응답 생성에 실패했습니다.';
      await api.sendThreadMessage(activeThreadId, {
        senderId: 'system',
        senderName: '시스템',
        text: `⚠ ${errMsg}`,
        type: 'system',
      });
    } finally {
      setIsGeneratingReply(false);
    }
  }, [activeThreadId, sendMessage, originalMessages, messages, currentRoomName, activeThread, api]);

  // ── AI 고객 답변 생성 ──
  const handleGenerateReply = useCallback(async (triggerMessage: ChatMessage) => {
    if (!activeThreadId || isGeneratingReply) return;
    setIsGeneratingReply(true);

    try {
      const replyText = await generateCustomerReply({
        originalMessages: (originalMessages || []).map(m => ({
          sender: m.sender,
          text: m.text,
          time: m.time,
        })),
        threadMessages: messages.map(m => ({
          senderName: m.senderName,
          text: m.text,
        })),
        customerName: currentRoomName || '고객',
        originalQuery: activeThread?.originalQuery,
      });

      await sendMessage(replyText, { generatedFrom: triggerMessage.id, isAiGenerated: true });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'AI 답변 생성에 실패했습니다.';
      await api.sendThreadMessage(activeThreadId, {
        senderId: 'system',
        senderName: '시스템',
        text: `⚠ ${errMsg}`,
        type: 'system',
      });
    } finally {
      setIsGeneratingReply(false);
    }
  }, [activeThreadId, isGeneratingReply, originalMessages, messages, currentRoomName, activeThread, sendMessage, api]);

  return (
    <div ref={containerRef} className="h-full flex">
      {/* Left: Thread panel — 항상 대화 뷰 (리스트 없음) */}
      <div
        className="h-full overflow-hidden border-r border-border"
        style={{ width: `${leftWidthPercent}%` }}
      >
        <div className="h-full flex flex-col bg-card">
          {/* Thread header */}
          <header className="h-12 border-b border-border px-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">스레드</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                buttonStyle="soft"
                size="xs"
                onClick={() => setIsInviteOpen(true)}
                leadIcon={<Icon iconType={['user', 'user-add']} size={14} />}
              >
                참여자 관리
              </Button>
              {onExitThreadMode && (
                <Button
                  buttonStyle="ghost"
                  size="xs"
                  onClick={onExitThreadMode}
                  leadIcon={<Icon iconType={['system', 'close']} size={16} />}
                >
                  닫기
                </Button>
              )}
            </div>
          </header>

          {/* Thread content — 항상 대화 뷰 */}
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">로딩 중...</div>
            ) : activeThread ? (
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1">
                  <ThreadMessageList
                    messages={messages}
                    currentUserId={auth.userId}
                    onGenerateReply={handleGenerateReply}
                    isGenerating={isGeneratingReply}
                  />
                </ScrollArea>
                <ThreadComposer onSend={handleSendWithAutoReply} />
              </div>
            ) : (
              /* 스레드 생성 대기 중 (모달이 자동으로 열림) */
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <Icon iconType={['communication', 'chat-1']} size={32} color="default-muted" />
                  <div className="text-sm text-muted-foreground mt-3 mb-1">스레드를 시작하세요</div>
                  <div className="text-xs text-muted-foreground mb-4">참여할 상담사를 선택해주세요</div>
                  <Button
                    buttonStyle="primary"
                    size="sm"
                    onClick={() => setIsInviteOpen(true)}
                    leadIcon={<Icon iconType={['user', 'user-add']} size={14} />}
                  >
                    상담사 선택
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resizer divider */}
      <div
        className={`w-1 bg-border hover:bg-primary cursor-col-resize flex-shrink-0 transition-colors ${
          isResizing ? 'bg-primary' : ''
        }`}
        onMouseDown={handleMouseDown}
      />

      {/* Right: Current contact room (rendered by parent) */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${100 - leftWidthPercent}%` }}
      >
        {rightPanel}
      </div>

      {/* Thread Invite Modal */}
      <ThreadInviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={async (agentIds) => {
          const newThread = await createThread({
            participantIds: agentIds,
            originalQuery: currentRoomName,
          });
          if (newThread?.id) {
            // 시스템 메시지 자동 삽입
            await api.sendThreadMessage(newThread.id, {
              senderId: 'system',
              senderName: '시스템',
              text: '스레드 대화가 시작되었습니다.',
              type: 'system',
            });
            await api.sendThreadMessage(newThread.id, {
              senderId: 'system',
              senderName: '시스템',
              text: '현재 고객 대화의 맥락이 공유되었습니다.',
              type: 'system',
            });
            setActiveThread(newThread.id);
          }
          setIsInviteOpen(false);
        }}
      />
    </div>
  );
};

export default ThreadModeLayout;
