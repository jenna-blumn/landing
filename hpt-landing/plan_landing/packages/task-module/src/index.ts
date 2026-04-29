// ── Providers ────────────────────────────────────────────────────
export { TaskModuleProvider } from './context/TaskModuleProvider';
export { useTaskContext } from './context/TaskContext';
export { useAuth } from './context/AuthContext';

// ── Components ───────────────────────────────────────────────────
export { default as TaskWidget } from './components/TaskWidget';
export { default as TaskFloatingButton } from './components/TaskFloatingButton';
export { default as TaskNavButton } from './components/TaskNavButton';
export { default as TaskDrawer } from './components/TaskDrawer';
export { default as TaskDetailView } from './components/TaskDetailView';
export { default as TaskCalendar } from './components/TaskCalendar';
export { default as TaskBoard } from './components/TaskBoard';
export { default as TaskCard } from './components/TaskCard';
export { default as TaskViewMode } from './components/TaskViewMode';
export { default as TaskEditMode } from './components/TaskEditMode';
export { default as TaskInlineEditor } from './components/TaskInlineEditor';
export { default as DatePickerModal } from './components/DatePickerModal';
export { default as FullCalendarView } from './components/FullCalendarView';
export { default as DateQuickFilter } from './components/DateQuickFilter';
export { default as NoticeViewer } from './components/NoticeViewer';
export { default as NoticeEditor } from './components/NoticeEditor';
export { default as TargetAudienceSelector } from './components/TargetAudienceSelector';

// ── Types ────────────────────────────────────────────────────────
export type {
  Task,
  TaskType,
  TaskStatus,
  TaskStats,
  CreateTaskInput,
  UpdateTaskInput,
  CreateNoticeInput,
  NoticeReadStatus,
  EditFocusTarget,
} from './types/task';
export { TASK_TYPES, TASK_COLORS, TASK_STATUS } from './types/task';

export type { AuthConfig, UserRole } from './types/auth';
export type { TaskModuleConfig, DisplayMode, TaskModuleCallbacks } from './types/module';
export type { RoomRef } from './types/room';
export type { Consultant, ConsultantGroup } from './types/consultant';

// ── API interfaces ───────────────────────────────────────────────
export type { ITaskApi } from './api/ITaskApi';
export type { IConsultantApi } from './api/IConsultantApi';
export { LocalStorageTaskApi } from './api/LocalStorageTaskApi';
export { HttpTaskApi } from './api/HttpTaskApi';
export { createTaskApi, createConsultantApi } from './api/createApiClient';

// ── Hooks ────────────────────────────────────────────────────────
export { useTaskEdit } from './hooks/useTaskEdit';

// ── Utils ────────────────────────────────────────────────────────
export {
  formatDateLabel,
  formatDeadlineLabel,
  getTodayString,
  getTomorrowString,
  getDatePart,
  hasTime,
} from './utils/taskEditUtils';
