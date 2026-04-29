import { useState } from 'react';
import { Button, Icon, Textarea } from '@blumnai-studio/blumnai-design-system';

interface ThreadComposerProps {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function ThreadComposer({ onSend, disabled = false }: ThreadComposerProps): JSX.Element {
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
    <div className="border-t border-border p-3 bg-card">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder="AI 상담사에게 질문하세요..."
            disabled={disabled}
            minRows={2}
          />
        </div>
        <Button
          variant="iconOnly"
          buttonStyle="primary"
          size="sm"
          disabled={disabled || !text.trim()}
          onClick={() => void handleSend()}
          leadIcon={<Icon iconType={['communication', 'chat-1']} size={16} />}
          title="전송"
        />
      </div>
    </div>
  );
}
