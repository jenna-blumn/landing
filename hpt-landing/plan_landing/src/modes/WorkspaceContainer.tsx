import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Room } from '../data/mockData';
import { useSharedReferenceArea } from '../components/SharedReferenceArea/SharedReferenceArea';
import GNB from '../components/GNB';
import SidebarArea from '../components/SidebarArea/SidebarArea';
import ContactRoomArea from '../components/ContactRoomArea/ContactRoomArea';
import AcknowledgementArea from '../components/ContactRoomArea/AcknowledgementArea';
import ChatRoomHeader from '../components/ChatRoomHeader';
import { useTaskStore } from '../stores/useTaskStore';
import { useSearchStore } from '../stores/useSearchStore';
import SearchArea from '../components/SearchArea/SearchArea';
import SearchResultOverlay from '../components/SearchArea/SearchResultOverlay';
import HistoryContactModeLayout from '../components/HistoryContactMode/HistoryContactModeLayout';
import { WorkspaceContainerProps, ChatMode } from './types';

interface WorkspaceContainerInternalProps extends WorkspaceContainerProps {
  chatMode: ChatMode;
  onModeChange: (mode: ChatMode | 'phone') => void;
  handleContactClick: (roomId: number) => void;
  handleCloseRoom: (roomId: number) => void;
  openRooms: Room[];
  selectedRoomInfo: { title?: string; tags: string[]; flag: { type: 'urgent' | 'important' | 'normal' | 'info' | 'completed' | null; color: string; label: string } | null; isVIP: boolean };
  handleFocusRoomChange: (roomId: number) => void;
  showTaskDetailInGNB: boolean;
}

const WorkspaceContainer: React.FC<WorkspaceContainerInternalProps> = ({
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
  // Internal props
  chatMode,
  onModeChange,
  handleContactClick,
  handleCloseRoom,
  openRooms,
  selectedRoomInfo,
  handleFocusRoomChange,
  showTaskDetailInGNB,
}) => {
  const mainContentAreaRef = useRef<HTMLDivElement>(null);
  const [isMaskingDisabled, setIsMaskingDisabled] = useState(false);

  // Search state from store
  const isSearchModeActive = useSearchStore(s => s.isActive);
  const searchQuery = useSearchStore(s => s.query);
  const searchFilters = useSearchStore(s => s.filters);
  const searchResults = useSearchStore(s => s.results);
  const selectedSearchResultId = useSearchStore(s => s.selectedResultId);
  const searchModeFilterMode = useSearchStore(s => s.filterMode);

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

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden w-full">
      <div className="w-12 flex-shrink-0">
        <GNB
          onModeChange={onModeChange}
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
          onOpenTaskDetail={showTaskDetailInGNB ? useTaskStore.getState().openTaskDetailView : undefined}
          isTaskDetailViewActive={false}
          onWorkspaceMove={() => { }}
          currentWorkspace={1}
          totalWorkspaces={1}
        />
      </div>

      <div className={`flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-[300px]'}`}>
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
                  onSearchQueryChange={useSearchStore.getState().setQuery}
                  searchFilters={searchFilters}
                  onSearchFiltersChange={useSearchStore.getState().setFilters}
                  searchResults={searchResults}
                  onSearchResultsChange={useSearchStore.getState().setResults}
                  onSelectResult={useSearchStore.getState().selectResult}
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
          onClose={() => useSearchStore.getState().selectResult(null)}
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

export default WorkspaceContainer;
