import { useRef, useEffect } from 'react';
import { Room } from '../data/mockData';
import { getMaxRoomsForMode } from '../utils/roomUtils';

interface UseChatDisplayModeProps {
  setChatMode: React.Dispatch<React.SetStateAction<'grid' | '2x1' | 'single' | 'focus' | 'kanban'>>;
  isPhoneModeActive: boolean;
  allRooms: Room[];
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const useChatDisplayMode = ({
  setChatMode,
  isPhoneModeActive,
  allRooms,
  setAllRooms,
  selectedRoomId,
  setSelectedRoomId,
}: UseChatDisplayModeProps) => {
  const allRoomsRef = useRef(allRooms);
  useEffect(() => {
    allRoomsRef.current = allRooms;
  }, [allRooms]);

  const getOpenRooms = () => {
    return allRoomsRef.current.filter(room => room.isOpen);
  };

  const handleChangeChatDisplayMode = (mode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban' | 'phone') => {
    if (mode === 'phone') {
      // Logic for phone mode if needed, or handled elsewhere
      return;
    }

    if (isPhoneModeActive) {
      return;
    }

    console.log('🔧 handleChangeChatDisplayMode called with mode:', mode);

    setChatMode(mode);

    const maxRooms = getMaxRoomsForMode(mode);
    const openRooms = getOpenRooms();

    if (openRooms.length > maxRooms) {
      const roomsToClose = openRooms.slice(maxRooms);
      setAllRooms(prev => prev.map(room =>
        roomsToClose.some(r => r.id === room.id)
          ? { ...room, isOpen: false }
          : room
      ));
    }

    if (mode === 'focus' && selectedRoomId) {
      const selectedRoom = allRoomsRef.current.find(r => r.id === selectedRoomId);
      if (!selectedRoom?.isOpen && openRooms.length > 0) {
        setSelectedRoomId(openRooms[0].id);
      }
    } else if (mode === 'focus' && openRooms.length > 0) {
      setSelectedRoomId(openRooms[0].id);
    }
  };

  return {
    handleChangeChatDisplayMode,
  };
};
