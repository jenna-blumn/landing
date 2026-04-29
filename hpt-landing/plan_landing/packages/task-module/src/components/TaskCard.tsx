import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, EditFocusTarget } from '../types/task';
import { useTaskEdit } from '../hooks/useTaskEdit';
import { useTaskContext } from '../context/TaskContext';
import TaskViewMode from './TaskViewMode';
import TaskEditMode from './TaskEditMode';
import TaskInlineEditor from './TaskInlineEditor';
import DatePickerModal from './DatePickerModal';

interface TaskCardProps {
  task: Task;
  subtasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onToggleLike: (taskId: string) => void;
  onTogglePin: (taskId: string) => void;
  onToggleNoticeRead?: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onAddSubtask: (input: CreateTaskInput) => void;
  onNoticeClick?: (task: Task) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  isSubtask?: boolean;
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
}

type DatePickerTarget = 'date' | 'deadline';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  subtasks,
  onToggleComplete,
  onToggleLike,
  onTogglePin,
  onToggleNoticeRead,
  onUpdate,
  onDelete,
  onAddSubtask,
  onNoticeClick,
  onEditStart,
  onEditEnd,
  isSubtask = false,
  onNavigateToRoom,
}) => {
  const { selectedRoom } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>('date');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const {
    isEditing,
    editFocusTarget,
    editTitle,
    editDescription,
    editType,
    editDate,
    editDeadline,
    titleInputRef,
    descriptionInputRef,
    setEditTitle,
    setEditDescription,
    setEditType,
    setEditDate,
    setEditDeadline,
    editBackgroundColor,
    setEditBackgroundColor,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
  } = useTaskEdit({ task, onUpdate, onEditStart, onEditEnd });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleComplete = useCallback(() => {
    if (task.type === 'notice') {
      if (onToggleNoticeRead) {
        onToggleNoticeRead(task.id);
      }
      return;
    }
    onToggleComplete(task.id);
  }, [task.id, task.type, onToggleComplete, onToggleNoticeRead]);

  const handleToggleLike = useCallback(() => {
    onToggleLike(task.id);
  }, [task.id, onToggleLike]);

  const handleTogglePin = useCallback(() => {
    onTogglePin(task.id);
  }, [task.id, onTogglePin]);

  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  const handleStartEdit = useCallback((focusTarget: EditFocusTarget) => {
    if (task.type === 'notice') {
      return;
    }
    startEdit(focusTarget);
  }, [startEdit, task.type]);

  const handleOpenDatePicker = useCallback(() => {
    setDatePickerTarget('date');
    setShowDatePickerModal(true);
  }, []);

  const handleOpenDeadlinePicker = useCallback(() => {
    setDatePickerTarget('deadline');
    setShowDatePickerModal(true);
  }, []);

  const handleDateSelect = useCallback((date: string | null) => {
    if (datePickerTarget === 'date') {
      if (isEditing) {
        setEditDate(date);
      } else {
        onUpdate(task.id, { scheduledDate: date });
      }
    } else {
      if (isEditing) {
        setEditDeadline(date);
      } else {
        onUpdate(task.id, { deadline: date });
      }
    }
  }, [datePickerTarget, isEditing, setEditDate, setEditDeadline, onUpdate, task.id]);

  const handleAddSubtaskSave = useCallback((input: CreateTaskInput) => {
    onAddSubtask(input);
    setIsAddingSubtask(false);
  }, [onAddSubtask]);

  const handleToggleOptionsMenu = useCallback(() => {
    setShowOptionsMenu(prev => !prev);
  }, []);

  const handleAddSubtask = useCallback(() => {
    setIsAddingSubtask(true);
  }, []);

  const handleChangeBackgroundColor = useCallback((color: string | null) => {
    onUpdate(task.id, { backgroundColor: color });
  }, [task.id, onUpdate]);

  const currentDateForPicker = datePickerTarget === 'date'
    ? (isEditing ? editDate : task.scheduledDate)
    : (isEditing ? editDeadline : task.deadline);

  return (
    <>
      {isEditing ? (
        <TaskEditMode
          task={task}
          isSubtask={isSubtask}
          editFocusTarget={editFocusTarget}
          editTitle={editTitle}
          editDescription={editDescription}
          editType={editType}
          editDate={editDate}
          editDeadline={editDeadline}
          titleInputRef={titleInputRef}
          descriptionInputRef={descriptionInputRef}
          showOptionsMenu={showOptionsMenu}
          optionsMenuRef={optionsMenuRef}
          onToggleComplete={handleToggleComplete}
          onToggleLike={handleToggleLike}
          onTogglePin={handleTogglePin}
          editBackgroundColor={editBackgroundColor}
          onSetEditBackgroundColor={setEditBackgroundColor}
          onSetEditTitle={setEditTitle}
          onSetEditDescription={setEditDescription}
          onSetEditType={setEditType}
          onSetEditDate={setEditDate}
          onSetEditDeadline={setEditDeadline}
          onKeyDown={handleKeyDown}
          onSave={saveEdit}
          onCancel={cancelEdit}
          onOpenDatePicker={handleOpenDatePicker}
          onOpenDeadlinePicker={handleOpenDeadlinePicker}
          onToggleOptionsMenu={handleToggleOptionsMenu}
          onAddSubtask={handleAddSubtask}
          onDelete={handleDelete}
        />
      ) : (
        <TaskViewMode
          task={task}
          isHovered={isHovered}
          isSubtask={isSubtask}
          showOptionsMenu={showOptionsMenu}
          optionsMenuRef={optionsMenuRef}
          onToggleComplete={handleToggleComplete}
          onToggleLike={handleToggleLike}
          onTogglePin={handleTogglePin}
          onStartEdit={handleStartEdit}
          onOpenDatePicker={handleOpenDatePicker}
          onOpenDeadlinePicker={handleOpenDeadlinePicker}
          onToggleOptionsMenu={handleToggleOptionsMenu}
          onAddSubtask={handleAddSubtask}
          onDelete={handleDelete}
          onChangeBackgroundColor={handleChangeBackgroundColor}
          onNoticeClick={onNoticeClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onNavigateToRoom={onNavigateToRoom}
        />
      )}

      <DatePickerModal
        isOpen={showDatePickerModal}
        selectedDate={currentDateForPicker}
        onSelect={handleDateSelect}
        onClose={() => setShowDatePickerModal(false)}
      />

      {(subtasks.length > 0 || isAddingSubtask) && (
        <div onClick={(e) => e.stopPropagation()}>
          {subtasks.map((subtask) => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              subtasks={[]}
              onToggleComplete={onToggleComplete}
              onToggleLike={onToggleLike}
              onTogglePin={onTogglePin}
              onToggleNoticeRead={onToggleNoticeRead}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              onNoticeClick={onNoticeClick}
              onNavigateToRoom={onNavigateToRoom}
              isSubtask={true}
            />
          ))}

          {isAddingSubtask && (
            <TaskInlineEditor
              onSave={handleAddSubtaskSave}
              onCancel={() => setIsAddingSubtask(false)}
              parentId={task.id}
              selectedRoom={selectedRoom}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TaskCard;
