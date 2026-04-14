import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Plus, ClipboardList, Clock, AlertTriangle, CheckCircle, Star, GripVertical, ExternalLink, Bell, Megaphone, ArrowUpDown } from 'lucide-react';
import { Task, TaskType, TaskStats, CreateTaskInput } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from './TaskCard';
import TaskInlineEditor from './TaskInlineEditor';
import DateQuickFilter, { getWeekPreset } from './DateQuickFilter';
import type { RoomRef } from '../types/room';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: (drawerSide: 'left' | 'right', drawerRect: { left: number; bottom: number; width: number; height: number }) => void;
  selectedRoom: RoomRef | null;
  onNavigateToRoom?: (roomId: number, messageId?: number | null) => void;
  allRooms?: RoomRef[];
  buttonPosition: DOMRect | null;
  onOpenDetail?: (task?: Task) => void;
  onNoticeClick?: (task: Task) => void;
  onAddNotice?: () => void;
  initialIsAddingTask?: boolean;
  initialLinked?: boolean;
  mode?: 'floating' | 'embedded';
  onCloseSimple?: () => void;
  openDirection?: 'left' | 'right';
}

type FilterType = 'all' | 'notice' | 'pending' | 'delayed' | 'liked' | 'completed';
type SortType = 'custom' | 'createdAt' | 'deadline' | 'liked' | 'title';

type ResizeType = 'corner' | 'top' | 'left' | 'right' | null;

const TaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  onClose,
  buttonPosition,
  onOpenDetail,
  onNoticeClick,
  onAddNotice,
  onNavigateToRoom,
  selectedRoom,
  initialIsAddingTask = false,
  initialLinked = false,
  mode = 'floating',
  onCloseSimple,
  openDirection,
}) => {
  const { api, prefillData, clearPrefill, focusMessageId, clearFocusMessage, callbacks } = useTaskContext();
  const { isManager } = useAuth();
  const isEmbedded = mode === 'embedded';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ notice: 0, pending: 0, delayed: 0, liked: 0, completed: 0 });
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortType>('custom');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(initialIsAddingTask);
  const [drawerWidth, setDrawerWidth] = useState(378);
  const [drawerHeight, setDrawerHeight] = useState(480);
  const [resizeType, setResizeType] = useState<ResizeType>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<{ left: number; bottom: number } | null>(null);
  const [hasBeenManuallyMoved, setHasBeenManuallyMoved] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showDetailTooltip, setShowDetailTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [embeddedHeight, setEmbeddedHeight] = useState(50); // percentage for embedded mode
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(getWeekPreset);
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const taskCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const drawerRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const hasDraggedRef = useRef(false);

  const loadTasks = useCallback(async () => {
    const loadedTasks = await api.getTasks();
    setTasks(loadedTasks);
    const loadedStats = await api.getTaskStats();
    setStats(loadedStats);
  }, [api]);

  // Ref로 loadTasks 참조 — api 변경 시 open effect 재실행 방지
  const loadTasksRef = useRef(loadTasks);
  loadTasksRef.current = loadTasks;

  useEffect(() => {
    if (isOpen) {
      setSelectedFilter('all');
      setSelectedTaskType('all');
      setSortBy('custom');
      if (!isEmbedded) {
        setIsAnimating(true);
        // onAnimationEnd 핸들러가 애니메이션 완료 시 setIsAnimating(false) 처리
      }
      setHasBeenManuallyMoved(false);
      setDateRange(getWeekPreset());
      void loadTasksRef.current();
    }
  }, [isOpen, isEmbedded, loadTasks]);

  // Sync drawer position with button position in real-time
  useEffect(() => {
    if (buttonPosition && !isDragging && !hasBeenManuallyMoved) {
      const buttonCenterX = buttonPosition.x + buttonPosition.width / 2;
      const isButtonOnRight = buttonCenterX > window.innerWidth / 2;
      const rawBottom = window.innerHeight - buttonPosition.y - buttonPosition.height;
      // Clamp bottom so the drawer top edge doesn't go above the viewport
      const maxBottom = window.innerHeight - drawerHeight - 10;
      const bottom = Math.max(10, Math.min(maxBottom, rawBottom));

      let left: number;
      if (isButtonOnRight) {
        left = buttonPosition.x + buttonPosition.width - drawerWidth;
      } else {
        left = buttonPosition.x;
      }

      left = Math.max(10, Math.min(window.innerWidth - drawerWidth - 10, left));

      setDrawerPosition({ left, bottom });
    }
  }, [buttonPosition, drawerWidth, drawerHeight, isDragging, hasBeenManuallyMoved]);

  // GNB/RNB nav mode: position drawer at edge
  useEffect(() => {
    if (openDirection && !buttonPosition && isOpen && !hasBeenManuallyMoved) {
      const GNB_WIDTH = 56;
      const RNB_WIDTH = 48;
      if (openDirection === 'right') {
        // GNB mode: drawer opens to the right of GNB
        setDrawerPosition({ left: GNB_WIDTH, bottom: 10 });
      } else {
        // RNB mode: drawer opens to the left of RNB
        setDrawerPosition({ left: window.innerWidth - RNB_WIDTH - drawerWidth, bottom: 10 });
      }
    }
  }, [openDirection, buttonPosition, isOpen, drawerWidth, hasBeenManuallyMoved]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeType) return;

      // Embedded mode: only handle top resize for height adjustment
      if (isEmbedded && resizeType === 'top') {
        const parentHeight = drawerRef.current?.parentElement?.clientHeight || 600;
        const deltaY = startPosRef.current.y - e.clientY;
        const currentHeightPx = (embeddedHeight / 100) * parentHeight;
        const newHeightPx = Math.max(200, Math.min(parentHeight - 50, currentHeightPx + deltaY));
        setEmbeddedHeight((newHeightPx / parentHeight) * 100);
        startPosRef.current.y = e.clientY;
        return;
      }

      let newWidth = drawerWidth;
      let newHeight = drawerHeight;

      if (resizeType === 'corner' || resizeType === 'top') {
        const deltaY = startPosRef.current.y - e.clientY;
        const currentBottom = drawerPosition?.bottom ?? 10;
        const maxHeight = window.innerHeight - currentBottom - 10;
        newHeight = Math.max(300, Math.min(maxHeight, startPosRef.current.height + deltaY));
      }

      if (resizeType === 'corner' || resizeType === 'left' || resizeType === 'right') {
        const currentLeft = drawerPosition?.left ?? window.innerWidth - drawerWidth - 24;
        const drawerCenter = currentLeft + drawerWidth / 2;
        const isOnRight = drawerCenter > window.innerWidth / 2;

        const deltaX = (resizeType === 'left' || (resizeType === 'corner' && isOnRight))
          ? startPosRef.current.x - e.clientX
          : e.clientX - startPosRef.current.x;

        newWidth = Math.max(320, Math.min(800, startPosRef.current.width + deltaX));
      }

      setDrawerWidth(newWidth);
      setDrawerHeight(newHeight);
    };

    const handleMouseUp = () => {
      setResizeType(null);
    };

    if (resizeType) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizeType, drawerWidth, drawerHeight, isEmbedded, embeddedHeight, drawerPosition?.bottom, drawerPosition?.left]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = dragStartRef.current.y - e.clientY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        hasDraggedRef.current = true;
      }

      const newLeft = Math.max(10, Math.min(window.innerWidth - drawerWidth - 10, dragStartRef.current.left + deltaX));
      const newBottom = Math.max(10, Math.min(window.innerHeight - drawerHeight - 10, dragStartRef.current.bottom + deltaY));

      setDrawerPosition({ left: newLeft, bottom: newBottom });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, drawerWidth, drawerHeight, drawerPosition?.left]);

  const handleDrawerDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    hasDraggedRef.current = false;
    const currentPos = getDrawerPositionValues();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: currentPos.left,
      bottom: currentPos.bottom,
    };
    setIsDragging(true);
    setHasBeenManuallyMoved(true);
  };

  const handleClose = () => {
    const pos = getDrawerPositionValues();
    const drawerCenter = pos.left + drawerWidth / 2;
    const screenCenter = window.innerWidth / 2;
    const side: 'left' | 'right' = drawerCenter > screenCenter ? 'right' : 'left';

    const drawerRect = {
      left: pos.left,
      bottom: pos.bottom,
      width: drawerWidth,
      height: drawerHeight
    };

    onClose(side, drawerRect);
  };

  const handleHeaderClick = () => {
    if (!isEmbedded && hasDraggedRef.current) return;
    if (isEmbedded) {
      onCloseSimple?.();
    } else {
      handleClose();
    }
  };

  const handleResizeStart = (e: React.MouseEvent, type: ResizeType) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeType(type);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: drawerWidth,
      height: drawerHeight,
    };
  };

  const handleToggleComplete = async (taskId: string) => {
    await api.toggleTaskCompletion(taskId);
    loadTasks();
  };

  const handleToggleLike = async (taskId: string) => {
    await api.toggleTaskLike(taskId);
    loadTasks();
  };

  const handleToggleNoticeRead = async (taskId: string) => {
    await api.toggleNoticeRead(taskId);
    loadTasks();
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    // Include messageId from prefillData if this was triggered via bubble-to-task
    const finalInput: CreateTaskInput = prefillData?.messageId
      ? { ...input, messageId: prefillData.messageId }
      : input;
    const createdTask = await api.createTask(finalInput);
    callbacks.onTaskCreated?.(createdTask);
    clearPrefill();
    loadTasks();
    setIsAddingTask(false);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await api.updateTask({ id: taskId, ...updates });
    loadTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId) ?? null;
    await api.deleteTask(taskId);
    if (taskToDelete) {
      callbacks.onTaskDeleted?.(taskToDelete);
    }
    loadTasks();
  };

  const handleTogglePin = async (taskId: string) => {
    await api.toggleTaskPin(taskId);
    loadTasks();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (sortBy !== 'custom') return;
    const task = filteredTasks.find(t => t.id === taskId);
    if (task?.pinned) return;
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    if (sortBy !== 'custom') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedTaskId !== taskId) {
      setDragOverTaskId(taskId);
    }
  };

  const handleDragLeave = () => {
    setDragOverTaskId(null);
  };

  const handleDrop = async (e: React.DragEvent, dropTaskId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === dropTaskId || sortBy !== 'custom') {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const dropTask = filteredTasks.find(t => t.id === dropTaskId);
    if (dropTask?.pinned) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const draggedIndex = filteredTasks.findIndex(t => t.id === draggedTaskId);
    const dropIndex = filteredTasks.findIndex(t => t.id === dropTaskId);

    if (draggedIndex === -1 || dropIndex === -1) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const reordered = [...filteredTasks];
    const [draggedTask] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, draggedTask);

    await api.reorderTasks(reordered);
    await loadTasks();

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const isDateInRange = useCallback((taskDate: string | null): boolean => {
    if (!dateRange || !taskDate) return !dateRange;
    const date = new Date(taskDate);
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return date >= start && date <= end;
  }, [dateRange]);

  const parentTasks = tasks.filter(t => !t.parentId);
  const getSubtasks = (parentId: string) => tasks.filter(t => t.parentId === parentId);

  // Recalculate stats based on date range and type filter
  const filteredStats = (() => {
    const tasksInRange = tasks.filter(task => {
      const dateMatch = isDateInRange(task.scheduledDate);
      const typeMatch = selectedTaskType === 'all' || task.type === selectedTaskType;
      return dateMatch && typeMatch;
    });
    return {
      notice: tasksInRange.filter(t => t.type === 'notice' && t.status !== 'completed' && !t.isRead).length,
      pending: tasksInRange.filter(t => t.status === 'pending' && t.type !== 'notice').length,
      delayed: tasksInRange.filter(t => t.status === 'delayed' && t.type !== 'notice').length,
      liked: tasksInRange.filter(t => t.liked && t.status !== 'completed' && t.type !== 'notice').length,
      completed: tasksInRange.filter(t => t.status === 'completed').length,
    };
  })();

  const displayStats = dateRange ? filteredStats : stats;

  const filteredTasks = parentTasks
    .filter(task => {
      // Date range filter
      if (dateRange && !isDateInRange(task.scheduledDate)) {
        return false;
      }

      // dateRange가 설정되어 있고 'all' 필터이면 모든 상태를 보여줌 (공지 포함)
      const statusMatch = selectedFilter === 'all'
        ? dateRange
          ? true
          : (task.type !== 'notice' && task.status !== 'completed') || (task.type === 'notice' && !task.isRead)
        : selectedFilter === 'notice'
          ? task.type === 'notice'
          : selectedFilter === 'completed'
            ? task.status === 'completed' && task.type !== 'notice'
            : selectedFilter === 'pending'
              ? task.status === 'pending' && task.type !== 'notice'
              : selectedFilter === 'delayed'
                ? task.status === 'delayed' && task.type !== 'notice'
                : selectedFilter === 'liked'
                  ? task.liked && task.status !== 'completed' && task.type !== 'notice'
                  : true;

      const typeMatch = selectedTaskType === 'all' || task.type === selectedTaskType;

      return statusMatch && typeMatch;
    })
    .sort((a, b) => {
      // 공지를 최상단에 배치 (공지 필터가 아닌 경우에만)
      if (selectedFilter !== 'notice') {
        if (a.type === 'notice' && b.type !== 'notice') return -1;
        if (a.type !== 'notice' && b.type === 'notice') return 1;
      }

      // 핀된 태스크 우선
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.pinned && b.pinned) return (b.pinnedAt || 0) - (a.pinnedAt || 0);

      switch (sortBy) {
        case 'custom':
          return a.order - b.order;
        case 'createdAt':
          return b.createdAt - a.createdAt;
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'liked':
          if (a.liked === b.liked) return b.createdAt - a.createdAt;
          return a.liked ? -1 : 1;
        case 'title':
          return a.title.localeCompare(b.title, 'ko');
        default:
          return 0;
      }
    });

  const taskTypeButtons: Array<{ value: TaskType | 'all'; label: string }> = [
    { value: 'all', label: '전체' },
    { value: 'sms', label: 'SMS' },
    { value: 'callback', label: '콜백' },
    { value: 'followup', label: '팔로업' },
  ];

  const getDrawerPositionValues = (): { left: number; bottom: number } => {
    if (drawerPosition) {
      return drawerPosition;
    }

    // Initial calculation if state is not yet set
    if (buttonPosition) {
      const buttonCenterX = buttonPosition.x + buttonPosition.width / 2;
      const isButtonOnRight = buttonCenterX > window.innerWidth / 2;
      const rawBottom = window.innerHeight - buttonPosition.y - buttonPosition.height;
      // Clamp bottom so the drawer top edge doesn't go above the viewport
      const maxBottom = window.innerHeight - drawerHeight - 10;
      const bottom = Math.max(10, Math.min(maxBottom, rawBottom));

      let left: number;
      if (isButtonOnRight) {
        left = buttonPosition.x + buttonPosition.width - drawerWidth;
      } else {
        left = buttonPosition.x;
      }

      left = Math.max(10, Math.min(window.innerWidth - drawerWidth - 10, left));

      return { left, bottom };
    }

    const MARGIN = 24;
    const left = window.innerWidth - drawerWidth - MARGIN;
    const bottom = MARGIN;

    return { left, bottom };
  };

  const getDrawerPositionStyle = () => {
    const pos = getDrawerPositionValues();
    return {
      left: `${pos.left}px`,
      bottom: `${pos.bottom}px`,
      top: 'auto',
      right: 'auto'
    };
  };

  const drawerPositionStyle = getDrawerPositionStyle();

  const currentLeft = drawerPosition?.left ?? window.innerWidth - drawerWidth - 24;
  const drawerCenter = currentLeft + drawerWidth / 2;
  const isButtonOnRight = drawerCenter > window.innerWidth / 2;

  useEffect(() => {
    if (isOpen) {
      setIsAddingTask(initialIsAddingTask);
    }
  }, [isOpen, initialIsAddingTask]);

  // Watch prefillData: 드로어가 이미 열려있을 때 신규 할일 입력 모드 활성화
  // 드로어가 닫혀있는 경우: TaskContext의 externalPrefillData useEffect에서 드로어를 먼저 열고,
  // 이후 isOpen이 true가 되면 initialIsAddingTask(=true)에 의해 자동으로 isAddingTask가 설정됨
  useEffect(() => {
    if (prefillData && isOpen) {
      setIsAddingTask(true);
    }
  }, [isOpen, prefillData]);

  // ── Focus linked task: find task by messageId, adjust dateRange, scroll & highlight ──
  const focusTimersRef = useRef<{ scroll?: ReturnType<typeof setTimeout>; highlight?: ReturnType<typeof setTimeout> }>({});

  useEffect(() => {
    if (focusMessageId == null || !isOpen || tasks.length === 0) return;

    const targetTask = tasks.find(t => t.messageId === focusMessageId);
    if (!targetTask) {
      clearFocusMessage();
      return;
    }

    // Reset filters so the task is visible
    setSelectedFilter('all');
    setSelectedTaskType('all');

    // Adjust dateRange to include the task's scheduledDate
    if (targetTask.scheduledDate) {
      if (!isDateInRange(targetTask.scheduledDate)) {
        setDateRange({ start: targetTask.scheduledDate, end: targetTask.scheduledDate });
      }
    } else {
      setDateRange(null);
    }

    // Clear previous timers
    clearTimeout(focusTimersRef.current.scroll);
    clearTimeout(focusTimersRef.current.highlight);

    // Highlight and scroll to the task after a brief delay (for re-render)
    setHighlightedTaskId(targetTask.id);
    focusTimersRef.current.scroll = setTimeout(() => {
      const el = taskCardRefs.current.get(targetTask.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    focusTimersRef.current.highlight = setTimeout(() => {
      setHighlightedTaskId(null);
    }, 2000);

    clearFocusMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dateRange omitted: we read it via isDateInRange but must not re-trigger when we change it
  }, [focusMessageId, isOpen, tasks, clearFocusMessage]);

  // Cleanup focus timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(focusTimersRef.current.scroll);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(focusTimersRef.current.highlight);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      id="task-drawer-container"
      className={isEmbedded
        ? 'absolute bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 shadow-lg flex flex-col overflow-hidden animate-slide-up'
        : `fixed bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)] border border-gray-200/80 z-50 flex flex-col rounded-xl overflow-hidden ${isAnimating ? 'animate-drawer-expand' : ''}`
      }
      style={isEmbedded ? {
        height: `${embeddedHeight}%`,
        userSelect: resizeType ? 'none' : 'auto',
      } : {
        width: `${drawerWidth}px`,
        height: `${drawerHeight}px`,
        userSelect: (resizeType || isDragging) ? 'none' : 'auto',
        transformOrigin: isButtonOnRight ? 'bottom right' : 'bottom left',
        ...drawerPositionStyle
      }}
      onAnimationEnd={() => {
        if (!isEmbedded) {
          setIsAnimating(false);
        }
      }}
    >
      <style>{`
        @keyframes drawerExpand {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          70% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-drawer-expand {
          animation: drawerExpand 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className={`bg-amber-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 ${!isEmbedded ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
        onMouseDown={!isEmbedded ? handleDrawerDragStart : undefined}
        onClick={handleHeaderClick}
      >
        <div className="flex items-center gap-2">
          <h2 className="size-lg font-bold text-gray-900">할 일</h2>
          <DateQuickFilter
            selectedRange={dateRange}
            onRangeChange={(range) => setDateRange(range)}
            onOpenCalendarView={() => onOpenDetail?.()}
          />
        </div>
        <div className="flex items-center gap-2">
          {isManager && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddNotice?.(); }}
              className="size-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-violet-50 transition-colors"
            >
              <Megaphone size={15} />
              공지+
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsAddingTask(true); }}
            className="size-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            할 일+
          </button>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); onOpenDetail?.(); }}
              onMouseEnter={() => setShowDetailTooltip(true)}
              onMouseLeave={() => setShowDetailTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <ExternalLink size={18} />
            </button>
            {showDetailTooltip && (
              <div className="absolute right-0 top-full mt-1.5 px-2.5 py-1 bg-gray-900 text-white size-xs rounded-md whitespace-nowrap z-50 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
                상세보기
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); if (isEmbedded) { onCloseSimple?.(); } else { handleClose(); } }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex-shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedFilter('notice')}
            className={`flex-1 rounded-lg p-2 text-center transition-all active:scale-[0.97] ${selectedFilter === 'notice'
              ? 'bg-violet-100 ring-1 ring-violet-300'
              : 'bg-white hover:bg-violet-50 border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Bell size={14} className="text-violet-600" />
              <span className="size-lg font-bold text-violet-700 tabular-nums">{displayStats.notice}</span>
            </div>
            <div className="size-sm text-violet-600 font-medium">공지</div>
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`flex-1 rounded-lg p-2 text-center transition-all active:scale-[0.97] ${selectedFilter === 'pending'
              ? 'bg-sky-100 ring-1 ring-sky-300'
              : 'bg-white hover:bg-sky-50 border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Clock size={14} className="text-sky-600" />
              <span className="size-lg font-bold text-sky-700 tabular-nums">{displayStats.pending}</span>
            </div>
            <div className="size-sm text-sky-600 font-medium">진행</div>
          </button>
          <button
            onClick={() => setSelectedFilter('delayed')}
            className={`flex-1 rounded-lg p-2 text-center transition-all active:scale-[0.97] ${selectedFilter === 'delayed'
              ? 'bg-orange-100 ring-1 ring-orange-300'
              : 'bg-white hover:bg-orange-50 border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle size={14} className="text-orange-600" />
              <span className="size-lg font-bold text-orange-700 tabular-nums">{displayStats.delayed}</span>
            </div>
            <div className="size-sm text-orange-600 font-medium">지연</div>
          </button>
          <button
            onClick={() => setSelectedFilter('liked')}
            className={`flex-1 rounded-lg p-2 text-center transition-all active:scale-[0.97] ${selectedFilter === 'liked'
              ? 'bg-amber-100 ring-1 ring-amber-300'
              : 'bg-white hover:bg-amber-50 border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Star size={14} className="text-amber-500" />
              <span className="size-lg font-bold text-amber-600 tabular-nums">{displayStats.liked}</span>
            </div>
            <div className="size-sm text-amber-600 font-medium">중요</div>
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`flex-1 rounded-lg p-2 text-center transition-all active:scale-[0.97] ${selectedFilter === 'completed'
              ? 'bg-gray-200 ring-1 ring-gray-400'
              : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
          >
            <div className="flex items-center justify-center gap-1">
              <CheckCircle size={14} className="text-gray-500" />
              <span className="size-lg font-bold text-gray-600 tabular-nums">{displayStats.completed}</span>
            </div>
            <div className="size-sm text-gray-500 font-medium">완료</div>
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            {taskTypeButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setSelectedTaskType(button.value)}
                className={`px-2.5 py-1 rounded size-sm font-medium whitespace-nowrap transition-all border ${selectedTaskType === button.value
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                  }`}
              >
                {button.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`p-1.5 rounded transition-colors border ${sortBy !== 'custom'
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
              title={sortBy === 'custom' ? '내가 정렬한 대로' : sortBy === 'createdAt' ? '날짜순' : sortBy === 'deadline' ? '기한순' : sortBy === 'liked' ? '별표순' : '제목순'}
            >
              <ArrowUpDown size={15} />
            </button>
            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200/80 rounded-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] py-1 z-50 min-w-[140px] animate-in fade-in-0 zoom-in-95 duration-150">
                  <button
                    onClick={() => { setSortBy('custom'); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${sortBy === 'custom' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    내가 정렬한 대로
                  </button>
                  <button
                    onClick={() => { setSortBy('createdAt'); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${sortBy === 'createdAt' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    날짜
                  </button>
                  <button
                    onClick={() => { setSortBy('deadline'); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${sortBy === 'deadline' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    기한
                  </button>
                  <button
                    onClick={() => { setSortBy('liked'); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${sortBy === 'liked' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    최근 별표 표시한 항목
                  </button>
                  <button
                    onClick={() => { setSortBy('title'); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-2 size-sm hover:bg-gray-50 ${sortBy === 'title' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    제목
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {isAddingTask && (
          <TaskInlineEditor
            key={prefillData ? `prefill-${prefillData.messageId ?? 'bubble'}` : 'manual'}
            onSave={handleCreateTask}
            onCancel={() => { setIsAddingTask(false); clearPrefill(); }}
            selectedRoom={selectedRoom}
            initialLinked={prefillData ? !!prefillData.roomId : initialLinked}
            initialTitle={prefillData?.title ?? ''}
            initialDescription={prefillData?.description ?? ''}
            initialType={prefillData?.type ?? 'followup'}
            defaultDate={prefillData?.scheduledDate ?? null}
          />
        )}

        {filteredTasks.length === 0 && !isAddingTask ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <ClipboardList size={24} className="text-gray-400" />
            </div>
            <p className="size-sm font-medium text-gray-600 mb-1">할 일이 없습니다</p>
            <p className="size-xs text-gray-400 mb-4">새 할 일을 추가해 보세요</p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="size-xs text-blue-600 hover:text-white hover:bg-blue-500 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-500 transition-all duration-150 active:scale-95"
            >
              <Plus size={14} />
              할 일 추가
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            const isDragging = draggedTaskId === task.id;
            const isDragOver = dragOverTaskId === task.id;

            const handleTaskClick = () => {
              if (isEditing) {
                return;
              }
              // Navigate to linked room when clicking a task card
              if (onNavigateToRoom && task.roomId) {
                onNavigateToRoom(task.roomId);
              }
            };

            const isHighlighted = highlightedTaskId === task.id;

            return (
              <div
                key={task.id}
                ref={(el) => {
                  if (el) taskCardRefs.current.set(task.id, el);
                  else taskCardRefs.current.delete(task.id);
                }}
                draggable={sortBy === 'custom' && !task.pinned}
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
                onClick={handleTaskClick}
                className={`relative cursor-pointer ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-t-2 border-blue-500' : ''} ${task.type === 'notice' && selectedFilter !== 'notice' ? 'bg-violet-50/60 hover:bg-violet-50' : ''} ${isHighlighted ? 'ring-2 ring-blue-400 ring-offset-1 rounded-lg bg-blue-50/50 transition-all duration-300' : ''}`}
              >
                {sortBy === 'custom' && isEditing && !task.pinned && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 text-gray-400 cursor-move">
                    <GripVertical size={16} />
                  </div>
                )}
                <TaskCard
                  task={task}
                  subtasks={getSubtasks(task.id)}
                  onToggleComplete={handleToggleComplete}
                  onToggleLike={handleToggleLike}
                  onTogglePin={handleTogglePin}
                  onToggleNoticeRead={handleToggleNoticeRead}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onAddSubtask={handleCreateTask}
                  onNoticeClick={onNoticeClick}
                  onEditStart={() => setEditingTaskId(task.id)}
                  onEditEnd={() => setEditingTaskId(null)}
                  onNavigateToRoom={onNavigateToRoom}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Embedded mode: top resize handle only (full width for easier grab) */}
      {isEmbedded && (
        <div
          className={`absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-400 transition-colors z-20 ${resizeType === 'top' ? 'bg-blue-400' : ''}`}
          onMouseDown={(e) => handleResizeStart(e, 'top')}
          style={{ userSelect: resizeType === 'top' ? 'none' : 'auto' }}
        />
      )}

      {/* Floating mode: all resize handles */}
      {!isEmbedded && (
        <>
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 cursor-ns-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors ${resizeType === 'top' ? 'bg-blue-500 bg-opacity-30' : ''
              }`}
            onMouseDown={(e) => handleResizeStart(e, 'top')}
            style={{ userSelect: resizeType === 'top' ? 'none' : 'auto' }}
          />

          {isButtonOnRight ? (
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-20 cursor-ew-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors ${resizeType === 'left' ? 'bg-blue-500 bg-opacity-30' : ''
                }`}
              onMouseDown={(e) => handleResizeStart(e, 'left')}
              style={{ userSelect: resizeType === 'left' ? 'none' : 'auto' }}
            />
          ) : (
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-20 cursor-ew-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors ${resizeType === 'right' ? 'bg-blue-500 bg-opacity-30' : ''
                }`}
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              style={{ userSelect: resizeType === 'right' ? 'none' : 'auto' }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskDrawer;
