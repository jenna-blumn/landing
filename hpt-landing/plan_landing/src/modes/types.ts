import { Room } from '../data/mockData';
import { Channel } from '../types/channel';
import { FilterMode } from '../features/search/types';

export type MainCategory = 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
export type ChatMode = 'grid' | '2x1' | 'single' | 'focus' | 'kanban';

// Core room/data props
interface RoomProps {
  allRooms: Room[];
  setAllRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  favoriteRooms: Set<number>;
  onToggleFavorite: (roomId: number) => void;
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  handleSetAlarm: (roomId: number, alarmTimestamp: number | null) => void;
  handleSetFlag: (roomId: number, flagType: string | null) => void;
}

// Sidebar layout props
interface SidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  inboxPosition: 'top' | 'bottom';
  onToggleInboxPosition: () => void;
  onAcceptContact: () => void;
}

// Channel/brand filter props
interface ChannelBrandProps {
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
  isChannelSectionVisible: boolean;
  onToggleChannelSection: (visible: boolean) => void;
  isBrandsInGNB: boolean;
  onToggleBrandsInGNB: (inGNB: boolean) => void;
  isBrandSectionVisible: boolean;
  onToggleBrandSectionVisible: (visible: boolean) => void;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
}

// Category/queue selection props
interface CategoryProps {
  selectedMainCategory: MainCategory;
  onSelectMainCategory: (category: MainCategory) => void;
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  onSelectAdditionalCategory: (category: 'request' | 'maintain' | null) => void;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  onSelectQueueType: (queueType: 'ai-response' | 'queue-waiting' | null) => void;
}

// Mode toggle props
interface ModeProps {
  isPhoneModeActive: boolean;
  isPhoneButtonVisible: boolean;
  onTogglePhoneButtonVisibility: () => void;
  isAutoAssignment: boolean;
  onToggleAssignment: (isAuto: boolean) => void;
  isManagerMode: boolean;
  onToggleManagerMode: (isManager: boolean) => void;
  isPhoneIncoming: boolean;
  onTogglePhoneIncoming: (isIncoming: boolean) => void;
}

// Search props (only enter/exit — actual search state comes from useSearchStore)
interface SearchProps {
  onEnterSearchMode: (filterMode?: FilterMode) => void;
  onExitSearchMode: () => void;
}

// History/historical view props
interface HistoryProps {
  isHistoricalViewActive: boolean;
  historicalRoomId: number | null;
  onCloseHistoricalView: () => void;
  isHistoryContactMode: boolean;
  historyContactId: number | null;
  onEnterHistoryContactMode: (historyId: number) => void;
  onExitHistoryContactMode: () => void;
}

// Navigation props
interface NavigationProps {
  onNavigateToRoom?: (roomId: number) => void;
  onClearSelectedRoom?: () => void;
}

// Combined base type used by both containers
export type WorkspaceContainerProps = RoomProps & SidebarProps & ChannelBrandProps
  & CategoryProps & ModeProps & SearchProps & HistoryProps & NavigationProps;
