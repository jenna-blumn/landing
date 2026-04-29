import { useState, useCallback, useRef, useEffect } from 'react';
import { Task, TaskType, EditFocusTarget } from '../types/task';

interface UseTaskEditProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onEditStart?: () => void;
  onEditEnd?: () => void;
}

interface UseTaskEditReturn {
  isEditing: boolean;
  editFocusTarget: EditFocusTarget;
  editTitle: string;
  editDescription: string;
  editType: TaskType;
  editDate: string | null;
  editDeadline: string | null;
  editBackgroundColor: string | null;
  titleInputRef: React.RefObject<HTMLInputElement>;
  descriptionInputRef: React.RefObject<HTMLInputElement>;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditType: (value: TaskType) => void;
  setEditDate: (value: string | null) => void;
  setEditDeadline: (value: string | null) => void;
  setEditBackgroundColor: (value: string | null) => void;
  startEdit: (focusTarget: EditFocusTarget) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const useTaskEdit = ({ task, onUpdate, onEditStart, onEditEnd }: UseTaskEditProps): UseTaskEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFocusTarget, setEditFocusTarget] = useState<EditFocusTarget>('title');
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editType, setEditType] = useState<TaskType>(task.type);
  const [editDate, setEditDate] = useState<string | null>(task.scheduledDate);
  const [editDeadline, setEditDeadline] = useState<string | null>(task.deadline);
  const [editBackgroundColor, setEditBackgroundColor] = useState<string | null>(task.backgroundColor);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditType(task.type);
    setEditDate(task.scheduledDate);
    setEditDeadline(task.deadline);
    setEditBackgroundColor(task.backgroundColor);
  }, [task]);

  useEffect(() => {
    if (isEditing) {
      if (editFocusTarget === 'title' && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (editFocusTarget === 'description' && descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      }
    }
  }, [isEditing, editFocusTarget]);

  const startEdit = useCallback((focusTarget: EditFocusTarget) => {
    setEditFocusTarget(focusTarget);
    setIsEditing(true);
    onEditStart?.();
  }, [onEditStart]);

  const saveEdit = useCallback(() => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        type: editType,
        scheduledDate: editDate,
        deadline: editDeadline,
        backgroundColor: editBackgroundColor,
      });
    }
    setIsEditing(false);
    onEditEnd?.();
  }, [task.id, editTitle, editDescription, editType, editDate, editDeadline, editBackgroundColor, onUpdate, onEditEnd]);

  const cancelEdit = useCallback(() => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditType(task.type);
    setEditDate(task.scheduledDate);
    setEditDeadline(task.deadline);
    setEditBackgroundColor(task.backgroundColor);
    setIsEditing(false);
    onEditEnd?.();
  }, [task, onEditEnd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  return {
    isEditing,
    editFocusTarget,
    editTitle,
    editDescription,
    editType,
    editDate,
    editDeadline,
    editBackgroundColor,
    titleInputRef,
    descriptionInputRef,
    setEditTitle,
    setEditDescription,
    setEditType,
    setEditDate,
    setEditDeadline,
    setEditBackgroundColor,
    startEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
  };
};
