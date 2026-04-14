import React from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';

interface AcwCardProps {
  remainingSeconds: number;
  durationSeconds: number;
  isPaused: boolean;
  isManagerMode: boolean;
  isCollapsed: boolean;
  onOpenSettings: () => void;
  onStop: () => void;
}

const AcwCard: React.FC<AcwCardProps> = ({
  remainingSeconds,
  durationSeconds,
  isPaused,
  isManagerMode,
  isCollapsed,
  onOpenSettings,
  onStop,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSeconds > 0
    ? (remainingSeconds / durationSeconds) * 100
    : 0;

  if (isCollapsed) {
    return (
      <div className="bg-orange-500 text-white p-2 rounded-lg text-center">
        <Icon iconType={['system', 'time']} size={14} className="mx-auto mb-0.5" />
        <div className="text-xs font-bold tabular-nums">{formatTime(remainingSeconds)}</div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-300 rounded-lg p-2">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <Icon iconType={['system', 'time']} size={12} color="white-default" />
          </div>
          <span className="text-xs font-semibold text-orange-800">후처리</span>
          <span className="text-sm font-bold text-orange-700 tabular-nums">
            {formatTime(remainingSeconds)}
          </span>
          {isPaused && (
            <span className="text-[10px] bg-orange-200 text-orange-700 px-1.5 py-0.5 rounded font-medium">
              일시정지
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {isManagerMode && (
            <Button
              onClick={onOpenSettings}
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              leadIcon={<Icon iconType={['system', 'settings']} size={14} color="warning" />}
              className="p-1 rounded hover:bg-orange-200 transition-colors"
              title="후처리 시간 설정"
            />
          )}
          <Button
            onClick={onStop}
            variant="iconOnly"
            buttonStyle="ghost"
            size="2xs"
            leadIcon={<Icon iconType={['system', 'close']} size={14} color="warning" />}
            className="p-1 rounded hover:bg-orange-200 transition-colors"
            title="후처리 종료"
          />
        </div>
      </div>
      <div className="w-full bg-orange-200 rounded-full h-1">
        <div
          className="bg-orange-500 h-1 rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default AcwCard;
