import { Room } from '../../../data/mockData';
import { SearchFilters, SearchResult, SortOption, periodPresetToDateRange, ChatSubChannel } from '../types';

export const roomToSearchResult = (room: Room): SearchResult => {
  const now = Date.now();
  const startTime = new Date(room.startTime).getTime();
  const waitingSince = now - startTime;

  const lastMessageTime = room.messages.length > 0
    ? room.messages[room.messages.length - 1].time
    : room.startTime;

  return {
    id: room.id,
    contactName: room.contactName,
    consultantName: room.consultantName,
    brand: room.brand,
    company: room.company,
    conversationTopic: room.conversationTopic,
    lastMessage: room.lastMessage,
    summary: room.summary || null,
    isVIP: room.isVIP,
    isFavorite: room.isFavorite,
    tokenUsage: room.tokenUsage,
    flag: room.flag,
    waitingSince: waitingSince,
    elapsedTime: room.elapsedTimeMs,
    lastActivity: lastMessageTime,
    lastActivityTimestamp: room.lastActivityTimestamp,
    channel: room.channel,
    status: room.status,
    startTime: room.startTime,
    tags: room.tags,
    messages: room.messages,
  };
};

export const searchRooms = (rooms: Room[], query: string): Room[] => {
  if (!query.trim()) {
    return rooms;
  }

  const lowerQuery = query.toLowerCase();

  return rooms.filter((room) => {
    if (room.conversationTopic.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (room.contactName.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (room.consultantName.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (room.subject.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    const hasMatchingMessage = room.messages.some((message) =>
      message.text.toLowerCase().includes(lowerQuery)
    );

    return hasMatchingMessage;
  });
};

// Room.channel → ChatSubChannel 매핑
const channelToChatSubChannel: Record<string, ChatSubChannel> = {
  chat: 'webchat',
  kakao: 'kakao',
  naver: 'naver',
  instagram: 'instagram',
};

export const applyFilters = (rooms: Room[], filters: SearchFilters): Room[] => {
  let filtered = [...rooms];

  // 상담사 필터
  if (filters.consultant) {
    if (Array.isArray(filters.consultant)) {
      filtered = filtered.filter(
        (room) => filters.consultant!.includes(room.consultantName)
      );
    } else {
      filtered = filtered.filter(
        (room) => room.consultantName === filters.consultant
      );
    }
  }

  // 기간 필터 (새 PeriodFilter 구조)
  if (filters.searchPeriod) {
    let dateRange: { start: string; end: string } | null = null;
    if (filters.searchPeriod.preset) {
      dateRange = periodPresetToDateRange(filters.searchPeriod.preset);
    } else if (filters.searchPeriod.custom) {
      dateRange = filters.searchPeriod.custom;
    }
    if (dateRange) {
      const start = new Date(dateRange.start).getTime();
      const end = new Date(dateRange.end).getTime();
      filtered = filtered.filter((room) => {
        const roomStart = new Date(room.startTime).getTime();
        return roomStart >= start && roomStart <= end;
      });
    }
  }

  // 채널 필터 (새 ChannelFilter 구조)
  const cf = filters.channelFilter;
  if (cf) {
    filtered = filtered.filter((room) => {
      const isPhoneChannel = room.channel === 'phone';
      const isChatChannel = !isPhoneChannel;

      if (isChatChannel) {
        if (!cf.chat.enabled) return false;
        // 서브채널 필터 (빈 배열 = 전체)
        if (cf.chat.subChannels.length > 0) {
          const subChannel = channelToChatSubChannel[room.channel] || 'webchat';
          return cf.chat.subChannels.includes(subChannel);
        }
        return true;
      }

      if (isPhoneChannel) {
        if (!cf.phone.enabled) return false;
        // 서브채널(인입번호) 필터 - 목업에서는 전체 통과
        return true;
      }

      return true;
    });
  }

  // 분류 필터 (새 CategoryFilter 구조)
  // 현재 Room에는 mainCategory만 있으므로, 대분류만 실제 필터링
  // 중분류/소분류는 향후 Room 데이터 확장 시 적용
  const cat = filters.categoryFilter;
  if (cat && cat.major.length > 0) {
    // 목업: mainCategory와 대분류 매핑은 직접 비교
    // 실제로는 Room에 category 필드가 필요하나, 현재는 패스스루
  }

  if (filters.priority) {
    if (filters.priority === 'vip') {
      filtered = filtered.filter((room) => room.isVIP);
    } else if (filters.priority === 'flag') {
      filtered = filtered.filter((room) => room.flag !== null);
    }
  }

  if (filters.waitingTime) {
    const now = Date.now();
    filtered = filtered.filter((room) => {
      const startTime = new Date(room.startTime).getTime();
      const waitingTime = now - startTime;
      const waitingMinutes = waitingTime / (1000 * 60);
      return (
        waitingMinutes >= filters.waitingTime!.min &&
        waitingMinutes <= filters.waitingTime!.max
      );
    });
  }

  // Status 필터 (멀티 선택)
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((room) => {
      return filters.status!.includes(room.contactStatus);
    });
  }

  if (filters.favorite) {
    filtered = filtered.filter((room) => room.isFavorite);
  }

  if (filters.flagFilter) {
    filtered = filtered.filter((room) => {
      if (!room.flag) return false;
      return room.flag.type === filters.flagFilter;
    });
  }

  if (filters.tokenUsage) {
    filtered = filtered.filter((room) => {
      if (room.tokenUsage === null) return false;
      return (
        room.tokenUsage >= filters.tokenUsage!.min &&
        room.tokenUsage <= filters.tokenUsage!.max
      );
    });
  }

  // 추가 상태 필터 (새 AdditionalStatusFilter 구조)
  const as = filters.additionalStatus;
  if (as) {
    const hasActiveStatuses = as.chatStatuses.length > 0 || as.phoneStatuses.length > 0;
    if (hasActiveStatuses) {
      filtered = filtered.filter((room) => {
        // 채팅 상태 매핑: received→접수(상담 중으로 통합), maintain→유지, request→요청
        if (as.chatStatuses.length > 0) {
          const hasChatMatch = as.chatStatuses.some(status => {
            if (status === 'maintain') return room.additionalAttributes.includes('maintain');
            if (status === 'request') return room.additionalAttributes.includes('request');
            if (status === 'received') return room.mainCategory === 'responding';
            return false;
          });
          if (hasChatMatch) return true;
        }
        // 전화 상태 매핑: callback→알람, absent→부재
        if (as.phoneStatuses.length > 0) {
          const hasPhoneMatch = as.phoneStatuses.some(status => {
            if (status === 'callback') return room.mainCategory === 'alarm';
            if (status === 'absent') return room.mainCategory === 'absent';
            return false;
          });
          if (hasPhoneMatch) return true;
        }
        return false;
      });
    }
  }

  return filtered;
};

export const sortResults = (
  results: SearchResult[],
  sortBy: SortOption,
  query: string
): SearchResult[] => {
  const sorted = [...results];

  switch (sortBy) {
    case 'relevance':
      return sorted.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, query);
        const bScore = calculateRelevanceScore(b, query);
        return bScore - aScore;
      });

    case 'newest':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.lastActivity).getTime();
        const bTime = new Date(b.lastActivity).getTime();
        return bTime - aTime;
      });

    case 'oldest':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.lastActivity).getTime();
        const bTime = new Date(b.lastActivity).getTime();
        return aTime - bTime;
      });

    default:
      return sorted;
  }
};

