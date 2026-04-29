import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogScrollArea, AccordionGroup, Badge, Icon } from '@blumnai-studio/blumnai-design-system';
import { flagIconColorMap } from '../../features/contactTab/utils/flagDefinitions';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: {
    start: string | null;
    end: string | null;
  };
  flags: Array<'urgent' | 'important' | 'normal' | 'info' | 'completed'>;
  customerGrades: Array<'vip' | 'problematic' | 'longterm'>;
  sortBy: 'lastConsultation' | 'roomCreated' | 'channel' | 'flag';
  sortOrder: 'asc' | 'desc';
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);
  const [expandedSections, setExpandedSections] = React.useState({
    flags: true,
    customerGrade: false,
    sorting: false
  });

  // Sync localFilters with the filters prop when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const flagOptions = [
    { value: 'urgent' as const, label: '긴급', color: 'bg-red-500' },
    { value: 'important' as const, label: '중요', color: 'bg-orange-500' },
    { value: 'normal' as const, label: '일반', color: 'bg-green-500' },
    { value: 'info' as const, label: '정보', color: 'bg-blue-500' },
    { value: 'completed' as const, label: '완료', color: 'bg-purple-500' }
  ];

  const customerGradeOptions = [
    { value: 'vip' as const, label: 'VIP', color: 'bg-orange-500' },
    { value: 'problematic' as const, label: '악성고객', color: 'bg-red-500' },
    { value: 'longterm' as const, label: '장기고객', color: 'bg-blue-500' }
  ];

  const sortOptions = [
    { value: 'lastConsultation' as const, label: '최근 상담 시간' },
    { value: 'roomCreated' as const, label: '상담방 생성일' },
    { value: 'channel' as const, label: '상담 채널' },
    { value: 'flag' as const, label: '플래그' }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleFlag = (flag: typeof flagOptions[0]['value']) => {
    setLocalFilters(prev => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter(f => f !== flag)
        : [...prev.flags, flag]
    }));
  };

  const toggleCustomerGrade = (grade: typeof customerGradeOptions[0]['value']) => {
    setLocalFilters(prev => ({
      ...prev,
      customerGrades: prev.customerGrades.includes(grade)
        ? prev.customerGrades.filter(g => g !== grade)
        : [...prev.customerGrades, grade]
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      dateRange: { start: null, end: null },
      flags: [],
      customerGrades: [],
      sortBy: 'lastConsultation',
      sortOrder: 'desc'
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={500} className="flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>필터</DialogTitle>
        </DialogHeader>

        <DialogScrollArea maxHeight="60vh">
          <div className="p-4 space-y-3">
            <AccordionGroup
              allowMultipleOpen
              items={[
                {
                  id: 'flags',
                  header: (
                    <div className="flex items-center gap-2">
                      <Icon iconType={['business', 'flag']} isFill size={16} color="default" />
                      <span>플래그</span>
                      {localFilters.flags.length > 0 && (
                        <Badge label={String(localFilters.flags.length)} color="blue" size="sm" shape="pill" />
                      )}
                    </div>
                  ),
                  children: (
                    <div className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {flagOptions.map((flag) => (
                          <Button
                            key={flag.value}
                            buttonStyle={localFilters.flags.includes(flag.value) ? 'primary' : 'secondary'}
                            size="xs"
                            onClick={() => toggleFlag(flag.value)}
                          >
                            <Icon iconType={['business', 'flag']} isFill size={12} color={flagIconColorMap[flag.value] || 'default'} />
                            {flag.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ),
                  isOpen: expandedSections.flags,
                  onToggle: () => toggleSection('flags'),
                },
                {
                  id: 'customerGrade',
                  header: (
                    <div className="flex items-center gap-2 flex-1">
                      <span>고객 등급</span>
                      {localFilters.customerGrades.length > 0 && (
                        <Badge label={String(localFilters.customerGrades.length)} color="blue" size="sm" shape="pill" />
                      )}
                      <div className="ml-auto">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          variant="iconOnly"
                          buttonStyle="ghost"
                          size="2xs"
                          leadIcon={<Icon iconType={['system', 'settings']} size={14} color="default-subtle" />}
                          title="설정"
                        />
                      </div>
                    </div>
                  ),
                  children: (
                    <div className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {customerGradeOptions.map((grade) => (
                          <Button
                            key={grade.value}
                            buttonStyle={localFilters.customerGrades.includes(grade.value) ? 'primary' : 'secondary'}
                            size="xs"
                            onClick={() => toggleCustomerGrade(grade.value)}
                          >
                            {grade.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ),
                  isOpen: expandedSections.customerGrade,
                  onToggle: () => toggleSection('customerGrade'),
                },
                {
                  id: 'sorting',
                  header: '정렬 기준',
                  children: (
                    <div className="p-3 space-y-2">
                      {sortOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <Button
                            buttonStyle="ghost"
                            size="xs"
                            onClick={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value }))}
                            className={`flex-1 justify-start ${
                              localFilters.sortBy === option.value
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </Button>
                          {localFilters.sortBy === option.value && (
                            <div className="flex gap-1">
                              <Button
                                variant="iconOnly"
                                buttonStyle={localFilters.sortOrder === 'desc' ? 'primary' : 'secondary'}
                                size="2xs"
                                onClick={() => setLocalFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                                leadIcon={<Icon iconType={['arrows', 'arrow-down-s']} size={14} />}
                                title="내림차순"
                              />
                              <Button
                                variant="iconOnly"
                                buttonStyle={localFilters.sortOrder === 'asc' ? 'primary' : 'secondary'}
                                size="2xs"
                                onClick={() => setLocalFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                                leadIcon={<Icon iconType={['arrows', 'arrow-up-s']} size={14} />}
                                title="오름차순"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ),
                  isOpen: expandedSections.sorting,
                  onToggle: () => toggleSection('sorting'),
                },
              ]}
            />
          </div>
        </DialogScrollArea>

        <DialogFooter className="justify-between">
          <Button buttonStyle="ghost" size="sm" onClick={handleReset}>
            초기화
          </Button>
          <div className="flex gap-2">
            <Button buttonStyle="ghost" size="sm" onClick={onClose}>
              취소
            </Button>
            <Button buttonStyle="primary" size="sm" onClick={handleApply}>
              적용
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
