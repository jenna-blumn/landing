import type { ChatMessage } from '../../types/common';

interface GroupChatMessageListProps {
  messages: ChatMessage[];
}

export default function GroupChatMessageList({ messages }: GroupChatMessageListProps): JSX.Element {
  return (
    <div className="flex-1 p-3 space-y-2">
      {messages.map((message) => (
        <div key={message.id} className="rounded-md border border-border bg-card px-3 py-2 text-sm">
          <div className="text-xs text-muted-foreground mb-1">{message.senderName}</div>
          <div className="text-foreground">{message.text}</div>
        </div>
      ))}
    </div>
  );
}
