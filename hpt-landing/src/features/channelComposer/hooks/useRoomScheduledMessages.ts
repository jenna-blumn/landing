import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IMessageScheduleApi } from '../api/IMessageScheduleApi';
import type { ScheduledMessageRecord } from '../types';

function isActiveScheduledRecord(record: ScheduledMessageRecord): boolean {
  return record.schedule.status === 'scheduled' || record.schedule.status === 'sending' || record.schedule.status === 'failed';
}

export function useRoomScheduledMessages(roomId: number, scheduleApi: IMessageScheduleApi) {
  const [records, setRecords] = useState<ScheduledMessageRecord[]>([]);

  const load = useCallback(async () => {
    const nextRecords = await scheduleApi.getScheduledMessagesByRoom(roomId);
    setRecords(nextRecords);
  }, [roomId, scheduleApi]);

  useEffect(() => {
    void load();

    const unsubscribe = scheduleApi.onSchedulesUpdated(() => {
      void load();
    });

    return unsubscribe;
  }, [load, scheduleApi]);

  const activeRecords = useMemo(
    () => records.filter(isActiveScheduledRecord),
    [records]
  );

  return {
    records,
    activeRecords,
    activeCount: activeRecords.length,
    reload: load,
  };
}
