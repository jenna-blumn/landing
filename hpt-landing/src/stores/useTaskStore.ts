import { create } from 'zustand';
import { LocalStorageTaskApi } from '../../packages/task-module/src/api/LocalStorageTaskApi';
import { getReferenceSettings } from '../features/referenceSettings/api/referenceSettingsApi';
import { ReferenceSettings } from '../features/referenceSettings/types';
import type { Task } from '../../packages/task-module/src/types/task';

// useTaskStore 전용 API 인스턴스 (standalone 함수 대체)
const taskApi = new LocalStorageTaskApi('default-user');

interface TaskStoreState {
  // Drawer state
  isTaskDrawerOpen: boolean;
  taskDrawerInitialIsAddingTask: boolean;
  taskDrawerInitialLinked: boolean;
  taskDrawerKey: number;

  // Stats
  noticeTaskCount: number;
  pendingTaskCount: number;
  delayedTaskCount: number;
  likedTaskCount: number;
  isTaskStatsLoading: boolean;
  taskStatsError: string | null;

  // Reference settings (task button related)
  isReferenceSettingsLoading: boolean;
  referenceSettingsError: string | null;
  taskButtonDisplayMode: 'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed';
  taskButtonFixedHeight: number;

  // Task detail view
  isTaskDetailViewActive: boolean;
  selectedTaskForDetail: Task | null;
  taskDetailInitialMode: 'view' | 'create_notice';
  calendarViewMode: 'compact' | 'expanded';
  sharedDateRange: { start: string; end: string } | null;
  pendingOverlayRequest: { task: Task; source: 'compact' | 'expanded' } | null;
}

interface TaskStoreActions {
  // Drawer actions
  openTaskDrawer: () => void;
  closeTaskDrawer: () => void;
  closeTaskDrawerWithPosition: (drawerSide: 'left' | 'right', drawerRect: { left: number; bottom: number; width: number; height: number }) => void;
  openTaskDrawerForCreation: (linked?: boolean) => void;

  // Detail view actions
  openTaskDetailView: (task?: Task) => void;
  openNoticeCreation: () => void;
  closeTaskDetailView: () => void;
  linkContactFromDetail: () => void;

  // Calendar actions
  toggleCalendarView: (mode: 'compact' | 'expanded') => void;
  setExpandedTaskSelect: (task: Task) => void;
  requestCompactDetail: (task: Task) => void;
  handleOverlayRequestHandled: () => void;
  returnToExpandedFromOverlay: () => void;
  setSharedDateRange: (range: { start: string; end: string } | null) => void;

  // Settings
  handleReferenceSettingsChange: (settings: ReferenceSettings) => void;

  // Data loading
  loadTaskStats: () => Promise<void>;
  loadReferenceSettings: () => Promise<void>;
  startStatsPolling: () => () => void;
}

