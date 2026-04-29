import { useRef, useEffect } from 'react';
import { Room } from '../data/mockData';
import { getMaxRoomsForMode } from '../utils/roomUtils';

interface UseRoomManagementProps {
  allRooms: Room[];
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
}

export const useRoomManagement = ({
  allRooms,
  setAllRooms,
  selectedRoomId,
  setSelectedRoomId,
}: UseRoomManagementProps) => {
  const allRoomsRef = useRef(allRooms);
  useEffect(() => {
    allRoomsRef.current = allRooms;
  }, [allRooms]);

  const getOpenRooms = () => {
    return allRoomsRef.current.filter(room => room.isOpen);
  };

  const handleContactClick = (clickedRoomId: number) => {
    setAllRooms(prev => prev.map(room => ({
      ...room,
      isOpen: room.id === clickedRoomId
    })));
    setSelectedRoomId(clickedRoomId);
  };

  const handleCloseRoom = (roomId: number) => {
    setAllRooms(prev => {
      const updated = prev.map(room =>
        room.id === roomId ? { ...room, isOpen: false } : room
      );

      if (selectedRoomId === roomId) {
        const remainingOpen = updated.filter(r => r.isOpen);
        setSelectedRoomId(remainingOpen.length > 0 ? remainingOpen[0].id : null);
      }

      return updated;
    });
  };

  return {
    getOpenRooms,
    handleContactClick,
    handleCloseRoom,
    getMaxRoomsForMode,
  };
};
