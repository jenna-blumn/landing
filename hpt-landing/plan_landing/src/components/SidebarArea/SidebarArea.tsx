import React from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';
import ChannelBrandArea from './ChannelBrandArea';
import QueueArea from './QueueArea';
import ContactListArea from './ContactListArea';
import InboxArea from './InboxArea';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';
import AcwCard from './AcwCard';
import AcwSettingsModal from './AcwSettingsModal';
import ThreadTeamCounterBar from './ThreadTeamCounterBar';
import ThreadInboxList from './ThreadInboxList';
import { FilterState } from './FilterModal';
import { DateFilterState } from './DateFilterModal';
import { useAcw } from '../../hooks/useAcw';
import { Channel } from '../../types/channel';
import { filterContactsBySidebarCore } from './contactSelectors';
import { useTaskContext, TaskDrawer } from '@deskit/task-module';
import { SIDEBAR_CARD_PADDING, SIDEBAR_SECTION_SPACING } from '../../features/layout/panelSpacing';

interface Room {
  id: number;
  contactName: string;
  conversationTopic: string;
  brand: string;
  channel: 'chat' | 'phone' | 'kakao' | 'naver' | 'instagram' | 'board' | 'email';
  isVIP: boolean;
  lastConversationTimestamp: number;
  lastActivityTimestamp: number;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  unreadCount: number;
  currentWorkspaceId: number | null;
  customerStatus: 'online' | 'typing' | 'away';
  mainCategory: 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  additionalCategory: 'request' | 'maintain' | null;
  isAlarmSet: boolean;
  alarmTimestamp: number | null;
}

