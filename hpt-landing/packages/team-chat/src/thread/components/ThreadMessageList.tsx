import type { JSX } from 'react';
import { Avatar, Badge, Icon, Button } from '@blumnai-studio/blumnai-design-system';
import type { ChatMessage } from '../../types/common';

interface ThreadMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onGenerateReply?: (message: ChatMessage) => void;
  isGenerating?: boolean;
}

export default function ThreadMessageList({
  messages,
  currentUserId,
  onGenerateReply,
  isGenerating = false,
}: ThreadMessageListProps): JSX.Element {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 bg-amber-50/30">
      {messages.map((message, index) => {
        // 시스템 메시지
        if (message.type === 'system') {
          return (
            <div key={message.id} className="flex justify-center py-2">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <Badge label="팀 대화" color="purple" size="sm" shape="pill" />
                )}
                <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                  {message.text}
                </span>
              </div>
            </div>
          );
        }

        const isMyMessage = currentUserId ? message.senderId === currentUserId : false;
        const initials = message.senderName?.charAt(0) || '?';

        // 내 메시지 (우측)
        if (isMyMessage) {
          return (
            <div key={message.id} className="flex items-start gap-2 justify-end">
              <div className="max-w-[75%]">
                <div className="rounded-lg p-3 bg-blue-500 text-white">
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
              <div className="pt-0.5 flex-shrink-0">
                <Avatar variant="initials" initials={initials} size="md" color="#4ade80" />
              </div>
            </div>
          );
        }

        // 상대방 메시지 (좌측) — AI/상담사
        return (
          <div key={message.id} className="flex items-start gap-2">
            <div className="pt-0.5 flex-shrink-0">
              <Avatar variant="initials" initials={initials} size="md" color="#fbbf24" />
            </div>
            <div className="max-w-[75%]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-medium text-foreground">{message.senderName}</span>
                <Badge label="AI" color="green" size="sm" shape="pill" />
              </div>
              <div className="rounded-lg p-3 bg-amber-50 border border-amber-200 text-foreground">
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">
                  {formatTimestamp(message.timestamp)}
                </p>
                {onGenerateReply && (
                  <Button
                    buttonStyle="ghost"
                    size="2xs"
                    onClick={() => onGenerateReply(message)}
                    disabled={isGenerating}
                    leadIcon={<Icon iconType={['communication', 'chat-1']} size={12} />}
                  >
                    {isGenerating ? '생성 중...' : '고객 답변 생성'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* AI 생성 중 로딩 표시 */}
      {isGenerating && (
        <div className="flex justify-center py-2">
          <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full animate-pulse">
            AI가 고객 답변을 생성하고 있습니다...
          </span>
        </div>
      )}
    </div>
  );
}