export const useTaskStore = create<TaskStoreState & TaskStoreActions>((set, get) => ({
  // Initial state
  isTaskDrawerOpen: false,
  taskDrawerInitialIsAddingTask: false,
  taskDrawerInitialLinked: false,
  taskDrawerKey: 0,

  noticeTaskCount: 0,
  pendingTaskCount: 0,
  delayedTaskCount: 0,
  likedTaskCount: 0,
  isTaskStatsLoading: true,
  taskStatsError: null,

  isReferenceSettingsLoading: true,
  referenceSettingsError: null,
  taskButtonDisplayMode: 'gnb',
  taskButtonFixedHeight: 300,

  isTaskDetailViewActive: false,
  selectedTaskForDetail: null,
  taskDetailInitialMode: 'view',
  calendarViewMode: 'compact',
  sharedDateRange: null,
  pendingOverlayRequest: null,

  // Actions
  openTaskDrawer: () => set({ isTaskDrawerOpen: true }),

  closeTaskDrawer: () => set({
    isTaskDrawerOpen: false,
    taskDrawerInitialIsAddingTask: false,
    taskDrawerInitialLinked: false,
  }),

  closeTaskDrawerWithPosition: (drawerSide, drawerRect) => {
    const BUTTON_WIDTH = 180;
    const BUTTON_HEIGHT = 44;

    let newX: number;
    if (drawerSide === 'right') {
      newX = drawerRect.left + drawerRect.width - BUTTON_WIDTH;
    } else {
      newX = drawerRect.left;
    }

    const newY = window.innerHeight - drawerRect.bottom - BUTTON_HEIGHT;
    localStorage.setItem('taskFloatingButtonPosition', JSON.stringify({ x: newX, y: newY }));

    set({
      isTaskDrawerOpen: false,
      taskDrawerInitialIsAddingTask: false,
      taskDrawerInitialLinked: false,
    });
  },

  openTaskDrawerForCreation: (linked = false) => {
    set({
      taskDrawerKey: get().taskDrawerKey + 1,
      taskDrawerInitialIsAddingTask: true,
      taskDrawerInitialLinked: linked,
      isTaskDrawerOpen: true,
    });
  },

  openTaskDetailView: (task) => {
    set({
      isTaskDrawerOpen: false,
      selectedTaskForDetail: task || null,
      taskDetailInitialMode: 'view',
      calendarViewMode: 'compact',
      pendingOverlayRequest: null,
      isTaskDetailViewActive: true,
    });
  },

  openNoticeCreation: () => {
    set({
      isTaskDrawerOpen: false,
      selectedTaskForDetail: null,
      taskDetailInitialMode: 'create_notice',
      calendarViewMode: 'compact',
      pendingOverlayRequest: null,
      isTaskDetailViewActive: true,
    });
  },

  closeTaskDetailView: () => {
    set({
      selectedTaskForDetail: null,
      calendarViewMode: 'compact',
      pendingOverlayRequest: null,
      isTaskDetailViewActive: false,
    });
  },

  linkContactFromDetail: () => {
    get().closeTaskDetailView();
    get().openTaskDrawerForCreation(false);
  },

  toggleCalendarView: (mode) => {
    if (mode === 'expanded') {
      set({ pendingOverlayRequest: null, calendarViewMode: mode });
    } else {
      set({ calendarViewMode: mode });
    }
  },

  setExpandedTaskSelect: (task) => {
    set({ selectedTaskForDetail: task });
  },

  requestCompactDetail: (task) => {
    set({
      selectedTaskForDetail: task,
      calendarViewMode: 'compact',
      pendingOverlayRequest: { task, source: 'expanded' },
    });
  },

  handleOverlayRequestHandled: () => {
    set({ pendingOverlayRequest: null });
  },

  returnToExpandedFromOverlay: () => {
    set({
      pendingOverlayRequest: null,
      calendarViewMode: 'expanded',
    });
  },

  setSharedDateRange: (range) => {
    set({ sharedDateRange: range });
  },

  handleReferenceSettingsChange: (settings) => {
    if (settings.taskButton) {
      set({
        taskButtonDisplayMode: settings.taskButton.displayMode,
        taskButtonFixedHeight: settings.taskButton.fixedDrawerHeight,
      });
    } else {
      set({ taskButtonDisplayMode: 'floating' });
    }
  },

  loadTaskStats: async () => {
    try {
      set({ taskStatsError: null });
      const stats = await taskApi.getTaskStats();
      set({
        noticeTaskCount: stats.notice,
        pendingTaskCount: stats.pending,
        delayedTaskCount: stats.delayed,
        likedTaskCount: stats.liked,
      });
    } catch (error) {
      console.error('Failed to load task stats:', error);
      set({ taskStatsError: '할일 통계를 불러오는데 실패했습니다.' });
    } finally {
      set({ isTaskStatsLoading: false });
    }
  },

  loadReferenceSettings: async () => {
    try {
      set({ referenceSettingsError: null });
      const settings = await getReferenceSettings();
      if (settings.taskButton) {
        set({
          taskButtonDisplayMode: settings.taskButton.displayMode,
          taskButtonFixedHeight: settings.taskButton.fixedDrawerHeight,
        });
      }
    } catch (error) {
      console.error('Failed to load reference settings:', error);
      set({ referenceSettingsError: '참조영역 설정을 불러오는데 실패했습니다.' });
    } finally {
      set({ isReferenceSettingsLoading: false });
    }
  },

  startStatsPolling: () => {
    get().loadTaskStats();
    let interval = setInterval(() => get().loadTaskStats(), 30000);

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        get().loadTaskStats();
        interval = setInterval(() => get().loadTaskStats(), 30000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  },
}));
