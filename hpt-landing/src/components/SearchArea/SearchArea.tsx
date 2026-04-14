import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, Checkbox, Select, DataGrid, Icon } from '@blumnai-studio/blumnai-design-system';
import type { ColumnDef as TanStackColumnDef, SortingState, RowSelectionState, ColumnOrderState, Row } from '@blumnai-studio/blumnai-design-system/table';
import { Room } from '../../data/mockData';
import { SearchFilters, SearchResult, FilterType, SortOption, ContactStatus, FilterMode, getDefaultSearchFilters } from '../../features/search/types';
import { searchConversations } from '../../features/search/api/searchApi';
import { getActiveFilterCount, formatWaitingTime, formatElapsedTime, formatTimeSince } from '../../features/search/utils/searchUtils';
import PeriodFilterDropdown from './PeriodFilterDropdown';
import ChannelFilterDropdown from './ChannelFilterDropdown';
import AdditionalStatusDropdown from './AdditionalStatusDropdown';
import CategoryFilterDropdowns from './CategoryFilterDropdowns';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { Channel } from '../../types/channel';

interface SearchAreaProps {
  allRooms: Room[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchFilters: SearchFilters;
  onSearchFiltersChange: (filters: SearchFilters) => void;
  searchResults: SearchResult[];
  onSearchResultsChange: (results: SearchResult[]) => void;
  onSelectResult: (resultId: number | null) => void;
  onToggleSidebar: () => void;
  isManagerMode: boolean;
  filterMode: FilterMode;
  isAutoAssignment?: boolean;
  selectedChannel: Channel; // 추가
}

type ColumnKey = 'customer' | 'preview' | 'status' | 'consultant' | 'company' | 'brand' | 'topic' | 'tags' | 'activity' | 'description' | 'priority' | 'waitingTime' | 'elapsedTime' | 'lastActivity';

interface ColumnDef {
  key: ColumnKey;
  label: string;
  render: (result: SearchResult) => React.ReactNode;
  sortable?: boolean;
  sortFn?: (a: SearchResult, b: SearchResult, direction: 'asc' | 'desc') => number;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const SelectAvatarCell: React.FC<{ row: Row<SearchResult> }> = ({ row }) => {
  const [isHovered, setIsHovered] = useState(false);
  const result = row.original;
  const isSelected = row.getIsSelected();

  return (
    <div
      onClick={(e) => { e.stopPropagation(); row.toggleSelected(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center cursor-pointer"
    >
      {isSelected ? (
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <Icon iconType={['system', 'check']} size={16} color="white-default" />
        </div>
      ) : isHovered ? (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <div className="w-4 h-4 rounded border-2 border-gray-500 bg-white" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
          {getInitials(result.contactName)}
        </div>
      )}
    </div>
  );
};

const defaultColumnWidths: Record<ColumnKey, string> = {
  customer: 'minmax(100px, 1fr)',
  preview: 'minmax(160px, 2fr)',
  status: 'minmax(80px, 0.7fr)',
  consultant: 'minmax(100px, 1fr)',
  company: 'minmax(120px, 1.2fr)',
  brand: 'minmax(80px, 0.8fr)',
  topic: 'minmax(140px, 1.5fr)',
  tags: 'minmax(120px, 1.2fr)',
  activity: 'minmax(160px, 2fr)',
  description: 'minmax(120px, 1.2fr)',
  priority: 'minmax(60px, 0.5fr)',
  waitingTime: 'minmax(90px, 0.8fr)',
  elapsedTime: 'minmax(90px, 0.8fr)',
  lastActivity: 'minmax(90px, 0.8fr)',
};

const CONSULTANT_OPTIONS = [
  { value: '김상담', label: '김상담' },
  { value: '이상담', label: '이상담' },
  { value: '박상담', label: '박상담' },
  { value: '최상담', label: '최상담' },
  { value: '정상담', label: '정상담' },
];

const DEFAULT_COLUMN_ORDER: ColumnKey[] = [
  'customer',
  'preview',
  'status',
  'consultant',
  'company',
  'brand',
  'topic',
  'tags',
  'activity',
  'description',
  'priority',
  'waitingTime',
  'elapsedTime',
  'lastActivity'
];

const DEFAULT_COLUMN_VISIBILITY: Record<ColumnKey, boolean> = {
  customer: true,
  preview: true,
  status: true,
  consultant: true,
  company: true,
  brand: true,
  topic: true,
  tags: true,
  activity: false,
  description: false,
  priority: true,
  waitingTime: true,
  elapsedTime: false,
  lastActivity: false
};

const COLUMN_DEFINITIONS: Record<ColumnKey, ColumnDef> = {
  customer: {
    key: 'customer',
    label: '고객',
    render: (result) => <span className="text-sm font-medium">{result.contactName}</span>
  },
  preview: {
    key: 'preview',
    label: '미리보기',
    render: (result) => (
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="text-xs text-gray-600 truncate">{result.consultantName}</span>
        <span className="text-xs text-gray-500 truncate">{result.lastMessage}</span>
      </div>
    )
  },
  status: {
    key: 'status',
    label: '상태',
    render: (result) => {
      const statusMap = {
        active: { label: '활성', className: 'bg-green-100 text-green-800' },
        waiting: { label: '대기', className: 'bg-yellow-100 text-yellow-800' },
        closed: { label: '종료', className: 'bg-gray-100 text-gray-800' }
      };
      const status = statusMap[result.status];
      return (
        <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      );
    }
  },
  consultant: {
    key: 'consultant',
    label: '상담사',
    render: (result) => <span className="text-sm">{result.consultantName || '-'}</span>
  },
  company: {
    key: 'company',
    label: '회사',
    render: (result) => <span className="text-sm">{result.company}</span>
  },
  brand: {
    key: 'brand',
    label: '브랜드',
    render: (result) => <span className="text-sm">{result.brand}</span>,
    sortable: true,
    sortFn: (a, b, direction) => {
      const comparison = a.brand.localeCompare(b.brand);
      return direction === 'asc' ? comparison : -comparison;
    }
  },
  topic: {
    key: 'topic',
    label: '주제',
    render: (result) => <span className="text-sm">{result.conversationTopic}</span>
  },
  tags: {
    key: 'tags',
    label: '태그',
    render: (result) => (
      <div className="flex flex-wrap gap-1">
        {result.tags && result.tags.length > 0 ? (
          result.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </div>
    )
  },
  activity: {
    key: 'activity',
    label: '활동',
    render: (result) => <span className="text-sm text-gray-600 truncate block">{result.lastMessage}</span>
  },
  description: {
    key: 'description',
    label: '설명',
    render: (result) => <span className="text-xs text-gray-500">{result.summary || '-'}</span>
  },
  priority: {
    key: 'priority',
    label: '중요도',
    render: (result) => (
      <div className="flex items-center gap-1">
        {result.isVIP && <Icon iconType={['system', 'star']} size={16} color="#eab308" isFill />}
        {result.flag && <div className={`w-2 h-2 rounded-full ${result.flag.color}`} />}
      </div>
    ),
    sortable: true,
    sortFn: (a, b, direction) => {
      const getPriorityScore = (result: SearchResult) => {
        let score = 0;
        if (result.isVIP) score += 2;
        if (result.flag) score += 1;
        return score;
      };
      const comparison = getPriorityScore(a) - getPriorityScore(b);
      return direction === 'asc' ? comparison : -comparison;
    }
  },
  waitingTime: {
    key: 'waitingTime',
    label: '대기 시간',
    render: (result) => <span className="text-sm text-gray-600">{formatWaitingTime(result.waitingSince)}</span>,
    sortable: true,
    sortFn: (a, b, direction) => {
      const comparison = (a.waitingSince || 0) - (b.waitingSince || 0);
      return direction === 'asc' ? comparison : -comparison;
    }
  },
  elapsedTime: {
    key: 'elapsedTime',
    label: '경과 시간',
    render: (result) => <span className="text-sm text-gray-600">{formatElapsedTime(result.elapsedTime)}</span>,
    sortable: true,
    sortFn: (a, b, direction) => {
      const comparison = (a.elapsedTime || 0) - (b.elapsedTime || 0);
      return direction === 'asc' ? comparison : -comparison;
    }
  },
  lastActivity: {
    key: 'lastActivity',
    label: '최근 활동',
    render: (result) => <span className="text-sm text-gray-600">{formatTimeSince(result.lastActivityTimestamp)}</span>,
    sortable: true,
    sortFn: (a, b, direction) => {
      const comparison = (a.lastActivityTimestamp || 0) - (b.lastActivityTimestamp || 0);
      return direction === 'asc' ? comparison : -comparison;
    }
  }
};

const SearchArea: React.FC<SearchAreaProps> = ({
  allRooms,
  searchQuery,
  onSearchQueryChange,
  searchFilters,
  onSearchFiltersChange,
  searchResults,
  onSearchResultsChange,
  onSelectResult,
  onToggleSidebar: _onToggleSidebar,
  isManagerMode,
  filterMode,
  isAutoAssignment = true,
  selectedChannel, // 추가
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isPerformingSearch, setIsPerformingSearch] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // Helper functions to check filter mode consistently (only based on filterMode, not searchFilters.status)
  // This ensures that in search mode (standard), all status selections remain available
  const isAIResponseMode = filterMode === 'ai-response';
  const isUnassignedMode = filterMode === 'unassigned';
  const isStandardMode = filterMode === 'standard';

  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(() => {
    const saved = localStorage.getItem('searchTableColumnOrder');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMN_ORDER;
  });

  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>(() => {
    const saved = localStorage.getItem('searchTableColumnVisibility');
    return saved ? JSON.parse(saved) : DEFAULT_COLUMN_VISIBILITY;
  });

  // DataGrid에 전달할 columnOrder (select 컬럼 포함)
  const gridColumnOrder: ColumnOrderState = useMemo(() => {
    const visible = columnOrder.filter(k => columnVisibility[k]);
    return ['select', ...visible];
  }, [columnOrder, columnVisibility]);

  const handleColumnOrderChange = useCallback((updater: ColumnOrderState | ((prev: ColumnOrderState) => ColumnOrderState)) => {
    const newOrder = typeof updater === 'function' ? updater(gridColumnOrder) : updater;
    // select 컬럼 제거 후 ColumnKey로 저장
    const dataOrder = newOrder.filter((k): k is ColumnKey => k !== 'select');
    // 숨겨진 컬럼도 원래 순서대로 유지
    const hiddenCols = columnOrder.filter(k => !columnVisibility[k]);
    const fullOrder = [...dataOrder, ...hiddenCols];
    setColumnOrder(fullOrder);
    localStorage.setItem('searchTableColumnOrder', JSON.stringify(fullOrder));
  }, [gridColumnOrder, columnOrder, columnVisibility]);

  const [_selectedAssignConsultant, setSelectedAssignConsultant] = useState<string | null>(null);

  const onSearchResultsChangeRef = useRef(onSearchResultsChange);
  onSearchResultsChangeRef.current = onSearchResultsChange;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchFiltersKey = useMemo(() => JSON.stringify(searchFilters), [searchFilters]);

  const hasSearchCriteria = debouncedQuery.trim() !== '' || getActiveFilterCount(searchFilters) > 0;

  useEffect(() => {
    const currentHasSearchCriteria = debouncedQuery.trim() !== '' || getActiveFilterCount(searchFilters) > 0;

    if (!currentHasSearchCriteria) {
      onSearchResultsChangeRef.current([]);
      setIsPerformingSearch(false);
      return;
    }

    let isCancelled = false;
    setIsPerformingSearch(true);

    const performSearch = async () => {
      try {
        const results = await searchConversations(allRooms, debouncedQuery, searchFilters, sortBy);

        if (!isCancelled) {
          onSearchResultsChangeRef.current(results);
          setIsPerformingSearch(false);
        }
      } catch {
        if (!isCancelled) {
          onSearchResultsChangeRef.current([]);
          setIsPerformingSearch(false);
        }
      }
    };

    performSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, searchFiltersKey, sortBy, allRooms, searchFilters]);

  const handleClearSearch = useCallback(() => {
    onSearchQueryChange('');
    onSearchFiltersChange(getDefaultSearchFilters());
  }, [onSearchQueryChange, onSearchFiltersChange]);

  const handleStatusToggle = useCallback((status: ContactStatus) => {
    const currentStatuses = searchFilters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];

    onSearchFiltersChange({
      ...searchFilters,
      status: newStatuses.length > 0 ? newStatuses : null,
      consultant: (newStatuses.includes('ai-response') || newStatuses.includes('assignment-waiting'))
        ? null : searchFilters.consultant,
    });
  }, [searchFilters, onSearchFiltersChange]);

  const activeFilterCount = getActiveFilterCount(searchFilters);

  useEffect(() => {
    localStorage.setItem('searchTableColumnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const toggleColumnVisibility = useCallback((colKey: ColumnKey) => {
    setColumnVisibility(prev => ({
      ...prev,
      [colKey]: !prev[colKey]
    }));
  }, []);

  const selectedCount = Object.keys(rowSelection).filter(k => rowSelection[k]).length;

  const handleCategoryChange = useCallback(() => {
    alert(`상담분류 변경: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleConsultantChangeRequest = useCallback(() => {
    alert(`상담사 변경 요청: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleConsultantChange = useCallback(() => {
    alert(`상담사 변경: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleEndConsultation = useCallback(() => {
    alert(`상담 종료: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handlePendingEnd = useCallback(() => {
    alert(`종료 보류: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleConvertToWaiting = useCallback(() => {
    alert(`상담 대기로 전환: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleConnectConsultant = useCallback(() => {
    alert(`상담사 즉시 연결: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleAssignToSelf = useCallback(() => {
    alert(`나에게 배정: ${selectedCount}개 항목 선택됨`);
  }, [selectedCount]);

  const handleAssignToConsultant = useCallback((consultantId: string) => {
    const consultant = CONSULTANT_OPTIONS.find(c => c.value === consultantId);
    alert(`${consultant?.label || consultantId}에게 ${selectedCount}개 항목 배정`);
    setSelectedAssignConsultant(null);
  }, [selectedCount]);

  const isManualMode = !isAutoAssignment;

  const visibleColumns = useMemo<TanStackColumnDef<SearchResult>[]>(() => {
    const selectCol: TanStackColumnDef<SearchResult> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={() => table.toggleAllRowsSelected()}
        />
      ),
      cell: ({ row }) => <SelectAvatarCell row={row} />,
      enableSorting: false,
      meta: { width: '48px' },
    };

    const dataCols = columnOrder
      .filter(colKey => columnVisibility[colKey])
      .map((colKey): TanStackColumnDef<SearchResult> => {
        const config = COLUMN_DEFINITIONS[colKey];
        const col: TanStackColumnDef<SearchResult> = {
          id: colKey,
          header: config.label,
          cell: ({ row }) => config.render(row.original),
          enableSorting: !!config.sortable,
          meta: { width: defaultColumnWidths[colKey] },
        };

        if (config.sortable && config.sortFn) {
          const sortFn = config.sortFn;
          col.sortingFn = (rowA, rowB) => sortFn(rowA.original, rowB.original, 'asc');
        }

        return col;
      });

    return [selectCol, ...dataCols];
  }, [columnOrder, columnVisibility]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-14 border-b border-gray-300 px-4 flex items-center">
        <div className="flex items-center gap-2 w-full">
          <Icon iconType={['system', 'search']} size={16} color="default-subtle" />
          <span className="text-sm text-gray-600">Search</span>
          {searchQuery && (
            <>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-600">{searchQuery}</span>
            </>
          )}
          {(searchQuery || activeFilterCount > 0) && (
            <Button
              buttonStyle="ghost"
              size="xs"
              onClick={handleClearSearch}
              className="ml-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* === 2행 고정 필터 레이아웃 === */}
      <div className="px-4 py-2 space-y-2">
        {/* 1행: 상담사, 기간, 채널, 추가상태 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 상담사 필터 (Standard 모드, AI응대/배정대기 상태 아닐 때) */}
            {isStandardMode && !searchFilters.status?.includes('ai-response') && !searchFilters.status?.includes('assignment-waiting') && (
              isManagerMode ? (
                <MultiSelectDropdown
                  options={CONSULTANT_OPTIONS}
                  selected={Array.isArray(searchFilters.consultant) ? searchFilters.consultant : searchFilters.consultant ? [searchFilters.consultant] : []}
                  onChange={(selected) => {
                    onSearchFiltersChange({
                      ...searchFilters,
                      consultant: selected.length > 0 ? selected : null,
                    });
                  }}
                  label="상담사"
                  allLabel="전체 상담사"
                  minWidth={140}
                />
              ) : (
                <span className="text-xs h-[26px] px-3 py-1 rounded-full border bg-gray-400 text-white border-gray-400 font-medium cursor-not-allowed flex items-center">
                  김상담
                </span>
              )
            )}

            {/* 기간 필터 */}
            <PeriodFilterDropdown
              value={searchFilters.searchPeriod}
              onChange={(period) => onSearchFiltersChange({ ...searchFilters, searchPeriod: period })}
            />

            {/* 채널 필터 */}
            <ChannelFilterDropdown
              value={searchFilters.channelFilter}
              onChange={(channelFilter) => onSearchFiltersChange({ ...searchFilters, channelFilter })}
              selectedChannel={selectedChannel}
            />

            {/* Status 배지 (AI응대/배정대기 모드) */}
            {!isStandardMode && (
              <span className="text-xs h-[26px] px-3 py-1 rounded-full border bg-blue-500 text-white border-blue-500 font-medium flex items-center">
                {isAIResponseMode ? 'AI 응대' : '배정대기'}
              </span>
            )}

            {/* Status 칩 버튼 (Standard 모드) - 멀티 선택 가능 */}
            {isStandardMode && (
              <div className="flex items-center gap-1.5">
                <Button
                  buttonStyle={searchFilters.status?.includes('ai-response') ? 'primary' : 'secondary'}
                  size="xs"
                  shape="pill"
                  onClick={() => handleStatusToggle('ai-response')}
                >
                  AI 응대
                </Button>
                <Button
                  buttonStyle={searchFilters.status?.includes('assignment-waiting') ? 'primary' : 'secondary'}
                  size="xs"
                  shape="pill"
                  onClick={() => handleStatusToggle('assignment-waiting')}
                >
                  배정대기
                </Button>
                <Button
                  buttonStyle={searchFilters.status?.includes('responding') ? 'primary' : 'secondary'}
                  size="xs"
                  shape="pill"
                  onClick={() => handleStatusToggle('responding')}
                >
                  상담 중
                </Button>
                <Button
                  buttonStyle={searchFilters.status?.includes('closed') ? 'primary' : 'secondary'}
                  size="xs"
                  shape="pill"
                  onClick={() => handleStatusToggle('closed')}
                >
                  종료
                </Button>
              </div>
            )}

            {/* 추가 상태 필터 (Standard 모드) - Status 오른쪽으로 이동 */}
            {isStandardMode && (
              <AdditionalStatusDropdown
                value={searchFilters.additionalStatus}
                onChange={(additionalStatus) => onSearchFiltersChange({ ...searchFilters, additionalStatus })}
                channelFilter={searchFilters.channelFilter}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              variant="default"
              options={[
                { id: 'relevance', label: '연관 항목 우선' },
                { id: 'newest', label: '최신 항목 우선' },
                { id: 'oldest', label: '오래된 항목 우선' },
              ]}
              value={sortBy}
              onChange={(val) => setSortBy(val as SortOption)}
              size="sm"
            />
          </div>
        </div>

        {/* 2행: 대분류, 중분류, 소분류, 태그, 중요도, 대기시간, 즐겨찾기, 플래그, 토큰 사용량 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 분류 필터 (Standard/배정대기 모드) */}
          {!isAIResponseMode && (
            <CategoryFilterDropdowns
              value={searchFilters.categoryFilter}
              onChange={(categoryFilter) => onSearchFiltersChange({ ...searchFilters, categoryFilter })}
            />
          )}

          {/* 태그 (비활성) */}
          {!isAIResponseMode && (
            <FilterTab label="태그" isActive={false} onClick={() => {}} count={0} disabled />
          )}

          {/* 중요도 */}
          {!isAIResponseMode && (
            <FilterTab
              label="중요도"
              isActive={activeFilter === 'priority'}
              onClick={() => setActiveFilter(activeFilter === 'priority' ? 'all' : 'priority')}
              count={searchFilters.priority ? 1 : 0}
            />
          )}

          {/* 대기 시간 */}
          {!isAIResponseMode && (
            <FilterTab
              label="대기 시간"
              isActive={activeFilter === 'waitingTime'}
              onClick={() => setActiveFilter(activeFilter === 'waitingTime' ? 'all' : 'waitingTime')}
              count={searchFilters.waitingTime ? 1 : 0}
            />
          )}

          {/* AI응대/배정대기 모드: 즐겨찾기, 플래그 */}
          {(isAIResponseMode || isUnassignedMode) && (
            <>
              <FilterTab
                label="즐겨찾기"
                isActive={activeFilter === 'favorite'}
                onClick={() => setActiveFilter(activeFilter === 'favorite' ? 'all' : 'favorite')}
                count={searchFilters.favorite ? 1 : 0}
              />
              <FilterTab
                label="플래그"
                isActive={activeFilter === 'flagFilter'}
                onClick={() => setActiveFilter(activeFilter === 'flagFilter' ? 'all' : 'flagFilter')}
                count={searchFilters.flagFilter ? 1 : 0}
              />
            </>
          )}

          {/* AI응대 모드: 토큰 사용량 */}
          {isAIResponseMode && (
            <FilterTab
              label="토큰 사용량"
              isActive={activeFilter === 'tokenUsage'}
              onClick={() => setActiveFilter(activeFilter === 'tokenUsage' ? 'all' : 'tokenUsage')}
              count={searchFilters.tokenUsage ? 1 : 0}
            />
          )}
        </div>
      </div>

      <div
        className="flex-1 overflow-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectResult(null);
          }
        }}
      >
        {!hasSearchCriteria ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Icon iconType={['system', 'search']} size={48} color="default-muted" className="mb-4" />
            <p className="text-lg font-medium">검색어를 입력해주세요</p>
            <p className="text-sm mt-2">검색어 또는 필터를 사용하여 대화를 검색할 수 있습니다</p>
          </div>
        ) : isPerformingSearch ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">검색 중...</div>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Icon iconType={['system', 'search']} size={48} color="default-muted" className="mb-4" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm mt-2 mb-4">현재 적용된 필터를 확인해 보세요</p>
            {/* 적용된 필터 요약 + 인라인 해제 */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-center max-w-md">
                {searchFilters.searchPeriod && (
                  <Button
                    buttonStyle="ghost"
                    size="xs"
                    shape="pill"
                    onClick={() => onSearchFiltersChange({ ...searchFilters, searchPeriod: null })}
                    tailIcon={<Icon iconType={['system', 'close']} size={10} />}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    기간
                  </Button>
                )}
                {!(searchFilters.channelFilter.chat.enabled && searchFilters.channelFilter.phone.enabled && searchFilters.channelFilter.chat.subChannels.length === 0 && searchFilters.channelFilter.phone.subChannels.length === 0) && (
                  <Button
                    buttonStyle="ghost"
                    size="xs"
                    shape="pill"
                    onClick={() => onSearchFiltersChange({ ...searchFilters, channelFilter: { chat: { enabled: true, subChannels: [] }, phone: { enabled: true, subChannels: [] } } })}
                    tailIcon={<Icon iconType={['system', 'close']} size={10} />}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    채널
                  </Button>
                )}
                {(searchFilters.additionalStatus.chatStatuses.length > 0 || searchFilters.additionalStatus.phoneStatuses.length > 0) && (
                  <Button
                    buttonStyle="ghost"
                    size="xs"
                    shape="pill"
                    onClick={() => onSearchFiltersChange({ ...searchFilters, additionalStatus: { chatStatuses: [], phoneStatuses: [] } })}
                    tailIcon={<Icon iconType={['system', 'close']} size={10} />}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    추가 상태
                  </Button>
                )}
                {(searchFilters.categoryFilter.major.length > 0 || searchFilters.categoryFilter.middle.length > 0 || searchFilters.categoryFilter.minor.length > 0) && (
                  <Button
                    buttonStyle="ghost"
                    size="xs"
                    shape="pill"
                    onClick={() => onSearchFiltersChange({ ...searchFilters, categoryFilter: { major: [], middle: [], minor: [] } })}
                    tailIcon={<Icon iconType={['system', 'close']} size={10} />}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    분류
                  </Button>
                )}
                {searchFilters.status && (
                  <Button
                    buttonStyle="ghost"
                    size="xs"
                    shape="pill"
                    onClick={() => onSearchFiltersChange({ ...searchFilters, status: null })}
                    tailIcon={<Icon iconType={['system', 'close']} size={10} />}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    상태
                  </Button>
                )}
                <p className="text-xs text-gray-400 w-full text-center mt-1">필터를 해제하면 더 많은 결과를 볼 수 있습니다</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {selectedCount > 0 ? (
                <span className="text-xs text-emerald-600 font-medium">{selectedCount}/{searchResults.length} 선택됨</span>
              ) : (
                <span className="text-xs text-gray-600">{searchResults.length} 검색됨</span>
              )}
              <div className="flex items-center gap-2 ml-2 flex-1">
                {/* Action buttons for AI response mode */}
                {isAIResponseMode ? (
                  <>
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['business', 'flag']} size={14} />}
                      onClick={() => alert('플래그 설정 기능 (구현 예정)')}
                      title="선택한 항목에 플래그를 설정합니다"
                    >
                      플래그 설정
                    </Button>
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['system', 'forbid']} size={14} />}
                      onClick={() => alert('고객 차단 기능 (구현 예정)')}
                      title="AI 응대 중인 고객을 차단합니다"
                    >
                      고객 차단
                    </Button>
                    {isManagerMode && (
                      <>
                        <Button
                          buttonStyle="secondary"
                          size="xs"
                          leadIcon={<Icon iconType={['document', 'clipboard']} size={14} />}
                          onClick={handleConvertToWaiting}
                          title="AI 응대를 종료하고 상담 대기로 전환합니다"
                        >
                          상담 대기로 전환
                        </Button>
                        <Button
                          buttonStyle="secondary"
                          size="xs"
                          leadIcon={<Icon iconType={['device', 'phone']} size={14} />}
                          onClick={handleConnectConsultant}
                          title="AI 응대를 종료하고 상담사에게 즉시 배정합니다. 자동배정 혹은 상담사를 지정할 수 있습니다"
                        >
                          상담사 즉시 연결
                        </Button>
                      </>
                    )}
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['system', 'close-circle']} size={14} />}
                      onClick={handleEndConsultation}
                      title="AI 응대를 마치고 상담을 종료합니다."
                    >
                      상담 종료
                    </Button>
                  </>
                ) : /* Action buttons for unassigned mode */ isUnassignedMode ? (
                  isManagerMode ? (
                    <>
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['business', 'flag']} size={14} />}
                        onClick={() => alert('플래그 설정 기능 (구현 예정)')}
                        title="선택한 항목에 플래그를 설정합니다"
                      >
                        플래그 설정
                      </Button>
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['system', 'forbid']} size={14} />}
                        onClick={() => alert('고객 차단 기능 (구현 예정)')}
                        title="고객을 차단합니다"
                      >
                        고객 차단
                      </Button>
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['document', 'clipboard']} size={14} />}
                        onClick={handleConvertToWaiting}
                        title="상담 대기로 전환합니다"
                      >
                        상담 대기로 전환
                      </Button>
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['user', 'user-add']} size={14} color="success" />}
                        onClick={handleAssignToSelf}
                        title="선택한 항목을 나에게 배정합니다"
                      >
                        {isManualMode ? '나에게 배정' : '나에게 즉시 배정'}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            buttonStyle="secondary"
                            size="xs"
                            leadIcon={<Icon iconType={['user', 'user-settings']} size={14} />}
                            tailIcon={<Icon iconType={['arrows', 'arrow-down-s']} size={12} />}
                            title="선택한 항목을 상담사에게 배정합니다"
                          >
                            {isManualMode ? '상담사에게 배정' : '상담사에게 즉시 배정'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent width={192}>
                          {CONSULTANT_OPTIONS.map((consultant) => (
                            <DropdownMenuItem
                              key={consultant.value}
                              onClick={() => handleAssignToConsultant(consultant.value)}
                              leadIcon={['user', 'account-circle']}
                            >
                              {consultant.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['system', 'close-circle']} size={14} />}
                        onClick={handleEndConsultation}
                        title="상담을 종료합니다"
                      >
                        상담 종료
                      </Button>
                    </>
                  ) : isManualMode ? (
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['user', 'user-add']} size={14} color="success" />}
                      onClick={handleAssignToSelf}
                      title="선택한 항목을 나에게 배정합니다"
                    >
                      나에게 배정
                    </Button>
                  ) : (
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['user', 'user-add']} size={14} color="success" />}
                      onClick={handleAssignToSelf}
                      title="선택한 항목을 나에게 즉시 배정합니다"
                    >
                      나에게 즉시 배정
                    </Button>
                  )
                ) : (
                  <>
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['system', 'more']} size={14} />}
                      onClick={handleCategoryChange}
                    >
                      상담 분류 변경
                    </Button>
                    {!isManagerMode && (
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['user', 'user']} size={14} />}
                        onClick={handleConsultantChangeRequest}
                      >
                        상담사 변경 요청
                      </Button>
                    )}
                    {isManagerMode && (
                      <Button
                        buttonStyle="secondary"
                        size="xs"
                        leadIcon={<Icon iconType={['user', 'user-settings']} size={14} />}
                        onClick={handleConsultantChange}
                      >
                        상담사 변경
                      </Button>
                    )}
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['system', 'close-circle']} size={14} />}
                      onClick={handleEndConsultation}
                    >
                      상담 종료
                    </Button>
                    <Button
                      buttonStyle="secondary"
                      size="xs"
                      leadIcon={<Icon iconType={['system', 'time']} size={14} />}
                      onClick={handlePendingEnd}
                    >
                      종료 보류
                    </Button>
                  </>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button buttonStyle="secondary" size="xs" leadIcon={<Icon iconType={['system', 'settings']} size={14} />}>
                    컬럼 설정
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  <DropdownMenuLabel>컬럼 보기/숨기기</DropdownMenuLabel>
                  {columnOrder.map((colKey) => (
                    <div
                      key={colKey}
                      className="px-2 py-1.5 hover:bg-gray-50 rounded"
                    >
                      <Checkbox
                        checked={columnVisibility[colKey]}
                        onCheckedChange={() => toggleColumnVisibility(colKey)}
                        label={COLUMN_DEFINITIONS[colKey].label}
                      />
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DataGrid<SearchResult>
              data={searchResults}
              columns={visibleColumns}
              rowHeight="48px"
              getRowId={(row) => String(row.id)}
              sorting={sorting}
              onSortingChange={setSorting}
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              enableRowSelection
              enableColumnReorder
              columnOrder={gridColumnOrder}
              onColumnOrderChange={handleColumnOrderChange}
              showSelectedRowBackground
              onRowClick={(row) => onSelectResult(row.id)}
              pagination={false}
              emptyText="검색 결과가 없습니다"
              isLoading={isPerformingSearch}
              className="search-datagrid-no-col-border"
            />
          </>
        )}
      </div>
    </div>
  );
};

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  disabled?: boolean;
}

const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  onClick,
  count = 0,
  disabled = false,
}) => {
  return (
    <Button
      buttonStyle={isActive ? 'primary' : 'secondary'}
      size="xs"
      shape="pill"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
      {count > 0 && (
        <span className={`ml-1.5 ${isActive ? 'text-white' : 'text-blue-600'}`}>
          ({count})
        </span>
      )}
    </Button>
  );
};

export default React.memo(SearchArea);
