import React from 'react';
import { Badge, Icon } from '@blumnai-studio/blumnai-design-system';

interface ThreadTeamCounterBarProps {
  threadCount: number;
  activeMode: 'contact' | 'thread';
  onModeChange: (mode: 'contact' | 'thread') => void;
  isCollapsed?: boolean;
}

const ThreadTeamCounterBar: React.FC<ThreadTeamCounterBarProps> = ({
  threadCount,
  activeMode,
  onModeChange,
  isCollapsed = false,
}) => {
  if (isCollapsed) {
    return (
      <div className="p-1 rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 border border-violet-300">
        <button
          type="button"
          onClick={() => onModeChange(activeMode === 'thread' ? 'contact' : 'thread')}
          className={`w-full flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeMode === 'thread'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <div className="relative">
            <Icon iconType={['communication', 'chat-1']} size={16} />
            {threadCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[9px] font-bold leading-none px-0.5">
                {threadCount > 99 ? '99+' : threadCount}
              </span>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 border border-violet-300">
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onModeChange(activeMode === 'thread' ? 'contact' : 'thread')}
        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
          activeMode === 'thread'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted'
        }`}
      >
        <Icon iconType={['communication', 'chat-1']} size={14} />
        <span>스레드</span>
        {threadCount > 0 && (
          <Badge label={String(threadCount)} color="blue" size="sm" shape="pill" />
        )}
      </button>
    </div>
    </div>
  );
};

export default React.memo(ThreadTeamCounterBar);
