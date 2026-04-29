import React, { useRef, useEffect } from 'react';
import { Check, Circle, Calendar, Clock, AlignLeft, ChevronDown, MessageSquare, Phone, ClipboardList, Bell, X, MoreVertical, Star, Pin, Plus, Trash2, Palette } from 'lucide-react';
import { Task, TaskType, TASK_TYPES, TASK_COLORS, EditFocusTarget } from '../types/task';
import { formatDateLabel, formatDeadlineLabel, getTodayString, getTomorrowString } from '../utils/taskEditUtils';

interface TaskEditModeProps {
  task: Task;
  isSubtask: boolean;
  editFocusTarget: EditFocusTarget;
  editTitle: string;
  editDescription: string;
  editType: TaskType;
  editDate: string | null;
  editDeadline: string | null;
  titleInputRef: React.RefObject<HTMLInputElement>;
  descriptionInputRef: React.RefObject<HTMLInputElement>;
  showOptionsMenu: boolean;
  optionsMenuRef: React.RefObject<HTMLDivElement>;
  onToggleComplete: () => void;
  onToggleLike: () => void;
  onTogglePin: () => void;
  editBackgroundColor: string | null;
  onSetEditBackgroundColor: (value: string | null) => void;
  onSetEditTitle: (value: string) => void;
  onSetEditDescription: (value: string) => void;
  onSetEditType: (value: TaskType) => void;
  onSetEditDate: (value: string | null) => void;
  onSetEditDeadline: (value: string | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSave: () => void;
  onCancel: () => void;
  onOpenDatePicker: () => void;
  onOpenDeadlinePicker: () => void;
  onToggleOptionsMenu: () => void;
  onAddSubtask: () => void;
  onDelete: () => void;
}

const getTypeIcon = (taskType: TaskType) => {
  switch (taskType) {
    case 'sms': return MessageSquare;
    case 'callback': return Phone;
    case 'followup': return ClipboardList;
    case 'notice': return Bell;
  }
};

const getTypeColor = (taskType: TaskType) => {
  switch (taskType) {
    case 'sms': return 'text-blue-600';
    case 'callback': return 'text-green-600';
    case 'followup': return 'text-amber-600';
    case 'notice': return 'text-indigo-600';
  }
};

const TaskEditMode: React.FC<TaskEditModeProps> = ({
  task,
  isSubtask,
  editFocusTarget,
  editTitle,
  editDescription,
  editType,
  editDate,
  editDeadline,
  titleInputRef,
  descriptionInputRef,
  showOptionsMenu,
  optionsMenuRef,
  onToggleComplete,
  onToggleLike,
  onTogglePin,
  editBackgroundColor,
  onSetEditBackgroundColor,
  onSetEditTitle,
  onSetEditDescription,
  onSetEditType,
  onSetEditDate,
  onSetEditDeadline,
  onKeyDown,
  onSave,
  onCancel,
  onOpenDatePicker,
  onOpenDeadlinePicker,
  onToggleOptionsMenu,
  onAddSubtask,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';
  const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
  const [showColorDropdown, setShowColorDropdown] = React.useState(false);
  const [showColorSubmenu, setShowColorSubmenu] = React.useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editFocusTarget === 'title' && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (editFocusTarget === 'description' && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [editFocusTarget, titleInputRef, descriptionInputRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setShowColorDropdown(false);
      }
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSave]);

  const handleInputBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as Node | null;
    if (cardRef.current && relatedTarget && cardRef.current.contains(relatedTarget)) {
      return;
    }
  };

