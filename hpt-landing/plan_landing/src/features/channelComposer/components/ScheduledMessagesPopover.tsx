import React, { useMemo } from 'react';
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import type { IMessageScheduleApi } from '../api/IMessageScheduleApi';
import type { ScheduledMessageRecord } from '../types';
import { formatScheduleMetaText } from '../utils/scheduleUtils';
import ChannelBadge from './ChannelBadge';

interface ScheduledMessagesPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  records: ScheduledMessageRecord[];
  scheduleApi: IMessageScheduleApi;
  onReschedule?: (record: ScheduledMessageRecord) => void;
}

function canEditRecord(record: ScheduledMessageRecord): boolean {
  return record.schedule.status === 'scheduled' || record.schedule.status === 'failed';
}

const ScheduledMessagesPopover: React.FC<ScheduledMessagesPopoverProps> = ({
  open,
  onOpenChange,
  records,
  scheduleApi,
  onReschedule,
}) => {

  const triggerLabel = useMemo(() => (records.length > 3 ? '3+' : String(records.length)), [records.length]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          buttonStyle="secondary"
          size="xs"
          className="relative"
          leadIcon={<Icon iconType={['business', 'calendar']} size={13} />}
        >
          예약 메시지
          <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {triggerLabel}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" sideOffset={8} width={360} className="!p-0">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="text-sm font-medium text-gray-900">예약 메시지</div>
          <div className="mt-1 text-xs text-gray-500">이 대화방에 설정된 예약 발송 메시지 목록입니다.</div>
        </div>

        <ScrollArea orientation="vertical" maxHeight="360px" className="max-h-[360px]">
          <div className="space-y-2 p-3">
            {records.map((record, index) => (
              <div
                key={record.id}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-gray-400">
                      {index + 1}
                    </span>
                    <ChannelBadge channel={record.channel} />
                    <span
                      className={`text-xs ${
                        record.schedule.status === 'failed'
                          ? 'text-red-500'
                          : record.schedule.status === 'sending'
                            ? 'text-amber-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {formatScheduleMetaText(record.schedule)}
                    </span>
                  </div>
                  {canEditRecord(record) && (
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        buttonStyle="ghost"
                        size="2xs"
                        onClick={() => {
                          onReschedule?.(record);
                          onOpenChange(false);
                        }}
                      >
                        재예약
                      </Button>
                      <Button
                        type="button"
                        buttonStyle="ghost"
                        size="2xs"
                        onClick={() => {
                          void scheduleApi.cancelScheduledMessage(record.id);
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  )}
                </div>
                <div className="px-3 py-2">
                  {record.subject && (
                    <div className="mb-1 truncate text-xs font-medium text-gray-700">{record.subject}</div>
                  )}
                  <div className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-gray-800">
                    {record.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ScheduledMessagesPopover;
