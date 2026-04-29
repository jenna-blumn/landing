import React, { useMemo } from 'react';
import { Avatar, Button, Badge, Checkbox, TooltipTrigger, Icon, Popover, PopoverAnchor, PopoverContent, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { IconType } from '@blumnai-studio/blumnai-design-system';
import { flagIconColorMap } from '../../features/contactTab/utils/flagDefinitions';
import { mockBrands } from '../../data/mockData';

import FilterModal, { FilterState } from './FilterModal';
import DateFilterModal, { DateFilterState, getDatePresetLabel } from './DateFilterModal';
import ContactActionModal from './ContactActionModal';
import AssignmentConfirmationModal from './AssignmentConfirmationModal';
import ConsultantSelectionModal from './ConsultantSelectionModal';
import EmptyState from '../common/EmptyState';
import { filterContactsBySidebarCore } from './contactSelectors';
import { Channel } from '../../types/channel';
import { SIDEBAR_BODY_TEXT, SIDEBAR_CARD_PADDING, SIDEBAR_CARD_LIST_GAP, SIDEBAR_META_TEXT } from '../../features/layout/panelSpacing';

// Hoisted static data - no dependency on props/state
const BRAND_COLOR_MAP: Record<string, string> = {
  'bg-red-500': '#ef4444',
  'bg-yellow-500': '#eab308',
  'bg-red-600': '#dc2626',
  'bg-pink-500': '#ec4899',
  'bg-blue-600': '#2563eb',
};

const getBrandInfoStatic = (brand: string) => {
  const found = mockBrands.find(b => b.id === brand);
  return {
    logoUrl: found?.logoUrl,
    initials: found?.icon || brand.charAt(0).toUpperCase(),
    name: found?.name || brand,
    colorHex: found?.color ? BRAND_COLOR_MAP[found.color] || '#6b7280' : '#6b7280',
  };
};

const CHANNEL_ICON_MAP: Record<string, IconType> = {
  chat: ['communication', 'chat-1'],
  phone: ['device', 'phone'],
  kakao: ['communication', 'chat-3'],
  naver: ['communication', 'chat-4'],
  instagram: ['communication', 'chat-3'] as IconType,
};

const getChannelColorStatic = (channel: string) => {
  const colorMap: { [key: string]: string } = {
    chat: 'bg-blue-500',
    phone: 'bg-green-500',
    kakao: 'bg-yellow-500',
    naver: 'bg-emerald-500',
    instagram: 'bg-pink-500'
  };
  return colorMap[channel] || 'bg-blue-500';
};

const formatTimeElapsed = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  return `${months}mo`;
};

type FlagType = 'urgent' | 'important' | 'normal' | 'info' | 'completed';

interface Room {
  id: number;
  contactName: string;
  conversationTopic: string;
  brand: string;
  channel: 'chat' | 'phone' | 'kakao' | 'naver' | 'instagram' | 'board' | 'email';
  isVIP: boolean;
  isProblematic?: boolean;
  isLongterm?: boolean;
  lastConversationTimestamp?: number;
  lastActivityTimestamp: number;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  unreadCount: number;
  currentWorkspaceId: number | null;
  customerStatus: 'online' | 'typing' | 'away';
  mainCategory: 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  additionalCategory: 'request' | 'maintain' | null;
  alarmTimestamp: number | null;
  flag?: { type: FlagType; color: string } | null;
  summary?: string;
}

interface ContactListAreaProps {
  isCollapsed: boolean;
  allRooms: Room[];
  onContactClick: (roomId: number) => void;
  selectedBrands: string[];
  selectedChannel: Channel;
  favoriteRooms: Set<number>;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  isAutoAssignment: boolean;
  selectedRoomId: number | null;
  isPhoneModeActive: boolean;
  activeFilters?: FilterState;
  onActiveFiltersChange?: (filters: FilterState) => void;
  isFilterModalOpen?: boolean;
  onFilterModalOpenChange?: (isOpen: boolean) => void;
  dateFilter?: DateFilterState;
  onDateFilterChange?: (dateFilter: DateFilterState) => void;
  isSearchModeActive?: boolean;
  onExitSearchMode?: () => void;
  isManagerMode?: boolean;
  onClearSelectedRoom?: () => void;
  // 별도 윈도우
  detachedRoomIds?: Set<number>;
  onFocusDetached?: (roomId: number) => void;
}

