import React, { useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, TimePicker } from '@blumnai-studio/blumnai-design-system';
import type { TimeValue } from '@blumnai-studio/blumnai-design-system';
import { buildScheduleIso, getScheduleInputError, isoToDate, isoToTimeValue } from '../utils/scheduleUtils';

interface SchedulePickerDialogProps {
  open: boolean;
  initialScheduledAt?: string;
  messageText: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledAt: string) => void;
}

const QUICK_TIME_OPTIONS: Array<{ label: string; value: TimeValue }> = [
  { label: '오전 9:00', value: { hour: 9, minute: 0 } },
  { label: '오후 1:00', value: { hour: 13, minute: 0 } },
  { label: '오후 6:00', value: { hour: 18, minute: 0 } },
];

const SchedulePickerDialog: React.FC<SchedulePickerDialogProps> = ({
  open,
  initialScheduledAt,
  messageText,
  onOpenChange,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<TimeValue | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    const initialDate = isoToDate(initialScheduledAt);
    const fallback = new Date();
    fallback.setMinutes(Math.ceil(fallback.getMinutes() / 5) * 5, 0, 0);

    setSelectedDate(initialDate ?? fallback);
    setSelectedTime(isoToTimeValue(initialScheduledAt) ?? {
      hour: fallback.getHours(),
      minute: fallback.getMinutes(),
    });
  }, [initialScheduledAt, open]);

  const scheduledAt = useMemo(() => {
    if (!selectedDate || !selectedTime) return undefined;
    return buildScheduleIso(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  const errorMessage = getScheduleInputError(messageText, scheduledAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width={360}>
        <DialogHeader>
          <DialogTitle>다음 시간에 이 메시지 보내기</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 p-4">
          <DatePicker
            label="예약 날짜"
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            showActions={false}
            size="sm"
          />
          <TimePicker
            label="예약 시간"
            value={selectedTime}
            onChange={setSelectedTime}
            timeFormat="12h"
            quickSelectOptions={QUICK_TIME_OPTIONS}
            showQuickSelect
            size="sm"
          />
          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {errorMessage}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button buttonStyle="secondary" size="sm" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            buttonStyle="primary"
            size="sm"
            disabled={Boolean(errorMessage) || !scheduledAt}
            onClick={() => {
              if (!scheduledAt) return;
              onConfirm(scheduledAt);
              onOpenChange(false);
            }}
          >
            계속
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulePickerDialog;
