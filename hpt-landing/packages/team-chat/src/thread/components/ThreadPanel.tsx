import { useMemo } from 'react';
import { Button, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import ThreadComposer from './ThreadComposer';
import ThreadMessageList from './ThreadMessageList';

import { useThread } from '../hooks/useThread';
import { useThreadMessages } from '../hooks/useThreadMessages';

interface ThreadPanelProps {
  className?: string;
}

export default function ThreadPanel({ className }: ThreadPanelProps): JSX.Element | null {
  const { isPanelOpen, setPanelOpen, threads, activeThreadId, setActiveThread } = useThread();
  const { messages, sendMessage } = useThreadMessages(activeThreadId);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  if (!isPanelOpen) {
    return null;
  }

  return (
    <section className={className ?? 'w-96 border-r border-border bg-muted flex flex-col'}>
      <header className="h-12 px-3 border-b border-border bg-card flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">{activeThread?.contactName ?? '스레드 대화'}</div>
        <div className="flex items-center gap-2">
          <Button
            buttonStyle="ghost"
            size="sm"
            onClick={() => {
              setPanelOpen(false);
              setActiveThread(null);
            }}
          >
            닫기
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <ThreadMessageList messages={messages} />
      </ScrollArea>
      <ThreadComposer onSend={async (text) => { await sendMessage(text); }} />
    </section>
  );
}
