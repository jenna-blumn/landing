import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Clock, Repeat, Trash2, X } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  selectedDate: string | null;
  onSelect: (date: string | null) => void;
  onClose: () => void;
}

const parseDateTime = (dateStr: string | null): { date: string | null; hour: number | null; minute: number | null } => {
  if (!dateStr) return { date: null, hour: null, minute: null };
  if (dateStr.includes('T')) {
    const [datePart, timePart] = dateStr.split('T');
    const [h, m] = timePart.split(':').map(Number);
    return { date: datePart, hour: h, minute: m };
  }
  return { date: dateStr, hour: null, minute: null };
};

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  selectedDate,
  onSelect,
  onClose,
}) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const parsed = parseDateTime(selectedDate);
  const initialDate = parsed.date ? new Date(parsed.date) : today;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(parsed.date);
  const [showTimePicker, setShowTimePicker] = useState(parsed.hour !== null);
  const [selectedHour, setSelectedHour] = useState<number>(parsed.hour ?? 9);
  const [selectedMinute, setSelectedMinute] = useState<number>(parsed.minute ?? 0);

  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showTimePicker) {
      requestAnimationFrame(() => {
        if (hourListRef.current) {
          const itemHeight = 36;
          hourListRef.current.scrollTop = selectedHour * itemHeight - 2 * itemHeight;
        }
        if (minuteListRef.current) {
          const itemHeight = 36;
          const minuteIndex = selectedMinute / 5;
          minuteListRef.current.scrollTop = minuteIndex * itemHeight - 2 * itemHeight;
        }
      });
    }
  }, [selectedHour, selectedMinute, showTimePicker]);

  if (!isOpen) return null;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setTempSelectedDate(dateString);
  };

  const buildDateTimeString = (): string | null => {
    if (!tempSelectedDate) return null;
    if (showTimePicker) {
      return `${tempSelectedDate}T${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    }
    return tempSelectedDate;
  };

  const handleConfirm = () => {
    onSelect(buildDateTimeString());
    onClose();
  };

  const handleDelete = () => {
    onSelect(null);
    onClose();
  };

  const handleToggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const handleRemoveTime = () => {
    setShowTimePicker(false);
  };

  const formatTimeDisplay = (): string => {
    const period = selectedHour < 12 ? '오전' : '오후';
    const displayHour = selectedHour === 0 ? 12 : selectedHour > 12 ? selectedHour - 12 : selectedHour;
    return `${period} ${displayHour}시 ${String(selectedMinute).padStart(2, '0')}분`;
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateString === todayString;
      const isSelected = dateString === tempSelectedDate;
      const isSunday = (firstDayOfMonth + day - 1) % 7 === 0;
      const isSaturday = (firstDayOfMonth + day - 1) % 7 === 6;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-9 h-9 flex items-center justify-center text-sm rounded-full transition-all
            ${isSelected
              ? 'bg-blue-500 text-white font-medium'
              : isToday
                ? 'ring-2 ring-blue-400 text-blue-600 font-medium'
                : isSunday
                  ? 'text-red-500 hover:bg-gray-100'
                  : isSaturday
                    ? 'text-blue-500 hover:bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const drawerContainer = document.getElementById('task-drawer-container');
  if (!drawerContainer) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const modalContent = (
    <div className="absolute inset-0 z-[100] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-[280px] overflow-hidden z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-base font-medium text-gray-900">
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="px-3">
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`w-9 h-8 flex items-center justify-center text-xs font-medium
                  ${index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-400'}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 pb-3">
            {renderCalendarDays()}
          </div>
        </div>

        <div className="border-t border-gray-100">
          {!showTimePicker ? (
            <button
              onClick={handleToggleTimePicker}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Clock size={18} className="text-gray-400" />
              <span className="text-sm text-gray-600">시간 설정</span>
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">{formatTimeDisplay()}</span>
                </div>
                <button
                  onClick={handleRemoveTime}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 px-4 pb-3">
                {/* Hour selector */}
                <div className="relative flex-1">
                  <div
                    ref={hourListRef}
                    className="h-[180px] overflow-y-auto scrollbar-thin"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {hours.map((h) => {
                      const period = h < 12 ? '오전' : '오후';
                      const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                      return (
                        <button
                          key={h}
                          onClick={() => setSelectedHour(h)}
                          className={`w-full h-9 flex items-center justify-center text-sm rounded-lg transition-all
                            ${selectedHour === h
                              ? 'bg-blue-500 text-white font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {period} {displayH}시
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-gray-300 text-lg font-light px-1">:</div>

                {/* Minute selector */}
                <div className="relative flex-1">
                  <div
                    ref={minuteListRef}
                    className="h-[180px] overflow-y-auto scrollbar-thin"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {minutes.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMinute(m)}
                        className={`w-full h-9 flex items-center justify-center text-sm rounded-lg transition-all
                          ${selectedMinute === m
                            ? 'bg-blue-500 text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {String(m).padStart(2, '0')}분
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100">
            <Repeat size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600">반복</span>
          </button>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
          >
            <Trash2 size={18} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, drawerContainer);
};

export default DatePickerModal;