const ContactListArea: React.FC<ContactListAreaProps> = ({
  isCollapsed,
  allRooms,
  onContactClick,
  selectedBrands,
  selectedChannel,
  favoriteRooms,
  selectedMainCategory,
  selectedAdditionalCategory,
  selectedQueueType,
  isAutoAssignment,
  selectedRoomId,
  isPhoneModeActive,
  activeFilters: externalActiveFilters,
  onActiveFiltersChange,
  isFilterModalOpen: externalIsFilterModalOpen,
  onFilterModalOpenChange,
  dateFilter: externalDateFilter,
  onDateFilterChange,
  isSearchModeActive = false,
  onExitSearchMode,
  isManagerMode = false,
  onClearSelectedRoom,
  detachedRoomIds,
  onFocusDetached,
}) => {
  const handleContactClick = (roomId: number) => {
    if (detachedRoomIds?.has(roomId) && onFocusDetached) {
      onFocusDetached(roomId);
      return;
    }
    if (isSearchModeActive && onExitSearchMode) {
      onExitSearchMode();
    }
    onContactClick(roomId);
  };
  const [isCompactView, setIsCompactView] = React.useState(false);
  const [selectedContactIds, setSelectedContactIds] = React.useState<Set<number>>(new Set());
  const [hoveredContactId, setHoveredContactId] = React.useState<number | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [internalIsFilterModalOpen, setInternalIsFilterModalOpen] = React.useState(false);
  const [internalActiveFilters, setInternalActiveFilters] = React.useState<FilterState>({
    dateRange: { start: null, end: null },
    flags: [],
    customerGrades: [],
    sortBy: 'lastConsultation',
    sortOrder: 'desc'
  });
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = React.useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = React.useState(false);
  const [isConsultantSelectionModalOpen, setIsConsultantSelectionModalOpen] = React.useState(false);
  const [assignedConsultantName, setAssignedConsultantName] = React.useState<string>('');

  const [internalDateFilter, setInternalDateFilter] = React.useState<DateFilterState>(() => {
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

  const activeFilters = externalActiveFilters || internalActiveFilters;
  const setActiveFilters = onActiveFiltersChange || setInternalActiveFilters;
  const isFilterModalOpen = externalIsFilterModalOpen !== undefined ? externalIsFilterModalOpen : internalIsFilterModalOpen;
  const setIsFilterModalOpen = onFilterModalOpenChange || setInternalIsFilterModalOpen;

  const dateFilter = externalDateFilter !== undefined ? externalDateFilter : internalDateFilter;
  const setDateFilter = onDateFilterChange || setInternalDateFilter;

    const coreFilteredContacts = useMemo(() => filterContactsBySidebarCore({
    rooms: allRooms,
    selectedBrands,
    selectedChannel,
    selectedMainCategory,
    selectedAdditionalCategory,
    selectedQueueType,
  }), [allRooms, selectedBrands, selectedChannel, selectedMainCategory, selectedAdditionalCategory, selectedQueueType]);

  const filteredContacts = useMemo(() => coreFilteredContacts.filter(room => {
    if (dateFilter.start || dateFilter.end) {
      const timestamp = room.lastActivityTimestamp || room.lastConversationTimestamp;
      if (!timestamp) {
        return false;
      }
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return false;
      }
      const roomDate = date.toISOString().split('T')[0];
      if (dateFilter.start && roomDate < dateFilter.start) {
        return false;
      }
      if (dateFilter.end && roomDate > dateFilter.end) {
        return false;
      }
    }

    if (activeFilters.flags.length > 0) {
      if (!room.flag || !activeFilters.flags.includes(room.flag.type)) {
        return false;
      }
    }

    if (activeFilters.customerGrades.length > 0) {
      const hasMatch = activeFilters.customerGrades.some(grade => {
        if (grade === 'vip') return room.isVIP;
        if (grade === 'problematic') return room.isProblematic;
        if (grade === 'longterm') return room.isLongterm;
        return false;
      });
      if (!hasMatch) {
        return false;
      }
    }

    return true;
  }), [coreFilteredContacts, dateFilter, activeFilters.flags, activeFilters.customerGrades]);

  React.useEffect(() => {
    if (selectedRoomId === null) {
      return;
    }

    if (filteredContacts.length === 0) {
      onClearSelectedRoom?.();
      return;
    }

    const hasSelectedContact = filteredContacts.some((room) => room.id === selectedRoomId);
    if (!hasSelectedContact) {
      onContactClick(filteredContacts[0].id);
    }
  }, [filteredContacts, selectedRoomId, onContactClick, onClearSelectedRoom]);

  // Check if scroll indicator should be shown
  React.useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current && isCollapsed) {
        const { scrollHeight, clientHeight, scrollTop } = scrollContainerRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScrollable();
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollable);
      return () => scrollContainer.removeEventListener('scroll', checkScrollable);
    }
  }, [filteredContacts, isCollapsed]);

  const getBrandInfo = getBrandInfoStatic;
  const getChannelColor = getChannelColorStatic;


  const getFilterLabel = () => {
    if (selectedQueueType) {
      const queueLabels: Record<'ai-response' | 'queue-waiting', string> = {
        'ai-response': 'AI 응답',
        'queue-waiting': '대기 큐',
      };
      return `${queueLabels[selectedQueueType]} (${filteredContacts.length})`;
    }

    if (selectedAdditionalCategory) {
      const categoryLabels: Record<'request' | 'maintain', string> = {
        request: '요청',
        maintain: '유지',
      };
      return `${categoryLabels[selectedAdditionalCategory]} (${filteredContacts.length})`;
    }

    if (selectedMainCategory !== 'all') {
      const categoryLabels: Record<Exclude<typeof selectedMainCategory, 'all'>, string> = {
        waiting: '대기',
        received: '접수',
        responding: '상담 중',
        closed: '종료',
        alarm: '알람',
        absent: '부재',
      };
      return `${categoryLabels[selectedMainCategory]} (${filteredContacts.length})`;
    }

    return `전체 (${filteredContacts.length})`;
  };

  const getContactCardColors = (room: Room) => {
    if (selectedRoomId === room.id) {
      return {
        bgColor: 'bg-blue-50',
        hoverColor: 'hover:bg-blue-100',
        borderColor: 'border-blue-300'
      };
    }
    return {
      bgColor: 'bg-white',
      hoverColor: 'hover:bg-blue-50',
      borderColor: 'border-gray-200'
    };
  };
  // Check if contact can be clicked based on assignment mode
  const canClickContact = (contact: Room) => {
    // If queue-waiting is selected, allow clicking on waiting contacts
    if (selectedQueueType === 'queue-waiting') {
      return true;
    }

    // In auto assignment mode, waiting contacts cannot be clicked
    if (isAutoAssignment && contact.mainCategory === 'waiting' && !isPhoneModeActive) {
      return false;
    }
    return true;
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.flags.length > 0 ||
      activeFilters.customerGrades.length > 0
    );
  };

  const handleSelectContact = (contactId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContactIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedContactIds.size === filteredContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedContactIds(new Set());
  };

  const handleCategoryChange = () => {
    alert(`카테고리를 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
  };

  const handleConsultantChangeRequest = () => {
    alert(`상담사 변경 요청을 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
  };

  const handleConsultantChange = () => {
    if (selectedQueueType === 'queue-waiting' && !isAutoAssignment) {
      setIsConsultantSelectionModalOpen(true);
    } else {
      alert(`상담사 변경을 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
    }
  };

  const handleEndConsultation = () => {
    alert(`상담 종료를 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
  };

  const handlePendingEnd = () => {
    alert(`종료 보류를 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
  };

  const handleAssignToSelf = () => {
    setAssignedConsultantName('나');
    setIsAssignmentModalOpen(true);
  };

  const handleAssignToConsultant = (_consultantId: string, consultantName: string) => {
    setIsConsultantSelectionModalOpen(false);
    setAssignedConsultantName(consultantName);
    setIsAssignmentModalOpen(true);
  };

  const handleSetFlag = () => {
    alert(`플래그 설정을 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
  };

  const handleBlockCustomer = () => {
    if (confirm(`${selectedContactIds.size}개 컨택을 차단하시겠습니까?`)) {
      alert(`차단 처리를 ${selectedContactIds.size}개 컨택에 적용했습니다.`);
    }
  };

  const handleAssignmentModalClose = () => {
    setIsAssignmentModalOpen(false);
    setSelectedContactIds(new Set());
  };

  const handleStartConsultation = () => {
    setIsAssignmentModalOpen(false);
    setSelectedContactIds(new Set());
    if (isSearchModeActive && onExitSearchMode) {
      onExitSearchMode();
    }
  };

  const hasSelection = selectedContactIds.size > 0;

  if (isCollapsed) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Contact List - Collapsed View */}
        <div className={`bg-gray-100 border border-gray-200 flex-1 rounded-lg ${SIDEBAR_CARD_PADDING} flex flex-col min-h-0 relative`}>
          <div className="font-medium mb-2 text-sm text-center flex-shrink-0">
            <span className="text-gray-700 inline-block">List</span>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="space-y-1 flex-1 overflow-y-auto hide-scrollbar flex flex-col items-center"
          >
            {filteredContacts.map((contact) => {
              const brandData = getBrandInfo(contact.brand);
              const clickable = canClickContact(contact);
              return (
                <TooltipTrigger
                  key={contact.id}
                  content={contact.summary || contact.conversationTopic}
                  placement="right"
                  disabled={!contact.summary && !contact.conversationTopic}
                >
                  <div
                    onClick={() => clickable && handleContactClick(contact.id)}
                    className={`
                      transition-all
                      ${clickable
                        ? 'cursor-pointer hover:scale-110'
                        : 'cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <div className="relative inline-flex">
                      <Avatar
                        variant="initials"
                        initials={brandData.initials}
                        color={brandData.colorHex}
                        size="sm"
                      />
                      {contact.unreadCount > 0 && (
                        <Badge
                          label={contact.unreadCount > 9 ? '9+' : String(contact.unreadCount)}
                          color="orange" size="sm" shape="pill"
                          className="absolute -top-1 -right-1 z-10 !bg-orange-500 !text-white h-4 w-4 !min-h-[16px] !px-1 !text-[10px]"
                        />
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
              );
            })}
            {filteredContacts.length === 0 && (
              <EmptyState
                title="조건에 맞는 컨택이 없습니다"
                description="필터를 조정하거나 다른 카테고리를 선택해 주세요"
              />
            )}
          </div>
          
          {/* Fade Effect - positioned at the bottom of the list area */}
          {showScrollIndicator && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 via-gray-100/70 to-transparent pointer-events-none" />
          )}
          
          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="bg-white rounded-full p-1 shadow-md border border-gray-300">
                <Icon iconType={['arrows', 'arrow-down-s']} size={20} color="informative" className="animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={activeFilters}
        onApplyFilters={handleApplyFilters}
      />
      <DateFilterModal
        isOpen={isDateFilterModalOpen}
        onClose={() => setIsDateFilterModalOpen(false)}
        dateFilter={dateFilter}
        onApply={setDateFilter}
      />
      <AssignmentConfirmationModal
        isOpen={isAssignmentModalOpen}
        assignedCount={selectedContactIds.size}
        consultantName={assignedConsultantName}
        onClose={handleAssignmentModalClose}
        onStartConsultation={handleStartConsultation}
      />
      <ConsultantSelectionModal
        isOpen={isConsultantSelectionModalOpen}
        selectedCount={selectedContactIds.size}
        onClose={() => setIsConsultantSelectionModalOpen(false)}
        onAssign={handleAssignToConsultant}
      />
      <div className="flex-1 flex flex-col h-full relative">
      {/* Contact List */}
      <div className={`flex-1 rounded-lg ${SIDEBAR_CARD_PADDING} flex flex-col min-h-0 ${
        selectedChannel === 'phone' || isPhoneModeActive
          ? 'bg-blue-200 border border-blue-300'
          : 'bg-gray-200 border border-gray-300'
      }`}>
        <Popover open={hasSelection} modal={false}>
          <PopoverAnchor asChild>
            <div className="font-medium mb-2 text-sm flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasSelection && (
                  <Checkbox
                    checked={selectedContactIds.size === filteredContacts.length}
                    onCheckedChange={handleSelectAll}
                  />
                )}
                {hasSelection ? (
                  <span className="text-emerald-600 font-medium">
                    {selectedContactIds.size}/{filteredContacts.length} 선택됨
                  </span>
                ) : (
                  <span className={`${
                    selectedChannel === 'phone' || isPhoneModeActive ? 'text-blue-700' : 'text-gray-700'
                  }`}>{getFilterLabel()}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setIsDateFilterModalOpen(true)}
                  buttonStyle="secondary"
                  size="2xs"
                  leadIcon={<Icon iconType={['business', 'calendar']} size={12} color="default-subtle" />}
                  title="날짜 필터"
                >
                  <span className="font-medium">{getDatePresetLabel(dateFilter.preset)}</span>
                </Button>
                <Button
                  onClick={() => setIsFilterModalOpen(true)}
                  variant="iconOnly"
                  buttonStyle="ghost"
                  size="2xs"
                  className={`p-1 rounded transition-colors ${
                    hasActiveFilters()
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'hover:bg-gray-200'
                  }`}
                  title="필터"
                  leadIcon={<Icon iconType={['system', 'filter']} size={14} color={hasActiveFilters() ? 'white-default' : 'default-subtle'} />}
                />
                <Button
                  onClick={() => setIsCompactView(!isCompactView)}
                  variant="iconOnly"
                  buttonStyle="ghost"
                  size="2xs"
                  leadIcon={isCompactView ? <Icon iconType={['arrows', 'expand-diagonal']} size={14} color="default-subtle" /> : <Icon iconType={['arrows', 'collapse-diagonal']} size={14} color="default-subtle" />}
                  title={isCompactView ? "일반 보기" : "컴팩트 보기"}
                />
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={8}
            width="fit-content"
            className="!p-0"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <ContactActionModal
              selectedCount={selectedContactIds.size}
              isManagerMode={isManagerMode}
              isAutoAssignment={isAutoAssignment}
              selectedQueueType={selectedQueueType}
              onClose={handleClearSelection}
              onCategoryChange={handleCategoryChange}
              onConsultantChangeRequest={handleConsultantChangeRequest}
              onConsultantChange={handleConsultantChange}
              onEndConsultation={handleEndConsultation}
              onPendingEnd={handlePendingEnd}
              onAssignToSelf={handleAssignToSelf}
              onSetFlag={handleSetFlag}
              onBlockCustomer={handleBlockCustomer}
            />
          </PopoverContent>
        </Popover>

        <ScrollArea orientation="vertical" maxHeight="100%" className="flex-1 min-h-0">
          <div className={SIDEBAR_CARD_LIST_GAP}>
          {filteredContacts.map((contact) => {
            const cardColors = getContactCardColors(contact);
            const brandData = getBrandInfo(contact.brand);
            const channelIconType = CHANNEL_ICON_MAP[contact.channel];
            const clickable = canClickContact(contact);
            const isSelected = selectedContactIds.has(contact.id);
            const isHovered = hoveredContactId === contact.id;
            return (
              <TooltipTrigger
                key={contact.id}
                content={contact.summary || contact.conversationTopic}
                placement="right"
                disabled={!contact.summary && !contact.conversationTopic}
              >
                <div
                  onClick={() => clickable && handleContactClick(contact.id)}
                  onMouseEnter={() => setHoveredContactId(contact.id)}
                  onMouseLeave={() => setHoveredContactId(null)}
                  className={`p-2.5 rounded-md transition-colors border-2 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-400'
                      : selectedRoomId === contact.id
                        ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-200 shadow-md'
                        : clickable
                          ? `cursor-pointer ${cardColors.bgColor} ${cardColors.hoverColor} ${cardColors.borderColor}`
                          : 'cursor-not-allowed opacity-50 border-gray-200'
                  } ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {/* Channel Icon / Checkbox - Shows checkbox on hover or when selected */}
                    <div
                      onClick={(e) => handleSelectContact(contact.id, e)}
                      className="cursor-pointer"
                    >
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <Checkbox checked={true} />
                        </div>
                      ) : isHovered ? (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <Checkbox checked={false} />
                        </div>
                      ) : (
                        <div className="relative">
                          <Button
                            variant="iconOnly"
                            buttonStyle="ghost"
                            size="2xs"
                            shape="pill"
                            className={contact.unreadCount > 0
                              ? getChannelColor(contact.channel)
                              : 'bg-gray-200'}
                            leadIcon={<Icon iconType={channelIconType || ['communication', 'chat-1']} size={12} color={contact.unreadCount > 0 ? 'white-default' : 'default-subtle'} />}
                          />
                          {contact.unreadCount > 0 && (
                            <Badge
                              label={contact.unreadCount > 9 ? '9+' : String(contact.unreadCount)}
                              color="orange" size="sm" shape="pill"
                              className="absolute -top-1 -right-1 z-10 !bg-orange-500 !text-white h-4 w-4 !min-h-[16px] !px-1 !text-[10px]"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Brand Icon */}
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                      {brandData.logoUrl ? (
                        <img src={brandData.logoUrl} alt={brandData.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium text-gray-600">{brandData.initials}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Flag */}
                 {/* Right side icons */}
                  <div className="flex items-center gap-1">
                    {detachedRoomIds?.has(contact.id) && (
                      <Icon iconType={['system', 'external-link']} size={12} color="informative" />
                    )}
                    {favoriteRooms.has(contact.id) && (
                      <Icon iconType={['system', 'star']} size={12} color="#eab308" isFill />
                    )}
                    
                    {/* Flag Icon */}
                    {contact.flag && (
                      <Icon iconType={['business', 'flag']} isFill size={14} color={flagIconColorMap[contact.flag.type] || 'default'} />
                    )}
                    
                    {/* VIP Badge */}
                    {contact.isVIP && (
                      <Badge label="VIP" color="orange" size="sm" />
                    )}
                  </div>
                </div>
                
                {/* Conversation Topic */}
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${SIDEBAR_BODY_TEXT} text-blue-600 truncate flex-1`}>
                    {contact.conversationTopic}
                  </span>
                  {/* Time Elapsed */}
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <span className={`${SIDEBAR_META_TEXT} text-gray-500 font-medium`}>
                      {formatTimeElapsed(contact.lastActivityTimestamp || contact.lastConversationTimestamp || Date.now())}
                    </span>
                  </div>
                </div>
                
                {/* Bottom Row */}
                {!isCompactView && (
                  <div className="flex items-center justify-between mt-1">
                    <p className={`${SIDEBAR_META_TEXT} text-gray-600 truncate flex-1`}>{contact.lastMessage}</p>
                    {/* Removed unread count from bottom since it's now on brand icon */}
                  </div>
                )}
              </div>
              </TooltipTrigger>
            );
          })}
          {filteredContacts.length === 0 && (
            <EmptyState
              title="조건에 맞는 컨택이 없습니다"
              description="필터를 조정하거나 다른 카테고리를 선택해 주세요"
            />
          )}
          </div>
        </ScrollArea>
      </div>

    </div>
    </>
  );
};

export default React.memo(ContactListArea);

