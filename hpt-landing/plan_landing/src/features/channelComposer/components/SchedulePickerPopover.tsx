import React, { useEffect, useMemo, useState } from 'react';
import { Button, Calendar, Divider, Popover, PopoverContent, PopoverTrigger, Select } from '@blumnai-studio/blumnai-design-system';
import { ko } from 'date-fns/locale/ko';
import { buildScheduleIso, formatScheduleBannerText, getScheduleInputError, isoToDate, isoToTimeValue } from '../utils/scheduleUtils';

interface SchedulePickerPopoverProps {
  open: boolean;
  initialScheduledAt?: string;
  messageText: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledAt: string) => void;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

interface TimeOption {
  id: string;
  label: string;
  hour: number;
  minute: number;
}

const timeLabelFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function createTimeOptions(): TimeOption[] {
  const options: TimeOption[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      options.push({
        id: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        label: timeLabelFormatter.format(date),
        hour,
        minute,
      });
    }
  }

  return options;
}

const TIME_OPTIONS = createTimeOptions();

function startOfDay(value: Date): number {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next.getTime();
}

const SchedulePickerPopover: React.FC<SchedulePickerPopoverProps> = ({
  open,
  initialScheduledAt,
  messageText,
  onOpenChange,
  onConfirm,
  trigger,
  align = 'end',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeId, setSelectedTimeId] = useState<string>('');

  useEffect(() => {
    if (!open) return;

    const initialDate = isoToDate(initialScheduledAt);
    const initialTime = isoToTimeValue(initialScheduledAt);
    const fallback = new Date();
    fallback.setMinutes(fallback.getMinutes() < 30 ? 30 : 0, 0, 0);
    if (fallback.getMinutes() === 0) {
      fallback.setHours(fallback.getHours() + 1);
    }

    const nextDate = initialDate ?? fallback;
    const nextHour = initialTime?.hour ?? fallback.getHours();
    const nextMinute = initialTime?.minute ?? (fallback.getMinutes() < 30 ? 0 : 30);

    setSelectedDate(nextDate);
    setSelectedTimeId(`${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`);
  }, [initialScheduledAt, open]);

  const selectableTimeOptions = useMemo(() => {
    if (!selectedDate) return TIME_OPTIONS;

    const isToday = startOfDay(selectedDate) === startOfDay(new Date());
    if (!isToday) return TIME_OPTIONS;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return TIME_OPTIONS.filter((option) => option.hour * 60 + option.minute > currentMinutes);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedTimeId) return;
    if (selectableTimeOptions.some((option) => option.id === selectedTimeId)) return;
    setSelectedTimeId(selectableTimeOptions[0]?.id ?? '');
  }, [selectableTimeOptions, selectedTimeId]);

  const selectedTimeOption = selectableTimeOptions.find((option) => option.id === selectedTimeId);

  const scheduledAt = useMemo(() => {
    if (!selectedDate || !selectedTimeOption) return undefined;
    return buildScheduleIso(selectedDate, {
      hour: selectedTimeOption.hour,
      minute: selectedTimeOption.minute,
    });
  }, [selectedDate, selectedTimeOption]);

  const errorMessage = getScheduleInputError(messageText, scheduledAt);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent side="top" align={align} sideOffset={8} width={280} className="!p-0">
        <div className="p-3">
          <div className="mb-2">
            <div className="text-sm font-medium text-gray-900">메시지 예약 발송</div>
            <div className="mt-1 text-xs text-gray-500">
              {scheduledAt ? formatScheduleBannerText(scheduledAt) : '날짜와 시간을 선택해 주세요.'}
            </div>
          </div>

          <Divider />

          <div className="py-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
              className="!p-0"
            />
          </div>

          <Divider />

          <div className="space-y-2 py-3">
            <div className="text-xs font-medium text-gray-600">예약 시간</div>
            <Select
              variant="default"
              options={selectableTimeOptions.map((option) => ({
                id: option.id,
                label: option.label,
              }))}
              value={selectedTimeId}
              onChange={setSelectedTimeId}
              placeholder="시간 선택"
              size="sm"
            />
          </div>

          {errorMessage && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {errorMessage}
            </div>
          )}

          <Button
            buttonStyle="primary"
            size="sm"
            fullWidth
            disabled={Boolean(errorMessage) || !scheduledAt}
            onClick={() => {
              if (!scheduledAt) return;
              onConfirm(scheduledAt);
              onOpenChange(false);
            }}
          >
            확인
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SchedulePickerPopover;
