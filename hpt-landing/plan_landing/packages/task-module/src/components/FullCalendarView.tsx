import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileDown,
  Link2,
  Megaphone,
  MessageSquare,
  Phone,
  Printer,
  Share2,
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import type { Task, TaskType } from '../types/task';
import { TASK_TYPES } from '../types/task';
import TaskBoard from './TaskBoard';

interface FullCalendarViewProps {
  onClose: () => void;
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string | null;
  onRequestCompactDetail: (task: Task) => void;
  dateRange: { start: string; end: string } | null;
  onRangeChange: (range: { start: string; end: string } | null) => void;
  onToggleCalendarView: (mode: 'compact' | 'expanded') => void;
}

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: string | null;
  onDateSelect: (dateStr: string) => void;
  onMonthChange: (date: Date) => void;
  label: string;
}

const TASK_TYPE_ICONS: Record<TaskType, React.ReactNode> = {
  sms: <MessageSquare size={11} />,
  callback: <Phone size={11} />,
  followup: <ClipboardList size={11} />,
  notice: <Megaphone size={11} />,
};

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  label,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const todayStr = new Date().toISOString().split('T')[0];

  const formatDate = (y: number, m: number, d: number) => {
    const date = new Date(y, m, d, 12);
    return date.toISOString().split('T')[0];
  };

  const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    days.push({ date: formatDate(year, month - 1, prevMonthDays - i), day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({ date: formatDate(year, month, day), day, isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day += 1) {
    days.push({ date: formatDate(year, month + 1, day), day, isCurrentMonth: false });
  }

  return (
    <div className="flex flex-col">
      <div className="size-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</div>
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => onMonthChange(new Date(year, month - 1, 1))} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <span className="size-xs font-bold text-gray-800">{year}.{month + 1}</span>
        <button onClick={() => onMonthChange(new Date(year, month + 1, 1))} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center size-xs font-medium py-0.5 text-gray-400">
            {day}
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
              className={`h-6 size-xs rounded flex items-center justify-center transition-colors
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

const FullCalendarView: React.FC<FullCalendarViewProps> = ({
  onClose: _onClose,
  onTaskSelect,
  selectedTaskId,
  onRequestCompactDetail,
  dateRange,
  onRangeChange,
  onToggleCalendarView,
}) => {
  const { api, openNoticeCreation } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [rangeStartDate, setRangeStartDate] = useState<string | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<string | null>(null);
  const [startCalMonth, setStartCalMonth] = useState(new Date());
  const [endCalMonth, setEndCalMonth] = useState(() => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    return next;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayStr = new Date().toISOString().split('T')[0];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MAX_VISIBLE_TASKS = 3;

  const loadTasks = useCallback(async () => {
    const loadedTasks = await api.getTasks();
    setTasks(loadedTasks);
  }, [api]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const unsubscribe = api.onTasksUpdated(() => {
      loadTasks();
    });
    return unsubscribe;
  }, [api, loadTasks]);

  useEffect(() => {
    if (dateRange && dateRange.start === dateRange.end) {
      setSelectedDate(dateRange.start);
      const selected = new Date(`${dateRange.start}T12:00:00`);
      setCurrentDate(new Date(selected.getFullYear(), selected.getMonth(), 1));
      return;
    }
    setSelectedDate(null);
  }, [dateRange]);

  const formatDateString = (y: number, m: number, d: number) => {
    const date = new Date(y, m, d, 12);
    return date.toISOString().split('T')[0];
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.scheduledDate && !task.parentId) {
        if (!map[task.scheduledDate]) {
          map[task.scheduledDate] = [];
        }
        map[task.scheduledDate].push(task);
      }
    }
    return map;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i -= 1) {
      const day = prevMonthDays - i;
      days.push({ date: formatDateString(year, month - 1, day), day, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push({ date: formatDateString(year, month, day), day, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day += 1) {
      days.push({ date: formatDateString(year, month + 1, day), day, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    onRangeChange({ start: dateStr, end: dateStr });
  };

  const isPresetActive = (type: '1w' | '1m') => {
    if (!dateRange) return false;
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const start = new Date(today);
    if (type === '1w') start.setDate(start.getDate() - 6);
    if (type === '1m') start.setMonth(start.getMonth() - 1);
    return dateRange.start === start.toISOString().split('T')[0] && dateRange.end === end;
  };

  const isCustomRange = Boolean(
    dateRange && dateRange.start !== dateRange.end && !isPresetActive('1w') && !isPresetActive('1m'),
  );

  const handlePresetClick = (type: '1w' | '1m') => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const start = new Date(today);
    if (type === '1w') start.setDate(start.getDate() - 6);
    if (type === '1m') start.setMonth(start.getMonth() - 1);
    onRangeChange({ start: start.toISOString().split('T')[0], end });
  };

  const handleOpenDateRangePicker = () => {
    if (dateRange) {
      setRangeStartDate(dateRange.start);
      setRangeEndDate(dateRange.end);
      const startMonth = new Date(`${dateRange.start}T12:00:00`);
      const endMonth = new Date(`${dateRange.end}T12:00:00`);
      setStartCalMonth(startMonth);
      if (
        startMonth.getFullYear() === endMonth.getFullYear()
        && startMonth.getMonth() === endMonth.getMonth()
      ) {
        endMonth.setMonth(endMonth.getMonth() + 1);
      }
      setEndCalMonth(endMonth);
    } else {
      setRangeStartDate(null);
      setRangeEndDate(null);
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      setStartCalMonth(start);
      setEndCalMonth(end);
    }
    setShowDateRangePicker(true);
  };

  const handleApplyDateRange = () => {
    if (rangeStartDate && rangeEndDate) {
      const start = rangeStartDate < rangeEndDate ? rangeStartDate : rangeEndDate;
      const end = rangeStartDate > rangeEndDate ? rangeStartDate : rangeEndDate;
      onRangeChange({ start, end });
      if (start === end) {
        setSelectedDate(start);
      }
    }
    setShowDateRangePicker(false);
  };

  const handleMockExport = (type: 'copy-link' | 'pdf' | 'print') => {
    setShowExportMenu(false);

    if (type === 'copy-link') {
      const mockLink = `${window.location.origin}${window.location.pathname}?calendar=expanded&month=${year}-${String(month + 1).padStart(2, '0')}`;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(mockLink).catch(() => undefined);
      }
      window.alert('링크 복사 메뉴 목업입니다. 실제 공유 로직은 아직 연결되지 않았습니다.');
      return;
    }

    if (type === 'pdf') {
      window.alert('PDF 다운로드 메뉴 목업입니다. 실제 생성 로직은 아직 연결되지 않았습니다.');
      return;
    }

    window.alert('출력 메뉴 목업입니다. 실제 출력 로직은 아직 연결되지 않았습니다.');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleCalendarView('compact')}
            className="px-3 py-1.5 size-xs rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            작게 보기
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="size-xl font-bold text-gray-900 min-w-[140px] text-center">
              {year}.{month + 1}
            </h1>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="px-3 py-1.5 size-xs rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
            >
              <Share2 size={13} />
              <span>내보내기</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-9 z-50 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => handleMockExport('copy-link')}
                    className="w-full px-3 py-2 text-left size-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Link2 size={13} className="text-blue-600" />
                    <span>링크 복사</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockExport('pdf')}
                    className="w-full px-3 py-2 text-left size-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown size={13} className="text-rose-600" />
                    <span>PDF 다운로드</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockExport('print')}
                    className="w-full px-3 py-2 text-left size-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Printer size={13} className="text-gray-600" />
                    <span>출력</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-2 border-b border-gray-100 relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => handlePresetClick('1w')}
              className={`px-3 py-1.5 size-xs border rounded-md transition-colors ${
                isPresetActive('1w')
                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
              }`}
            >
              1주
            </button>
            <button
              onClick={() => handlePresetClick('1m')}
              className={`px-3 py-1.5 size-xs border rounded-md transition-colors ${
                isPresetActive('1m')
                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
              }`}
            >
              1개월
            </button>
            <button
              onClick={handleOpenDateRangePicker}
              className={`px-3 py-1.5 size-xs border rounded-md transition-colors flex items-center justify-center gap-1 ${
                isCustomRange
                  ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600'
              }`}
            >
              <CalendarRange size={12} />
              기간 선택
            </button>
            {dateRange && (
              <button
                onClick={() => onRangeChange(null)}
                className="px-3 py-1.5 size-xs border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
              >
                초기화
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 size-xs text-gray-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
              <span>진행</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
              <span>지연</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
              <span>공지</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gray-400" />
              <span>완료</span>
            </div>
          </div>
        </div>

        {showDateRangePicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDateRangePicker(false)} />
            <div className="absolute left-6 top-12 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-[280px]">
              <div className="space-y-4">
                <MiniCalendar
                  currentDate={startCalMonth}
                  selectedDate={rangeStartDate}
                  onDateSelect={setRangeStartDate}
                  onMonthChange={setStartCalMonth}
                  label="Start"
                />

                <div className="border-t border-gray-100" />

                <MiniCalendar
                  currentDate={endCalMonth}
                  selectedDate={rangeEndDate}
                  onDateSelect={setRangeEndDate}
                  onMonthChange={setEndCalMonth}
                  label="End"
                />

                {(rangeStartDate || rangeEndDate) && (
                  <div className="size-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span>{rangeStartDate || '-'}</span>
                    <span className="text-gray-300 mx-2">~</span>
                    <span>{rangeEndDate || '-'}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDateRangePicker(false)}
                    className="flex-1 py-2 size-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleApplyDateRange}
                    disabled={!rangeStartDate || !rangeEndDate}
                    className={`flex-1 py-2 size-xs rounded-lg transition-colors font-medium ${
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
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="grid grid-cols-7 border-b border-gray-200 flex-shrink-0">
            {weekDays.map((day, idx) => (
              <div
                key={day}
                className={`py-2 text-center size-sm font-medium border-r border-gray-100 last:border-r-0 ${
                  idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {calendarDays.map((dayInfo, idx) => {
              const dayTasks = tasksByDate[dayInfo.date] || [];
              const isToday = dayInfo.date === todayStr;
              const isSelected = dayInfo.date === selectedDate;
              const dayOfWeek = idx % 7;

              return (
                <div
                  key={dayInfo.date}
                  onClick={() => handleDateClick(dayInfo.date)}
                  className={`border-r border-b border-gray-100 last:border-r-0 p-1 cursor-pointer transition-colors overflow-hidden flex flex-col
                    ${!dayInfo.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                    ${isSelected ? 'bg-blue-50 ring-1 ring-inset ring-blue-300' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center justify-between mb-0.5 flex-shrink-0">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 size-sm rounded-full
                        ${isToday ? 'bg-blue-500 text-white font-bold' : ''}
                        ${!isToday && !dayInfo.isCurrentMonth ? 'text-gray-300' : ''}
                        ${!isToday && dayInfo.isCurrentMonth && dayOfWeek === 0 ? 'text-red-500' : ''}
                        ${!isToday && dayInfo.isCurrentMonth && dayOfWeek === 6 ? 'text-blue-500' : ''}
                        ${!isToday && dayInfo.isCurrentMonth && dayOfWeek !== 0 && dayOfWeek !== 6 ? 'text-gray-900' : ''}
                      `}
                    >
                      {dayInfo.day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="size-xs text-gray-400 mr-1">{dayTasks.length}</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5 overflow-hidden min-h-0">
                    {dayTasks.slice(0, MAX_VISIBLE_TASKS).map((task) => (
                      <div
                        key={task.id}
                        className={`border-l-2 rounded-r px-1.5 py-0.5 size-xs leading-tight truncate ${
                          task.type === 'notice'
                            ? 'border-l-violet-500 bg-violet-50'
                            : task.status === 'delayed'
                              ? 'border-l-orange-500 bg-orange-50'
                              : task.status === 'completed'
                                ? 'border-l-gray-400 bg-gray-50'
                                : 'border-l-sky-500 bg-sky-50'
                        } ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}
                        title={`${TASK_TYPES[task.type].label}: ${task.title}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <span className="flex-shrink-0 opacity-70">{TASK_TYPE_ICONS[task.type]}</span>
                          <span className="truncate">{task.title}</span>
                        </span>
                      </div>
                    ))}
                    {dayTasks.length > MAX_VISIBLE_TASKS && (
                      <div className="size-xs text-gray-400 px-1.5 font-medium">
                        +{dayTasks.length - MAX_VISIBLE_TASKS} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[420px] flex-shrink-0 border-l border-gray-200 bg-white">
          <TaskBoard
            dateRange={dateRange}
            onTaskSelect={onTaskSelect}
            selectedTaskId={selectedTaskId}
            onTasksUpdated={setTasks}
            onTaskDetailRequest={onRequestCompactDetail}
            onAddNotice={openNoticeCreation}
          />
        </div>
      </div>
    </div>
  );
};

export default FullCalendarView;
