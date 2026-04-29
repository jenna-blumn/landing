import React, { useState, useCallback, useRef } from 'react';
import { Room } from '../../data/mockData';
import ContactRoomArea from '../ContactRoomArea/ContactRoomArea';
import ContactReferenceArea from '../ContactReferenceArea';
import ChatRoomHeader from '../ChatRoomHeader';

interface SearchResultOverlayProps {
  room: Room | null;
  onClose: () => void;
  handleSetAlarm?: (roomId: number, alarmTimestamp: number | null) => void;
  handleSetFlag?: (roomId: number, flagType: string | null) => void;
  allRooms: Room[];
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  favoriteRooms?: Set<number>;
  onToggleFavorite?: (roomId: number) => void;
  isManagerMode?: boolean;
  /** true이면 fixed 포지션 대신 부모 컨테이너를 채움 */
  inline?: boolean;
  /** true이면 입력창(컴포저) 및 기능 버튼 숨김 */
  readOnly?: boolean;
}

const SearchResultOverlay: React.FC<SearchResultOverlayProps> = ({
  room,
  onClose,
  handleSetAlarm,
  handleSetFlag,
  allRooms,
  setAllRooms,
  favoriteRooms = new Set(),
  onToggleFavorite,
  isManagerMode = false,
  inline = false,
  readOnly = false,
}) => {
  const [chatWidth, setChatWidth] = useState(55);
  const [isMaskingDisabled, setIsMaskingDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = chatWidth;
    const containerWidth = inline
      ? (containerRef.current?.clientWidth || window.innerWidth * 0.45)
      : window.innerWidth * 0.7;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.min(Math.max(startWidth + deltaPercent, 30), 70);
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [chatWidth, inline]);

  if (!room) return null;

  const handleToggleMasking = () => {
    setIsMaskingDisabled(prev => !prev);
  };

  const handleReload = () => {
    console.log('Reload chat for room:', room.id);
  };

  const handleOpenInNewWindow = () => {
    const url = `${window.location.origin}${window.location.pathname}?roomId=${room.id}`;
    window.open(url, '_blank', 'width=1400,height=900,menubar=no,toolbar=no');
  };

  const getSelectedRoomInfo = () => {
    return {
      tags: room.tags || [],
      flag: room.flag || null,
      isVIP: room.isVIP || false
    };
  };

  const noopAlarm = (_roomId: number, _ts: number | null) => {};
  const noopFlag = (_roomId: number, _flag: string | null) => {};
  const setAlarm = handleSetAlarm || noopAlarm;
  const setFlag = handleSetFlag || noopFlag;

  const containerClassName = inline
    ? 'flex-1 flex flex-col overflow-hidden h-full bg-white'
    : 'fixed right-0 top-0 bottom-0 w-[70%] bg-white rounded-l-2xl z-50 flex flex-col animate-slide-in-right overlay-shadow';

  const content = (
    <div ref={containerRef} className={containerClassName}>
      <div className="flex-1 flex overflow-hidden">
        <div
          className="flex flex-col min-h-0"
          style={{ width: `${chatWidth}%` }}
        >
          <div className={`flex-shrink-0 ${inline ? '' : 'rounded-tl-2xl'} overflow-hidden`}>
            <ChatRoomHeader
              tags={getSelectedRoomInfo().tags}
              flag={getSelectedRoomInfo().flag}
              isVIP={getSelectedRoomInfo().isVIP}
              isMaskingDisabled={isMaskingDisabled}
              onToggleMasking={handleToggleMasking}
              isFavorite={favoriteRooms.has(room.id)}
              onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(room.id) : undefined}
              onReload={handleReload}
              onOpenInNewWindow={handleOpenInNewWindow}
              onClose={onClose}
            />
          </div>
          <div className="flex-1 overflow-auto border-r border-gray-300">
            <ContactRoomArea
              chatMode="single"
              onCloseRoom={() => {}}
              onFocusRoomChange={() => {}}
              onSetAlarm={setAlarm}
              onSetFlag={setFlag}
              availableRooms={allRooms.map(r => r.id)}
              allRooms={allRooms}
              favoriteRooms={favoriteRooms}
              onToggleFavorite={onToggleFavorite || (() => {})}
              selectedRoomId={room.id}
              onSelectRoom={() => {}}
              setAllRooms={setAllRooms}
              isManagerMode={isManagerMode}
              isSearchResultOverlay={true}
              hideComposer={readOnly}
            />
          </div>
        </div>

        <div
          className="w-1 bg-gray-200 hover:bg-blue-400 cursor-ew-resize transition-colors flex-shrink-0"
          onMouseDown={handleMouseDown}
        />

        <div className="flex-1 overflow-auto">
          <ContactReferenceArea
            allRooms={allRooms}
            hideSettingsButton
          />
        </div>
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <>
      {content}
      <style>
        {`
          @keyframes slide-in-right {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out;
          }

          .overlay-shadow {
            box-shadow: -8px 0 24px rgba(0, 0, 0, 0.15), -4px 0 12px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </>
  );
};

export default SearchResultOverlay;