  return (
    <div ref={cardRef} className={`${editBackgroundColor && TASK_COLORS[editBackgroundColor] ? TASK_COLORS[editBackgroundColor].bg : 'bg-white'} border-b border-gray-200 ${isSubtask ? 'ml-8' : ''} relative`}>
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 mt-1"
        >
          {isCompleted ? (
            <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
          ) : (
            <Circle size={18} className="text-gray-300 hover:text-gray-400" />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => onSetEditTitle(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={handleInputBlur}
              className="flex-1 size-sm font-medium text-gray-900 outline-none bg-transparent border-b border-transparent focus:border-blue-400 transition-colors duration-200 pb-0.5"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave();
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
              ref={descriptionInputRef}
              type="text"
              value={editDescription}
              onChange={(e) => onSetEditDescription(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={handleInputBlur}
              placeholder="세부정보"
              className="flex-1 size-xs text-gray-600 placeholder-gray-400 outline-none bg-transparent border-b border-transparent focus:border-blue-300 transition-colors duration-200 pb-0.5"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!editDate ? (
              <>
                <button
                  onClick={() => onSetEditDate(getTodayString())}
                  className="px-2.5 py-1 size-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  오늘
                </button>
                <button
                  onClick={() => onSetEditDate(getTomorrowString())}
                  className="px-2.5 py-1 size-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  내일
                </button>
                <button
                  onClick={onOpenDatePicker}
                  className="p-1.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <Calendar size={14} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenDatePicker}
                  className="px-2.5 py-1 size-xs rounded bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                  <Calendar size={12} />
                  {formatDateLabel(editDate)}
                </button>
                <button
                  onClick={() => onSetEditDate(null)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {editDeadline && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenDeadlinePicker}
                  className="px-2.5 py-1 size-xs rounded bg-gray-100 border border-gray-300 text-gray-700 flex items-center gap-1 hover:bg-gray-200 transition-colors"
                >
                  <Clock size={12} />
                  {formatDeadlineLabel(editDeadline)}
                </button>
                <button
                  onClick={() => onSetEditDeadline(null)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="relative" ref={typeDropdownRef}>
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1 size-xs rounded border transition-colors ${getTypeColor(editType)} border-gray-300 hover:bg-gray-50`}
              >
                {React.createElement(getTypeIcon(editType), { size: 14 })}
                <span>{TASK_TYPES[editType].label}</span>
                <ChevronDown size={12} />
              </button>

              {showTypeDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] z-10 animate-in fade-in-0 zoom-in-95 duration-150">
                  {(Object.keys(TASK_TYPES) as TaskType[]).map((taskType) => {
                    const Icon = getTypeIcon(taskType);
                    return (
                      <button
                        key={taskType}
                        onClick={() => {
                          onSetEditType(taskType);
                          setShowTypeDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 size-xs hover:bg-gray-50 transition-colors ${editType === taskType ? 'bg-gray-50' : ''
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
                <div className={`w-3.5 h-3.5 rounded-full ${editBackgroundColor && TASK_COLORS[editBackgroundColor] ? TASK_COLORS[editBackgroundColor].dot : 'bg-white border border-gray-300'}`} />
                <ChevronDown size={12} />
              </button>

              {showColorDropdown && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] z-10 p-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="flex items-center gap-1.5">
                    {Object.entries(TASK_COLORS).map(([key, color]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onSetEditBackgroundColor(key === 'white' ? null : key);
                          setShowColorDropdown(false);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${color.dot} ${
                          (editBackgroundColor === key || (!editBackgroundColor && key === 'white'))
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

        <div className="hidden">
          <div className="relative" ref={optionsMenuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleOptionsMenu();
              }}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showOptionsMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleOptionsMenu();
                    onOpenDeadlinePicker();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 size-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Clock size={14} />
                  <span>마감일 {editDeadline ? '수정' : '추가'}</span>
                </button>
                {!isSubtask && !task.parentId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleOptionsMenu();
                      onAddSubtask();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 size-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={14} />
                    <span>하위 할 일 추가</span>
                  </button>
                )}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorSubmenu(!showColorSubmenu);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 size-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Palette size={14} />
                    <span>배경색 변경</span>
                  </button>
                  {showColorSubmenu && (
                    <div className="flex items-center gap-1.5 px-3 py-2 border-t border-gray-100">
                      {Object.entries(TASK_COLORS).map(([key, color]) => (
                        <button
                          key={key}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetEditBackgroundColor(key === 'white' ? null : key);
                            setShowColorSubmenu(false);
                            onToggleOptionsMenu();
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${color.dot} ${
                            (editBackgroundColor === key || (!editBackgroundColor && key === 'white'))
                              ? 'border-blue-500 scale-110'
                              : 'border-transparent hover:border-gray-400'
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleOptionsMenu();
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 size-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>삭제</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`p-1.5 rounded transition-colors duration-200 ${task.pinned
              ? 'text-blue-500 hover:text-blue-600'
              : 'text-gray-400 hover:text-blue-500 hover:bg-gray-200'
              }`}
          >
            <Pin size={16} fill={task.pinned ? 'currentColor' : 'none'} className={task.pinned ? 'rotate-[30deg]' : ''} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={`p-1.5 rounded transition-all ${task.liked
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-gray-400 hover:text-amber-500 hover:bg-gray-200'
              }`}
          >
            <Star size={16} fill={task.liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditMode;