interface SidebarAreaProps {
  isCollapsed: boolean;
  onToggle: () => void;
  allRooms: Room[];
  onContactClick: (roomId: number) => void;
  favoriteRooms: Set<number>;
  selectedRoomId: number | null;
  isAutoAssignment: boolean;
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  onSelectMainCategory: (category: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent') => void;
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  onSelectAdditionalCategory: (category: 'request' | 'maintain' | null) => void;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  onSelectQueueType: (queueType: 'ai-response' | 'queue-waiting' | null) => void;
  isPhoneModeActive: boolean;
  isPhoneButtonVisible: boolean;
  inboxPosition: 'top' | 'bottom';
  onToggleInboxPosition: () => void;
  onAcceptContact: () => void;
  isChannelSectionVisible: boolean;
  isBrandSectionVisible: boolean;
  isBrandsInGNB: boolean;
  onToggleBrandsInGNB: (inGNB: boolean) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  isSearchModeActive?: boolean;
  onEnterSearchMode?: (filterMode?: 'standard' | 'ai-response' | 'unassigned') => void;
  onExitSearchMode?: () => void;
  isManagerMode?: boolean;
  onClearSelectedRoom?: () => void;
  // 스레드 대화
  sidebarListMode?: 'contact' | 'thread';
  onSidebarListModeChange?: (mode: 'contact' | 'thread') => void;
  threadCount?: number;
  onToggleThreadMode?: () => void;
  // 별도 윈도우
  detachedRoomIds?: Set<number>;
  onFocusDetached?: (roomId: number) => void;
}

const SidebarArea: React.FC<SidebarAreaProps> = ({
  isCollapsed,
  onToggle,
  allRooms,
  onContactClick,
  selectedRoomId,
  favoriteRooms,
  isAutoAssignment,
  selectedChannel,
  onChannelChange,
  selectedMainCategory,
  onSelectMainCategory,
  selectedAdditionalCategory,
  onSelectAdditionalCategory,
  selectedQueueType,
  onSelectQueueType,
  isPhoneModeActive,
  isPhoneButtonVisible,
  inboxPosition,
  onToggleInboxPosition,
  isChannelSectionVisible,
  isBrandSectionVisible,
  isBrandsInGNB,
  onToggleBrandsInGNB,
  selectedBrands,
  onBrandChange,
  isSearchModeActive = false,
  onEnterSearchMode,
  onExitSearchMode,
  isManagerMode = false,
  onClearSelectedRoom,
  sidebarListMode = 'contact',
  onSidebarListModeChange,
  threadCount = 0,
  onToggleThreadMode,
  detachedRoomIds,
  onFocusDetached,
}) => {
  const taskCtx = useTaskContext();
  const compactTaskButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // Inbox category clicks auto-switch back to contact mode
  const handleSelectMainCategory = React.useCallback((category: typeof selectedMainCategory) => {
    onSelectMainCategory(category);
    if (sidebarListMode !== 'contact') {
      onSidebarListModeChange?.('contact');
    }
  }, [onSelectMainCategory, sidebarListMode, onSidebarListModeChange]);

  const handleSelectAdditionalCategory = React.useCallback((category: typeof selectedAdditionalCategory) => {
    onSelectAdditionalCategory(category);
    if (sidebarListMode !== 'contact') {
      onSidebarListModeChange?.('contact');
    }
  }, [onSelectAdditionalCategory, sidebarListMode, onSidebarListModeChange]);

  const handleSelectQueueType = React.useCallback((queueType: typeof selectedQueueType) => {
    onSelectQueueType(queueType);
    if (sidebarListMode !== 'contact') {
      onSidebarListModeChange?.('contact');
    }
  }, [onSelectQueueType, sidebarListMode, onSidebarListModeChange]);

  const [activeFilters, setActiveFilters] = React.useState<FilterState>({
    dateRange: { start: null, end: null },
    flags: [],
    customerGrades: [],
    sortBy: 'lastConsultation',
    sortOrder: 'desc'
  });

  const [dateFilter, setDateFilter] = React.useState<DateFilterState>(() => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 3);
    return {
      preset: '3months',
      start: startDate.toISOString().split('T')[0],
      end: endDate
    };
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [, setIsDateFilterModalOpen] = React.useState(false);
  const [isAcwSettingsOpen, setIsAcwSettingsOpen] = React.useState(false);

  const acw = useAcw();
  const hasVisibleActiveFilters =
    activeFilters.flags.length > 0 ||
    activeFilters.customerGrades.length > 0 ||
    dateFilter.preset === 'custom';

  const handleOpenAcwSettings = () => {
    acw.pauseAcw();
    setIsAcwSettingsOpen(true);
  };

  const handleCloseAcwSettings = () => {
    setIsAcwSettingsOpen(false);
    acw.resumeAcw();
  };

  const handleApplyAcwDuration = (seconds: number) => {
    acw.setDuration(seconds);
  };

  const handleRemoveFilter = (filterType: 'flag' | 'customerGrade', value?: string) => {
    setActiveFilters(prev => {
      if (filterType === 'flag' && value) {
        return {
          ...prev,
          flags: prev.flags.filter(f => f !== value)
        };
      } else if (filterType === 'customerGrade' && value) {
        return {
          ...prev,
          customerGrades: prev.customerGrades.filter(g => g !== value)
        };
      }
      return prev;
    });
  };

  const handleRemoveDateFilter = () => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 3);
    setDateFilter({
      preset: '3months',
      start: startDate.toISOString().split('T')[0],
      end: endDate
    });
  };

  const { waitingCount, aiResponseCount } = React.useMemo(() => {
    const filteredRooms = filterContactsBySidebarCore({
      rooms: allRooms,
      selectedBrands,
      selectedChannel,
      selectedMainCategory: 'all',
      selectedAdditionalCategory: null,
      selectedQueueType: null,
    });

    return {
      waitingCount: filteredRooms.filter(room => room.mainCategory === 'waiting').length,
      aiResponseCount: filteredRooms.filter(room => (room as Room & { isAIHandled?: boolean }).isAIHandled).length,
    };
  }, [allRooms, selectedBrands, selectedChannel]);

  const isSidebarFixedTaskMode = taskCtx.buttonDisplayMode === 'sidebar-fixed';
  const [compactTaskButtonRect, setCompactTaskButtonRect] = React.useState<DOMRect | null>(null);

  const syncCompactTaskButtonRect = React.useCallback(() => {
    if (!compactTaskButtonRef.current) {
      setCompactTaskButtonRect(null);
      return;
    }
    setCompactTaskButtonRect(compactTaskButtonRef.current.getBoundingClientRect());
  }, []);

  React.useEffect(() => {
    if (!isSidebarFixedTaskMode || !isCollapsed) {
      return;
    }

    syncCompactTaskButtonRect();

    const handleResize = () => {
      syncCompactTaskButtonRect();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, isSidebarFixedTaskMode, syncCompactTaskButtonRect]);

  React.useEffect(() => {
    if (!isSidebarFixedTaskMode || !isCollapsed || !taskCtx.isDrawerOpen) {
      return;
    }
    syncCompactTaskButtonRect();
  }, [isCollapsed, isSidebarFixedTaskMode, syncCompactTaskButtonRect, taskCtx.isDrawerOpen]);

  const handleSidebarTaskButtonClick = React.useCallback(() => {
    if (isCollapsed) {
      syncCompactTaskButtonRect();
    }
    taskCtx.openDrawer();
  }, [isCollapsed, syncCompactTaskButtonRect, taskCtx]);

  const sidebarTaskStats = (
    <>
      <div className="bg-violet-500 border border-violet-600 rounded px-2 py-1 flex items-center gap-1">
        <Icon iconType={['media', 'notification']} size={12} color="white-default" />
        <span className="text-sm font-bold text-white">{taskCtx.stats.notice}</span>
      </div>
      <div className="bg-blue-500 border border-blue-600 rounded px-2 py-1 flex items-center gap-1">
        <Icon iconType={['system', 'time']} size={12} color="white-default" />
        <span className="text-sm font-bold text-white">{taskCtx.stats.pending}</span>
      </div>
      <div className="bg-orange-500 border border-orange-600 rounded px-2 py-1 flex items-center gap-1">
        <Icon iconType={['system', 'alert']} size={12} color="white-default" />
        <span className="text-sm font-bold text-white">{taskCtx.stats.delayed}</span>
      </div>
      <div className="bg-amber-500 border border-amber-600 rounded px-2 py-1 flex items-center gap-1">
        <Icon iconType={['system', 'star']} size={12} color="white-default" />
        <span className="text-sm font-bold text-white">{taskCtx.stats.liked}</span>
      </div>
    </>
  );

  return (
    <div className={`h-full bg-gray-50 border-r transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-full'
    }`}>
      <div className={`h-full ${SIDEBAR_CARD_PADDING} flex flex-col relative`}>
        {/* Toggle Button */}
        <Button
          onClick={isSearchModeActive && onExitSearchMode ? onExitSearchMode : onToggle}
          variant="iconOnly"
          buttonStyle="secondary"
          size="2xs"
          shape="pill"
          className="absolute -right-3 top-[42px] shadow-md hover:shadow-lg z-10"
          leadIcon={isCollapsed ? <Icon iconType={['arrows', 'arrow-right-s']} size={16} /> : <Icon iconType={['arrows', 'arrow-left-s']} size={16} />}
        />

        <ChannelBrandArea
          isCollapsed={isCollapsed}
          selectedBrands={selectedBrands}
          onBrandChange={onBrandChange}
          selectedChannel={selectedChannel}
          onChannelChange={onChannelChange}
          allRooms={allRooms}
          isPhoneModeActive={isPhoneModeActive}
          isPhoneButtonVisible={isPhoneButtonVisible}
          isChannelSectionVisible={isChannelSectionVisible}
          isBrandSectionVisible={isBrandSectionVisible}
          isBrandsInGNB={isBrandsInGNB}
          onToggleBrandsInGNB={onToggleBrandsInGNB}
        />

        <div className={SIDEBAR_SECTION_SPACING}>
          <QueueArea
            waitingCount={waitingCount}
            aiResponseCount={aiResponseCount}
            isAutoAssignment={isAutoAssignment}
            isCollapsed={isCollapsed}
            onSelectQueueType={handleSelectQueueType}
            selectedQueueType={selectedQueueType}
            onEnterSearchMode={onEnterSearchMode}
          />
        </div>

        {inboxPosition === 'top' && (
          <div className={SIDEBAR_SECTION_SPACING}>
            <InboxArea
              allRooms={allRooms}
              selectedMainCategory={selectedMainCategory}
              selectedAdditionalCategory={selectedAdditionalCategory}
              onSelectMainCategory={handleSelectMainCategory}
              onSelectAdditionalCategory={handleSelectAdditionalCategory}
              isAutoAssignment={isAutoAssignment}
              isCollapsed={isCollapsed}
              selectedChannel={selectedChannel}
              isPhoneModeActive={isPhoneModeActive}
              inboxPosition={inboxPosition}
              onToggleInboxPosition={onToggleInboxPosition}
              isSearchModeActive={isSearchModeActive}
              onExitSearchMode={onExitSearchMode}
              selectedRoomId={selectedRoomId}
              onContactClick={onContactClick}
              isAcwActive={acw.isAcwActive}
              acwRemainingSeconds={acw.remainingSeconds}
              onStartAcw={acw.startAcw}
              selectedBrands={selectedBrands}
              selectedQueueType={selectedQueueType}
            />
          </div>
        )}

        {inboxPosition === 'top' && acw.isAcwActive && !isCollapsed && (
          <div className={SIDEBAR_SECTION_SPACING}>
            <AcwCard
              remainingSeconds={acw.remainingSeconds}
              durationSeconds={acw.durationSeconds}
              isPaused={acw.isPaused}
              isManagerMode={isManagerMode}
              isCollapsed={isCollapsed}
              onOpenSettings={handleOpenAcwSettings}
              onStop={acw.stopAcw}
            />
          </div>
        )}

        {hasVisibleActiveFilters && (
          <div className={SIDEBAR_SECTION_SPACING}>
            <ActiveFiltersDisplay
              isCollapsed={isCollapsed}
              activeFilters={activeFilters}
              dateFilter={dateFilter}
              onRemoveFilter={handleRemoveFilter}
              onRemoveDateFilter={handleRemoveDateFilter}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onOpenDateFilterModal={() => setIsDateFilterModalOpen(true)}
            />
          </div>
        )}

        <div className={`${SIDEBAR_SECTION_SPACING} flex-1 h-full min-h-0`}>
          {sidebarListMode === 'thread' ? (
            <ThreadInboxList
              isCollapsed={isCollapsed}
              onContactClick={onContactClick}
              onToggleThreadMode={onToggleThreadMode}
            />
          ) : (
          <ContactListArea
            isCollapsed={isCollapsed}
            allRooms={allRooms}
            onContactClick={onContactClick}
            selectedBrands={selectedBrands}
            selectedChannel={selectedChannel}
            favoriteRooms={favoriteRooms}
            selectedMainCategory={selectedMainCategory}
            selectedAdditionalCategory={selectedAdditionalCategory}
            selectedQueueType={selectedQueueType}
            isAutoAssignment={isAutoAssignment}
            selectedRoomId={selectedRoomId}
            isPhoneModeActive={isPhoneModeActive}
            activeFilters={activeFilters}
            onActiveFiltersChange={setActiveFilters}
            isFilterModalOpen={isFilterModalOpen}
            onFilterModalOpenChange={setIsFilterModalOpen}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            isSearchModeActive={isSearchModeActive}
            onExitSearchMode={onExitSearchMode}
            isManagerMode={isManagerMode}
            onClearSelectedRoom={onClearSelectedRoom}
            detachedRoomIds={detachedRoomIds}
            onFocusDetached={onFocusDetached}
          />
          )}
        </div>

        <div className={SIDEBAR_SECTION_SPACING}>
          <ThreadTeamCounterBar
            threadCount={threadCount}
            activeMode={sidebarListMode}
            onModeChange={(mode) => {
              onSidebarListModeChange?.(mode);
            }}
            isCollapsed={isCollapsed}
          />
        </div>

        {inboxPosition === 'bottom' && acw.isAcwActive && !isCollapsed && (
          <div className={SIDEBAR_SECTION_SPACING}>
            <AcwCard
              remainingSeconds={acw.remainingSeconds}
              durationSeconds={acw.durationSeconds}
              isPaused={acw.isPaused}
              isManagerMode={isManagerMode}
              isCollapsed={isCollapsed}
              onOpenSettings={handleOpenAcwSettings}
              onStop={acw.stopAcw}
            />
          </div>
        )}

        {inboxPosition === 'bottom' && (
          <div className={SIDEBAR_SECTION_SPACING}>
            <InboxArea
              allRooms={allRooms}
              selectedMainCategory={selectedMainCategory}
              selectedAdditionalCategory={selectedAdditionalCategory}
              onSelectMainCategory={handleSelectMainCategory}
              onSelectAdditionalCategory={handleSelectAdditionalCategory}
              isAutoAssignment={isAutoAssignment}
              isCollapsed={isCollapsed}
              selectedChannel={selectedChannel}
              isPhoneModeActive={isPhoneModeActive}
              inboxPosition={inboxPosition}
              onToggleInboxPosition={onToggleInboxPosition}
              isSearchModeActive={isSearchModeActive}
              onExitSearchMode={onExitSearchMode}
              selectedRoomId={selectedRoomId}
              onContactClick={onContactClick}
              isAcwActive={acw.isAcwActive}
              acwRemainingSeconds={acw.remainingSeconds}
              onStartAcw={acw.startAcw}
              selectedBrands={selectedBrands}
              selectedQueueType={selectedQueueType}
            />
          </div>
        )}

        {isSidebarFixedTaskMode && (
          <div className={`${SIDEBAR_SECTION_SPACING} flex-shrink-0 border-t border-gray-300 pt-2.5`}>
            {isCollapsed ? (
              <div className="flex justify-center">
                <button
                  ref={compactTaskButtonRef}
                  type="button"
                  onClick={handleSidebarTaskButtonClick}
                  className={`
                    relative flex items-center justify-center rounded-lg transition-all duration-200
                    w-8 h-8 hover:scale-110
                    ${taskCtx.isDrawerOpen
                      ? 'bg-amber-100 border border-amber-400 shadow-md'
                      : 'bg-white/90 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'
                    }
                  `}
                >
                  <Icon
                    iconType={['editor', 'list-check']}
                    size={16}
                  />
                  {taskCtx.unseenChanges.total > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold leading-none ring-1 ring-white">
                      {taskCtx.unseenChanges.total > 99 ? '99+' : taskCtx.unseenChanges.total}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <Button
                onClick={handleSidebarTaskButtonClick}
                buttonStyle="ghost"
                size="md"
                fullWidth
                className="bg-amber-50 hover:bg-amber-100"
              >
                {sidebarTaskStats}
              </Button>
            )}
          </div>
        )}

        <AcwSettingsModal
          isOpen={isAcwSettingsOpen}
          currentDuration={acw.durationSeconds}
          onApply={handleApplyAcwDuration}
          onClose={handleCloseAcwSettings}
        />

        {isSidebarFixedTaskMode && !isCollapsed && taskCtx.isDrawerOpen && (
          <TaskDrawer
            mode="embedded"
            isOpen={true}
            onClose={() => { }}
            onCloseSimple={() => taskCtx.closeDrawer()}
            selectedRoom={taskCtx.selectedRoom}
            onNavigateToRoom={taskCtx.callbacks.onNavigateToRoom as ((roomId: number, messageId?: number | null) => void) | undefined}
            allRooms={taskCtx.allRooms}
            buttonPosition={null}
            onOpenDetail={(task) => taskCtx.openDetailView(task)}
            onNoticeClick={(task) => taskCtx.handleNoticeClick(task)}
            onAddNotice={() => taskCtx.openNoticeCreation()}
            initialIsAddingTask={taskCtx.drawerInitialIsAddingTask}
            initialLinked={taskCtx.drawerInitialLinked}
          />
        )}

        {isSidebarFixedTaskMode && isCollapsed && taskCtx.isDrawerOpen && compactTaskButtonRect && (
          <TaskDrawer
            mode="floating"
            isOpen={true}
            onClose={(side, rect) => taskCtx.closeDrawer(side, rect as DOMRect | undefined)}
            onCloseSimple={() => taskCtx.closeDrawer()}
            selectedRoom={taskCtx.selectedRoom}
            onNavigateToRoom={taskCtx.callbacks.onNavigateToRoom as ((roomId: number, messageId?: number | null) => void) | undefined}
            allRooms={taskCtx.allRooms}
            buttonPosition={compactTaskButtonRect}
            onOpenDetail={(task) => taskCtx.openDetailView(task)}
            onNoticeClick={(task) => taskCtx.handleNoticeClick(task)}
            onAddNotice={() => taskCtx.openNoticeCreation()}
            initialIsAddingTask={taskCtx.drawerInitialIsAddingTask}
            initialLinked={taskCtx.drawerInitialLinked}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(SidebarArea);
