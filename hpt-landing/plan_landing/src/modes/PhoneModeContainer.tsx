import React, { useState, useRef, useMemo } from 'react';
import { Room } from '../data/mockData';
import type { CreateTaskInput } from '../../packages/task-module/src/types/task';
import { useSharedReferenceArea } from '../components/SharedReferenceArea/SharedReferenceArea';
import GNB from '../components/GNB';
import SidebarArea from '../components/SidebarArea/SidebarArea';
import ContactRoomArea from '../components/ContactRoomArea/ContactRoomArea';
import AcknowledgementArea from '../components/ContactRoomArea/AcknowledgementArea';
import ChatRoomHeader from '../components/ChatRoomHeader';
import SearchArea from '../components/SearchArea/SearchArea';
import SearchResultOverlay from '../components/SearchArea/SearchResultOverlay';
import HistoryContactModeLayout from '../components/HistoryContactMode/HistoryContactModeLayout';
import { FilterMode } from '../features/search/types';
import { Channel } from '../types/channel';
import { useTaskStore } from '../stores/useTaskStore';
import { useSearchStore } from '../stores/useSearchStore';

interface PhoneModeContainerProps {
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
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  onSelectHistoricalRoom: (roomId: number) => void;
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
  isHistoricalViewActive: boolean;
  historicalRoomId: number | null;
  onCloseHistoricalView: () => void;
  isHistoryContactMode: boolean;
  historyContactId: number | null;
  onEnterHistoryContactMode: (historyId: number) => void;
  onExitHistoryContactMode: () => void;
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
}

const PhoneModeContainer: React.FC<PhoneModeContainerProps> = ({
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
  selectedRoomId,
  setSelectedRoomId,
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
  isHistoricalViewActive,
  historicalRoomId,
  onCloseHistoricalView,
  isHistoryContactMode,
  historyContactId,
  onEnterHistoryContactMode,
  onExitHistoryContactMode,
  onNavigateToRoom,
  onClearSelectedRoom,
  onPrefillTask,
  onFocusLinkedTask,
  taskBadgeMap,
  scrollToMessageId,
  bookmarkMap,
  onToggleBookmark,
}) => {
  const [isMaskingDisabled, setIsMaskingDisabled] = useState(false);
  const mainContentAreaRef = useRef<HTMLDivElement>(null);

  // Search state from Zustand store
  const isSearchModeActive = useSearchStore(s => s.isActive);
  const searchModeFilterMode = useSearchStore(s => s.filterMode);
  const searchQuery = useSearchStore(s => s.query);
  const searchFilters = useSearchStore(s => s.filters);
  const searchResults = useSearchStore(s => s.results);
  const selectedSearchResultId = useSearchStore(s => s.selectedResultId);
  const { setQuery: onSearchQueryChange, setFilters: onSearchFiltersChange, setResults: onSearchResultsChange, selectResult: onSelectSearchResult } = useSearchStore.getState();

  const sharedReference = useSharedReferenceArea({
    allRooms,
    selectedRoomId,
    setSelectedRoomId,
    onSelectHistoricalRoom: onEnterHistoryContactMode,
    isSearchModeActive,
    mainContentAreaRef,
    onNavigateToRoom: onNavigateToRoom || ((roomId: number) => setSelectedRoomId(roomId)),
    isManagerMode,
    selectedRoom: selectedRoomId ? allRooms.find(r => r.id === selectedRoomId) || null : null,
    onSetAlarm: handleSetAlarm,
    onSetFlag: handleSetFlag,
  });

  const handleToggleMasking = () => {
    setIsMaskingDisabled(prev => !prev);
  };

  const handleDownload = () => {
    console.log('Download chat history');
  };

  const handleReload = () => {
    console.log('Reload chat');
  };

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

  const handleContactClick = (clickedRoomId: number) => {
    setAllRooms(prev => prev.map(room => {
      if (room.isOpen) {
        return { ...room, isOpen: false };
      } else if (room.id === clickedRoomId) {
        return { ...room, isOpen: true };
      }
      return room;
    }));

    setSelectedRoomId(clickedRoomId);
  };

  const handleCloseRoom = (roomId: number) => {
    setAllRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, isOpen: false }
        : room
    ));

    setSelectedRoomId(null);
  };

  const phoneWorkspaceRooms = allRooms
    .filter(room => room.isOpen)
    .map(room => room.id);

  const handleFocusRoomChange = () => {};
  const handleModeChange = () => {};

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden w-full">
      <div className="w-12 flex-shrink-0">
        <GNB
          onModeChange={handleModeChange}
          currentMode={'single'}
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
          onOpenTaskDetail={useTaskStore.getState().openTaskDetailView}
          isTaskDetailViewActive={false}
          onWorkspaceMove={() => {}}
          currentWorkspace={1}
          totalWorkspaces={1}
        />
      </div>

      <div className={`flex-shrink-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-[300px]'
      }`}>
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
        />
      </div>

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
              <div className="flex-1 min-h-0">
                <HistoryContactModeLayout
                  currentRoomId={selectedRoomId}
                  historyContactId={historyContactId}
                  allRooms={allRooms}
                  onExitHistoryMode={onExitHistoryContactMode}
                  onSelectHistoricalRoom={onEnterHistoryContactMode}
                  favoriteRooms={favoriteRooms}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
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
                      onAddTask={() => useTaskStore.getState().openTaskDrawerForCreation(true)}
                    />
                  </div>
                  <div className="flex-1 min-h-0">
                    <ContactRoomArea
                      chatMode={'single'}
                      onCloseRoom={handleCloseRoom}
                      onFocusRoomChange={handleFocusRoomChange}
                      onSetAlarm={handleSetAlarm}
                      availableRooms={phoneWorkspaceRooms}
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

export default PhoneModeContainer;
