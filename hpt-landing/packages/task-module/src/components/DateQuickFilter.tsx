import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateQuickFilterProps {
  selectedRange: { start: string; end: string } | null;
  onRangeChange: (range: { start: string; end: string } | null) => void;
  onOpenCalendarView?: () => void;
}

/** 오늘~+6일(총 7일) 일주일 범위를 생성 */
export const getWeekPreset = (): { start: string; end: string } => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 6);
  return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
};

const DateQuickFilter: React.FC<DateQuickFilterProps> = ({
  selectedRange,
  onRangeChange,
  onOpenCalendarView,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get date preset
  const getDatePreset = (preset: 'today' | 'tomorrow' | 'week'): { start: string; end: string } => {
    if (preset === 'week') {
      return getWeekPreset();
    }
    const date = new Date();
    if (preset === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    }
    const dateStr = date.toISOString().split('T')[0];
    return { start: dateStr, end: dateStr };
  };

  // Check if current range matches the week preset
  const isWeekRange = (range: { start: string; end: string } | null): boolean => {
    if (!range) return false;
    const weekPreset = getWeekPreset();
    return range.start === weekPreset.start && range.end === weekPreset.end;
  };

  // Get display label for current date range
  const getDateRangeLabel = (range: { start: string; end: string } | null): string => {
    if (!range) return '전체보기';

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (isWeekRange(range)) return '일주일';

    if (range.start === range.end) {
      if (range.start === today) return '오늘';
      if (range.start === tomorrowStr) return '내일';
      // Format date as MM/DD
      const date = new Date(range.start);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // Range format
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    return `${startDate.getMonth() + 1}/${startDate.getDate()} - ${endDate.getMonth() + 1}/${endDate.getDate()}`;
  };

  const handleDateSelect = (e: React.MouseEvent, preset: 'today' | 'tomorrow' | 'week' | 'custom') => {
    e.stopPropagation();
    if (preset === 'custom') {
      // Navigate to calendar view
      setShowMenu(false);
      onOpenCalendarView?.();
      return;
    }

    const range = getDatePreset(preset);
    onRangeChange(range);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
        className="flex items-center gap-1 px-2 py-1.5 rounded transition-colors border bg-white text-gray-600 hover:bg-gray-50 border-gray-200 size-sm"
      >
        <Calendar size={14} />
        <span className="whitespace-nowrap">{getDateRangeLabel(selectedRange)}</span>
        <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] py-1 z-50 min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-150">
            <button
              onClick={(e) => handleDateSelect(e, 'today')}
              className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${
                selectedRange &&
                selectedRange.start === selectedRange.end &&
                selectedRange.start === new Date().toISOString().split('T')[0]
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              오늘
            </button>
            <button
              onClick={(e) => handleDateSelect(e, 'tomorrow')}
              className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${
                selectedRange &&
                selectedRange.start === selectedRange.end &&
                selectedRange.start === (() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return tomorrow.toISOString().split('T')[0];
                })()
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              내일
            </button>
            <button
              onClick={(e) => handleDateSelect(e, 'week')}
              className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${
                isWeekRange(selectedRange)
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              일주일
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={(e) => handleDateSelect(e, 'custom')}
              className="w-full text-left px-3 py-2 size-sm hover:bg-gray-50 text-gray-700"
            >
              다른 날짜...
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DateQuickFilter;
