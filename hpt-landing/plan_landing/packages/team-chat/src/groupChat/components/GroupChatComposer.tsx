import { useState } from 'react';
import { Button } from '@blumnai-studio/blumnai-design-system';

interface GroupChatComposerProps {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function GroupChatComposer({ onSend, disabled = false }: GroupChatComposerProps): JSX.Element {
  const [text, setText] = useState('');

  const handleSend = async (): Promise<void> => {
    const nextText = text.trim();
    if (!nextText || disabled) {
      return;
    }
    await onSend(nextText);
    setText('');
  };

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
          className="flex-1 h-16 resize-none rounded-md border border-input bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="팀 메시지를 입력하세요..."
          disabled={disabled}
        />
        <Button
          size="sm"
          className="w-16"
          disabled={disabled || !text.trim()}
          onClick={() => void handleSend()}
        >
          전송
        </Button>
      </div>
    </div>
  );
}
