import React, { useState, useRef, useCallback } from 'react';
import ChatWorkspaceWithTabs from './ChatWorkspaceWithTabs';
import { HistoryContactData, getHistoryContactById, mockHistoryContacts } from '../../features/history/mockHistoryContactData';
import { Room } from '../../data/mockData';
import type { ComposerMessage } from '../../features/channelComposer/types';

interface HistoryContactModeLayoutProps {
  currentRoomId: number | null;
  historyContactId: number;
  allRooms: Room[];
  onExitHistoryMode: () => void;
  onSelectHistoricalRoom: (roomId: number) => void;
  onSendMessage?: (roomId: number, message: ComposerMessage) => void;
  favoriteRooms?: Set<number>;
  onToggleFavorite?: (roomId: number) => void;
  /** Custom chat tab content for the current room (left panel), e.g. ContactRoomArea with function bar */
  currentRoomChatContent?: React.ReactNode;
}

const MIN_WIDTH_PERCENT = 25;
const MAX_WIDTH_PERCENT = 75;

const HistoryContactModeLayout: React.FC<HistoryContactModeLayoutProps> = ({
  currentRoomId,
  historyContactId,
  allRooms,
  onExitHistoryMode,
  onSelectHistoricalRoom,
  onSendMessage,
  favoriteRooms = new Set(),
  onToggleFavorite,
  currentRoomChatContent,
}) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [likedHistoryContacts, setLikedHistoryContacts] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentRoom = allRooms.find(r => r.id === currentRoomId) || null;
  const historyContact = getHistoryContactById(historyContactId);

  const ongoingContact = mockHistoryContacts.find(c => c.status === 'ongoing');
  const fallbackCurrentData: HistoryContactData | null = currentRoom ? null : (ongoingContact || mockHistoryContacts[mockHistoryContacts.length - 1] || null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const clampedWidth = Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, newLeftWidth));
    setLeftWidthPercent(clampedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleHistorySelectFromCurrent = (roomId: number) => {
    onExitHistoryMode();
    onSelectHistoricalRoom(roomId);
  };

  const handleHistorySelectFromHistory = (roomId: number) => {
    onExitHistoryMode();
    onSelectHistoricalRoom(roomId);
  };

  const handleSendMessageCurrent = (message: ComposerMessage) => {
    if (currentRoomId && onSendMessage) {
      onSendMessage(currentRoomId, message);
    }
  };

  const handleSendMessageHistory = (message: ComposerMessage) => {
    if (historyContactId && onSendMessage) {
      onSendMessage(historyContactId, message);
    }
  };

  const handleMakeMainChat = () => {
    onSelectHistoricalRoom(historyContactId);
    onExitHistoryMode();
  };

  const handleToggleLike = () => {
    setLikedHistoryContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(historyContactId)) {
        newSet.delete(historyContactId);
      } else {
        newSet.add(historyContactId);
      }
      return newSet;
    });
  };

  return (
    <div ref={containerRef} className="h-full flex">
      <div
        className="h-full overflow-hidden border-r border-gray-200"
        style={{ width: `${leftWidthPercent}%` }}
      >
        <ChatWorkspaceWithTabs
          isHistoryWorkspace={false}
          contactData={currentRoom || fallbackCurrentData}
          allRooms={allRooms}
          onSelectHistoricalRoom={handleHistorySelectFromCurrent}
          selectedRoomId={currentRoomId}
          onSendMessage={handleSendMessageCurrent}
          isFavorite={currentRoomId !== null && favoriteRooms.has(currentRoomId)}
          onToggleFavorite={currentRoomId !== null && onToggleFavorite ? () => onToggleFavorite(currentRoomId) : undefined}
          chatContent={currentRoomChatContent}
        />
      </div>

      <div
        className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      />

      <div
        className="h-full overflow-hidden"
        style={{ width: `${100 - leftWidthPercent}%` }}
      >
        <ChatWorkspaceWithTabs
          isHistoryWorkspace={true}
          contactData={historyContact || null}
          allRooms={allRooms}
          onBack={onExitHistoryMode}
          onSelectHistoricalRoom={handleHistorySelectFromHistory}
          selectedRoomId={historyContactId}
          onSendMessage={handleSendMessageHistory}
          onMakeMainChat={handleMakeMainChat}
          isLiked={likedHistoryContacts.has(historyContactId)}
          onToggleLike={handleToggleLike}
        />
      </div>
    </div>
  );
};

export default HistoryContactModeLayout;
