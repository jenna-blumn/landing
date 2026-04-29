import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Task, TaskStats, CreateTaskInput } from '../types/task';
import type { TaskModuleConfig, TaskModuleCallbacks } from '../types/module';
import type { AuthConfig } from '../types/auth';
import type { RoomRef } from '../types/room';
import type { ITaskApi } from '../api/ITaskApi';
import type { IConsultantApi } from '../api/IConsultantApi';

export interface TaskContextValue {
  // Stats
  stats: TaskStats;
  isStatsLoading: boolean;
  statsError: string | null;
  refreshStats: () => Promise<void>;

  // Drawer
  isDrawerOpen: boolean;
  openDrawer: (options?: { isAddingTask?: boolean; linked?: boolean }) => void;
  closeDrawer: (drawerSide?: string, drawerRect?: DOMRect) => void;
  drawerInitialIsAddingTask: boolean;
  drawerInitialLinked: boolean;

  // Floating button
  buttonPosition: { x: number; y: number };
  setButtonPosition: (pos: { x: number; y: number }) => void;
  buttonRect: DOMRect | null;
  setButtonRect: (rect: DOMRect | null) => void;
  buttonDisplayMode: 'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed';
  buttonFixedHeight: number;
  setButtonDisplayMode: (mode: 'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed') => void;
  setButtonFixedHeight: (height: number) => void;

  // Badge (unseen changes)
  unseenChanges: { notice: boolean; pending: boolean; delayed: boolean; total: number };

  // Detail view
  isDetailViewActive: boolean;
  selectedTaskForDetail: Task | null;
  detailInitialMode: 'view' | 'create_notice';
  calendarViewMode: 'compact' | 'expanded';
  sharedDateRange: { start: string; end: string } | null;
  setSharedDateRange: (range: { start: string; end: string } | null) => void;
  pendingOverlayRequest: { task: Task; source: 'compact' | 'expanded' } | null;

  // Detail view actions
  openDetailView: (task?: Task) => void;
  openNoticeCreation: () => void;
  closeDetailView: () => void;
  toggleCalendarView: (mode: 'compact' | 'expanded') => void;
  setExpandedTaskSelect: (task: Task) => void;
  requestCompactDetail: (task: Task) => void;
  handleOverlayRequestHandled: () => void;
  returnToExpandedFromOverlay: () => void;
  handleNoticeClick: (task: Task) => void;

  // API
  api: ITaskApi;
  consultantApi: IConsultantApi;

  // Auth
  auth: AuthConfig;
  isManager: boolean;

  // Module config
  config: TaskModuleConfig;
  callbacks: TaskModuleCallbacks;

  // Rooms
  selectedRoom: RoomRef | null;
  allRooms: RoomRef[];

  // Prefill (bubble-to-task)
  prefillData: CreateTaskInput | null;
  clearPrefill: () => void;

  // Focus linked task (badge click → open drawer with task focused)
  focusMessageId: number | null;
  clearFocusMessage: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const BUTTON_WIDTH = 180;
const BUTTON_HEIGHT = 44;

interface TaskProviderProps {
  api: ITaskApi;
  consultantApi: IConsultantApi;
  auth: AuthConfig;
  config: TaskModuleConfig;
  callbacks?: TaskModuleCallbacks;
  selectedRoom?: RoomRef | null;
  allRooms?: RoomRef[];
  prefillData?: CreateTaskInput | null;
  focusMessageRequest?: { messageId: number; nonce: number } | null;
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({
  api,
  consultantApi,
  auth,
  config,
  callbacks = {},
  selectedRoom = null,
  allRooms = [],
  prefillData: externalPrefillData = null,
  focusMessageRequest: externalFocusMessageRequest = null,
  children,
}) => {
  // ── Stats ──────────────────────────────────────────────────────
  const [stats, setStats] = useState<TaskStats>({ notice: 0, pending: 0, delayed: 0, liked: 0, completed: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setStatsError(null);
      const taskStats = await api.getTaskStats();
      setStats(taskStats);
    } catch (error) {
      console.error('Failed to load task stats:', error);
      setStatsError('\uD560\uC77C \uD1B5\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uB370 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.');
    } finally {
      setIsStatsLoading(false);
    }
  }, [api]);

