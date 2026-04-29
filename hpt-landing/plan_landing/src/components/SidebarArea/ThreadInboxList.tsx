import React, { useMemo, useState } from 'react';
import { Badge, Button, Icon, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { useThread } from '@deskit/team-chat';

interface ThreadInboxListProps {
  isCollapsed?: boolean;
  onContactClick?: (roomId: number) => void;
  onToggleThreadMode?: () => void;
}

const formatTimeElapsed = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  return `${months}mo`;
};

const ThreadInboxList: React.FC<ThreadInboxListProps> = ({
  isCollapsed = false,
  onContactClick,
  onToggleThreadMode,
}) => {
  const { threads, loading, resolveThread } = useThread();
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null);

  const activeThreads = useMemo(
    () => threads.filter((t) => t.status === 'active'),
    [threads],
  );

  if (isCollapsed) {
    return null;
  }

  const handleThreadClick = (roomId: number | string) => {
    onContactClick?.(Number(roomId));
    onToggleThreadMode?.();
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    await resolveThread(threadId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* List container — ContactListArea와 동일 스타일 */}
      <div className="flex-1 rounded-lg p-2 flex flex-col min-h-0 bg-gray-200 border border-gray-300">
        {/* Header */}
        <div className="font-medium mb-2 text-sm flex-shrink-0 flex items-center justify-between">
          <span className="text-gray-700">스레드 ({activeThreads.length})</span>
        </div>

        {/* Thread list */}
        <ScrollArea orientation="vertical" maxHeight="100%" className="flex-1 min-h-0">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground text-center">로딩 중...</div>
          ) : activeThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Icon iconType={['communication', 'chat-1']} size={28} color="default-muted" />
              <p className="text-xs text-muted-foreground mt-2">
                스레드 대화가 없습니다.
              </p>
              <p className="text-xs text-muted-foreground">
                대화방 헤더에서 스레드를 시작하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {activeThreads.map((thread) => {
                const isHovered = hoveredThreadId === thread.id;
                const lastMessage = thread.messages.length > 0
                  ? thread.messages[thread.messages.length - 1]
                  : null;
                const firstParticipant = thread.participants[0];
                const timeMs = new Date(thread.lastMessageAt).getTime();

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadClick(thread.contactRoomId)}
                    onMouseEnter={() => setHoveredThreadId(thread.id)}
                    onMouseLeave={() => setHoveredThreadId(null)}
                    className="p-1.5 rounded-md transition-colors border-2 cursor-pointer bg-white border-transparent hover:bg-blue-50"
                  >
                    {/* Row 1: Thread icon + Avatar + Badges */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {/* Thread Icon */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          thread.unreadCount > 0 ? 'bg-purple-500' : 'bg-gray-300'
                        }`}>
                          <Icon
                            iconType={['communication', 'chat-1']}
                            size={12}
                            color={thread.unreadCount > 0 ? 'white-default' : 'default-subtle'}
                          />
                        </div>
                        {/* First participant avatar */}
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {firstParticipant?.userName?.charAt(0) || '?'}
                          </span>
                        </div>
                      </div>
                      {/* Right: unread badge + delete button on hover */}
                      <div className="flex items-center gap-1">
                        {thread.unreadCount > 0 && (
                          <Badge
                            label={thread.unreadCount > 9 ? '9+' : String(thread.unreadCount)}
                            color="orange"
                            size="sm"
                            shape="pill"
                          />
                        )}
                        {isHovered && (
                          <Button
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            onClick={(e) => handleDeleteThread(e, thread.id)}
                            leadIcon={<Icon iconType={['system', 'delete-bin']} size={14} color="default-subtle" />}
                            className="hover:bg-red-100"
                            title="스레드 삭제"
                          />
                        )}
                      </div>
                    </div>

                    {/* Row 2: Contact name + Time elapsed */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs text-blue-600 truncate flex-1">
                        {thread.contactName}
                      </span>
                      <span className="text-xs text-gray-500 font-medium ml-2 flex-shrink-0">
                        {formatTimeElapsed(timeMs)}
                      </span>
                    </div>

                    {/* Row 3: Last message or participants */}
                    <div className="flex items-center mt-0.5">
                      <span className="text-xs text-gray-600 truncate flex-1">
                        {lastMessage
                          ? lastMessage.text
                          : thread.participants.map((p) => p.userName).join(', ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default React.memo(ThreadInboxList);
