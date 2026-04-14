import { useState, useEffect, useMemo, useCallback } from 'react';
import { mockRooms, Room } from './data/mockData';
import ChatModeContainer from './modes/ChatModeContainer';
import PhoneModeContainer from './modes/PhoneModeContainer';
import ChatWorkspaceWithTabs from './components/HistoryContactMode/ChatWorkspaceWithTabs';
import ContactRoomArea from './components/ContactRoomArea/ContactRoomArea';
import { useDetachedWindowCloseNotifier } from './hooks/useBroadcastSync';
import { SearchModeSnapshot, FilterMode } from './features/search/types';
import { useSearchStore } from './stores/useSearchStore';
import { TaskModuleProvider, TaskWidget } from '@deskit/task-module';
import { TeamChatModuleProvider } from '@deskit/team-chat';
import type { CreateTaskInput } from '../packages/task-module/src/types/task';
import { createMessageScheduleApi } from './features/channelComposer/api/createMessageScheduleApi';
import { getStoredScheduledMessagesSnapshot } from './features/channelComposer/api/LocalStorageMessageScheduleApi';
import { useScheduledMessageRuntime } from './features/channelComposer/hooks/useScheduledMessageRuntime';
import { hydrateRoomsWithScheduledMessages } from './features/channelComposer/utils/roomMessageUtils';
import SearchResultOverlay from './components/SearchArea/SearchResultOverlay';
import { Channel, ChannelSettings, CHANNEL_SETTINGS_STORAGE_KEY } from './types/channel';
import { filterContactsBySidebarCore, resolveVisibleSelectedRoomId } from './components/SidebarArea/contactSelectors';

interface ChatWorkspaceSnapshot {
  openRoomIds: number[];
  selectedRoomId: number | null;
  favoriteRooms: Set<number>;
  selectedChannel: Channel;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
  isAutoAssignment: boolean;
  chatMode: 'grid' | '2x1' | 'single' | 'focus' | 'kanban';
  isSidebarCollapsed: boolean;
}

interface PhoneWorkspaceSnapshot {
  openRoomIds: number[];
  selectedRoomId: number | null;
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  selectedQueueType: 'ai-response' | 'queue-waiting' | null;
}



// Hoisted pure functions - no dependency on component state
const getFlagColor = (flagType: string) => {
  const colorMap: { [key: string]: string } = {
    urgent: 'bg-red-500',
    important: 'bg-orange-500',
    normal: 'bg-green-500',
    info: 'bg-blue-500',
    completed: 'bg-purple-500'
  };
  return colorMap[flagType] || 'bg-gray-500';
};

const getFlagLabel = (flagType: string) => {
  const labelMap: { [key: string]: string } = {
    urgent: '긴급',
    important: '중요',
    normal: '일반',
    info: '정보',
    completed: '완료',
  };
  return labelMap[flagType] || '기타';
};