  // Initial load + periodic refresh
  useEffect(() => {
    refreshStats();
    const intervalMs = config.statsRefreshIntervalMs ?? 30000;
    const interval = setInterval(refreshStats, intervalMs);
    return () => clearInterval(interval);
  }, [refreshStats, config.statsRefreshIntervalMs]);

  // Listen for API events
  useEffect(() => {
    const unsubscribe = api.onTasksUpdated(() => {
      refreshStats();
    });
    return unsubscribe;
  }, [api, refreshStats]);

  // ── Drawer ─────────────────────────────────────────────────────
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerInitialIsAddingTask, setDrawerInitialIsAddingTask] = useState(false);
  const [drawerInitialLinked, setDrawerInitialLinked] = useState(false);

  const openDrawer = useCallback((options?: { isAddingTask?: boolean; linked?: boolean }) => {
    if (isDrawerOpen && options) {
      setIsDrawerOpen(false);
      setTimeout(() => {
        setDrawerInitialIsAddingTask(options.isAddingTask ?? false);
        setDrawerInitialLinked(options.linked ?? false);
        setIsDrawerOpen(true);
      }, 0);
    } else {
      setDrawerInitialIsAddingTask(options?.isAddingTask ?? false);
      setDrawerInitialLinked(options?.linked ?? false);
      setIsDrawerOpen(true);
    }
    callbacks.onDrawerOpenChange?.(true);
  }, [isDrawerOpen, callbacks]);

  const closeDrawer = useCallback((drawerSide?: string, drawerRect?: DOMRect) => {
    if (drawerRect) {
      let newX: number;
      if (drawerSide === 'right') {
        newX = drawerRect.left + drawerRect.width - BUTTON_WIDTH;
      } else {
        newX = drawerRect.left;
      }
      const newY = window.innerHeight - drawerRect.bottom - BUTTON_HEIGHT;
      setButtonPositionState({ x: newX, y: newY });
      localStorage.setItem('taskFloatingButtonPosition', JSON.stringify({ x: newX, y: newY }));
    }
    // Save current stats as last-seen snapshot (badge reset)
    const snapshot = { notice: stats.notice, pending: stats.pending, delayed: stats.delayed };
    setLastSeenStats(snapshot);
    localStorage.setItem(LAST_SEEN_STATS_KEY, JSON.stringify(snapshot));

    setIsDrawerOpen(false);
    setDrawerInitialIsAddingTask(false);
    setDrawerInitialLinked(false);
    callbacks.onDrawerOpenChange?.(false);
  }, [callbacks, stats]);

  // ── Prefill (bubble-to-task) ───────────────────────────────────
  const [internalPrefillData, setInternalPrefillData] = useState<CreateTaskInput | null>(externalPrefillData);