const calculateRelevanceScore = (result: SearchResult, query: string): number => {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  if (result.conversationTopic.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }

  if (result.contactName.toLowerCase().includes(lowerQuery)) {
    score += 8;
  }

  if (result.consultantName.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }

  const matchingMessagesCount = result.messages.filter((msg) =>
    msg.text.toLowerCase().includes(lowerQuery)
  ).length;
  score += matchingMessagesCount * 2;

  return score;
};

export const getActiveFilterCount = (filters: SearchFilters): number => {
  let count = 0;

  if (filters.consultant) count++;
  if (filters.searchPeriod) count++;

  // 채널 필터
  const cf = filters.channelFilter;
  if (cf && !(cf.chat.enabled && cf.phone.enabled && cf.chat.subChannels.length === 0 && cf.phone.subChannels.length === 0)) {
    count++;
  }

  // 분류 필터
  const cat = filters.categoryFilter;
  if (cat && (cat.major.length > 0 || cat.middle.length > 0 || cat.minor.length > 0)) {
    count++;
  }

  if (filters.tag) count++;
  if (filters.priority) count++;
  if (filters.waitingTime) count++;
  if (filters.status && filters.status.length > 0) count++;
  if (filters.favorite) count++;
  if (filters.flagFilter) count++;
  if (filters.tokenUsage) count++;

  // 추가 상태
  const as = filters.additionalStatus;
  if (as && (as.chatStatuses.length > 0 || as.phoneStatuses.length > 0)) {
    count++;
  }

  return count;
};

export const formatWaitingTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}일 ${hours % 24}시간`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분`;
  } else if (minutes > 0) {
    return `${minutes}분`;
  } else {
    return `${seconds}초`;
  }
};

export const formatElapsedTime = (milliseconds: number | null): string => {
  if (!milliseconds) return '-';

  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}일 이상`;
  } else if (hours > 0) {
    return `${hours} hr 이상`;
  } else {
    return `${minutes} m`;
  }
};

export const formatTimeSince = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours} hr 전`;
  } else {
    return `${minutes} m전`;
  }
};
