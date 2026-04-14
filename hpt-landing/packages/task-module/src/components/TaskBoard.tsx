import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ClipboardList, Clock, AlertTriangle, CheckCircle, Star, GripVertical, Bell, Megaphone, ArrowUpDown } from 'lucide-react';
import { Task, TaskType, TaskStats, CreateTaskInput } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCard from './TaskCard';
import TaskInlineEditor from './TaskInlineEditor';

interface DraftNotice {
  id: string;
  title: string;
}

interface TaskBoardProps {
  dateRange: { start: string; end: string } | null;
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string | null;
  onTasksUpdated?: (tasks: Task[]) => void;
  onAddNotice?: () => void;
  draftNotice?: DraftNotice | null;
  onDraftNoticeClick?: () => void;
  onLinkContact?: () => void;
  onTaskDetailRequest?: (task: Task) => void;
}

type FilterType = 'all' | 'notice' | 'pending' | 'delayed' | 'liked' | 'completed';
type SortType = 'custom' | 'createdAt' | 'deadline' | 'liked' | 'title';

const getFilterForTask = (task: Task): FilterType => {
  if (task.type === 'notice') return 'notice';
  if (task.status === 'completed') return 'completed';
  if (task.status === 'delayed') return 'delayed';
  if (task.liked) return 'liked';
  if (task.status === 'pending') return 'pending';
  return 'all';
};

