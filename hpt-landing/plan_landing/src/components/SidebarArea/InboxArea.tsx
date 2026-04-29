import React, { useMemo } from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';

import { isAlarmActive } from '../../utils/timeUtils';
import { Channel, ASYNC_TEXT_CHANNELS } from '../../types/channel';
import { filterContactsBySidebarCore, MainCategory, AdditionalCategory, QueueType } from './contactSelectors';
import { SIDEBAR_BODY_TEXT, SIDEBAR_CARD_COMPACT_PADDING, SIDEBAR_CARD_PADDING } from '../../features/layout/panelSpacing';

interface Room {
  id: number;
  contactName: string;
  conversationTopic: string;
  brand: string;
  channel: 'chat' | 'phone' | 'kakao' | 'naver' | 'instagram' | 'board' | 'email';
  isVIP: boolean;
  lastConversationTimestamp: number;
  status: 'active' | 'waiting' | 'closed';
  lastMessage: string;
  unreadCount: number;
  currentWorkspaceId: number | null;
  customerStatus: 'online' | 'typing' | 'away';
  mainCategory: 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  additionalCategory: 'request' | 'maintain' | null;
  alarmTimestamp: number | null;
}

interface InboxAreaProps {
  allRooms: Room[];
  selectedMainCategory: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent';
  selectedAdditionalCategory: 'request' | 'maintain' | null;
  onSelectMainCategory: (category: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent') => void;
  onSelectAdditionalCategory: (category: 'request' | 'maintain' | null) => void;
  isAutoAssignment: boolean;
  isCollapsed: boolean;
  selectedChannel: Channel;
  isPhoneModeActive: boolean;
  inboxPosition: 'top' | 'bottom';
  onToggleInboxPosition: () => void;
  isSearchModeActive?: boolean;
  onExitSearchMode?: () => void;
  selectedRoomId?: number | null;
  onContactClick?: (roomId: number) => void;
  isAcwActive?: boolean;
  acwRemainingSeconds?: number;
  onStartAcw?: () => void;
  selectedBrands: string[];
  selectedQueueType: QueueType;
}

const InboxArea: React.FC<InboxAreaProps> = ({
  allRooms,
  selectedMainCategory,
  selectedAdditionalCategory,
  onSelectMainCategory,
  onSelectAdditionalCategory,
  isCollapsed,
  selectedChannel,
  inboxPosition,
  onToggleInboxPosition,
  isSearchModeActive = false,
  onExitSearchMode,
  selectedRoomId,
  onContactClick,
  isAcwActive = false,
  acwRemainingSeconds = 0,
  onStartAcw,
  selectedBrands,
  selectedQueueType,
}) => {
  const counts = useMemo(() => {
    // 비동기 채널 그룹화
    const asyncRooms = allRooms.filter(room => (ASYNC_TEXT_CHANNELS as readonly string[]).includes(room.channel));
    const phoneRooms = allRooms.filter(room => room.channel === 'phone');

    if (selectedChannel === 'all') {
      return {
        responding: allRooms.filter(room => room.mainCategory === 'responding').length,
        closed: allRooms.filter(room => room.mainCategory === 'closed').length,
        received: asyncRooms.filter(room => room.mainCategory === 'received').length,
        maintain: asyncRooms.filter(room => room.additionalCategory === 'maintain').length,
        callback: phoneRooms.filter(room => isAlarmActive(room.alarmTimestamp)).length,
        absent: phoneRooms.filter(room => room.mainCategory === 'absent').length,
        request: allRooms.filter(room => room.additionalCategory === 'request' && room.channel !== 'phone').length,
      };
    } else if (['chat', 'board', 'email'].includes(selectedChannel)) {
      // 비동기 채널들은 챗 모드 레이아웃 사용
      const channelRooms = selectedChannel === 'chat'
        ? asyncRooms
        : allRooms.filter(room => room.channel === selectedChannel);

      return {
        responding: channelRooms.filter(room => room.mainCategory === 'responding').length,
        closed: channelRooms.filter(room => room.mainCategory === 'closed').length,
        received: channelRooms.filter(room => room.mainCategory === 'received').length,
        maintain: channelRooms.filter(room => room.additionalCategory === 'maintain').length,
        callback: 0,
        absent: 0,
        request: channelRooms.filter(room => room.additionalCategory === 'request').length,
      };
    } else {
      // phone
      return {
        responding: phoneRooms.filter(room => room.mainCategory === 'responding').length,
        closed: phoneRooms.filter(room => room.mainCategory === 'closed').length,
        received: 0,
        maintain: 0,
        callback: phoneRooms.filter(room => isAlarmActive(room.alarmTimestamp)).length,
        absent: phoneRooms.filter(room => room.mainCategory === 'absent').length,
        request: phoneRooms.filter(room => room.additionalCategory === 'request').length,
      };
    }
  }, [allRooms, selectedChannel]);

  const openFirstVisibleContact = (mainCategory: MainCategory, additionalCategory: AdditionalCategory) => {
    if (!onContactClick || selectedRoomId) {
      return;
    }

    const visibleRooms = filterContactsBySidebarCore({
      rooms: allRooms,
      selectedBrands,
      selectedChannel,
      selectedMainCategory: mainCategory,
      selectedAdditionalCategory: additionalCategory,
      selectedQueueType,
    });

    if (visibleRooms.length > 0) {
      onContactClick(visibleRooms[0].id);
    }
  };

  const handleMainCategoryClick = (category: 'all' | 'waiting' | 'received' | 'responding' | 'closed' | 'alarm' | 'absent') => {
    if (isSearchModeActive && onExitSearchMode) {
      onExitSearchMode();
    }

    if (category === 'alarm') {
      onSelectMainCategory(category);
      onSelectAdditionalCategory(null);
      openFirstVisibleContact(category, null);
      return;
    }

    const nextMainCategory = selectedMainCategory === category && category !== 'all' ? 'all' : category;

    if (selectedMainCategory === category && category !== 'all') {
      onSelectMainCategory('all');
    } else {
      onSelectMainCategory(category);
    }
    if (selectedAdditionalCategory) {
      onSelectAdditionalCategory(null);
    }

    openFirstVisibleContact(nextMainCategory, null);
  };

  const handleAdditionalCategoryClick = (category: 'request' | 'maintain') => {
    if (isSearchModeActive && onExitSearchMode) {
      onExitSearchMode();
    }

    if (selectedAdditionalCategory === category) {
      onSelectAdditionalCategory(null);
    } else {
      onSelectAdditionalCategory(category);
    }
    if (selectedMainCategory !== 'all') {
      onSelectMainCategory('all');
    }

    openFirstVisibleContact('all', category);
  };

  const formatCount = (count: number) => {
    return count > 99 ? '99+' : count.toString();
  };

  const formatAcwTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBackgroundStyle = () => {
    if (selectedChannel === 'all') {
      return 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300';
    } else if (selectedChannel === 'phone') {
      return 'bg-blue-200 border border-blue-300';
    }
    return 'bg-gray-200 border border-gray-300';
  };

  if (isCollapsed) {
    return (
      <div className={`${getBackgroundStyle()} ${SIDEBAR_CARD_COMPACT_PADDING} rounded-lg overflow-hidden`}>
        <div className="space-y-2">
          <Button
            buttonStyle={selectedMainCategory === 'responding' ? 'primary' : 'ghost'}
            colorOverride="green"
            size="xs"
            fullWidth
            onClick={() => handleMainCategoryClick('responding')}
          >
            <div className="flex items-center justify-center gap-1 w-full">
              <span className={`${SIDEBAR_BODY_TEXT} truncate`}>상담 중</span>
              <span className={`${SIDEBAR_BODY_TEXT} font-bold flex-shrink-0`}>
                {formatCount(counts.responding)}
              </span>
            </div>
          </Button>

          <Button
            buttonStyle={selectedMainCategory === 'closed' ? 'primary' : 'ghost'}
            colorOverride="gray"
            size="xs"
            fullWidth
            onClick={() => handleMainCategoryClick('closed')}
          >
            <div className="flex items-center justify-center gap-1 w-full">
              <span className={`${SIDEBAR_BODY_TEXT} truncate`}>종료</span>
              <span className={`${SIDEBAR_BODY_TEXT} font-bold flex-shrink-0`}>
                {formatCount(counts.closed)}
              </span>
            </div>
          </Button>

          {(selectedChannel === 'all' || selectedChannel === 'chat') && (
            <>
              <Button
                buttonStyle={selectedMainCategory === 'received' ? 'primary' : 'ghost'}
                colorOverride="green"
                size="xs"
                fullWidth
                onClick={() => handleMainCategoryClick('received')}
              >
                <div className="flex items-center justify-center gap-1 w-full">
                  <span className="text-xs truncate">접수</span>
                  <span className="text-xs font-bold flex-shrink-0">
                    {formatCount(counts.received)}
                  </span>
                </div>
              </Button>
            </>
          )}

          {(selectedChannel === 'all' || selectedChannel === 'phone') && (
            <Button
              buttonStyle={selectedMainCategory === 'absent' ? 'primary' : 'ghost'}
              colorOverride="blue"
              size="xs"
              fullWidth
              onClick={() => handleMainCategoryClick('absent')}
            >
              <div className="flex items-center justify-center gap-1 w-full">
                <span className="text-xs truncate">부재</span>
                <span className="text-xs font-bold flex-shrink-0">
                  {formatCount(counts.absent)}
                </span>
              </div>
            </Button>
          )}

          {(selectedChannel === 'phone' || selectedChannel === 'all') && isAcwActive && (
            <Button
              buttonStyle="primary"
              colorOverride="orange"
              size="xs"
              fullWidth
              disabled
            >
              <div className="flex flex-col items-center">
                <Icon iconType={['system', 'time']} size={12} />
                <div className="text-xs font-bold tabular-nums">{formatAcwTime(acwRemainingSeconds)}</div>
              </div>
            </Button>
          )}

          {(selectedChannel === 'phone' || selectedChannel === 'all') && !isAcwActive && onStartAcw && (
            <Button
              buttonStyle="primary"
              colorOverride="orange"
              size="xs"
              fullWidth
              onClick={onStartAcw}
            >
              <div className="flex items-center justify-center w-full">
                <span className="text-xs truncate">후처리</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const renderAllModeLayout = () => (
    <div className={`${SIDEBAR_CARD_PADDING} rounded-lg ${getBackgroundStyle()}`}>
      <div className="flex gap-1.5 items-stretch">
        <div className="flex-[1.1] min-w-0 flex flex-col">
          <div className="flex items-center gap-1 mb-1 py-0.5">
            <span className="font-medium text-base text-slate-800">Inbox</span>
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              onClick={onToggleInboxPosition}
              leadIcon={inboxPosition === 'top' ? <Icon iconType={['arrows', 'arrow-down-circle']} size={16} color="default-subtle" /> : <Icon iconType={['arrows', 'arrow-up-circle']} size={16} color="default-subtle" />}
              title={inboxPosition === 'top' ? '인박스를 하단으로 이동' : '인박스를 상단으로 이동'}
            />
          </div>
          <div className="flex gap-1 flex-1">
            <Button
              buttonStyle={selectedMainCategory === 'responding' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'responding' ? 'green' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('responding')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>상담 중</span>
                <span className="text-base font-bold">{formatCount(counts.responding)}</span>
              </div>
            </Button>

            <Button
              buttonStyle={selectedMainCategory === 'closed' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'closed' ? 'gray' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('closed')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>종료</span>
                <span className="text-base font-bold">{formatCount(counts.closed)}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="flex-1 bg-green-100 border border-green-300 rounded-lg p-0.5 flex flex-col gap-0.5">
              <div className="flex items-center justify-center py-0.5">
                <Icon iconType={['communication', 'chat-1']} size={12} color="success" />
              </div>
              <Button
                buttonStyle={selectedMainCategory === 'received' ? 'primary' : 'ghost'}
                colorOverride="green"
                size="2xs"
                onClick={() => handleMainCategoryClick('received')}
                className={selectedMainCategory === 'received' ? '' : 'bg-white'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">접수</span>
                  <span className="text-xs font-bold">{formatCount(counts.received)}</span>
                </div>
              </Button>
              <Button
                buttonStyle={selectedAdditionalCategory === 'maintain' ? 'primary' : 'ghost'}
                colorOverride="green"
                size="2xs"
                onClick={() => handleAdditionalCategoryClick('maintain')}
                className={selectedAdditionalCategory === 'maintain' ? '' : 'bg-white'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">유지</span>
                  <span className="text-xs font-bold">{formatCount(counts.maintain)}</span>
                </div>
              </Button>
              <Button
                buttonStyle={selectedAdditionalCategory === 'request' ? 'primary' : 'ghost'}
                colorOverride="green"
                size="2xs"
                onClick={() => handleAdditionalCategoryClick('request')}
                className={selectedAdditionalCategory === 'request' ? '' : 'bg-white'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">요청</span>
                  <span className="text-xs font-bold">{formatCount(counts.request)}</span>
                </div>
              </Button>
            </div>

            <div className="flex-1 bg-blue-100 border border-blue-300 rounded-lg p-0.5 flex flex-col gap-0.5">
              <div className="flex items-center justify-center py-0.5">
                <Icon iconType={['device', 'phone']} size={12} color="informative" />
              </div>
              <Button
                buttonStyle={selectedMainCategory === 'alarm' ? 'primary' : 'ghost'}
                colorOverride="blue"
                size="2xs"
                onClick={() => handleMainCategoryClick('alarm')}
                className={selectedMainCategory === 'alarm' ? '' : 'bg-white'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">콜백</span>
                  <span className="text-xs font-bold">{formatCount(counts.callback)}</span>
                </div>
              </Button>
              <Button
                buttonStyle={selectedMainCategory === 'absent' ? 'primary' : 'ghost'}
                colorOverride="blue"
                size="2xs"
                onClick={() => handleMainCategoryClick('absent')}
                className={selectedMainCategory === 'absent' ? '' : 'bg-white'}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs">부재</span>
                  <span className="text-xs font-bold">{formatCount(counts.absent)}</span>
                </div>
              </Button>
              <Button
                buttonStyle="primary"
                colorOverride="orange"
                size="2xs"
                onClick={!isAcwActive && onStartAcw ? onStartAcw : undefined}
                disabled={isAcwActive}
              >
                <div className="flex items-center justify-center w-full">
                  <span className="text-xs">후처리</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatModeLayout = () => (
    <div className={`${SIDEBAR_CARD_PADDING} rounded-lg ${getBackgroundStyle()}`}>
      <div className="flex gap-1.5">
        <div className="flex-[1.1] min-w-0 flex flex-col">
          <div className="flex items-center gap-1 mb-1 py-0.5">
            <span className="font-medium text-base text-gray-800">Inbox</span>
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              onClick={onToggleInboxPosition}
              leadIcon={inboxPosition === 'top' ? <Icon iconType={['arrows', 'arrow-down-circle']} size={16} color="default-subtle" /> : <Icon iconType={['arrows', 'arrow-up-circle']} size={16} color="default-subtle" />}
              title={inboxPosition === 'top' ? '인박스를 하단으로 이동' : '인박스를 상단으로 이동'}
            />
          </div>
          <div className="flex gap-1 flex-1">
            <Button
              buttonStyle={selectedMainCategory === 'responding' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'responding' ? 'green' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('responding')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>상담 중</span>
                <span className="text-base font-bold">{formatCount(counts.responding)}</span>
              </div>
            </Button>

            <Button
              buttonStyle={selectedMainCategory === 'closed' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'closed' ? 'gray' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('closed')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>종료</span>
                <span className="text-base font-bold">{formatCount(counts.closed)}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-end gap-0.5">
          <Button
            buttonStyle={selectedMainCategory === 'received' ? 'primary' : 'soft'}
            colorOverride="green"
            size="xs"
            fullWidth
            onClick={() => handleMainCategoryClick('received')}
          >
            <div className="flex items-center justify-center gap-1">
              <Icon iconType={['communication', 'chat-1']} size={12} />
              <span className="text-xs">접수</span>
              <span className="text-xs font-bold">
                {formatCount(counts.received)}
              </span>
            </div>
          </Button>

          <Button
            buttonStyle={selectedAdditionalCategory === 'maintain' ? 'primary' : 'soft'}
            colorOverride="green"
            size="xs"
            fullWidth
            onClick={() => handleAdditionalCategoryClick('maintain')}
          >
            <div className="flex items-center justify-center gap-1">
              <Icon iconType={['communication', 'chat-1']} size={12} />
              <span className="text-xs">유지</span>
              <span className="text-xs font-bold">
                {formatCount(counts.maintain)}
              </span>
            </div>
          </Button>

          <Button
            buttonStyle={selectedAdditionalCategory === 'request' ? 'primary' : 'secondary'}
            colorOverride={selectedAdditionalCategory === 'request' ? 'gray' : undefined}
            size="xs"
            fullWidth
            onClick={() => handleAdditionalCategoryClick('request')}
          >
            <span className="text-xs">요청</span>
            <span className="text-xs ml-1 font-bold">
              {formatCount(counts.request)}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPhoneModeLayout = () => (
    <div className={`${SIDEBAR_CARD_PADDING} rounded-lg ${getBackgroundStyle()}`}>
      <div className="flex gap-1.5">
        <div className="flex-[1.1] min-w-0 flex flex-col">
          <div className="flex items-center gap-1 mb-1 py-0.5">
            <span className="font-medium text-base text-blue-800">Inbox</span>
            <Button
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              onClick={onToggleInboxPosition}
              leadIcon={inboxPosition === 'top' ? <Icon iconType={['arrows', 'arrow-down-circle']} size={16} color="informative" /> : <Icon iconType={['arrows', 'arrow-up-circle']} size={16} color="informative" />}
              title={inboxPosition === 'top' ? '인박스를 하단으로 이동' : '인박스를 상단으로 이동'}
            />
          </div>
          <div className="flex gap-1 flex-1">
            <Button
              buttonStyle={selectedMainCategory === 'responding' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'responding' ? 'blue' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('responding')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>상담 중</span>
                <span className="text-base font-bold">{formatCount(counts.responding)}</span>
              </div>
            </Button>

            <Button
              buttonStyle={selectedMainCategory === 'closed' ? 'primary' : 'secondary'}
              colorOverride={selectedMainCategory === 'closed' ? 'gray' : undefined}
              size="md"
              onClick={() => handleMainCategoryClick('closed')}
              className="flex-1 !h-full"
            >
              <div className="flex flex-col items-center">
                <span className={`${SIDEBAR_BODY_TEXT} whitespace-nowrap`}>종료</span>
                <span className="text-base font-bold">{formatCount(counts.closed)}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-end gap-0.5">
          <Button
            buttonStyle={selectedMainCategory === 'alarm' ? 'primary' : 'soft'}
            colorOverride="blue"
            size="xs"
            fullWidth
            onClick={() => handleMainCategoryClick('alarm')}
          >
            <div className="flex items-center justify-center gap-1">
              <Icon iconType={['device', 'phone']} size={12} />
              <span className="text-xs">콜백</span>
              <span className="text-xs font-bold">
                {formatCount(counts.callback)}
              </span>
            </div>
          </Button>

          <Button
            buttonStyle={selectedMainCategory === 'absent' ? 'primary' : 'soft'}
            colorOverride="blue"
            size="xs"
            fullWidth
            onClick={() => handleMainCategoryClick('absent')}
          >
            <div className="flex items-center justify-center gap-1">
              <Icon iconType={['device', 'phone']} size={12} />
              <span className="text-xs">부재</span>
              <span className="text-xs font-bold">
                {formatCount(counts.absent)}
              </span>
            </div>
          </Button>

          <Button
            buttonStyle="primary"
            colorOverride="orange"
            size="xs"
            fullWidth
            onClick={!isAcwActive && onStartAcw ? onStartAcw : undefined}
            disabled={isAcwActive}
            leadIcon={['system', 'time']}
          >
            <span className="text-xs">{isAcwActive ? '후처리 중' : '후처리'}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  if (selectedChannel === 'all') {
    return renderAllModeLayout();
  } else if (['chat', 'board', 'email'].includes(selectedChannel)) {
    return renderChatModeLayout(); // 비동기 채널 공통 레이아웃
  } else {
    return renderPhoneModeLayout();
  }
};

export default React.memo(InboxArea);
