import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Divider, DatePicker, Icon } from '@blumnai-studio/blumnai-design-system';

export type DatePresetType = 'today' | 'yesterday' | 'last7days' | '1month' | '3months' | 'thisMonth' | 'custom';

export interface DateFilterState {
  preset: DatePresetType;
  start: string | null;
  end: string | null;
}

interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateFilter: DateFilterState;
  onApply: (dateFilter: DateFilterState) => void;
}

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateString = (dateStr: string | null): Date | undefined => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? undefined : date;
};

const DateFilterModal: React.FC<DateFilterModalProps> = ({
  isOpen,
  onClose,
  dateFilter,
  onApply
}) => {
  const [localDateFilter, setLocalDateFilter] = React.useState<DateFilterState>(dateFilter);

  React.useEffect(() => {
    if (isOpen) {
      setLocalDateFilter(dateFilter);
    }
  }, [isOpen, dateFilter]);

  const datePresets: { value: DatePresetType; label: string }[] = [
    { value: 'today', label: '오늘' },
    { value: 'yesterday', label: '어제' },
    { value: 'last7days', label: '최근 7일' },
    { value: '1month', label: '1개월' },
    { value: '3months', label: '3개월' },
    { value: 'thisMonth', label: '이번 달 누적' },
  ];

  const calculateDateRange = (preset: DatePresetType): { start: string; end: string } => {
    const today = new Date();
    const endDate = formatDateToString(today);

    switch (preset) {
      case 'today':
        return { start: endDate, end: endDate };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDateToString(yesterday);
        return { start: yesterdayStr, end: yesterdayStr };
      }
      case 'last7days': {
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        return { start: formatDateToString(startDate), end: endDate };
      }
      case '1month': {
        const startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
        return { start: formatDateToString(startDate), end: endDate };
      }
      case '3months': {
        const startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 3);
        return { start: formatDateToString(startDate), end: endDate };
      }
      case 'thisMonth': {
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: formatDateToString(startDate), end: endDate };
      }
      default:
        return { start: endDate, end: endDate };
    }
  };

  const handlePresetClick = (preset: DatePresetType) => {
    const { start, end } = calculateDateRange(preset);
    setLocalDateFilter({ preset, start, end });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setLocalDateFilter(prev => ({
      ...prev,
      preset: 'custom',
      start: date ? formatDateToString(date) : null
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setLocalDateFilter(prev => ({
      ...prev,
      preset: 'custom',
      end: date ? formatDateToString(date) : null
    }));
  };

  const handleApply = () => {
    onApply(localDateFilter);
    onClose();
  };

  const getPresetLabel = (preset: DatePresetType): string => {
    const found = datePresets.find(p => p.value === preset);
    return found?.label || '사용자 지정';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent width={400} className="flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon iconType={['business', 'calendar']} size={18} color="default-subtle" />
            기간 설정
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {datePresets.map((preset) => (
              <Button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                buttonStyle={localDateFilter.preset === preset.value ? 'primary' : 'secondary'}
                size="sm"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Divider />
          <div>
            <div className="text-sm text-gray-600 mb-2">직접 설정</div>
            <div className="grid grid-cols-2 gap-3">
              <DatePicker
                label="시작일"
                value={parseDateString(localDateFilter.start)}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                size="sm"
              />
              <DatePicker
                label="종료일"
                value={parseDateString(localDateFilter.end)}
                onChange={handleEndDateChange}
                dateFormat="yyyy-MM-dd"
                size="sm"
              />
            </div>
          </div>

          {localDateFilter.start && localDateFilter.end && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">선택된 기간:</span>{' '}
                {localDateFilter.preset !== 'custom' ? (
                  <span className="text-blue-600">{getPresetLabel(localDateFilter.preset)}</span>
                ) : (
                  <span className="text-blue-600">사용자 지정</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {localDateFilter.start} ~ {localDateFilter.end}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button buttonStyle="ghost" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button buttonStyle="primary" size="sm" onClick={handleApply}>
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const getDatePresetLabel = (preset: DatePresetType): string => {
  const labels: Record<DatePresetType, string> = {
    today: '오늘',
    yesterday: '어제',
    last7days: '최근 7일',
    '1month': '1개월',
    '3months': '3개월',
    thisMonth: '이번 달',
    custom: '사용자 지정'
  };
  return labels[preset];
};

export default DateFilterModal;