  // Sync external prefillData → internal state + auto-open drawer
  useEffect(() => {
    if (externalPrefillData) {
      setInternalPrefillData(externalPrefillData);
      // 드로어가 닫혀있으면 즉시 열기 (TaskDrawer는 닫혀있을 때 언마운트되므로 여기서 처리)
      if (!isDrawerOpen) {
        setDrawerInitialIsAddingTask(true);
        setDrawerInitialLinked(false);
        setIsDrawerOpen(true);
      }
      // 드로어가 이미 열려있는 경우: TaskDrawer 내부 useEffect가 setIsAddingTask(true) 처리
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- isDrawerOpen omitted: only react to new prefillData, not drawer state changes
  }, [externalPrefillData]);

  const clearPrefill = useCallback(() => {
    setInternalPrefillData(null);
    callbacks.onPrefillCleared?.();
  }, [callbacks]);

  // ── Focus linked task (badge click) ──────────────────────────
  const [internalFocusMessageId, setInternalFocusMessageId] = useState<number | null>(null);

  useEffect(() => {
    if (externalFocusMessageRequest != null) {
      setInternalFocusMessageId(externalFocusMessageRequest.messageId);
      if (!isDrawerOpen) {
        setDrawerInitialIsAddingTask(false);
        setDrawerInitialLinked(false);
        setIsDrawerOpen(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- isDrawerOpen omitted intentionally to avoid re-triggering when drawer opens
  }, [externalFocusMessageRequest]);

  const clearFocusMessage = useCallback(() => {
    setInternalFocusMessageId(null);
  }, []);

  // ── Button position ────────────────────────────────────────────
  const [buttonPosition, setButtonPositionState] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('taskFloatingButtonPosition');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          x: Math.min(Math.max(0, parsed.x), window.innerWidth - 25),
          y: Math.min(Math.max(0, parsed.y), window.innerHeight - BUTTON_HEIGHT),
        };
      }
    } catch { /* ignore */ }
    return {
      x: window.innerWidth - 220 - 24,
      y: window.innerHeight - BUTTON_HEIGHT - 24,
    };
  });
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [buttonDisplayMode, setButtonDisplayMode] = useState<'floating' | 'fixed' | 'gnb' | 'rnb' | 'sidebar-fixed'>(() => {
    if (config.buttonDisplayMode) return config.buttonDisplayMode;
    try {
      const saved = localStorage.getItem('referenceSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        const mode = parsed?.taskButton?.displayMode;
        if (mode === 'fixed' || mode === 'gnb' || mode === 'rnb' || mode === 'floating' || mode === 'sidebar-fixed') return mode;
      }
    } catch { /* ignore */ }
    return 'gnb';
  });
  const [buttonFixedHeight, setButtonFixedHeight] = useState(() => {
    if (config.buttonFixedHeight) return config.buttonFixedHeight;
    try {
      const saved = localStorage.getItem('referenceSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.taskButton?.fixedDrawerHeight) return parsed.taskButton.fixedDrawerHeight;
      }
    } catch { /* ignore */ }
    return 300;
  });

  const setButtonPosition = useCallback((pos: { x: number; y: number }) => {
    setButtonPositionState(pos);
    localStorage.setItem('taskFloatingButtonPosition', JSON.stringify(pos));
  }, []);

  // ── Badge (unseen changes) ──────────────────────────────────────
  const LAST_SEEN_STATS_KEY = 'taskLastSeenStats';
  const [lastSeenStats, setLastSeenStats] = useState<{ notice: number; pending: number; delayed: number }>(() => {
    try {
      const saved = localStorage.getItem(LAST_SEEN_STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { notice: 0, pending: 0, delayed: 0 };
  });

  const unseenChanges = useMemo(() => {
    const notice = stats.notice > lastSeenStats.notice;
    const pending = stats.pending > lastSeenStats.pending;
    const delayed = stats.delayed > lastSeenStats.delayed;
    const total =
      Math.max(0, stats.notice - lastSeenStats.notice) +
      Math.max(0, stats.pending - lastSeenStats.pending) +
      Math.max(0, stats.delayed - lastSeenStats.delayed);
    return { notice, pending, delayed, total };
  }, [stats, lastSeenStats]);

  // ── Detail view ────────────────────────────────────────────────
  const [isDetailViewActive, setIsDetailViewActive] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [detailInitialMode, setDetailInitialMode] = useState<'view' | 'create_notice'>('view');
  const [calendarViewMode, setCalendarViewMode] = useState<'compact' | 'expanded'>('compact');
  const [sharedDateRange, setSharedDateRange] = useState<{ start: string; end: string } | null>(null);
  const [pendingOverlayRequest, setPendingOverlayRequest] = useState<{ task: Task; source: 'compact' | 'expanded' } | null>(null);

  const openDetailView = useCallback((task?: Task) => {
    setIsDrawerOpen(false);
    setSelectedTaskForDetail(task || null);
    setDetailInitialMode('view');
    setCalendarViewMode('compact');
    setPendingOverlayRequest(null);
    setIsDetailViewActive(true);
    callbacks.onDetailViewOpenChange?.(true);
  }, [callbacks]);

  const openNoticeCreation = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedTaskForDetail(null);
    setDetailInitialMode('create_notice');
    setCalendarViewMode('compact');
    setPendingOverlayRequest(null);
    setIsDetailViewActive(true);
    callbacks.onDetailViewOpenChange?.(true);
  }, [callbacks]);

  const closeDetailView = useCallback(() => {
    setSelectedTaskForDetail(null);
    setCalendarViewMode('compact');
    setPendingOverlayRequest(null);
    setIsDetailViewActive(false);
    callbacks.onDetailViewOpenChange?.(false);
  }, [callbacks]);

  const toggleCalendarView = useCallback((mode: 'compact' | 'expanded') => {
    if (mode === 'expanded') {
      setPendingOverlayRequest(null);
    }
    setCalendarViewMode(mode);
  }, []);

  const setExpandedTaskSelect = useCallback((task: Task) => {
    setSelectedTaskForDetail(task);
  }, []);

  const requestCompactDetail = useCallback((task: Task) => {
    setSelectedTaskForDetail(task);
    setCalendarViewMode('compact');
    setPendingOverlayRequest({ task, source: 'expanded' });
  }, []);

  const handleOverlayRequestHandled = useCallback(() => {
    setPendingOverlayRequest(null);
  }, []);

  const returnToExpandedFromOverlay = useCallback(() => {
    setPendingOverlayRequest(null);
    setCalendarViewMode('expanded');
  }, []);

  const handleNoticeClick = useCallback((task: Task) => {
    openDetailView(task);
  }, [openDetailView]);

  // ── Stable callbacks ref ───────────────────────────────────────
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const value = useMemo<TaskContextValue>(() => ({
    stats,
    isStatsLoading,
    statsError,
    refreshStats,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    drawerInitialIsAddingTask,
    drawerInitialLinked,
    buttonPosition,
    setButtonPosition,
    buttonRect,
    setButtonRect,
    buttonDisplayMode,
    buttonFixedHeight,
    setButtonDisplayMode,
    setButtonFixedHeight,
    unseenChanges,
    isDetailViewActive,
    selectedTaskForDetail,
    detailInitialMode,
    calendarViewMode,
    sharedDateRange,
    setSharedDateRange,
    pendingOverlayRequest,
    openDetailView,
    openNoticeCreation,
    closeDetailView,
    toggleCalendarView,
    setExpandedTaskSelect,
    requestCompactDetail,
    handleOverlayRequestHandled,
    returnToExpandedFromOverlay,
    handleNoticeClick,
    api,
    consultantApi,
    auth,
    isManager: auth.role === 'manager',
    config,
    callbacks: callbacksRef.current,
    selectedRoom,
    allRooms,
    prefillData: internalPrefillData,
    clearPrefill,
    focusMessageId: internalFocusMessageId,
    clearFocusMessage,
  }), [
    stats, isStatsLoading, statsError, refreshStats,
    isDrawerOpen, openDrawer, closeDrawer, drawerInitialIsAddingTask, drawerInitialLinked,
    buttonPosition, setButtonPosition, buttonRect, buttonDisplayMode, buttonFixedHeight, unseenChanges,
    isDetailViewActive, selectedTaskForDetail, detailInitialMode, calendarViewMode,
    sharedDateRange, pendingOverlayRequest,
    openDetailView, openNoticeCreation, closeDetailView, toggleCalendarView,
    setExpandedTaskSelect, requestCompactDetail, handleOverlayRequestHandled,
    returnToExpandedFromOverlay, handleNoticeClick,
    api, consultantApi, auth, config, selectedRoom, allRooms,
    internalPrefillData, clearPrefill,
    internalFocusMessageId, clearFocusMessage,
  ]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within TaskModuleProvider');
  }
  return context;
};
