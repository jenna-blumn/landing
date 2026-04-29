import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Users, User, Check, ChevronDown, X } from 'lucide-react';
import { Consultant, ConsultantGroup } from '../types/consultant';
import { NoticeReadStatus } from '../types/task';
import { useTaskContext } from '../context/TaskContext';

interface TargetAudienceSelectorProps {
  selectedAudience: NoticeReadStatus[];
  onAudienceChange: (audience: NoticeReadStatus[]) => void;
}

const TargetAudienceSelector: React.FC<TargetAudienceSelectorProps> = ({
  selectedAudience,
  onAudienceChange,
}) => {
  const { consultantApi } = useTaskContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'consultants' | 'groups'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Async-loaded consultant data
  const [allConsultants, setAllConsultants] = useState<Consultant[]>([]);
  const [allGroups, setAllGroups] = useState<ConsultantGroup[]>([]);

  // Cache for group members to avoid repeated async calls
  const [groupMembersCache, setGroupMembersCache] = useState<Record<string, Consultant[]>>({});

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const [consultants, groups] = await Promise.all([
          consultantApi.getAllConsultants(),
          consultantApi.getAllGroups(),
        ]);
        if (!cancelled) {
          setAllConsultants(consultants);
          setAllGroups(groups);

          // Pre-load group members
          const membersMap: Record<string, Consultant[]> = {};
          await Promise.all(
            groups.map(async (group) => {
              const members = await consultantApi.getConsultantsByGroupId(group.id);
              membersMap[group.id] = members;
            })
          );
          if (!cancelled) {
            setGroupMembersCache(membersMap);
          }
        }
      } catch (error) {
        console.error('Failed to load consultant data:', error);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [consultantApi]);

  const getConsultantsByGroupId = useCallback((groupId: string): Consultant[] => {
    return groupMembersCache[groupId] || [];
  }, [groupMembersCache]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAllSelected = allConsultants.length > 0 && selectedAudience.length === allConsultants.length;
  const selectedIds = new Set(selectedAudience.map(s => s.consultantId));

  const handleSelectAll = () => {
    if (isAllSelected) {
      onAudienceChange([]);
    } else {
      const allAudience: NoticeReadStatus[] = allConsultants.map(c => ({
        consultantId: c.id,
        consultantName: c.name,
        isRead: false,
        readAt: null,
      }));
      onAudienceChange(allAudience);
    }
  };

  const handleSelectConsultant = (consultant: Consultant) => {
    if (selectedIds.has(consultant.id)) {
      onAudienceChange(selectedAudience.filter(s => s.consultantId !== consultant.id));
    } else {
      onAudienceChange([
        ...selectedAudience,
        {
          consultantId: consultant.id,
          consultantName: consultant.name,
          isRead: false,
          readAt: null,
        },
      ]);
    }
  };

  const handleSelectGroup = (group: ConsultantGroup) => {
    const groupMembers = getConsultantsByGroupId(group.id);
    const groupMemberIds = new Set(groupMembers.map(m => m.id));
    const allGroupSelected = groupMembers.every(m => selectedIds.has(m.id));

    if (allGroupSelected) {
      onAudienceChange(selectedAudience.filter(s => !groupMemberIds.has(s.consultantId)));
    } else {
      const currentWithoutGroup = selectedAudience.filter(s => !groupMemberIds.has(s.consultantId));
      const groupAudience: NoticeReadStatus[] = groupMembers.map(m => ({
        consultantId: m.id,
        consultantName: m.name,
        isRead: false,
        readAt: null,
      }));
      onAudienceChange([...currentWithoutGroup, ...groupAudience]);
    }
  };

  const handleRemoveAudience = (consultantId: string) => {
    onAudienceChange(selectedAudience.filter(s => s.consultantId !== consultantId));
  };

  const filteredConsultants = allConsultants.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = allGroups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isGroupFullySelected = (group: ConsultantGroup): boolean => {
    const groupMembers = getConsultantsByGroupId(group.id);
    return groupMembers.length > 0 && groupMembers.every(m => selectedIds.has(m.id));
  };

  const isGroupPartiallySelected = (group: ConsultantGroup): boolean => {
    const groupMembers = getConsultantsByGroupId(group.id);
    const selectedCount = groupMembers.filter(m => selectedIds.has(m.id)).length;
    return selectedCount > 0 && selectedCount < groupMembers.length;
  };

  const sortedAudience = [...selectedAudience].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return a.consultantName.localeCompare(b.consultantName, 'ko');
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        읽기 대상 상담사
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <span className="text-sm text-gray-700">
          {selectedAudience.length === 0
            ? '대상 선택'
            : isAllSelected
            ? '전체 상담사'
            : `${selectedAudience.length}명 선택됨`}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-300"
              />
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-3 py-2 text-xs font-medium ${
                activeTab === 'all' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 px-3 py-2 text-xs font-medium ${
                activeTab === 'groups' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'
              }`}
            >
              그룹
            </button>
            <button
              onClick={() => setActiveTab('consultants')}
              className={`flex-1 px-3 py-2 text-xs font-medium ${
                activeTab === 'consultants' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500'
              }`}
            >
              상담사
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {activeTab === 'all' && (
              <button
                onClick={handleSelectAll}
                className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-violet-50 transition-colors border-b border-gray-100"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isAllSelected ? 'bg-violet-600 border-violet-600' : 'border-gray-300'
                }`}>
                  {isAllSelected && <Check size={12} className="text-white" />}
                </div>
                <Users size={16} className="text-violet-600" />
                <span className="text-sm font-medium text-gray-900">전체 상담사</span>
                <span className="text-xs text-gray-500 ml-auto">{allConsultants.length}명</span>
              </button>
            )}

            {(activeTab === 'all' || activeTab === 'groups') && filteredGroups.length > 0 && (
              <div>
                {activeTab === 'all' && (
                  <div className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-500">
                    상담 그룹
                  </div>
                )}
                {filteredGroups.map(group => {
                  const isFullySelected = isGroupFullySelected(group);
                  const isPartiallySelected = isGroupPartiallySelected(group);
                  const memberCount = getConsultantsByGroupId(group.id).length;

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleSelectGroup(group)}
                      className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-violet-50 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isFullySelected
                          ? 'bg-violet-600 border-violet-600'
                          : isPartiallySelected
                          ? 'bg-violet-200 border-violet-400'
                          : 'border-gray-300'
                      }`}>
                        {(isFullySelected || isPartiallySelected) && (
                          <Check size={12} className={isFullySelected ? 'text-white' : 'text-violet-600'} />
                        )}
                      </div>
                      <Users size={16} className="text-gray-500" />
                      <div className="flex-1 text-left">
                        <span className="text-sm text-gray-900">{group.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{memberCount}명</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'consultants') && filteredConsultants.length > 0 && (
              <div>
                {activeTab === 'all' && (
                  <div className="px-3 py-1.5 bg-gray-50 text-xs font-medium text-gray-500">
                    개별 상담사
                  </div>
                )}
                {filteredConsultants.map(consultant => {
                  const isSelected = selectedIds.has(consultant.id);
                  const group = allGroups.find(g => g.id === consultant.groupId);

                  return (
                    <button
                      key={consultant.id}
                      onClick={() => handleSelectConsultant(consultant)}
                      className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-violet-50 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-violet-600 border-violet-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <User size={16} className="text-gray-400" />
                      <div className="flex-1 text-left">
                        <span className="text-sm text-gray-900">{consultant.name}</span>
                        {group && <span className="text-xs text-gray-400 ml-2">{group.name}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredConsultants.length === 0 && filteredGroups.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}

      {selectedAudience.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sortedAudience.map(status => (
            <span
              key={status.consultantId}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                status.isRead
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <User size={12} />
              {status.consultantName}
              {status.isRead && <Check size={10} className="text-green-600" />}
              <button
                onClick={() => handleRemoveAudience(status.consultantId)}
                className="ml-0.5 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TargetAudienceSelector;
