import React from 'react';
import { Icon, Button } from '@blumnai-studio/blumnai-design-system';

import { FilterState } from './FilterModal';
import { DateFilterState } from './DateFilterModal';

interface ActiveFiltersDisplayProps {
  isCollapsed: boolean;
  activeFilters: FilterState;
  dateFilter?: DateFilterState;
  onRemoveFilter: (filterType: 'flag' | 'customerGrade', value?: string) => void;
  onRemoveDateFilter?: () => void;
  onOpenFilterModal?: () => void;
  onOpenDateFilterModal?: () => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  isCollapsed,
  activeFilters,
  dateFilter,
  onRemoveFilter,
  onRemoveDateFilter,
  onOpenFilterModal,
  onOpenDateFilterModal,
}) => {
  const hasActiveFilters =
    activeFilters.flags.length > 0 ||
    activeFilters.customerGrades.length > 0;

  const hasCustomDateFilter = dateFilter && dateFilter.preset === 'custom';

  if (!hasActiveFilters && !hasCustomDateFilter) {
    return null;
  }

  if (isCollapsed) {
    return null;
  }

  const getFlagLabel = (flag: string) => {
    const labelMap: { [key: string]: string } = {
      urgent: '긴급',
      important: '중요',
      normal: '일반',
      info: '정보',
      completed: '완료'
    };
    return labelMap[flag] || flag;
  };

  const getFlagColor = (flag: string) => {
    const colorMap: { [key: string]: string } = {
      urgent: 'bg-red-100 text-red-700 border-red-300',
      important: 'bg-orange-100 text-orange-700 border-orange-300',
      normal: 'bg-green-100 text-green-700 border-green-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300',
      completed: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return colorMap[flag] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getGradeLabel = (grade: string) => {
    const labelMap: { [key: string]: string } = {
      vip: 'VIP',
      problematic: '문제',
      longterm: '장기'
    };
    return labelMap[grade] || grade;
  };

  const getGradeColor = (grade: string) => {
    const colorMap: { [key: string]: string } = {
      vip: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      problematic: 'bg-red-100 text-red-700 border-red-300',
      longterm: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colorMap[grade] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatDateRange = (startStr: string, endStr: string) => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();

    if (startYear !== endYear) {
      return `${startYear}/${startMonth}/${startDay} ~ ${endYear}/${endMonth}/${endDay}`;
    }
    return `${startMonth}/${startDay} ~ ${endMonth}/${endDay}`;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg px-2 py-2">
      <div className="flex flex-wrap gap-1.5">
        {hasCustomDateFilter && dateFilter && (
          <div className="inline-flex items-center gap-1 px-2 py-1 border rounded-md text-xs bg-blue-100 text-blue-700 border-blue-300">
            <Icon iconType={['business', 'calendar']} size={12} />
            <span
              onClick={onOpenDateFilterModal}
              className="cursor-pointer hover:underline"
            >
              {dateFilter.start && dateFilter.end && formatDateRange(dateFilter.start, dateFilter.end)}
            </span>
            {onRemoveDateFilter && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDateFilter();
                }}
                variant="iconOnly"
                buttonStyle="ghost"
                size="2xs"
                leadIcon={<Icon iconType={['system', 'close']} size={12} />}
                className="hover:opacity-70 rounded"
              />
            )}
          </div>
        )}

        {activeFilters.flags.map((flag) => (
          <div
            key={flag}
            className={`inline-flex items-center gap-1 px-2 py-1 border rounded-md text-xs ${getFlagColor(flag)}`}
          >
            <span
              onClick={onOpenFilterModal}
              className="cursor-pointer hover:underline"
            >
              {getFlagLabel(flag)}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFilter('flag', flag);
              }}
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              leadIcon={<Icon iconType={['system', 'close']} size={12} />}
              className="hover:opacity-70 rounded"
            />
          </div>
        ))}

        {activeFilters.customerGrades.map((grade) => (
          <div
            key={grade}
            className={`inline-flex items-center gap-1 px-2 py-1 border rounded-md text-xs ${getGradeColor(grade)}`}
          >
            <span
              onClick={onOpenFilterModal}
              className="cursor-pointer hover:underline"
            >
              {getGradeLabel(grade)}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFilter('customerGrade', grade);
              }}
              variant="iconOnly"
              buttonStyle="ghost"
              size="2xs"
              leadIcon={<Icon iconType={['system', 'close']} size={12} />}
              className="hover:opacity-70 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFiltersDisplay;
