import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Circle, AlignLeft, Calendar, MessageSquare, Phone, ClipboardList, ChevronDown, X } from 'lucide-react';
import { TaskType, CreateTaskInput, TASK_TYPES, TASK_COLORS } from '../types/task';
import { RoomRef } from '../types/room';
import DatePickerModal from './DatePickerModal';
import { formatDateLabel as formatDateLabelUtil } from '../utils/taskEditUtils';

interface TaskInlineEditorProps {
  onSave: (input: CreateTaskInput) => void;
  onCancel: () => void;
  parentId?: string | null;
  autoFocus?: boolean;
  defaultDate?: string | null;
  selectedRoom?: RoomRef | null;
  initialLinked?: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialType?: TaskType;
  extraActions?: React.ReactNode;
}

const TaskInlineEditor: React.FC<TaskInlineEditorProps> = ({
  onSave,
  onCancel,
  parentId = null,
  autoFocus = true,
  defaultDate = null,
  selectedRoom = null,
  initialLinked = false,
  initialTitle = '',
  initialDescription = '',
  initialType = 'followup',
  extraActions,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const initialScheduledDate = defaultDate && defaultDate.trim() !== '' ? defaultDate : today;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [type, setType] = useState<TaskType>(initialType);
  const [scheduledDate, setScheduledDate] = useState<string | null>(initialScheduledDate);
  const [isLinkedToRoom, setIsLinkedToRoom] = useState(initialLinked);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;

    onSave({
      type,
      title: title.trim(),
      description: description.trim() || undefined,
      scheduledDate: scheduledDate || undefined,
      parentId,
      roomId: isLinkedToRoom && selectedRoom ? selectedRoom.id : undefined,
      backgroundColor: backgroundColor || undefined,
    });

    setTitle('');
    setDescription('');
    setType('followup');
    setScheduledDate(initialScheduledDate);
    setIsLinkedToRoom(false);
    setBackgroundColor(null);
  }, [
    backgroundColor,
    initialScheduledDate,
    isLinkedToRoom,
    onSave,
    parentId,
    scheduledDate,
    selectedRoom,
    title,
    description,
    type,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDatePickerModal) return;
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (title.trim()) {
          handleSave();
        } else {
          onCancel();
        }
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleSave, onCancel, showDatePickerModal, title]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const setDateToday = () => {
    setScheduledDate(today);
  };

  const setDateTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow.toISOString().split('T')[0]);
  };

  const todayDate = today;
  const tomorrowDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const getTypeIcon = (taskType: TaskType) => {
    switch (taskType) {
      case 'sms': return MessageSquare;
      case 'callback': return Phone;
      case 'followup': return ClipboardList;
      default: return ClipboardList;
    }
  };

  const getTypeColor = (taskType: TaskType) => {
    switch (taskType) {
      case 'sms': return 'text-blue-600';
      case 'callback': return 'text-green-600';
      case 'followup': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const availableTaskTypes: TaskType[] = ['sms', 'callback', 'followup'];

  const formatDateLabel = (date: string) => {
    return formatDateLabelUtil(date);
  };

  const hasAnyInput = title.trim() !== '' || description.trim() !== '' || type !== 'followup' || backgroundColor !== null || scheduledDate !== initialScheduledDate;

  const handleClearAll = useCallback(() => {
    setTitle('');
    setDescription('');
    setType('followup');
    setScheduledDate(initialScheduledDate);
    setIsLinkedToRoom(false);
    setBackgroundColor(null);
    titleInputRef.current?.focus();
  }, [initialScheduledDate]);

  const TypeIcon = getTypeIcon(type);

  return (
    <div
      ref={containerRef}
      className={`bg-white border-b border-gray-200 ${parentId ? 'ml-8' : ''} relative`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex-shrink-0 mt-1">
          <Circle size={18} className="text-gray-300" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="제목"
              className="flex-1 size-sm font-medium text-gray-900 placeholder-gray-400 outline-none bg-transparent border-b border-transparent focus:border-blue-400 transition-colors duration-200 pb-0.5"
            />
            {hasAnyInput && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all duration-150 active:scale-95"
                title="입력 초기화"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="px-2.5 py-1 size-xs text-blue-600 hover:text-white hover:bg-blue-500 rounded transition-all duration-150 font-medium active:scale-95"
            >
              저장
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="px-2 py-1 size-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-all duration-150 active:scale-95"
            >
              취소
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <AlignLeft size={14} />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="세부 정보"
              className="flex-1 size-xs text-gray-600 placeholder-gray-400 outline-none bg-transparent border-b border-transparent focus:border-blue-300 transition-colors duration-200 pb-0.5"
            />
          </div>

          {selectedRoom && (
            <div className="flex items-center gap-2 py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isLinkedToRoom}
                  onChange={(e) => setIsLinkedToRoom(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="size-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                  현재 선택된 컨택룸에 연결 ({selectedRoom.conversationTopic})
                </span>
              </label>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={setDateToday}
              className={`px-2.5 py-1 size-xs rounded border transition-colors ${
                scheduledDate === todayDate
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              오늘
            </button>
            <button
              onClick={setDateTomorrow}
              className={`px-2.5 py-1 size-xs rounded border transition-colors ${
                scheduledDate === tomorrowDate
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              내일
            </button>
            <button
              onClick={() => setShowDatePickerModal(true)}
              className={`px-2 py-1 size-xs rounded border transition-colors flex items-center gap-1 ${
                scheduledDate && scheduledDate !== todayDate && scheduledDate !== tomorrowDate
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar size={12} />
              {scheduledDate && scheduledDate !== todayDate && scheduledDate !== tomorrowDate
                ? formatDateLabel(scheduledDate)
                : '다른 날짜'}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 size-xs rounded border transition-colors ${getTypeColor(type)} border-gray-300 hover:bg-gray-50`}
                >
                  <TypeIcon size={14} />
                  <span>{TASK_TYPES[type].label}</span>
                  <ChevronDown size={12} />
                </button>

                {showTypeDropdown && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] z-10 animate-in fade-in-0 zoom-in-95 duration-150">
                    {availableTaskTypes.map((taskType) => {
                      const Icon = getTypeIcon(taskType);
                      return (
                        <button
                          key={taskType}
                          onClick={() => {
                            setType(taskType);
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 size-xs hover:bg-gray-50 transition-colors ${type === taskType ? 'bg-gray-50' : ''
                            } ${getTypeColor(taskType)}`}
                        >
                          <Icon size={14} />
                          <span>{TASK_TYPES[taskType].label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative" ref={colorDropdownRef}>
                <button
                  onClick={() => setShowColorDropdown(!showColorDropdown)}
                  className="flex items-center gap-1 px-2 py-1 size-xs rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${backgroundColor && TASK_COLORS[backgroundColor] ? TASK_COLORS[backgroundColor].dot : 'bg-white border border-gray-300'}`} />
                  <ChevronDown size={12} />
                </button>

                {showColorDropdown && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] z-10 p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="flex items-center gap-1.5">
                      {Object.entries(TASK_COLORS).map(([key, color]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setBackgroundColor(key === 'white' ? null : key);
                            setShowColorDropdown(false);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${color.dot} ${
                            (backgroundColor === key || (!backgroundColor && key === 'white'))
                              ? 'border-blue-500 scale-110'
                              : 'border-transparent hover:border-gray-400'
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {extraActions && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              {extraActions}
            </div>
          )}
        </div>
      </div>

      <DatePickerModal
        isOpen={showDatePickerModal}
        selectedDate={scheduledDate}
        onSelect={setScheduledDate}
        onClose={() => setShowDatePickerModal(false)}
      />
    </div>
  );
};

export default TaskInlineEditor;
