import React, { useState } from 'react';
import { Check, Circle, MoreVertical, Star, Pin, Calendar, Clock, Plus, Trash2, MessageSquare, Phone, ClipboardList, Bell, Link2, Palette } from 'lucide-react';
import { Task, TaskType, TASK_TYPES, TASK_COLORS, EditFocusTarget } from '../types/task';
import { formatDateLabel, formatDeadlineLabel } from '../utils/taskEditUtils';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';

interface TaskViewModeProps {
  task: Task;
  isHovered: boolean;
  isSubtask: boolean;
  showOptionsMenu: boolean;
  optionsMenuRef: React.RefObject<HTMLDivElement>;
  onToggleComplete: () => void;
  onToggleLike: () => void;
  onTogglePin: () => void;
  onStartEdit: (focusTarget: EditFocusTarget) => void;
  onOpenDatePicker: () => void;
  onOpenDeadlinePicker: () => void;
  onToggleOptionsMenu: () => void;
  onAddSubtask: () => void;
  onDelete: () => void;
  onChangeBackgroundColor: (color: string | null) => void;
  onNoticeClick?: (task: Task) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
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

const TaskViewMode: React.FC<TaskViewModeProps> = ({
  task,
  isHovered,
  isSubtask,
  showOptionsMenu,
  optionsMenuRef,
  onToggleComplete,
  onToggleLike,
  onTogglePin,
  onStartEdit,
  onOpenDatePicker,
  onOpenDeadlinePicker,
  onToggleOptionsMenu,
  onAddSubtask,
  onDelete,
  onChangeBackgroundColor,
  onNoticeClick,
  onMouseEnter,
  onMouseLeave,
  onNavigateToRoom,
}) => {
  const { isManager } = useAuth();
  const { api } = useTaskContext();
  const [showColorSubmenu, setShowColorSubmenu] = useState(false);
  const isCompleted = task.status === 'completed';
  const isDelayed = task.status === 'delayed';
  const TypeIcon = getTypeIcon(task.type);

  const handleTitleClick = (e: React.MouseEvent) => {
    if (task.type === 'notice') {
      return;
    }
    e.stopPropagation();
    onStartEdit('title');
  };

  const handleDescriptionClick = (e: React.MouseEvent) => {
    if (task.type === 'notice') {
      return;
    }
    e.stopPropagation();
    onStartEdit('description');
  };

  const handleDateRowClick = (e: React.MouseEvent) => {
    if (task.type === 'notice') {
      return;
    }
    e.stopPropagation();
    onStartEdit('title');
  };

  const handleDateButtonClick = (e: React.MouseEvent) => {
    if (task.type === 'notice') {
      return;
    }
    e.stopPropagation();
    onOpenDatePicker();
  };

  const handleDeadlineButtonClick = (e: React.MouseEvent) => {
    if (task.type === 'notice') {
      return;
    }
    e.stopPropagation();
    onOpenDeadlinePicker();
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.type === 'notice' && !task.isRead) {
      return;
    }
    onToggleComplete();
  };

