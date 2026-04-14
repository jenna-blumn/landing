import { Room } from '../../../data/mockData';
import { SearchFilters, SearchResult, SortOption } from '../types';
import {
  roomToSearchResult,
  searchRooms,
  applyFilters,
  sortResults,
} from '../utils/searchUtils';

export const searchConversations = async (
  allRooms: Room[],
  query: string,
  filters: SearchFilters,
  sortBy: SortOption = 'relevance'
): Promise<SearchResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filteredRooms = searchRooms(allRooms, query);

  filteredRooms = applyFilters(filteredRooms, filters);

  const results = filteredRooms.map(roomToSearchResult);

  const sortedResults = sortResults(results, sortBy, query);

  return sortedResults;
};

export const getStatuses = (): Array<{ value: string; label: string }> => {
  return [
    { value: 'ai-response', label: 'AI 응대' },
    { value: 'assignment-waiting', label: '배정대기' },
    { value: 'responding', label: '상담 중' },
    { value: 'closed', label: '종료' },
  ];
};
