import { ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { useThread } from '../hooks/useThread';

interface ThreadListProps {
  className?: string;
}

export default function ThreadList({ className }: ThreadListProps): JSX.Element {
  const { threads, activeThreadId, setActiveThread, setPanelOpen } = useThread();

  return (
    <div className={className ?? 'bg-card border border-border rounded-md'}>
      <div className="px-3 py-2 border-b border-border text-sm font-semibold text-foreground">스레드 목록</div>
      <ScrollArea className="max-h-60">
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            onClick={() => {
              setActiveThread(thread.id);
              setPanelOpen(true, thread.contactRoomId);
            }}
            className={`w-full text-left px-3 py-2 border-b border-border/30 hover:bg-muted transition-colors ${
              activeThreadId === thread.id ? 'bg-primary/10' : ''
            }`}
          >
            <div className="text-sm font-medium text-foreground">{thread.contactName}</div>
            <div className="text-xs text-muted-foreground">{thread.participants.map((participant) => participant.userName).join(', ')}</div>
          </button>
        ))}
      </ScrollArea>
    </div>
  );
}
