import React, { useState, useRef, useEffect } from 'react';
import { ListTodo, Bell, Clock, AlertTriangle, Star } from 'lucide-react';
import type { TaskStats } from '../types/task';

interface UnseenChanges {
  notice: boolean;
  pending: boolean;
  delayed: boolean;
  total: number;
}

interface TaskNavButtonProps {
  placement: 'gnb' | 'rnb';
  stats: TaskStats;
  unseenChanges: UnseenChanges;
  isDrawerOpen: boolean;
  onClick: () => void;
}

const POPOVER_ITEMS = [
  { key: 'notice' as const, label: '공지', icon: Bell, bgColor: 'bg-violet-500', borderColor: 'border-violet-600' },
  { key: 'pending' as const, label: '진행', icon: Clock, bgColor: 'bg-blue-500', borderColor: 'border-blue-600' },
  { key: 'delayed' as const, label: '지연', icon: AlertTriangle, bgColor: 'bg-orange-500', borderColor: 'border-orange-600' },
  { key: 'liked' as const, label: '즐겨찾기', icon: Star, bgColor: 'bg-amber-500', borderColor: 'border-amber-600' },
] as const;

const TaskNavButton: React.FC<TaskNavButtonProps> = ({
  placement,
  stats,
  unseenChanges,
  isDrawerOpen,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close popover when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setIsHovered(false);
    }
  }, [isDrawerOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isDrawerOpen) setIsHovered(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const isGnb = placement === 'gnb';

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={onClick}
        className={`
          relative flex items-center justify-center rounded-lg transition-all duration-200
          w-8 h-8 hover:scale-110
          ${isDrawerOpen
            ? 'bg-amber-100 border border-amber-400 shadow-md'
            : 'bg-white/90 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
          }
        `}
        title="할일 관리"
      >
        <ListTodo size={16} className={isDrawerOpen ? 'text-amber-700' : 'text-gray-600'} />

        {/* Badge - unseen count */}
        {unseenChanges.total > 0 && (
          <span className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-1 ring-white">
            {unseenChanges.total > 99 ? '99+' : unseenChanges.total}
          </span>
        )}
      </button>

      {/* Hover Popover - Mini Dashboard */}
      {isHovered && !isDrawerOpen && (
        <div
          ref={popoverRef}
          className={`
            absolute z-[60] bg-white rounded-lg shadow-xl border border-gray-200
            animate-in fade-in-0 zoom-in-95 duration-150
            ${isGnb
              ? 'left-full ml-2 bottom-0'
              : 'right-full mr-2 bottom-0'
            }
          `}
          style={{ minWidth: '140px' }}
        >
          <div className="p-2 space-y-1">
            <div className="text-[10px] font-semibold text-gray-500 px-1 pb-1 border-b border-gray-100">
              할일 현황
            </div>
            {POPOVER_ITEMS.map(({ key, label, icon: ItemIcon, bgColor, borderColor }) => {
              const count = key === 'liked' ? stats.liked : stats[key];
              const hasChange = key !== 'liked' && unseenChanges[key];

              return (
                <div
                  key={key}
                  className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50"
                >
                  <div className={`${bgColor} border ${borderColor} rounded p-0.5`}>
                    <ItemIcon size={10} className="text-white" />
                  </div>
                  <span className="text-xs text-gray-700 flex-1">{label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800">{count}</span>
                    {hasChange && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-white border-gray-200 rotate-45
              ${isGnb
                ? '-left-1 bottom-3 border-l border-b'
                : '-right-1 bottom-3 border-r border-t'
              }
            `}
          />
        </div>
      )}
    </div>
  );
};

export default TaskNavButton;