function App() {
  // Global states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messageScheduleApi = useMemo(
    () => createMessageScheduleApi({ apiType: 'localStorage' }),
    []
  );
  const [allRooms, setAllRooms] = useState<Room[]>(() =>
    hydrateRoomsWithScheduledMessages(mockRooms, getStoredScheduledMessagesSnapshot())
  );
  const [favoriteRooms, setFavoriteRooms] = useState<Set<number>>(new Set());

  // Filter and assignment states
  const [selectedChannel, setSelectedChannel] = useState<Channel>('all');
  const [selectedMainCategory, setSelectedMainCategory] = useState<'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent'>('responding');
  const [selectedAdditionalCategory, setSelectedAdditionalCategory] = useState<'request' | 'maintain' | null>(null);
  const [selectedQueueType, setSelectedQueueType] = useState<'ai-response' | 'queue-waiting' | null>(null);
  const [isAutoAssignment, setIsAutoAssignment] = useState(true);
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [isPhoneIncoming, setIsPhoneIncoming] = useState(false);

  // Section visibility states
  const [isChannelSectionVisible, setIsChannelSectionVisible] = useState(true);
  const [isBrandsInGNB, setIsBrandsInGNB] = useState(false);
  const [isBrandSectionVisible, setIsBrandSectionVisible] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Chat mode states - moved from ChatModeContainer
  const [chatMode, setChatMode] = useState<'grid' | '2x1' | 'single' | 'focus' | 'kanban'>('focus');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(101);
  const [phoneSelectedRoomId, setPhoneSelectedRoomId] = useState<number | null>(null);

  // 말풍선-할일 연동 상태
  const [prefillTaskData, setPrefillTaskData] = useState<CreateTaskInput | null>(null);
  const [taskBadgeMap, setTaskBadgeMap] = useState<Map<number, Set<number>>>(new Map()); // roomId → Set<messageId>
  const [scrollToMessageId, setScrollToMessageId] = useState<{ roomId: number; messageId: number; nonce: number } | null>(null);
  const [focusMessageRequest, setFocusMessageRequest] = useState<{ messageId: number; nonce: number } | null>(null);

  // 북마크 상태 (roomId → Set<messageId>)
  const [bookmarkMap, setBookmarkMap] = useState<Map<number, Set<number>>>(() => {
    try {
      const saved = localStorage.getItem('deskit-bookmarks');
      if (!saved) return new Map();
      const parsed: Record<string, number[]> = JSON.parse(saved);
      return new Map(Object.entries(parsed).map(([k, v]) => [Number(k), new Set(v)]));
    } catch {
      return new Map();
    }
  });

  // Phone mode states
  const [isPhoneModeActive, setIsPhoneModeActive] = useState(false);
  const [isPhoneButtonVisible, setIsPhoneButtonVisible] = useState(true);
  const [chatWorkspaceSnapshot, setChatWorkspaceSnapshot] = useState<ChatWorkspaceSnapshot | null>(null);
  const [phoneWorkspaceSnapshot, setPhoneWorkspaceSnapshot] = useState<PhoneWorkspaceSnapshot | null>(null);

  // Historical view states
  const [isHistoricalViewActive, setIsHistoricalViewActive] = useState(false);
  const [historicalRoomId, setHistoricalRoomId] = useState<number | null>(null);
  const [historicalViewSnapshot, setHistoricalViewSnapshot] = useState<ChatWorkspaceSnapshot | null>(null);

  // History contact mode states (dual workspace view)
  const [isHistoryContactMode, setIsHistoryContactMode] = useState(false);
  const [historyContactId, setHistoryContactId] = useState<number | null>(null);

  // Thread states
  const [sidebarListMode, setSidebarListMode] = useState<'contact' | 'thread'>('contact');
  const [threadCount, setThreadCount] = useState(0);
  const [isThreadMode, setIsThreadMode] = useState(false);
  const [threadSourceRoomId, setThreadSourceRoomId] = useState<number | null>(null);

  // Detached window mode
  const [isDetachedMode, setIsDetachedMode] = useState(false);

  // Inbox position state
  const [inboxPosition, setInboxPosition] = useState<'top' | 'bottom'>('top');

  // Search mode — from Zustand store
  const isSearchModeActive = useSearchStore(s => s.isActive);
  const searchModeFilterMode = useSearchStore(s => s.filterMode);

  // 북마크 localStorage 동기화
  useEffect(() => {
    const obj: Record<string, number[]> = {};
    bookmarkMap.forEach((set, roomId) => {
      if (set.size > 0) obj[String(roomId)] = [...set];
    });
    localStorage.setItem('deskit-bookmarks', JSON.stringify(obj));
  }, [bookmarkMap]);

  const handleToggleBookmark = useCallback((roomId: number, messageId: number) => {
    setBookmarkMap(prev => {
      const next = new Map(prev);
      const set = new Set(next.get(roomId) ?? []);
      if (set.has(messageId)) {
        set.delete(messageId);
        if (set.size === 0) next.delete(roomId);
        else next.set(roomId, set);
      } else {
        set.add(messageId);
        next.set(roomId, set);
      }
      return next;
    });
  }, []);

  useScheduledMessageRuntime({
    scheduleApi: messageScheduleApi,
    setAllRooms,
  });

  // Channel settings initialization and correction
  useEffect(() => {
    try {
      const savedSettingsRaw = localStorage.getItem(CHANNEL_SETTINGS_STORAGE_KEY);
      const savedChannelRaw = localStorage.getItem('selectedChannel');

      if (savedSettingsRaw && savedChannelRaw) {
        const savedSettings: ChannelSettings = JSON.parse(savedSettingsRaw);
        const savedChannel = savedChannelRaw as Channel;

        if (savedChannel === 'phone' && !savedSettings.phone) {
          setSelectedChannel('chat');
        } else if (savedChannel === 'chat' && !savedSettings.chat) {
          setSelectedChannel('phone');
        } else if (savedChannel === 'board' && !savedSettings.board) {
          setSelectedChannel('chat');
        } else if (savedChannel === 'email' && !savedSettings.email) {
          setSelectedChannel('chat');
        } else if (savedChannel !== 'all' && savedSettings[savedChannel] !== undefined && !savedSettings[savedChannel]) {
          setSelectedChannel('all');
        } else if (savedChannelRaw) {
          setSelectedChannel(savedChannel);
        }
      }
    } catch (error) {
      console.error('Failed to load channel settings:', error);
    }

    // URL 쿼리 파라미터로 roomId가 전달된 경우 해당 방을 자동 선택 (새창으로 열기)
    const params = new URLSearchParams(window.location.search);
    const roomIdParam = params.get('roomId');
    const isDetachedParam = params.get('detached') === 'true';
    if (roomIdParam) {
      const roomId = Number(roomIdParam);
      if (!isNaN(roomId)) {
        setSelectedRoomId(roomId);
        setAllRooms(prev => prev.map(r =>
          r.id === roomId ? { ...r, isOpen: true } : r
        ));
        if (isDetachedParam) {
          setIsDetachedMode(true);
        }
      }
    }
  }, []);

  const applyOpenRoomIds = useCallback((openRoomIds: number[]) => {
    setAllRooms(prevRooms =>
      prevRooms.map((room) => ({
        ...room,
        isOpen: openRoomIds.includes(room.id),
      }))
    );
  }, []);

  const applySingleOpenRoom = useCallback((roomId: number | null) => {
    setAllRooms(prevRooms =>
      prevRooms.map((room) => ({
        ...room,
        isOpen: roomId !== null && room.id === roomId,
      }))
    );
  }, []);

  const captureChatWorkspaceSnapshot = useCallback((): ChatWorkspaceSnapshot => ({
    openRoomIds: allRooms.filter(room => room.isOpen).map(room => room.id),
    selectedRoomId,
    favoriteRooms: new Set(favoriteRooms),
    selectedChannel,
    selectedMainCategory,
    selectedAdditionalCategory,
    selectedQueueType,
    isAutoAssignment,
    chatMode,
    isSidebarCollapsed,
  }), [allRooms, selectedRoomId, favoriteRooms, selectedChannel, selectedMainCategory, selectedAdditionalCategory, selectedQueueType, isAutoAssignment, chatMode, isSidebarCollapsed]);

  const capturePhoneWorkspaceSnapshot = useCallback((): PhoneWorkspaceSnapshot => ({
    openRoomIds: allRooms.filter(room => room.isOpen).map(room => room.id),
    selectedRoomId: phoneSelectedRoomId,
    selectedMainCategory,
    selectedAdditionalCategory,
    selectedQueueType,
  }), [allRooms, phoneSelectedRoomId, selectedMainCategory, selectedAdditionalCategory, selectedQueueType]);

  // Event order: 1) save current workspace snapshot -> 2) switch mode/channel -> 3) restore target workspace snapshot.
  const handleWorkspaceTransition = useCallback((targetChannel: Channel, targetMode: 'chat' | 'phone') => {
    if (targetMode === 'phone') {
      setChatWorkspaceSnapshot(captureChatWorkspaceSnapshot());
      setIsPhoneModeActive(true);
      setSelectedChannel('phone');
      setIsAutoAssignment(false);

      if (phoneWorkspaceSnapshot) {
        const visibleRooms = filterContactsBySidebarCore({
          rooms: allRooms,
          selectedBrands,
          selectedChannel: 'phone',
          selectedMainCategory: phoneWorkspaceSnapshot.selectedMainCategory,
          selectedAdditionalCategory: phoneWorkspaceSnapshot.selectedAdditionalCategory,
          selectedQueueType: phoneWorkspaceSnapshot.selectedQueueType,
        });
        const nextRoomId = resolveVisibleSelectedRoomId(visibleRooms, phoneWorkspaceSnapshot.selectedRoomId);
        const restoredOpenRoomIds = phoneWorkspaceSnapshot.openRoomIds.filter((roomId) =>
          visibleRooms.some((room) => room.id === roomId)
        );
        const nextOpenRoomIds = restoredOpenRoomIds.length > 0
          ? restoredOpenRoomIds
          : nextRoomId !== null
            ? [nextRoomId]
            : [];

        setSelectedMainCategory(phoneWorkspaceSnapshot.selectedMainCategory);
        setSelectedAdditionalCategory(phoneWorkspaceSnapshot.selectedAdditionalCategory);
        setSelectedQueueType(phoneWorkspaceSnapshot.selectedQueueType);
        setPhoneSelectedRoomId(nextRoomId);
        applyOpenRoomIds(nextOpenRoomIds);
      } else {
        const visibleRooms = filterContactsBySidebarCore({
          rooms: allRooms,
          selectedBrands,
          selectedChannel: 'phone',
          selectedMainCategory: 'responding',
          selectedAdditionalCategory: null,
          selectedQueueType: null,
        });
        const nextRoomId = resolveVisibleSelectedRoomId(visibleRooms, null);

        setSelectedMainCategory('responding');
        setSelectedAdditionalCategory(null);
        setSelectedQueueType(null);
        setPhoneSelectedRoomId(nextRoomId);
        applySingleOpenRoom(nextRoomId);
      }
      return;
    }

    if (isPhoneModeActive) {
      setPhoneWorkspaceSnapshot(capturePhoneWorkspaceSnapshot());

      if (chatWorkspaceSnapshot) {
        applyOpenRoomIds(chatWorkspaceSnapshot.openRoomIds);
        setFavoriteRooms(chatWorkspaceSnapshot.favoriteRooms);
        setSelectedMainCategory(chatWorkspaceSnapshot.selectedMainCategory);
        setSelectedAdditionalCategory(chatWorkspaceSnapshot.selectedAdditionalCategory);
        setSelectedQueueType(chatWorkspaceSnapshot.selectedQueueType);
        setIsAutoAssignment(chatWorkspaceSnapshot.isAutoAssignment);
        setChatMode(chatWorkspaceSnapshot.chatMode);
        setSelectedRoomId(chatWorkspaceSnapshot.selectedRoomId);
        setIsSidebarCollapsed(chatWorkspaceSnapshot.isSidebarCollapsed);
        setSelectedChannel(targetChannel === 'phone' ? chatWorkspaceSnapshot.selectedChannel : targetChannel);
      } else {
        setSelectedChannel(targetChannel === 'phone' ? 'chat' : targetChannel);
      }

      setIsPhoneModeActive(false);
      return;
    }

    setSelectedChannel(targetChannel);
  }, [captureChatWorkspaceSnapshot, capturePhoneWorkspaceSnapshot, isPhoneModeActive, phoneWorkspaceSnapshot, chatWorkspaceSnapshot, allRooms, selectedBrands, applyOpenRoomIds, applySingleOpenRoom]);

  const handleChannelChange = useCallback((channel: Channel) => {
    if (channel === 'phone') {
      handleWorkspaceTransition('phone', isPhoneModeActive ? 'chat' : 'phone');
      return;
    }
    handleWorkspaceTransition(channel, 'chat');
  }, [handleWorkspaceTransition, isPhoneModeActive]);

  const handleTogglePhoneButtonVisibility = useCallback(() => {
    setIsPhoneButtonVisible(prev => !prev);
  }, []);

  // Historical view handlers
  const handleSelectHistoricalRoom = useCallback((roomId: number) => {
    // Save current chat mode state
    const snapshot: ChatWorkspaceSnapshot = {
      openRoomIds: allRooms.filter(room => room.isOpen).map(room => room.id),
      selectedRoomId: selectedRoomId,
      favoriteRooms: new Set(favoriteRooms),
      selectedChannel: selectedChannel,
      selectedMainCategory: selectedMainCategory,
      selectedAdditionalCategory: selectedAdditionalCategory,
      selectedQueueType: selectedQueueType,
      isAutoAssignment: isAutoAssignment,
      chatMode: chatMode,
      isSidebarCollapsed: isSidebarCollapsed,
    };
    setHistoricalViewSnapshot(snapshot);

    // Force sidebar to collapse for better space utilization
    setIsSidebarCollapsed(true);

    // Set historical view active
    setIsHistoricalViewActive(true);
    setHistoricalRoomId(roomId);

    // Set chat mode to single for proper layout
    setChatMode('single');
  }, [allRooms, selectedRoomId, favoriteRooms, selectedChannel, selectedMainCategory, selectedAdditionalCategory, selectedQueueType, isAutoAssignment, chatMode, isSidebarCollapsed]);

  const handleCloseHistoricalView = useCallback(() => {
    if (historicalViewSnapshot) {
      // Restore previous state
      setAllRooms(prevAllRooms => prevAllRooms.map(room => ({
        ...room,
        isOpen: historicalViewSnapshot.openRoomIds.includes(room.id)
      })));

      setFavoriteRooms(historicalViewSnapshot.favoriteRooms);
      setSelectedChannel(historicalViewSnapshot.selectedChannel);
      setSelectedMainCategory(historicalViewSnapshot.selectedMainCategory);
      setSelectedAdditionalCategory(historicalViewSnapshot.selectedAdditionalCategory);
      setSelectedQueueType(historicalViewSnapshot.selectedQueueType);
      setIsAutoAssignment(historicalViewSnapshot.isAutoAssignment);
      setChatMode(historicalViewSnapshot.chatMode);
      setSelectedRoomId(historicalViewSnapshot.selectedRoomId);
      setIsSidebarCollapsed(historicalViewSnapshot.isSidebarCollapsed);

      setHistoricalViewSnapshot(null);
    }

    setIsHistoricalViewActive(false);
    setHistoricalRoomId(null);
  }, [historicalViewSnapshot]);

  // History contact mode handlers (dual workspace view)
  const handleEnterHistoryContactMode = useCallback((historyId: number) => {
    // If already in history contact mode, just update the history contact ID
    if (isHistoryContactMode) {
      setHistoryContactId(historyId);
      return;
    }

    // [R3] 히스토리 진입 시 스레드 모드 해제
    setIsThreadMode(false);
    // Set history contact mode active (no sidebar state change)
    setIsHistoryContactMode(true);
    setHistoryContactId(historyId);
  }, [isHistoryContactMode]);

  const handleExitHistoryContactMode = useCallback(() => {
    setIsHistoryContactMode(false);
    setHistoryContactId(null);
  }, []);

  // Thread mode handlers
  const handleToggleThreadMode = useCallback(() => {
    setIsThreadMode(prev => {
      const next = !prev;
      if (next) {
        // [R3] 스레드 진입 시 히스토리 모드 해제
        setIsHistoryContactMode(false);
        setHistoryContactId(null);
        setThreadSourceRoomId(selectedRoomId);
      } else {
        setThreadSourceRoomId(null);
      }
      return next;
    });
  }, [selectedRoomId]);

  // 인박스 카테고리 선택 시 스레드 모드 자동 해제
  const exitOverlayModes = useCallback(() => {
    setIsThreadMode(false);
    setThreadSourceRoomId(null);
  }, []);

  const handleSelectMainCategory = useCallback((category: typeof selectedMainCategory) => {
    setSelectedMainCategory(category);
    exitOverlayModes();
  }, [exitOverlayModes]);

  const handleSelectAdditionalCategory = useCallback((category: typeof selectedAdditionalCategory) => {
    setSelectedAdditionalCategory(category);
    exitOverlayModes();
  }, [exitOverlayModes]);

  const handleSelectQueueType = useCallback((queueType: typeof selectedQueueType) => {
    setSelectedQueueType(queueType);
    exitOverlayModes();
  }, [exitOverlayModes]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleClearChatSelectedRoom = useCallback(() => {
    setSelectedRoomId(null);
  }, []);

  const handleClearPhoneSelectedRoom = useCallback(() => {
    setPhoneSelectedRoomId(null);
    applySingleOpenRoom(null);
  }, [applySingleOpenRoom]);

  const handleSetAlarm = useCallback((roomId: number, alarmTimestamp: number | null) => {
    setAllRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, alarmTimestamp }
        : room
    ));
  }, []);

  const handleSetFlag = useCallback((roomId: number, flagType: string | null) => {
    setAllRooms(prev => prev.map(room =>
      room.id === roomId
        ? {
          ...room,
          flag: flagType ? {
            type: flagType as 'urgent' | 'important' | 'normal' | 'info' | 'completed',
            color: getFlagColor(flagType),
            label: getFlagLabel(flagType)
          } : null
        }
        : room
    ));
  }, []);

  const toggleFavoriteRoom = useCallback((roomId: number) => {
    setFavoriteRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  }, []);

  const toggleInboxPosition = useCallback(() => {
    setInboxPosition(prev => prev === 'top' ? 'bottom' : 'top');
  }, []);

  // Handle accept contact
  const handleAcceptContact = useCallback(() => {
    setAllRooms(prev => {
      const waitingRoom = prev.find(room => room.mainCategory === 'waiting');
      if (!waitingRoom) return prev;

      return prev.map(room =>
        room.id === waitingRoom.id
          ? { ...room, mainCategory: 'received' }
          : room
      );
    });
  }, []);

  // Search mode handlers
  const activeSelectedRoomId = isPhoneModeActive ? phoneSelectedRoomId : selectedRoomId;
  const activeSelectedRoom = useMemo(
    () => activeSelectedRoomId ? allRooms.find((room) => room.id === activeSelectedRoomId) || null : null,
    [activeSelectedRoomId, allRooms]
  );

  const handleEnterSearchMode = useCallback((filterMode: FilterMode = 'standard') => {
    const snapshot: SearchModeSnapshot = {
      isSidebarCollapsed,
      selectedMainCategory,
      selectedAdditionalCategory,
      selectedQueueType,
      selectedChannel,
      selectedBrands,
      selectedRoomId: activeSelectedRoomId,
      filterMode: searchModeFilterMode,
    };

    useSearchStore.getState().activate(snapshot, filterMode, isManagerMode, selectedChannel);

    setIsSidebarCollapsed(true);
    setSelectedMainCategory('all');
    setSelectedAdditionalCategory(null);

    if (filterMode === 'ai-response') {
      setSelectedQueueType('ai-response');
    } else if (filterMode === 'unassigned') {
      setSelectedQueueType('queue-waiting');
    } else {
      setSelectedQueueType(null);
    }
  }, [isSidebarCollapsed, selectedMainCategory, selectedAdditionalCategory, selectedQueueType, selectedChannel, selectedBrands, activeSelectedRoomId, searchModeFilterMode, isManagerMode]);

  const handleExitSearchMode = useCallback(() => {
    const snapshot = useSearchStore.getState().deactivate();

    if (snapshot) {
      setIsSidebarCollapsed(snapshot.isSidebarCollapsed);
      setSelectedMainCategory(snapshot.selectedMainCategory);
      setSelectedAdditionalCategory(snapshot.selectedAdditionalCategory);
      setSelectedQueueType(snapshot.selectedQueueType);
      setSelectedChannel(snapshot.selectedChannel);
      setSelectedBrands(snapshot.selectedBrands);
      if (isPhoneModeActive) {
        setPhoneSelectedRoomId(snapshot.selectedRoomId);
      } else {
        setSelectedRoomId(snapshot.selectedRoomId);
      }
    }
  }, [isPhoneModeActive]);

  // Update consultant filter when manager mode changes in search mode
  useEffect(() => {
    useSearchStore.getState().updateConsultantFilter(isManagerMode);
  }, [isManagerMode, isSearchModeActive, searchModeFilterMode]);

  // Detached window: set document title + close notifier
  const detachedRoom = useMemo(
    () => isDetachedMode && selectedRoomId ? allRooms.find(r => r.id === selectedRoomId) ?? null : null,
    [isDetachedMode, selectedRoomId, allRooms]
  );

  useEffect(() => {
    if (detachedRoom) {
      document.title = `${detachedRoom.contactName} - Deskit`;
    }
  }, [detachedRoom]);

  useDetachedWindowCloseNotifier(isDetachedMode ? selectedRoomId : null);

  // Detached mode: 탭 기반 레이아웃만 풀스크린 렌더링
  if (isDetachedMode && detachedRoom) {
    return (
      <TaskModuleProvider
        auth={{
          userId: 'manager',
          userName: '매니저',
          role: isManagerMode ? 'manager' : 'consultant',
          token: '',
        }}
        config={{ displayMode: 'floating', apiType: 'localStorage' }}
        callbacks={{
          onTaskCreated: (task) => {
            if (task.roomId != null && task.messageId != null) {
              setTaskBadgeMap(prev => {
                const next = new Map(prev);
                const set = new Set(next.get(task.roomId!) ?? []);
                set.add(task.messageId!);
                next.set(task.roomId!, set);
                return next;
              });
            }
            setPrefillTaskData(null);
          },
          onPrefillCleared: () => setPrefillTaskData(null),
          onTaskDeleted: (task) => {
            if (task.roomId != null && task.messageId != null) {
              setTaskBadgeMap(prev => {
                const next = new Map(prev);
                const set = new Set(next.get(task.roomId!) ?? []);
                set.delete(task.messageId!);
                if (set.size === 0) next.delete(task.roomId!);
                else next.set(task.roomId!, set);
                return next;
              });
            }
          },
        }}
        prefillData={prefillTaskData}
        focusMessageRequest={focusMessageRequest}
        selectedRoom={{ id: detachedRoom.id, contactName: detachedRoom.contactName }}
        allRooms={allRooms.map(r => ({ id: r.id, contactName: r.contactName }))}
      >
      <TeamChatModuleProvider
        auth={{ userId: 'consultant-001', userName: '김상담', role: 'consultant', token: '' }}
        config={{ displayMode: 'embedded', apiType: 'localStorage' }}
        selectedRoom={{ id: detachedRoom.id, contactName: detachedRoom.contactName }}
        allRooms={allRooms.map(r => ({ id: r.id, contactName: r.contactName, channel: r.channel }))}
      >
        <div className="w-full h-screen flex flex-col">
          <ChatWorkspaceWithTabs
            isHistoryWorkspace={false}
            contactData={detachedRoom}
            allRooms={allRooms}
            chatContent={
              <ContactRoomArea
                chatMode="single"
                allRooms={allRooms}
                selectedRoomId={detachedRoom.id}
                setAllRooms={setAllRooms}
                favoriteRooms={favoriteRooms}
                onToggleFavorite={toggleFavoriteRoom}
                availableRooms={[detachedRoom.id]}
                onCloseRoom={() => window.close()}
                onFocusRoomChange={() => {}}
                onSelectRoom={() => {}}
                onSetAlarm={handleSetAlarm}
                onSetFlag={handleSetFlag}
                onPrefillTask={(data, messageId) => setPrefillTaskData({ ...data, roomId: detachedRoom.id, messageId })}
                onFocusLinkedTask={(messageId) => setFocusMessageRequest({ messageId, nonce: Date.now() })}
                taskBadgeMessageIds={taskBadgeMap.get(detachedRoom.id)}
                scrollToMessageId={scrollToMessageId?.roomId === detachedRoom.id ? { messageId: scrollToMessageId.messageId, nonce: scrollToMessageId.nonce } : null}
                bookmarkMessageIds={bookmarkMap.get(detachedRoom.id)}
                onToggleBookmark={(messageId) => handleToggleBookmark(detachedRoom.id, messageId)}
              />
            }
          />
        </div>
        <TaskWidget />
        <div id="task-drawer-container" />
      </TeamChatModuleProvider>
      </TaskModuleProvider>
    );
  }

  return (
    <TaskModuleProvider
      auth={{
        userId: 'manager',
        userName: '매니저',
        role: isManagerMode ? 'manager' : 'consultant',
        token: '',
      }}
      config={{ displayMode: 'floating', apiType: 'localStorage' }}
      callbacks={{
        onNavigateToRoom: (roomId, messageId) => {
          if (isPhoneModeActive) {
            setPhoneSelectedRoomId(roomId);
            applySingleOpenRoom(roomId);
          } else {
            setSelectedRoomId(roomId);
          }
          if (messageId) {
            setScrollToMessageId({ roomId, messageId, nonce: Date.now() });
          }
        },
        renderContactPreview: (roomId, onClose) => (
          <SearchResultOverlay
            room={allRooms.find(r => r.id === roomId) || null}
            onClose={onClose}
            allRooms={allRooms}
            setAllRooms={setAllRooms}
            isManagerMode={isManagerMode}
            inline
            readOnly
          />
        ),
        onTaskCreated: (task) => {
          if (task.roomId != null && task.messageId != null) {
            setTaskBadgeMap(prev => {
              const next = new Map(prev);
              const set = new Set(next.get(task.roomId!) ?? []);
              set.add(task.messageId!);
              next.set(task.roomId!, set);
              return next;
            });
          }
          setPrefillTaskData(null);
        },
        onPrefillCleared: () => {
          setPrefillTaskData(null);
        },
        onTaskDeleted: (task) => {
          if (task.roomId != null && task.messageId != null) {
            setTaskBadgeMap(prev => {
              const next = new Map(prev);
              const set = new Set(next.get(task.roomId!) ?? []);
              set.delete(task.messageId!);
              if (set.size === 0) next.delete(task.roomId!);
              else next.set(task.roomId!, set);
              return next;
            });
          }
        },
      }}
      prefillData={prefillTaskData}
      focusMessageRequest={focusMessageRequest}
      selectedRoom={activeSelectedRoom ? { id: activeSelectedRoom.id, contactName: activeSelectedRoom.contactName } : null}
      allRooms={allRooms.map(r => ({ id: r.id, contactName: r.contactName }))}
    >
    <TeamChatModuleProvider
      auth={{ userId: 'consultant-001', userName: '김상담', role: 'consultant', token: '' }}
      config={{ displayMode: 'embedded', apiType: 'localStorage' }}
      selectedRoom={activeSelectedRoom ? { id: activeSelectedRoom.id, contactName: activeSelectedRoom.contactName } : null}
      allRooms={allRooms.map(r => ({ id: r.id, contactName: r.contactName, channel: r.channel }))}
      callbacks={{
        onNavigateToRoom: (roomId) => {
          setSidebarListMode('contact');
          setSelectedRoomId(Number(roomId));
        },
        onThreadOpenChange: (isOpen, roomId) => {
          setIsThreadMode(isOpen);
          if (isOpen) {
            setIsHistoryContactMode(false);
            setHistoryContactId(null);
          }
          setThreadSourceRoomId(roomId ? Number(roomId) : null);
        },
        onThreadCountChange: setThreadCount,
      }}
    >
    <div className="relative overflow-x-auto overflow-y-hidden min-w-[1280px] w-full h-screen">
      {/* Chat Mode Container - Always rendered but hidden when phone mode is active */}
      <div className={isPhoneModeActive ? 'hidden' : 'block'}>
        <ChatModeContainer
          allRooms={allRooms}
          setAllRooms={setAllRooms}
          favoriteRooms={favoriteRooms}
          onToggleFavorite={toggleFavoriteRoom}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isPhoneModeActive={isPhoneModeActive}
          isPhoneButtonVisible={isPhoneButtonVisible}
          onTogglePhoneButtonVisibility={handleTogglePhoneButtonVisibility}
          selectedChannel={selectedChannel}
          onChannelChange={handleChannelChange}
          selectedMainCategory={selectedMainCategory}
          onSelectMainCategory={handleSelectMainCategory}
          selectedAdditionalCategory={selectedAdditionalCategory}
          onSelectAdditionalCategory={handleSelectAdditionalCategory}
          selectedQueueType={selectedQueueType}
          onSelectQueueType={handleSelectQueueType}
          isAutoAssignment={isAutoAssignment}
          onToggleAssignment={setIsAutoAssignment}
          isManagerMode={isManagerMode}
          onToggleManagerMode={setIsManagerMode}
          isPhoneIncoming={isPhoneIncoming}
          onTogglePhoneIncoming={setIsPhoneIncoming}
          handleSetAlarm={handleSetAlarm}
          handleSetFlag={handleSetFlag}
          chatMode={chatMode}
          setChatMode={setChatMode}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          isHistoricalViewActive={isHistoricalViewActive}
          historicalRoomId={historicalRoomId}
          onCloseHistoricalView={handleCloseHistoricalView}
          isHistoryContactMode={isHistoryContactMode}
          historyContactId={historyContactId}
          onEnterHistoryContactMode={handleEnterHistoryContactMode}
          onExitHistoryContactMode={handleExitHistoryContactMode}
          inboxPosition={inboxPosition}
          onToggleInboxPosition={toggleInboxPosition}
          onAcceptContact={handleAcceptContact}
          isChannelSectionVisible={isChannelSectionVisible}
          onToggleChannelSection={setIsChannelSectionVisible}
          isBrandsInGNB={isBrandsInGNB}
          onToggleBrandsInGNB={setIsBrandsInGNB}
          isBrandSectionVisible={isBrandSectionVisible}
          onToggleBrandSectionVisible={setIsBrandSectionVisible}
          selectedBrands={selectedBrands}
          onBrandChange={setSelectedBrands}
          onEnterSearchMode={handleEnterSearchMode}
          onExitSearchMode={handleExitSearchMode}
          onClearSelectedRoom={handleClearChatSelectedRoom}
          onPrefillTask={(data) => setPrefillTaskData(data)}
          onFocusLinkedTask={(messageId) => setFocusMessageRequest({ messageId, nonce: Date.now() })}
          taskBadgeMap={taskBadgeMap}
          scrollToMessageId={scrollToMessageId}
          bookmarkMap={bookmarkMap}
          onToggleBookmark={handleToggleBookmark}
          sidebarListMode={sidebarListMode}
          onSidebarListModeChange={setSidebarListMode}
          threadCount={threadCount}
          isThreadMode={isThreadMode}
          onToggleThreadMode={handleToggleThreadMode}
          threadSourceRoomId={threadSourceRoomId}
        />
      </div>

      {/* Phone Mode Container - Always rendered but hidden when chat mode is active */}
      <div className={isPhoneModeActive ? 'block' : 'hidden'}>
        <PhoneModeContainer
          allRooms={allRooms}
          setAllRooms={setAllRooms}
          favoriteRooms={favoriteRooms}
          onToggleFavorite={toggleFavoriteRoom}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isPhoneModeActive={isPhoneModeActive}
          isPhoneButtonVisible={isPhoneButtonVisible}
          onTogglePhoneButtonVisibility={handleTogglePhoneButtonVisibility}
          selectedChannel={selectedChannel}
          onChannelChange={handleChannelChange}
          selectedMainCategory={selectedMainCategory}
          onSelectMainCategory={setSelectedMainCategory}
          selectedAdditionalCategory={selectedAdditionalCategory}
          onSelectAdditionalCategory={setSelectedAdditionalCategory}
          selectedQueueType={selectedQueueType}
          onSelectQueueType={setSelectedQueueType}
          isAutoAssignment={isAutoAssignment}
          onToggleAssignment={setIsAutoAssignment}
          isManagerMode={isManagerMode}
          onToggleManagerMode={setIsManagerMode}
          isPhoneIncoming={isPhoneIncoming}
          onTogglePhoneIncoming={setIsPhoneIncoming}
          handleSetAlarm={handleSetAlarm}
          handleSetFlag={handleSetFlag}
          selectedRoomId={phoneSelectedRoomId}
          setSelectedRoomId={setPhoneSelectedRoomId}
          onSelectHistoricalRoom={handleSelectHistoricalRoom}
          inboxPosition={inboxPosition}
          onToggleInboxPosition={toggleInboxPosition}
          onAcceptContact={handleAcceptContact}
          isChannelSectionVisible={isChannelSectionVisible}
          onToggleChannelSection={setIsChannelSectionVisible}
          isBrandsInGNB={isBrandsInGNB}
          onToggleBrandsInGNB={setIsBrandsInGNB}
          isBrandSectionVisible={isBrandSectionVisible}
          onToggleBrandSectionVisible={setIsBrandSectionVisible}
          selectedBrands={selectedBrands}
          onBrandChange={setSelectedBrands}
          onEnterSearchMode={handleEnterSearchMode}
          onExitSearchMode={handleExitSearchMode}
          isHistoricalViewActive={isHistoricalViewActive}
          historicalRoomId={historicalRoomId}
          onCloseHistoricalView={handleCloseHistoricalView}
          isHistoryContactMode={isHistoryContactMode}
          historyContactId={historyContactId}
          onEnterHistoryContactMode={handleEnterHistoryContactMode}
          onExitHistoryContactMode={handleExitHistoryContactMode}
          onClearSelectedRoom={handleClearPhoneSelectedRoom}
          onPrefillTask={(data) => setPrefillTaskData(data)}
          onFocusLinkedTask={(messageId) => setFocusMessageRequest({ messageId, nonce: Date.now() })}
          taskBadgeMap={taskBadgeMap}
          scrollToMessageId={scrollToMessageId}
          bookmarkMap={bookmarkMap}
          onToggleBookmark={handleToggleBookmark}
        />
      </div>

      <TaskWidget />
    </div>
    </TeamChatModuleProvider>
    </TaskModuleProvider>
  );
}

export default App;