const TaskBoard: React.FC<TaskBoardProps> = ({
  dateRange,
  onTaskSelect,
  selectedTaskId,
  onTasksUpdated,
  onAddNotice,
  draftNotice,
  onDraftNoticeClick,
  onLinkContact,
  onTaskDetailRequest
}) => {
  const { api } = useTaskContext();
  const { isManager } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ notice: 0, pending: 0, delayed: 0, liked: 0, completed: 0 });
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortType>('custom');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    const loadedTasks = await api.getTasks();
    setTasks(loadedTasks);
    const loadedStats = await api.getTaskStats();
    setStats(loadedStats);
    onTasksUpdated?.(loadedTasks);
  }, [api, onTasksUpdated]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  // dateRange가 변경되면 필터를 'all'로 리셋
  useEffect(() => {
    setSelectedFilter('all');
  }, [dateRange]);

  useEffect(() => {
    if (dateRange) return; // 날짜 범위 보기 중에는 자동 필터 전환하지 않음
    if (selectedTaskId && tasks.length > 0) {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        const targetFilter = getFilterForTask(task);
        if (targetFilter !== selectedFilter) {
          setSelectedFilter(targetFilter);
        }
      }
    }
  }, [selectedFilter, selectedTaskId, tasks, dateRange]);

  const handleToggleComplete = async (taskId: string) => {
    await api.toggleTaskCompletion(taskId);
    loadTasks();
  };

  const handleToggleLike = async (taskId: string) => {
    await api.toggleTaskLike(taskId);
    loadTasks();
  };

  const handleTogglePin = async (taskId: string) => {
    await api.toggleTaskPin(taskId);
    loadTasks();
  };

  const handleToggleNoticeRead = async (taskId: string) => {
    await api.toggleNoticeRead(taskId);
    loadTasks();
  };

  const handleCreateTask = async (input: CreateTaskInput) => {
    await api.createTask(input);
    loadTasks();
    setIsAddingTask(false);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    await api.updateTask({ id: taskId, ...updates });
    loadTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    await api.deleteTask(taskId);
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

  const handleTaskClick = (task: Task) => {
    const targetFilter = getFilterForTask(task);
    setSelectedFilter(targetFilter);
    onTaskSelect(task);
  };

  const isDateInRange = useCallback((taskDate: string | null) => {
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

  // Recalculate stats based on date filter
  useEffect(() => {
    const tasksInDateRange = tasks.filter(task => isDateInRange(task.scheduledDate));

    const newStats: TaskStats = {
      notice: tasksInDateRange.filter(t => t.type === 'notice' && t.status !== 'completed' && !t.isRead).length,
      pending: tasksInDateRange.filter(t => t.status === 'pending' && t.type !== 'notice').length,
      delayed: tasksInDateRange.filter(t => t.status === 'delayed' && t.type !== 'notice').length,
      liked: tasksInDateRange.filter(t => t.liked && t.status !== 'completed' && t.type !== 'notice').length,
      completed: tasksInDateRange.filter(t => t.status === 'completed').length,
    };

    setStats(newStats);
  }, [isDateInRange, tasks]);

  const filteredTasks = parentTasks
    .filter(task => {
      // 1. Date Range Filter
      if (dateRange && !isDateInRange(task.scheduledDate)) {
        return false;
      }

      // 2. Status/Category Filter
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

      // 3. Task Type Filter
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

  const getDateRangeLabel = () => {
    if (!dateRange) return '전체보기';
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    if (dateRange.start === dateRange.end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-[49px] px-4 border-b border-gray-200/80 flex items-center justify-between flex-shrink-0 bg-amber-50">
        <div className="flex items-center gap-3">
          <h2 className="size-lg font-bold text-gray-900">할 일</h2>
          <span className="size-sm text-gray-500">{getDateRangeLabel()}</span>
        </div>
        <div className="flex items-center gap-2">
          {isManager && (
            <button
              onClick={onAddNotice}
              className="size-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-violet-50 transition-colors"
            >
              <Megaphone size={15} />
              공지+
            </button>
          )}
          <button
            onClick={() => setIsAddingTask(true)}
            className="size-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            할 일+
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
              <span className="size-lg font-bold text-violet-700 tabular-nums">{stats.notice}</span>
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
              <span className="size-lg font-bold text-sky-700 tabular-nums">{stats.pending}</span>
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
              <span className="size-lg font-bold text-orange-700 tabular-nums">{stats.delayed}</span>
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
              <span className="size-lg font-bold text-amber-600 tabular-nums">{stats.liked}</span>
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
              <span className="size-lg font-bold text-gray-600 tabular-nums">{stats.completed}</span>
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
            onSave={handleCreateTask}
            onCancel={() => setIsAddingTask(false)}
            defaultDate={dateRange?.start || null}
            extraActions={onLinkContact && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkContact();
                }}
                className="flex items-center gap-1.5 size-xs font-bold text-blue-600 hover:text-blue-700 transition-colors py-1 px-2 rounded hover:bg-blue-50"
              >
                <ClipboardList size={14} />
                <span>컨택 연결</span>
              </button>
            )}
          />
        )}

        {draftNotice && selectedFilter === 'notice' && (
          <div
            onClick={onDraftNoticeClick}
            className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedTaskId === draftNotice.id
              ? 'bg-violet-50 ring-1 ring-violet-300 ring-inset'
              : 'bg-violet-50/50 hover:bg-violet-50'
              }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <Megaphone size={12} className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`size-sm font-medium truncate ${draftNotice.title ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                  {draftNotice.title || '새 공지 작성 중...'}
                </p>
                <p className="size-xs text-violet-500">작성 중</p>
              </div>
            </div>
          </div>
        )}

        {filteredTasks.length === 0 && !isAddingTask && !draftNotice ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <ClipboardList size={24} className="text-gray-400" />
            </div>
            <p className="size-sm font-medium text-gray-600 mb-1">
              {dateRange ? '선택한 날짜에 업무가 없습니다' : '할 일이 없습니다'}
            </p>
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
            const isSelected = selectedTaskId === task.id;

            return (
              <div
                key={task.id}
                draggable={sortBy === 'custom' && !task.pinned}
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleTaskClick(task)}
                className={`relative cursor-pointer ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-t-2 border-blue-500' : ''} ${isSelected ? 'bg-blue-50 ring-1 ring-blue-300 ring-inset' : task.type === 'notice' && selectedFilter !== 'notice' ? 'bg-violet-50/60 hover:bg-violet-50' : 'hover:bg-gray-50'}`}
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
                  onEditStart={() => setEditingTaskId(task.id)}
                  onEditEnd={() => setEditingTaskId(null)}
                  onNoticeClick={onTaskDetailRequest}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
