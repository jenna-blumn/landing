import { Channel } from '../../types/channel';
import { isAlarmActive } from '../../utils/timeUtils';

export type MainCategory = 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
export type AdditionalCategory = 'request' | 'maintain' | null;
export type QueueType = 'ai-response' | 'queue-waiting' | null;

const CHAT_GROUP_CHANNELS = ['chat', 'kakao', 'naver', 'instagram'];

export interface SidebarFilterRoom {
  id: number;
  brand: string;
  channel: string;
  mainCategory: Exclude<MainCategory, 'all'>;
  additionalCategory: Exclude<AdditionalCategory, null> | null;
  alarmTimestamp: number | null;
  isAIHandled?: boolean;
}

interface CoreFilterParams<T extends SidebarFilterRoom> {
  rooms: T[];
  selectedBrands: string[];
  selectedChannel: Channel;
  selectedMainCategory: MainCategory;
  selectedAdditionalCategory: AdditionalCategory;
  selectedQueueType: QueueType;
}

export const filterContactsBySidebarCore = <T extends SidebarFilterRoom>({
  rooms,
  selectedBrands,
  selectedChannel,
  selectedMainCategory,
  selectedAdditionalCategory,
  selectedQueueType,
}: CoreFilterParams<T>): T[] => {
  return rooms.filter((room) => {
    if (selectedQueueType !== null) {
      if (selectedQueueType === 'ai-response' && !room.isAIHandled) {
        return false;
      }
      if (selectedQueueType === 'queue-waiting' && room.mainCategory !== 'waiting') {
        return false;
      }
      return matchesChannel(room.channel, selectedChannel);
    }

    const isAllBrandsSelected = selectedBrands.length === 0;
    if (!isAllBrandsSelected && !selectedBrands.includes(room.brand)) {
      return false;
    }

    if (!matchesChannel(room.channel, selectedChannel)) {
      return false;
    }

    if (selectedMainCategory === 'alarm') {
      if (!isAlarmActive(room.alarmTimestamp)) {
        return false;
      }
    } else if (selectedMainCategory !== 'all' && room.mainCategory !== selectedMainCategory) {
      return false;
    }

    if (selectedAdditionalCategory !== null && room.additionalCategory !== selectedAdditionalCategory) {
      return false;
    }

    return true;
  });
};

export const resolveVisibleSelectedRoomId = <T extends { id: number }>(
  visibleRooms: T[],
  previousRoomId: number | null
): number | null => {
  if (visibleRooms.length === 0) {
    return null;
  }
  if (previousRoomId !== null && visibleRooms.some((room) => room.id === previousRoomId)) {
    return previousRoomId;
  }
  return visibleRooms[0].id;
};

const matchesChannel = (roomChannel: string, selectedChannel: Channel): boolean => {
  if (selectedChannel === 'all') {
    return true;
  }
  if (selectedChannel === 'chat') {
    return CHAT_GROUP_CHANNELS.includes(roomChannel);
  }
  return roomChannel === selectedChannel;
};
