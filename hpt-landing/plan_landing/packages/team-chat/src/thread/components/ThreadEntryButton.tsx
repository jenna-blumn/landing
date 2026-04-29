import { Button, Icon } from '@blumnai-studio/blumnai-design-system';
import { useThread } from '../hooks/useThread';

interface ThreadEntryButtonProps {
  className?: string;
  label?: string;
}

export default function ThreadEntryButton({ className, label = '스레드 대화' }: ThreadEntryButtonProps): JSX.Element {
  const { setPanelOpen } = useThread();

  return (
    <Button
      buttonStyle="secondary"
      size="sm"
      className={className}
      onClick={() => setPanelOpen(true)}
      leadIcon={<Icon iconType={['communication', 'chat-1']} size={14} />}
    >
      {label}
    </Button>
  );
}
