import React from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';

interface QueueAreaProps {
  waitingCount: number;
  aiResponseCount: number;
  isAutoAssignment: boolean;
  isCollapsed: boolean;
  onSelectQueueType: (queueType: 'ai-response' | 'queue-waiting' | null) => void;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  onEnterSearchMode?: (filterMode?: 'standard' | 'ai-response' | 'unassigned') => void;
}

const QueueArea: React.FC<QueueAreaProps> = ({
  waitingCount,
  aiResponseCount,
  isCollapsed,
  selectedQueueType,
  onEnterSearchMode,
}) => {
  const handleQueueTypeClick = (queueType: 'ai-response' | 'queue-waiting' | null) => {
    if (!queueType) return;

    // Enter search mode with appropriate filter mode
    if (onEnterSearchMode) {
      const filterMode = queueType === 'ai-response' ? 'ai-response' : 'unassigned';
      onEnterSearchMode(filterMode);
    }
  };
  const formatCount = (count: number) => {
    return count > 99 ? '99+' : count.toString();
  };

  if (isCollapsed) {
    return (
      <div className="bg-gray-200 border border-gray-300 p-1 rounded-lg overflow-hidden">
        <div className="space-y-1.5">
          <Button
            onClick={() => handleQueueTypeClick('ai-response')}
            buttonStyle="ghost"
            size="xs"
            fullWidth
            className={`border ${
              selectedQueueType === 'ai-response'
                ? 'bg-blue-500 border-blue-600 text-white'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1 w-full">
              <div className={`text-xs font-medium truncate ${selectedQueueType === 'ai-response' ? 'text-white' : 'text-blue-800'}`}>AI</div>
              <div className={`text-xs font-bold flex-shrink-0 ${selectedQueueType === 'ai-response' ? 'text-white' : 'text-blue-600'}`}>{formatCount(aiResponseCount)}</div>
            </div>
          </Button>

          <Button
            onClick={() => handleQueueTypeClick('queue-waiting')}
            buttonStyle="ghost"
            size="xs"
            fullWidth
            className={`border ${
              selectedQueueType === 'queue-waiting'
                ? 'bg-orange-500 border-orange-600 text-white'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1 w-full">
              <div className={`text-xs font-medium truncate ${selectedQueueType === 'queue-waiting' ? 'text-white' : 'text-orange-800'}`}>
                배정대기
              </div>
              <div className={`text-xs font-bold flex-shrink-0 ${selectedQueueType === 'queue-waiting' ? 'text-white' : 'text-orange-600'}`}>{formatCount(waitingCount)}</div>
            </div>
          </Button>

          {onEnterSearchMode && (
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="xs"
              fullWidth
              onClick={() => onEnterSearchMode('standard')}
              leadIcon={<Icon iconType={['system', 'search']} size={16} color="default-subtle" />}
              className="border bg-gray-50 border-gray-300 hover:bg-gray-100"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handleQueueTypeClick('ai-response')}
        buttonStyle="ghost"
        size="xs"
        className={`border flex-1 ${
          selectedQueueType === 'ai-response'
            ? 'bg-blue-500 border-blue-600 text-white'
            : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
        }`}
      >
        <span className={`font-medium ${selectedQueueType === 'ai-response' ? 'text-white' : 'text-blue-800'}`}>AI응대</span>
        <span className={`font-bold ${selectedQueueType === 'ai-response' ? 'text-white' : 'text-blue-600'}`}>{formatCount(aiResponseCount)}</span>
      </Button>

      <Button
        onClick={() => handleQueueTypeClick('queue-waiting')}
        buttonStyle="ghost"
        size="xs"
        className={`border flex-1 ${
          selectedQueueType === 'queue-waiting'
            ? 'bg-orange-500 border-orange-600 text-white'
            : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
        }`}
      >
        <span className={`font-medium ${selectedQueueType === 'queue-waiting' ? 'text-white' : 'text-orange-800'}`}>
          배정대기
        </span>
        <span className={`font-bold ${selectedQueueType === 'queue-waiting' ? 'text-white' : 'text-orange-600'}`}>{formatCount(waitingCount)}</span>
      </Button>

      {onEnterSearchMode && (
        <Button
          buttonStyle="ghost"
          size="xs"
          onClick={() => onEnterSearchMode('standard')}
          leadIcon={<Icon iconType={['system', 'search']} size={14} color="default-subtle" />}
          className="border bg-gray-50 border-gray-300 hover:bg-gray-100 flex-1"
        >
          검색
        </Button>
      )}
    </div>
  );
};

export default React.memo(QueueArea);