  return (
    <div
      className={`${task.backgroundColor && TASK_COLORS[task.backgroundColor] ? TASK_COLORS[task.backgroundColor].bg : task.type === 'notice' ? 'bg-violet-50/60' : 'bg-white'} border-b border-gray-200 transition-[background-color,opacity] duration-150 ${isSubtask ? 'ml-8' : ''} ${isHovered && !task.backgroundColor && task.type !== 'notice' ? 'bg-gray-50/80' : ''} ${task.type === 'notice' && task.isRead ? 'opacity-60' : ''} relative`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (task.type !== 'notice') {
          e.stopPropagation();
          onStartEdit('title');
        }
      }}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <button
          onClick={handleCheckboxClick}
          className={`flex-shrink-0 mt-0.5 ${task.type === 'notice'
            ? task.isRead
              ? 'cursor-pointer'
              : 'cursor-default'
            : 'cursor-pointer'
            }`}
        >
          {task.type === 'notice' ? (
            task.isRead ? (
              <div className="w-[18px] h-[18px] rounded-full bg-violet-400 flex items-center justify-center transition-colors duration-200">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <Circle size={18} className="text-violet-400 transition-colors duration-200 hover:text-violet-500" />
            )
          ) : isCompleted ? (
            <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center transition-colors duration-200">
              <Check size={12} className="text-white" strokeWidth={3} />
            </div>
          ) : (
            <Circle size={18} className={`${isDelayed ? 'text-orange-400' : 'text-gray-300'} hover:text-blue-400 transition-colors duration-200`} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            className="cursor-pointer"
            onClick={handleTitleClick}
          >
            <div className="flex items-start gap-2">
              <span className={`flex-1 min-w-0 size-sm font-medium ${isCompleted && task.type !== 'notice' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </span>
              {task.type !== 'notice' && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <div className={`relative transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`} ref={optionsMenuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleOptionsMenu();
                      }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showOptionsMenu && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleOptionsMenu();
                            if (task.deadline) {
                              onOpenDeadlinePicker();
                            } else {
                              onOpenDeadlinePicker();
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 size-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Clock size={14} />
                          <span>마감일 {task.deadline ? '수정' : '추가'}</span>
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
                                    onChangeBackgroundColor(key === 'white' ? null : key);
                                    setShowColorSubmenu(false);
                                    onToggleOptionsMenu();
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 transition-all ${color.dot} ${
                                    (task.backgroundColor === key || (!task.backgroundColor && key === 'white'))
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
                    className={`p-1.5 rounded transition-[color,opacity,background-color,transform] duration-200 active:scale-90 ${task.pinned
                      ? 'text-blue-500 hover:text-blue-600 opacity-100'
                      : isHovered
                        ? 'text-gray-400 hover:text-blue-500 hover:bg-gray-100 opacity-100'
                        : 'text-gray-400 opacity-0'
                      }`}
                  >
                    <Pin size={16} fill={task.pinned ? 'currentColor' : 'none'} className={`transition-transform duration-200 ${task.pinned ? 'rotate-[30deg]' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike();
                    }}
                    className={`p-1.5 rounded transition-[color,opacity,background-color,transform] duration-200 active:scale-90 ${task.liked
                      ? 'text-amber-500 hover:text-amber-600 opacity-100'
                      : isHovered
                        ? 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 opacity-100'
                        : 'text-gray-400 opacity-0'
                      }`}
                  >
                    <Star size={16} fill={task.liked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p
              className={`size-xs mt-0.5 cursor-pointer ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}
              onClick={handleDescriptionClick}
            >
              {task.description}
            </p>
          )}

          <div
            className="flex items-center gap-2 mt-1.5 flex-wrap"
            onClick={handleDateRowClick}
          >
            {task.scheduledDate && (
              <button
                onClick={handleDateButtonClick}
                className={`px-2 py-0.5 size-xs rounded flex items-center gap-1 transition-all duration-150 ${isDelayed && !isCompleted && !task.deadline
                  ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100'
                  : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
              >
                <Calendar size={11} />
                <span>{formatDateLabel(task.scheduledDate)}</span>
              </button>
            )}
            {task.deadline && (
              <button
                onClick={handleDeadlineButtonClick}
                className={`px-2 py-0.5 size-xs rounded flex items-center gap-1 transition-all duration-150 ${isDelayed && !isCompleted
                  ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100'
                  : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Clock size={11} />
                <span>{formatDeadlineLabel(task.deadline)}</span>
              </button>
            )}
            <span className={`flex items-center gap-1 size-xs ${getTypeColor(task.type)}`}>
              <TypeIcon size={12} />
              {TASK_TYPES[task.type].label}
            </span>
            {task.roomId && (
              <div
                className="p-1 rounded hover:bg-blue-100 text-blue-500 transition-colors cursor-pointer"
                title="컨택룸 연결됨"
                onClick={(e) => {
                  e.stopPropagation();
                  if (task.type === 'notice' && onNoticeClick) {
                    onNoticeClick(task);
                    return;
                  }
                  if (onNavigateToRoom && task.roomId) {
                    onNavigateToRoom(task.roomId, task.messageId);
                    return;
                  }
                  if (onNoticeClick && task.roomId) {
                    onNoticeClick(task);
                  }
                }}
              >
                <Link2 size={14} />
              </div>
            )}
            {task.type === 'notice' && isManager && (
              <span className="size-xs text-gray-500 font-medium ml-auto pr-2">
                {api.getNoticeReadStats(task).read}/{api.getNoticeReadStats(task).total}명 읽음
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskViewMode;
