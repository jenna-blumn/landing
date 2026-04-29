import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskFloatingButton from './TaskFloatingButton';
import TaskDrawer from './TaskDrawer';
import TaskDetailView from './TaskDetailView';
import FullCalendarView from './FullCalendarView';

/**
 * TaskWidget — 할일 모듈의 통합 위젯 컴포넌트.
 *
 * displayMode에 따라 floating/embedded 모드로 자동 렌더링합니다.
 * TaskModuleProvider 하위에서 사용해야 합니다.
 */
const TaskWidget: React.FC = () => {
  const {
    config,
    stats,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    drawerInitialIsAddingTask,
    drawerInitialLinked,
    buttonPosition,
    setButtonPosition,
    setButtonRect,
    buttonRect,
    isDetailViewActive,
    selectedTaskForDetail,
    detailInitialMode,
    calendarViewMode,
    sharedDateRange,
    setSharedDateRange,
    pendingOverlayRequest,
    closeDetailView,
    toggleCalendarView,
    setExpandedTaskSelect,
    requestCompactDetail,
    handleOverlayRequestHandled,
    returnToExpandedFromOverlay,
    selectedRoom,
    allRooms,
    buttonDisplayMode,
    callbacks,
    openDetailView,
    openNoticeCreation,
    handleNoticeClick,
  } = useTaskContext();

  const showFloating =
    config.displayMode === 'floating' &&
    buttonDisplayMode === 'floating';

  const isNavMode = buttonDisplayMode === 'gnb' || buttonDisplayMode === 'rnb';
  const drawerOpenDirection = buttonDisplayMode === 'rnb' ? 'left' : 'right';

  const handleLinkContact = () => {
    if (selectedRoom) {
      openDrawer({ isAddingTask: true, linked: true });
    }
  };

  return (
    <>
      {/* Floating Button */}
      {showFloating && !isDrawerOpen && !isDetailViewActive && (
        <TaskFloatingButton
          noticeCount={stats.notice}
          pendingCount={stats.pending}
          delayedCount={stats.delayed}
          likedCount={stats.liked}
          position={buttonPosition}
          onClick={() => openDrawer()}
          onPositionChange={(pos, rect) => {
            setButtonPosition(pos);
            setButtonRect(rect);
          }}
        />
      )}

      {/* Drawer — floating mode */}
      {showFloating && isDrawerOpen && !isDetailViewActive && (
        <TaskDrawer
          mode="floating"
          isOpen={isDrawerOpen}
          onClose={(side, rect) => closeDrawer(side, rect as DOMRect | undefined)}
          buttonPosition={buttonRect}
          initialIsAddingTask={drawerInitialIsAddingTask}
          initialLinked={drawerInitialLinked}
          selectedRoom={selectedRoom}
          allRooms={allRooms}
          onNavigateToRoom={callbacks.onNavigateToRoom}
          onOpenDetail={(task) => openDetailView(task)}
          onNoticeClick={(task) => handleNoticeClick(task)}
          onAddNotice={() => openNoticeCreation()}
        />
      )}

      {/* Drawer — GNB/RNB nav mode */}
      {isNavMode && isDrawerOpen && !isDetailViewActive && (
        <TaskDrawer
          mode="floating"
          isOpen={isDrawerOpen}
          onClose={() => closeDrawer()}
          onCloseSimple={() => closeDrawer()}
          buttonPosition={null}
          openDirection={drawerOpenDirection}
          initialIsAddingTask={drawerInitialIsAddingTask}
          initialLinked={drawerInitialLinked}
          selectedRoom={selectedRoom}
          allRooms={allRooms}
          onNavigateToRoom={callbacks.onNavigateToRoom}
          onOpenDetail={(task) => openDetailView(task)}
          onNoticeClick={(task) => handleNoticeClick(task)}
          onAddNotice={() => openNoticeCreation()}
        />
      )}

      {/* Detail View */}
      {isDetailViewActive && (
        <div className="fixed top-0 right-0 bottom-0 left-12 z-50 bg-white">
          {calendarViewMode === 'expanded' ? (
            <FullCalendarView
              onClose={closeDetailView}
              onTaskSelect={setExpandedTaskSelect}
              selectedTaskId={selectedTaskForDetail?.id}
              onRequestCompactDetail={requestCompactDetail}
              dateRange={sharedDateRange}
              onRangeChange={setSharedDateRange}
              onToggleCalendarView={toggleCalendarView}
            />
          ) : (
            <TaskDetailView
              onClose={closeDetailView}
              initialTask={selectedTaskForDetail}
              initialMode={detailInitialMode}
              onLinkContact={handleLinkContact}
              dateRange={sharedDateRange}
              onRangeChange={setSharedDateRange}
              onToggleCalendarView={toggleCalendarView}
              calendarViewMode={calendarViewMode}
              requestedOverlayTask={pendingOverlayRequest?.task}
              requestedOverlaySource={pendingOverlayRequest?.source}
              onOverlayRequestHandled={handleOverlayRequestHandled}
              onReturnToExpanded={returnToExpandedFromOverlay}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TaskWidget;
