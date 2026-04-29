import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types/task';

interface TaskCalendarProps {
  selectedRange: { start: string; end: string } | null;
  onRangeChange: (range: { start: string; end: string } | null) => void;
  calendarViewMode: 'compact' | 'expanded';
  onToggleCalendarView: (mode: 'compact' | 'expanded') => void;
  refreshSignal?: number;
}

// ─── Mini calendar for date range picker ───
interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: string | null;
  onDateSelect: (dateStr: string) => void;
  onMonthChange: (date: Date) => void;
  label: string;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ currentDate, selectedDate, onDateSelect, onMonthChange, label }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const formatDate = (y: number, m: number, d: number) => {
    const date = new Date(y, m, d, 12);
    return date.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: formatDate(year, month - 1, prevMonthDays - i), day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: formatDate(year, month, d), day: d, isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: formatDate(year, month + 1, d), day: d, isCurrentMonth: false });
  }

  return (
    <div className="flex flex-col">
      <div className="size-sm font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => onMonthChange(new Date(year, month - 1, 1))} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <span className="size-sm font-bold text-gray-800">{year}년 {month + 1}월</span>
        <button onClick={() => onMonthChange(new Date(year, month + 1, 1))} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((d, idx) => (
          <div key={d} className={`text-center size-sm font-medium py-0.5 ${idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {days.map((dayInfo) => {
          const isSelected = dayInfo.date === selectedDate;
          const isToday = dayInfo.date === todayStr;
          return (
            <button
              key={dayInfo.date}
              onClick={() => dayInfo.isCurrentMonth && onDateSelect(dayInfo.date)}
              className={`h-6 size-sm rounded flex items-center justify-center transition-colors
                ${!dayInfo.isCurrentMonth ? 'text-gray-300 cursor-default' : 'cursor-pointer hover:bg-blue-50'}
                ${isSelected ? 'bg-blue-500 text-white font-bold hover:bg-blue-600' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-blue-400 ring-inset font-semibold' : ''}
              `}
            >
              {dayInfo.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main TaskCalendar component ───
const TaskCalendar: React.FC<TaskCalendarProps> = ({
  selectedRange,
  onRangeChange,
  calendarViewMode,
  onToggleCalendarView,
  refreshSignal = 0,
}) => {
  const { api } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Dual calendar state
  const [rangeStartDate, setRangeStartDate] = useState<string | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<string | null>(null);
  const [startCalMonth, setStartCalMonth] = useState(new Date());
  const [endCalMonth, setEndCalMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  });

  const loadTasks = useCallback(async () => {
    const loadedTasks = await api.getTasks();
    setTasks(loadedTasks);
  }, [api]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshSignal]);

  useEffect(() => {
    const unsubscribe = api.onTasksUpdated(() => {
      loadTasks();
    });
    return unsubscribe;
  }, [api, loadTasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const jumpToMonth = (m: number) => {
    setCurrentDate(new Date(year, m, 1));
    setShowMonthPicker(false);
  };

  const formatDateString = (y: number, m: number, d: number) => {
    const date = new Date(y, m, d, 12);
    return date.toISOString().split('T')[0];
  };

  const hasDelayedTask = (dateStr: string) => {
    return tasks.some(task => task.scheduledDate === dateStr && task.status === 'delayed' && task.type !== 'notice');
  };

  const hasNotice = (dateStr: string) => {
    return tasks.some(task => task.scheduledDate === dateStr && task.type === 'notice' && task.status !== 'completed');
  };

  const hasPendingTask = (dateStr: string) => {
    return tasks.some(task => task.scheduledDate === dateStr && task.status === 'pending' && task.type !== 'notice');
  };

  const hasAnyTask = () => tasks.length > 0;
  const hasAnyNotice = () => tasks.some(task => task.type === 'notice' && task.status !== 'completed');
  const hasAnyPendingTask = () => tasks.some(task => task.status === 'pending' && task.type !== 'notice');
  const hasAnyDelayedTask = () => tasks.some(task => task.status === 'delayed' && task.type !== 'notice');

  const isDateInRange = (dateStr: string) => {
    if (!selectedRange) return false;
    return dateStr >= selectedRange.start && dateStr <= selectedRange.end;
  };

  const isRangeStart = (dateStr: string) => {
    if (!selectedRange) return false;
    return selectedRange.start === dateStr;
  };

  const isRangeEnd = (dateStr: string) => {
    if (!selectedRange) return false;
    return selectedRange.end === dateStr;
  };

  // Single date click: select that date (or deselect if already selected)
  const handleDateClick = (dateStr: string) => {
    if (selectedRange && selectedRange.start === dateStr && selectedRange.end === dateStr) {
      // Deselect: same single date clicked again
      onRangeChange(null);
    } else {
      onRangeChange({ start: dateStr, end: dateStr });
    }
  };

  const handlePresetClick = (type: '1w' | '1m') => {
    const today = new Date();
    const start = today.toISOString().split('T')[0];
    const end = new Date(today);

    if (type === '1w') end.setDate(end.getDate() + 6);
    else if (type === '1m') end.setMonth(end.getMonth() + 1);

    onRangeChange({ start, end: end.toISOString().split('T')[0] });
  };

  const handleOpenDateRangePicker = () => {
    // Initialize with current selection or defaults
    if (selectedRange) {
      setRangeStartDate(selectedRange.start);
      setRangeEndDate(selectedRange.end);
      setStartCalMonth(new Date(selectedRange.start + 'T12:00:00'));
      const endMonth = new Date(selectedRange.end + 'T12:00:00');
      // If same month, show next month for end calendar
      const startMonth = new Date(selectedRange.start + 'T12:00:00');
      if (startMonth.getFullYear() === endMonth.getFullYear() && startMonth.getMonth() === endMonth.getMonth()) {
        endMonth.setMonth(endMonth.getMonth() + 1);
      }
      setEndCalMonth(endMonth);
    } else {
      setRangeStartDate(null);
      setRangeEndDate(null);
      setStartCalMonth(new Date());
      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      setEndCalMonth(next);
    }
    setShowDateRangePicker(true);
  };

  const handleApplyDateRange = () => {
    if (rangeStartDate && rangeEndDate) {
      const start = rangeStartDate < rangeEndDate ? rangeStartDate : rangeEndDate;
      const end = rangeStartDate > rangeEndDate ? rangeStartDate : rangeEndDate;
      onRangeChange({ start, end });
    }
    setShowDateRangePicker(false);
  };

  const handleCancelDateRange = () => {
    setShowDateRangePicker(false);
  };

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(task => task.scheduledDate === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const dateStr = formatDateString(year, month - 1, day);
      days.push(
        <div
          key={`prev-${day}`}
          className="h-10 flex flex-col items-center justify-center text-gray-300 size-md cursor-pointer hover:bg-gray-50 rounded"
          onClick={() => handleDateClick(dateStr)}
        >
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const inRange = isDateInRange(dateStr);
      const isStart = isRangeStart(dateStr);
      const isEnd = isRangeEnd(dateStr);
      const isSingleSelected = isStart && isEnd;
      const tasksForDay = getTasksForDate(dateStr);

      let textColor = 'text-gray-900';
      if (dayOfWeek === 0) textColor = 'text-red-500';
      if (dayOfWeek === 6) textColor = 'text-blue-500';

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(dateStr)}
          className={`h-10 flex flex-col items-center justify-center size-md cursor-pointer rounded relative transition-all
            ${inRange && !isSingleSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
            ${isSingleSelected ? 'bg-blue-500 text-white hover:bg-blue-600 z-10' : ''}
            ${!isSingleSelected && (isStart || isEnd) ? 'bg-blue-500 text-white hover:bg-blue-600 z-10' : ''}
            ${isToday && !inRange ? 'ring-2 ring-blue-400 ring-inset' : ''}
          `}
        >
          <span className={`${(isStart || isEnd) ? 'text-white font-bold' : textColor}`}>
            {day}
          </span>
          {tasksForDay.length > 0 && (
            <div className="flex gap-0.5 mt-0.5">
              {hasNotice(dateStr) && (
                <div className={`w-1.5 h-1.5 rounded-full ${(isStart || isEnd) ? 'bg-violet-300' : 'bg-violet-500'}`} />
              )}
              {hasPendingTask(dateStr) && (
                <div className={`w-1.5 h-1.5 rounded-full ${(isStart || isEnd) ? 'bg-sky-300' : 'bg-sky-500'}`} />
              )}
              {hasDelayedTask(dateStr) && (
                <div className={`w-1.5 h-1.5 rounded-full ${(isStart || isEnd) ? 'bg-orange-300' : 'bg-orange-500'}`} />
              )}
            </div>
          )}
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dateStr = formatDateString(year, month + 1, day);
      days.push(
        <div
          key={`next-${day}`}
          className="h-10 flex flex-col items-center justify-center text-gray-300 size-md cursor-pointer hover:bg-gray-50 rounded"
          onClick={() => handleDateClick(dateStr)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // Check if a preset is currently active
  const isPresetActive = (type: '1w' | '1m') => {
    if (!selectedRange) return false;
    const today = new Date();
    const start = today.toISOString().split('T')[0];
    const end = new Date(today);
    if (type === '1w') end.setDate(end.getDate() + 6);
    else if (type === '1m') end.setMonth(end.getMonth() + 1);
    return selectedRange.start === start && selectedRange.end === end.toISOString().split('T')[0];
  };

  const isCustomRange = selectedRange && selectedRange.start !== selectedRange.end && !isPresetActive('1w') && !isPresetActive('1m');

  return (
    <div className="h-full flex flex-col bg-white select-none">
      <div className="h-[49px] px-4 border-b border-gray-100 flex items-center gap-1">
        <button
          type="button"
          onClick={() => onToggleCalendarView(calendarViewMode === 'compact' ? 'expanded' : 'compact')}
          className="px-2.5 py-1 size-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {calendarViewMode === 'compact' ? '크게 보기' : '작게 보기'}
        </button>
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="flex-1 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors size-md font-bold text-gray-900 flex items-center justify-center gap-1"
        >
          {year}년 {month + 1}월
          <span className="size-sm text-gray-400">▼</span>
        </button>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="flex-1 px-4 py-2 overflow-auto relative">
        {showMonthPicker && (
          <div className="absolute inset-0 z-20 bg-white grid grid-cols-3 gap-2 p-4">
            {months.map((m, idx) => (
              <button
                key={m}
                onClick={() => jumpToMonth(idx)}
                className={`py-3 rounded-lg size-md transition-colors ${idx === month ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                {m}
              </button>
            ))}
            <button
              onClick={() => setShowMonthPicker(false)}
              className="col-span-3 mt-2 size-sm text-gray-500 hover:text-gray-700 underline"
            >
              닫기
            </button>
          </div>
        )}

        {/* Preset buttons: 1주일, 1개월, 기간 설정 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handlePresetClick('1w')}
            className={`flex-1 py-1.5 size-sm border rounded-md transition-colors ${
              isPresetActive('1w')
                ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
            }`}
          >
            1주일
          </button>
          <button
            onClick={() => handlePresetClick('1m')}
            className={`flex-1 py-1.5 size-sm border rounded-md transition-colors ${
              isPresetActive('1m')
                ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
            }`}
          >
            1개월
          </button>
          <button
            onClick={handleOpenDateRangePicker}
            className={`flex-1 py-1.5 size-sm border rounded-md transition-colors flex items-center justify-center gap-1 ${
              isCustomRange
                ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
            }`}
          >
            <CalendarRange size={12} />
            기간 설정
          </button>
        </div>

        {/* Date range picker overlay */}
        {showDateRangePicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleCancelDateRange} />
            <div className="absolute left-2 right-2 top-12 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-[260px]">
              <div className="space-y-4">
                {/* Start date calendar */}
                <MiniCalendar
                  currentDate={startCalMonth}
                  selectedDate={rangeStartDate}
                  onDateSelect={setRangeStartDate}
                  onMonthChange={setStartCalMonth}
                  label="시작일"
                />

                <div className="border-t border-gray-100" />

                {/* End date calendar */}
                <MiniCalendar
                  currentDate={endCalMonth}
                  selectedDate={rangeEndDate}
                  onDateSelect={setRangeEndDate}
                  onMonthChange={setEndCalMonth}
                  label="종료일"
                />

                {/* Selected range summary */}
                {(rangeStartDate || rangeEndDate) && (
                  <div className="size-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span>{rangeStartDate || '미선택'}</span>
                    <span className="text-gray-300 mx-2">~</span>
                    <span>{rangeEndDate || '미선택'}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelDateRange}
                    className="flex-1 py-2 size-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleApplyDateRange}
                    disabled={!rangeStartDate || !rangeEndDate}
                    className={`flex-1 py-2 size-sm rounded-lg transition-colors font-medium ${
                      rangeStartDate && rangeEndDate
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    적용
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={day}
              className={`text-center size-sm font-medium py-2 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'
                }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>

        {hasAnyTask() && (
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {hasAnyNotice() && (
              <div className="flex items-center gap-2 size-sm text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span>공지</span>
              </div>
            )}
            {hasAnyPendingTask() && (
              <div className="flex items-center gap-2 size-sm text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>진행</span>
              </div>
            )}
            {hasAnyDelayedTask() && (
              <div className="flex items-center gap-2 size-sm text-gray-500">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>지연</span>
              </div>
            )}
          </div>
        )}

        {/* Reset button when range is active */}
        {selectedRange && (
          <div className="mt-4">
            <button
              onClick={() => onRangeChange(null)}
              className="w-full py-1.5 size-sm bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors font-medium text-center"
            >
              선택 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;
