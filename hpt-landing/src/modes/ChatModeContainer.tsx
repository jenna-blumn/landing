import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Room } from '../data/mockData';
import type { CreateTaskInput } from '../../packages/task-module/src/types/task';
import { useRoomManagement } from '../hooks/useRoomManagement';
import { useChatDisplayMode } from '../hooks/useChatDisplayMode';
import { useSharedReferenceArea } from '../components/SharedReferenceArea/SharedReferenceArea';
import { cn } from '@blumnai-studio/blumnai-design-system';
import GNB from '../components/GNB';

const DEFAULT_SIDEBAR_WIDTH = 300;
const MIN_SIDEBAR_WIDTH = DEFAULT_SIDEBAR_WIDTH;
const MAX_SIDEBAR_WIDTH = 480;
const SIDEBAR_COLLAPSED_WIDTH = 80;
import SidebarArea from '../components/SidebarArea/SidebarArea';
import ContactRoomArea from '../components/ContactRoomArea/ContactRoomArea';
import AcknowledgementArea from '../components/ContactRoomArea/AcknowledgementArea';
import ChatRoomHeader from '../components/ChatRoomHeader';
import { useTaskContext } from '../../packages/task-module/src/context/TaskContext';
import { useSearchStore } from '../stores/useSearchStore';
import SearchArea from '../components/SearchArea/SearchArea';
import SearchResultOverlay from '../components/SearchArea/SearchResultOverlay';
import HistoryContactModeLayout from '../components/HistoryContactMode/HistoryContactModeLayout';
import ChatWorkspaceWithTabs from '../components/HistoryContactMode/ChatWorkspaceWithTabs';
import ThreadModeLayout from '../components/ThreadMode/ThreadModeLayout';
import { Channel } from '../types/channel';
import { FilterMode } from '../features/search/types';
import { useDetachedWindowManager } from '../hooks/useDetachedWindowManager';

