import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import TaskCalendar from './TaskCalendar';
import TaskBoard from './TaskBoard';
import NoticeViewer from './NoticeViewer';
import NoticeEditor from './NoticeEditor';

interface DraftNotice {
  id: string;
  title: string;
}

interface TaskDetailViewProps {
  onClose: () => void;
  initialTask?: Task | null;
  initialMode?: 'view' | 'create_notice';
  onLinkContact?: () => void;
  dateRange: { start: string; end: string } | null;
  onRangeChange: (range: { start: string; end: string } | null) => void;
  onToggleCalendarView: (mode: 'compact' | 'expanded') => void;
  calendarViewMode: 'compact' | 'expanded';
  requestedOverlayTask?: Task | null;
  requestedOverlaySource?: 'compact' | 'expanded';
  onOverlayRequestHandled?: () => void;
  onReturnToExpanded?: () => void;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  onClose,
  initialTask,
  initialMode = 'view',
  onLinkContact,
  dateRange,
  onRangeChange,
  onToggleCalendarView,
  calendarViewMode,
  requestedOverlayTask = null,
  requestedOverlaySource = 'compact',
  onOverlayRequestHandled,
  onReturnToExpanded,
}) => {
  const { callbacks } = useTaskContext();
  const { isManager } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(initialTask || null);
  const [activeOverlayTask, setActiveOverlayTask] = useState<Task | null>(null);
  const [activeOverlaySource, setActiveOverlaySource] = useState<'compact' | 'expanded'>('compact');
  const [refreshKey, setRefreshKey] = useState(0);
  const [calendarRefreshSignal, setCalendarRefreshSignal] = useState(0);
  const [isCreatingNotice, setIsCreatingNotice] = useState(initialMode === 'create_notice');
  const [isEditing, setIsEditing] = useState(false);
  const [draftNotice, setDraftNotice] = useState<DraftNotice | null>(initialMode === 'create_notice' ? { id: `draft_${Date.now()}`, title: '' } : null);

  useEffect(() => {
    if (activeOverlayTask && activeOverlayTask.roomId) {
      // Room lookup is handled via render slot pattern now
    }
  }, [activeOverlayTask]);

  useEffect(() => {
    if (initialMode === 'create_notice') {
      return;
    }
    setSelectedTask(initialTask || null);
    setActiveOverlayTask(null);
    setActiveOverlaySource('compact');
    setIsCreatingNotice(false);
    setIsEditing(false);
    setDraftNotice(null);
  }, [initialTask, initialMode]);

  useEffect(() => {
    if (!requestedOverlayTask?.roomId) {
      return;
    }

    setSelectedTask(requestedOverlayTask);
    setIsCreatingNotice(false);
    setIsEditing(false);
    setDraftNotice(null);
    setActiveOverlayTask(requestedOverlayTask);
    setActiveOverlaySource(requestedOverlaySource);
    onOverlayRequestHandled?.();
  }, [requestedOverlayTask, requestedOverlaySource, onOverlayRequestHandled]);

  const handleTaskSelect = (task: Task) => {
    // Reset creation/editing states when a new task is selected
    setIsCreatingNotice(false);
    setIsEditing(false);
    setDraftNotice(null);
    setSelectedTask(task);
    setActiveOverlayTask(null);
  };

  const handleOpenContactOverlay = (task: Task) => {
    if (!task.roomId) {
      return;
    }

    setIsCreatingNotice(false);
    setIsEditing(false);
    setDraftNotice(null);
    setSelectedTask(task);
    setActiveOverlayTask(task);
    setActiveOverlaySource('compact');
  };

  const handleCloseContactOverlay = () => {
    setActiveOverlayTask(null);
  };

  const handleOverlayBack = () => {
    if (activeOverlaySource === 'expanded') {
      handleCloseContactOverlay();
      onReturnToExpanded?.();
      return;
    }
    handleCloseContactOverlay();
  };

  const handleCloseDetail = () => {
    handleCloseContactOverlay();
    setSelectedTask(null);
    setIsCreatingNotice(false);
    setDraftNotice(null);
    onClose();
  };

  const handleTaskUpdated = () => {
    setRefreshKey(prev => prev + 1);
    setCalendarRefreshSignal(prev => prev + 1);
  };

  const handleAddNotice = () => {
    setSelectedTask(null);
    setIsCreatingNotice(true);
    setIsEditing(false);
    setDraftNotice({
      id: `draft_${Date.now()}`,
      title: '',
    });
  };

  const handleEditNotice = () => {
    if (selectedTask) {
      setIsEditing(true);
      setIsCreatingNotice(false);
      setDraftNotice({
        id: selectedTask.id,
        title: selectedTask.title,
      });
    }
  };

  const handleDraftNoticeClick = () => {
    setSelectedTask(null);
  };

  const handleDraftTitleChange = useCallback((title: string) => {
    setDraftNotice(prev => prev ? { ...prev, title } : null);
  }, []);

  const handleNoticeSaved = (savedTask: Task) => {
    setIsCreatingNotice(false);
    setIsEditing(false);
    setDraftNotice(null);
    setSelectedTask(savedTask);
    setRefreshKey(prev => prev + 1);
    setCalendarRefreshSignal(prev => prev + 1);
  };

  const handleCancelNoticeEdit = () => {
    setIsCreatingNotice(false);
    setDraftNotice(null);
  };

  const handleTasksUpdated = useCallback((tasks: Task[]) => {
    setCalendarRefreshSignal(prev => prev + 1);
    setSelectedTask(prev => {
      if (!prev) return prev;
      const updatedTask = tasks.find(t => t.id === prev.id);
      return updatedTask || prev;
    });
  }, []);

  const renderDetailPanel = () => {
    if (isCreatingNotice) {
      return (
        <NoticeEditor
          onClose={handleCancelNoticeEdit}
          onSave={handleNoticeSaved}
          onTitleChange={handleDraftTitleChange}
          authorName="매니저"
        />
      );
    }

    if (selectedTask?.type === 'notice') {
      if (isCreatingNotice || (isManager && isEditing)) {
        return (
          <NoticeEditor
            existingNotice={isEditing ? selectedTask : undefined}
            onClose={isEditing ? () => setIsEditing(false) : handleCancelNoticeEdit}
            onSave={handleNoticeSaved}
            onTitleChange={handleDraftTitleChange}
            authorName={selectedTask.author || '매니저'}
          />
        );
      }

      return (
        <NoticeViewer
          key={selectedTask.id}
          task={selectedTask}
          onClose={handleCloseDetail}
          onTaskUpdated={handleTaskUpdated}
          onEdit={handleEditNotice}
        />
      );
    }

    // Default view when no task is selected or a task without room is selected
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
        {!selectedTask ? (
          <div className="text-center text-gray-400">
            <p className="size-lg">할일을 선택하면</p>
            <p className="size-lg">상세 내용이 표시됩니다</p>
          </div>
        ) : (
          <div className="text-center text-gray-400 max-w-md px-6">
            <p className="size-lg mb-2 font-medium text-gray-700">{selectedTask.title}</p>
            <p className="size-sm text-gray-500 mb-4">{selectedTask.description || '설명이 없습니다'}</p>
            {selectedTask.scheduledDate && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full size-xs font-medium">
                <Calendar size={12} />
                예정일: {selectedTask.scheduledDate}
              </div>
            )}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="size-sm text-gray-400">연결된 컨택룸이 없는 작업입니다.</p>
            </div>
            <button
              onClick={handleCloseDetail}
              className="mt-6 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg size-sm text-gray-600 transition-colors shadow-sm"
            >
              닫기
            </button>
          </div>
        )}

        {/* Sliding Overlay for tasks with roomId */}
        {activeOverlayTask?.roomId && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-in-right overlay-shadow">
            {callbacks.renderContactPreview ? (
              <div className="flex-1 min-h-0 flex">
                {callbacks.renderContactPreview(activeOverlayTask.roomId, handleOverlayBack)}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 size-sm">연결된 컨택룸</p>
                  <p className="text-gray-700 font-medium mt-1">Room #{activeOverlayTask.roomId}</p>
                  <button
                    onClick={() => callbacks.onNavigateToRoom?.(activeOverlayTask.roomId!, activeOverlayTask.messageId)}
                    className="mt-2 px-3 py-1 size-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    컨택룸 열기
                  </button>
                </div>
              </div>
            )}
            <style>
              {`
                @keyframes slide-in-right {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                  animation: slide-in-right 0.3s ease-out;
                }
                .overlay-shadow {
                  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.05);
                }
              `}
            </style>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex bg-gray-100">
      <div className="w-[320px] border-r border-gray-200 flex-shrink-0">
        <TaskCalendar
          selectedRange={dateRange}
          onRangeChange={onRangeChange}
          calendarViewMode={calendarViewMode}
          onToggleCalendarView={onToggleCalendarView}
          refreshSignal={calendarRefreshSignal}
        />
      </div>

      <div className="w-[380px] border-r border-gray-200 flex-shrink-0">
        <TaskBoard
          key={refreshKey}
          dateRange={dateRange}
          onTaskSelect={handleTaskSelect}
          selectedTaskId={isCreatingNotice ? draftNotice?.id : selectedTask?.id}
          onTasksUpdated={handleTasksUpdated}
          onAddNotice={handleAddNotice}
          draftNotice={draftNotice}
          onDraftNoticeClick={handleDraftNoticeClick}
          onLinkContact={onLinkContact}
          onTaskDetailRequest={handleOpenContactOverlay}
        />
      </div>

      <div className="flex-1 min-w-0">
        {renderDetailPanel()}
      </div>
    </div>
  );
};

export default TaskDetailView;