interface ChatModeContainerProps {
  allRooms: Room[];
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  favoriteRooms: Set<number>;
  onToggleFavorite: (roomId: number) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isPhoneModeActive: boolean;
  isPhoneButtonVisible: boolean;
  onTogglePhoneButtonVisibility: () => void;
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  onSelectMainCategory: (category: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent') => void;
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  onSelectAdditionalCategory: (category: 'request' | 'maintain' | null) => void;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  onSelectQueueType: (queueType: 'ai-response' | 'queue-waiting' | null) => void;
  isAutoAssignment: boolean;
  onToggleAssignment: (isAuto: boolean) => void;
  isManagerMode: boolean;
  onToggleManagerMode: (isManager: boolean) => void;
  isPhoneIncoming: boolean;
  onTogglePhoneIncoming: (isIncoming: boolean) => void;
  handleSetAlarm: (roomId: number, alarmTimestamp: number | null) => void;
  handleSetFlag: (roomId: number, flagType: string | null) => void;
  chatMode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban';
  setChatMode: React.Dispatch<React.SetStateAction<'grid' | '2x1' | 'single' | 'focus' | 'kanban'>>;
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  isHistoricalViewActive: boolean;
  historicalRoomId: number | null;
  onCloseHistoricalView: () => void;
  isHistoryContactMode: boolean;
  historyContactId: number | null;
  onEnterHistoryContactMode: (historyId: number) => void;
  onExitHistoryContactMode: () => void;
  inboxPosition: 'top' | 'bottom';
  onToggleInboxPosition: () => void;
  onAcceptContact: () => void;
  isChannelSectionVisible: boolean;
  onToggleChannelSection: (visible: boolean) => void;
  isBrandsInGNB: boolean;
  onToggleBrandsInGNB: (inGNB: boolean) => void;
  isBrandSectionVisible: boolean;
  onToggleBrandSectionVisible: (visible: boolean) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  onEnterSearchMode: (filterMode?: FilterMode) => void;
  onExitSearchMode: () => void;
  onNavigateToRoom?: (roomId: number) => void;
  onClearSelectedRoom?: () => void;
  // 말풍선-할일 연동
  onPrefillTask?: (data: CreateTaskInput, messageId: number) => void;
  onFocusLinkedTask?: (messageId: number) => void;
  taskBadgeMap?: Map<number, Set<number>>;
  scrollToMessageId?: { roomId: number; messageId: number; nonce: number } | null;
  // 북마크
  bookmarkMap?: Map<number, Set<number>>;
  onToggleBookmark?: (roomId: number, messageId: number) => void;
  // 스레드 대화 관련
  sidebarListMode?: 'contact' | 'thread';
  onSidebarListModeChange?: (mode: 'contact' | 'thread') => void;
  threadCount?: number;
  isThreadMode?: boolean;
  onToggleThreadMode?: () => void;
  threadSourceRoomId?: number | null;
}

const ChatModeContainer: React.FC<ChatModeContainerProps> = ({
  allRooms,
  setAllRooms,
  favoriteRooms,
  onToggleFavorite,
  isSidebarCollapsed,
  toggleSidebar,
  isPhoneModeActive,
  isPhoneButtonVisible,
  onTogglePhoneButtonVisibility,
  selectedChannel,
  onChannelChange,
  selectedMainCategory,
  onSelectMainCategory,
  selectedAdditionalCategory,
  onSelectAdditionalCategory,
  selectedQueueType,
  onSelectQueueType,
  isAutoAssignment,
  onToggleAssignment,
  isManagerMode,
  onToggleManagerMode,
  isPhoneIncoming,
  onTogglePhoneIncoming,
  handleSetAlarm,
  handleSetFlag,
  chatMode,
  setChatMode,
  selectedRoomId,
  setSelectedRoomId,
  isHistoricalViewActive,
  historicalRoomId,
  onCloseHistoricalView,
  isHistoryContactMode,
  historyContactId,
  onEnterHistoryContactMode,
  onExitHistoryContactMode,
  inboxPosition,
  onToggleInboxPosition,
  onAcceptContact,
  isChannelSectionVisible,
  onToggleChannelSection,
  isBrandsInGNB,
  onToggleBrandsInGNB,
  isBrandSectionVisible,
  onToggleBrandSectionVisible,
  selectedBrands,
  onBrandChange,
  onEnterSearchMode,
  onExitSearchMode,
  onNavigateToRoom,
  onClearSelectedRoom,
  onPrefillTask,
  onFocusLinkedTask,
  taskBadgeMap,
  scrollToMessageId,
  bookmarkMap,
  onToggleBookmark,
  sidebarListMode = 'contact',
  onSidebarListModeChange,
  threadCount = 0,
  isThreadMode = false,
  onToggleThreadMode,
  threadSourceRoomId,
}) => {
  const mainContentAreaRef = useRef<HTMLDivElement>(null);
  const detachedWindowManager = useDetachedWindowManager();

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    if (isSidebarCollapsed) return;
    setIsResizingSidebar(true);
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, startWidth + deltaX)
      );
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isSidebarCollapsed, sidebarWidth]);

  const [isMaskingDisabled, setIsMaskingDisabled] = useState(false);

  // Task detail view state from TaskContext
  const { isDetailViewActive: isTaskDetailViewActive, openDetailView, closeDetailView, openDrawer } = useTaskContext();

  // Search state from Zustand store
  const isSearchModeActive = useSearchStore(s => s.isActive);
  const searchModeFilterMode = useSearchStore(s => s.filterMode);
  const searchQuery = useSearchStore(s => s.query);
  const searchFilters = useSearchStore(s => s.filters);
  const searchResults = useSearchStore(s => s.results);
  const selectedSearchResultId = useSearchStore(s => s.selectedResultId);
  const { setQuery: onSearchQueryChange, setFilters: onSearchFiltersChange, setResults: onSearchResultsChange, selectResult: onSelectSearchResult } = useSearchStore.getState();

  const selectedRoom = useMemo(
    () => selectedRoomId ? allRooms.find(r => r.id === selectedRoomId) || null : null,
    [selectedRoomId, allRooms]
  );

  const navigateToRoom = useMemo(
    () => onNavigateToRoom || ((roomId: number) => setSelectedRoomId(roomId)),
    [onNavigateToRoom, setSelectedRoomId]
  );

  const sharedReference = useSharedReferenceArea({
    allRooms,
    selectedRoomId,
    setSelectedRoomId,
    onSelectHistoricalRoom: onEnterHistoryContactMode,
    isSearchModeActive,
    mainContentAreaRef,
    onNavigateToRoom: navigateToRoom,
    isManagerMode,
    selectedRoom,
    onSetAlarm: handleSetAlarm,
    onSetFlag: handleSetFlag,
  });

  const handleToggleMasking = useCallback(() => {
    setIsMaskingDisabled(prev => !prev);
  }, []);

  const handleDownload = useCallback(() => {
    console.log('Download chat history');
  }, []);

  const handleReload = useCallback(() => {
    console.log('Reload chat');
  }, []);

  const selectedRoomInfo = useMemo(() => {
    if (!selectedRoomId) return { tags: [] as string[], flag: null, isVIP: false };
    const selectedRoom = allRooms.find(r => r.id === selectedRoomId);
    if (!selectedRoom) return { tags: [] as string[], flag: null, isVIP: false };

    return {
      title: selectedRoom.conversationTopic,
      tags: selectedRoom.tags || [],
      flag: selectedRoom.flag || null,
      isVIP: selectedRoom.isVIP || false
    };
  }, [selectedRoomId, allRooms]);

  const { handleContactClick: baseContactClick, handleCloseRoom } = useRoomManagement({
    allRooms,
    setAllRooms,
    selectedRoomId,
    setSelectedRoomId,
  });

  // 사이드바에서 컨택 클릭 시 스레드 모드 자동 해제
  const handleContactClick = useCallback((roomId: number) => {
    baseContactClick(roomId);
    if (isThreadMode) {
      onToggleThreadMode?.();
    }
  }, [baseContactClick, isThreadMode, onToggleThreadMode]);

  const chatDisplayMode = useChatDisplayMode({
    setChatMode,
    isPhoneModeActive,
    allRooms,
    setAllRooms,
    selectedRoomId,
    setSelectedRoomId,
  });

  const handleFocusRoomChange = useCallback((newFocusRoomId: number) => {
    if (chatMode === 'focus') {
      setSelectedRoomId(newFocusRoomId);
    }
  }, [chatMode, setSelectedRoomId]);

  const openRooms = useMemo(() => allRooms.filter(room => room.isOpen), [allRooms]);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden w-full">
      <div className="w-12 flex-shrink-0">
        <GNB
          onModeChange={chatDisplayMode.handleChangeChatDisplayMode}
          currentMode={chatMode}
          isAutoAssignment={isAutoAssignment}
          onToggleAssignment={onToggleAssignment}
          isPhoneModeActive={isPhoneModeActive}
          isPhoneButtonVisible={isPhoneButtonVisible}
          onTogglePhoneButtonVisibility={onTogglePhoneButtonVisibility}
          isChannelSectionVisible={isChannelSectionVisible}
          onToggleChannelSection={onToggleChannelSection}
          isBrandsInGNB={isBrandsInGNB}
          selectedBrands={selectedBrands}
          onBrandChange={onBrandChange}
          allRooms={allRooms}
          onToggleBrandsInGNB={onToggleBrandsInGNB}
          isBrandSectionVisible={isBrandSectionVisible}
          onToggleBrandSectionVisible={onToggleBrandSectionVisible}
          isManagerMode={isManagerMode}
          onToggleManagerMode={onToggleManagerMode}
          isPhoneIncoming={isPhoneIncoming}
          onTogglePhoneIncoming={onTogglePhoneIncoming}
          onOpenTaskDetail={() => {
            if (isTaskDetailViewActive) {
              closeDetailView();
            } else {
              openDetailView();
            }
          }}
          isTaskDetailViewActive={isTaskDetailViewActive}
          onWorkspaceMove={() => { }}
          currentWorkspace={1}
          totalWorkspaces={1}
        />
      </div>

      <div
        className={cn(
          'flex-shrink-0',
          !isResizingSidebar && 'transition-all duration-300'
        )}
        style={{ width: isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth }}
      >
        <SidebarArea
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          allRooms={allRooms}
          onContactClick={handleContactClick}
          favoriteRooms={favoriteRooms}
          selectedRoomId={selectedRoomId}
          isAutoAssignment={isAutoAssignment}
          isPhoneButtonVisible={isPhoneButtonVisible}
          selectedChannel={selectedChannel}
          onChannelChange={onChannelChange}
          selectedMainCategory={selectedMainCategory}
          onSelectMainCategory={onSelectMainCategory}
          selectedAdditionalCategory={selectedAdditionalCategory}
          onSelectAdditionalCategory={onSelectAdditionalCategory}
          selectedQueueType={selectedQueueType}
          onSelectQueueType={onSelectQueueType}
          isPhoneModeActive={isPhoneModeActive}
          inboxPosition={inboxPosition}
          onToggleInboxPosition={onToggleInboxPosition}
          onAcceptContact={onAcceptContact}
          isChannelSectionVisible={isChannelSectionVisible}
          isBrandSectionVisible={isBrandSectionVisible}
          isBrandsInGNB={isBrandsInGNB}
          onToggleBrandsInGNB={onToggleBrandsInGNB}
          selectedBrands={selectedBrands}
          onBrandChange={onBrandChange}
          isSearchModeActive={isSearchModeActive}
          onEnterSearchMode={onEnterSearchMode}
          onExitSearchMode={onExitSearchMode}
          isManagerMode={isManagerMode}
          onClearSelectedRoom={onClearSelectedRoom}
          sidebarListMode={sidebarListMode}
          onSidebarListModeChange={onSidebarListModeChange}
          threadCount={threadCount}
          onToggleThreadMode={onToggleThreadMode}
          detachedRoomIds={detachedWindowManager.detachedRoomIds}
          onFocusDetached={detachedWindowManager.focusDetached}
        />
      </div>

      {/* Sidebar resize divider */}
      {!isSidebarCollapsed && (
        <div
          className={cn(
            'group/sidebar-handle relative flex items-center justify-center flex-shrink-0 cursor-col-resize',
            'w-[4px]',
            'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:-translate-x-1/2',
            'after:transition-colors after:duration-150',
            isResizingSidebar
              ? 'after:bg-border-strong'
              : 'after:bg-muted hover:after:bg-border-darker active:after:bg-border-strong'
          )}
          onMouseDown={handleSidebarResizeStart}
        >
          <div className={cn(
            'z-10 flex items-center justify-center',
            'w-4 h-6 rounded-sm',
            'bg-card border border-border-darker',
            'text-hint group-hover/sidebar-handle:text-muted',
            'transition-colors duration-150'
          )}>
            <svg width="6" height="14" viewBox="0 0 6 14" fill="currentColor" aria-hidden="true">
              <circle cx="1.5" cy="1.5" r="1.5" />
              <circle cx="1.5" cy="7" r="1.5" />
              <circle cx="1.5" cy="12.5" r="1.5" />
              <circle cx="4.5" cy="1.5" r="1.5" />
              <circle cx="4.5" cy="7" r="1.5" />
              <circle cx="4.5" cy="12.5" r="1.5" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {!isSearchModeActive && (
          <div className="flex-shrink-0">
            <AcknowledgementArea />
          </div>
        )}

        <div
          className="flex-1 flex min-h-0 overflow-x-hidden"
          ref={mainContentAreaRef}
        >
          <div className="flex min-h-0 w-full">
            {isSearchModeActive ? (
              <div className="flex-1 min-h-0 relative">
                <SearchArea
                  allRooms={allRooms}
                  searchQuery={searchQuery}
                  onSearchQueryChange={onSearchQueryChange}
                  searchFilters={searchFilters}
                  onSearchFiltersChange={onSearchFiltersChange}
                  searchResults={searchResults}
                  onSearchResultsChange={onSearchResultsChange}
                  onSelectResult={onSelectSearchResult}
                  onToggleSidebar={toggleSidebar}
                  isManagerMode={isManagerMode}
                  filterMode={searchModeFilterMode}
                  isAutoAssignment={isAutoAssignment}
                  selectedChannel={selectedChannel}
                />
              </div>
            ) : isHistoryContactMode && historyContactId !== null ? (
              <>
                <div className="flex-1 min-h-0">
                  <HistoryContactModeLayout
                    currentRoomId={selectedRoomId}
                    historyContactId={historyContactId}
                    allRooms={allRooms}
                    onExitHistoryMode={onExitHistoryContactMode}
                    onSelectHistoricalRoom={onEnterHistoryContactMode}
                    favoriteRooms={favoriteRooms}
                    onToggleFavorite={onToggleFavorite}
                    currentRoomChatContent={
                      <ContactRoomArea
                        chatMode="single"
                        onCloseRoom={handleCloseRoom}
                        onFocusRoomChange={handleFocusRoomChange}
                        onSetAlarm={handleSetAlarm}
                        availableRooms={openRooms.map(r => r.id)}
                        allRooms={allRooms}
                        favoriteRooms={favoriteRooms}
                        onToggleFavorite={onToggleFavorite}
                        selectedRoomId={selectedRoomId}
                        onSelectRoom={setSelectedRoomId}
                        setAllRooms={setAllRooms}
                        isAutoAssignment={isAutoAssignment}
                        onSetFlag={handleSetFlag}
                        isPhoneModeActive={isPhoneModeActive}
                        isHistoricalViewActive={isHistoricalViewActive}
                        historicalRoomId={historicalRoomId}
                        onCloseHistoricalView={onCloseHistoricalView}
                        onPrefillTask={onPrefillTask}
                        onFocusLinkedTask={onFocusLinkedTask}
                        taskBadgeMessageIds={selectedRoomId ? (taskBadgeMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                        scrollToMessageId={scrollToMessageId?.roomId === selectedRoomId ? { messageId: scrollToMessageId.messageId, nonce: scrollToMessageId.nonce } : null}
                        bookmarkMessageIds={selectedRoomId ? (bookmarkMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                        onToggleBookmark={selectedRoomId ? (messageId: number) => onToggleBookmark?.(selectedRoomId, messageId) : undefined}
                      />
                    }
                  />
                </div>
                {sharedReference.renderSideTabDrawerButtons()}
              </>
            ) : isThreadMode && threadSourceRoomId !== null ? (
              <>
                <div className="flex-1 min-h-0">
                  <ThreadModeLayout
                    onExitThreadMode={onToggleThreadMode}
                    currentRoomId={selectedRoomId}
                    currentRoomName={selectedRoom?.contactName}
                    originalMessages={selectedRoom?.messages}
                    rightPanel={
                      <ChatWorkspaceWithTabs
                        isHistoryWorkspace={false}
                        contactData={selectedRoom}
                        allRooms={allRooms}
                        onSelectHistoricalRoom={onEnterHistoryContactMode}
                        selectedRoomId={selectedRoomId}
                        isFavorite={selectedRoomId !== null && favoriteRooms.has(selectedRoomId)}
                        onToggleFavorite={selectedRoomId !== null ? () => onToggleFavorite(selectedRoomId) : undefined}
                        chatContent={
                          <ContactRoomArea
                            chatMode="single"
                            onCloseRoom={handleCloseRoom}
                            onFocusRoomChange={handleFocusRoomChange}
                            onSetAlarm={handleSetAlarm}
                            availableRooms={openRooms.map(r => r.id)}
                            allRooms={allRooms}
                            favoriteRooms={favoriteRooms}
                            onToggleFavorite={onToggleFavorite}
                            selectedRoomId={selectedRoomId}
                            onSelectRoom={setSelectedRoomId}
                            setAllRooms={setAllRooms}
                            isAutoAssignment={isAutoAssignment}
                            onSetFlag={handleSetFlag}
                            isPhoneModeActive={isPhoneModeActive}
                            isHistoricalViewActive={isHistoricalViewActive}
                            historicalRoomId={historicalRoomId}
                            onCloseHistoricalView={onCloseHistoricalView}
                            onPrefillTask={onPrefillTask}
                            onFocusLinkedTask={onFocusLinkedTask}
                            taskBadgeMessageIds={selectedRoomId ? (taskBadgeMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                            scrollToMessageId={scrollToMessageId?.roomId === selectedRoomId ? { messageId: scrollToMessageId.messageId, nonce: scrollToMessageId.nonce } : null}
                            bookmarkMessageIds={selectedRoomId ? (bookmarkMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                            onToggleBookmark={selectedRoomId ? (messageId: number) => onToggleBookmark?.(selectedRoomId, messageId) : undefined}
                          />
                        }
                      />
                    }
                  />
                </div>
                {sharedReference.renderSideTabDrawerButtons()}
              </>
            ) : (
              sharedReference.renderResizableLayout(
                <div className="flex flex-col min-h-0 h-full">
                  <div className="flex-shrink-0">
                    <ChatRoomHeader
                      title={selectedRoomInfo.title}
                      tags={selectedRoomInfo.tags}
                      flag={selectedRoomInfo.flag}
                      isVIP={selectedRoomInfo.isVIP}
                      isMaskingDisabled={isMaskingDisabled}
                      onToggleMasking={handleToggleMasking}
                      isFavorite={selectedRoomId !== null && favoriteRooms.has(selectedRoomId)}
                      onToggleFavorite={selectedRoomId !== null ? () => onToggleFavorite(selectedRoomId) : undefined}
                      onDownload={handleDownload}
                      onReload={handleReload}
                      onOpenInNewWindow={selectedRoomId ? () => detachedWindowManager.openDetached(selectedRoomId) : undefined}
                      onAddTask={() => openDrawer({ isAddingTask: true })}
                      isThreadModeActive={isThreadMode}
                      onToggleThreadMode={onToggleThreadMode}
                      isThreadButtonDisabled={!selectedRoomId}
                    />
                  </div>
                  <div className="flex-1 min-h-0">
                    <ContactRoomArea
                      chatMode={chatMode}
                      onCloseRoom={handleCloseRoom}
                      onFocusRoomChange={handleFocusRoomChange}
                      onSetAlarm={handleSetAlarm}
                      availableRooms={openRooms.map(r => r.id)}
                      allRooms={allRooms}
                      favoriteRooms={favoriteRooms}
                      onToggleFavorite={onToggleFavorite}
                      selectedRoomId={selectedRoomId}
                      onSelectRoom={setSelectedRoomId}
                      setAllRooms={setAllRooms}
                      isAutoAssignment={isAutoAssignment}
                      onSetFlag={handleSetFlag}
                      isPhoneModeActive={isPhoneModeActive}
                      isHistoricalViewActive={isHistoricalViewActive}
                      historicalRoomId={historicalRoomId}
                      onCloseHistoricalView={onCloseHistoricalView}
                      onPrefillTask={onPrefillTask}
                      onFocusLinkedTask={onFocusLinkedTask}
                      taskBadgeMessageIds={selectedRoomId ? (taskBadgeMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                      scrollToMessageId={scrollToMessageId?.roomId === selectedRoomId ? { messageId: scrollToMessageId.messageId, nonce: scrollToMessageId.nonce } : null}
                      bookmarkMessageIds={selectedRoomId ? (bookmarkMap?.get(selectedRoomId) ?? new Set()) : new Set()}
                      onToggleBookmark={selectedRoomId ? (messageId: number) => onToggleBookmark?.(selectedRoomId, messageId) : undefined}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {sharedReference.renderSideTabOverlays()}

      {isSearchModeActive && selectedSearchResultId !== null && (
        <SearchResultOverlay
          room={allRooms.find((r) => r.id === selectedSearchResultId) || null}
          onClose={() => onSelectSearchResult(null)}
          handleSetAlarm={handleSetAlarm}
          handleSetFlag={handleSetFlag}
          allRooms={allRooms}
          setAllRooms={setAllRooms}
          favoriteRooms={favoriteRooms}
          onToggleFavorite={onToggleFavorite}
          isManagerMode={isManagerMode}
        />
      )}

      {sharedReference.renderOmsConnectionModal()}
    </div>
  );
};

export default ChatModeContainer;
