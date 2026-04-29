import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Room } from '../../../data/mockData';
import type { IMessageScheduleApi } from '../api/IMessageScheduleApi';
import { sendMessageNow } from '../api/composerApi';
import { upsertComposerMessageInRooms } from '../utils/roomMessageUtils';

interface UseScheduledMessageRuntimeProps {
  scheduleApi: IMessageScheduleApi;
  setAllRooms: Dispatch<SetStateAction<Room[]>>;
}

const POLLING_INTERVAL_MS = 5000;

export function useScheduledMessageRuntime({
  scheduleApi,
  setAllRooms,
}: UseScheduledMessageRuntimeProps): void {
  useEffect(() => {
    // TODO(server): 운영에서는 브라우저 polling으로 실제 발송을 수행하지 않는다. 서버 스케줄러가 발송하고 클라이언트는 상태만 동기화한다.
    let disposed = false;

    const processDueSchedules = async () => {
      const dueRecords = await scheduleApi.getDueScheduledMessages();

      for (const record of dueRecords) {
        if (disposed) return;

        const sendingRecord = await scheduleApi.updateScheduledMessageStatus(record.id, {
          status: 'sending',
        });

        if (!sendingRecord) continue;

        try {
          const sentMessage = await sendMessageNow(sendingRecord.roomId, sendingRecord.channel, sendingRecord.text, {
            messageId: sendingRecord.id,
            subject: sendingRecord.subject,
            templateId: sendingRecord.templateId,
            templateVariables: sendingRecord.templateVariables,
            byteLength: sendingRecord.byteLength,
          });

          const completedRecord = await scheduleApi.updateScheduledMessageStatus(sendingRecord.id, {
            status: 'sent',
            sentAt: new Date().toISOString(),
          });

          if (!completedRecord) continue;

          setAllRooms((previousRooms) =>
            upsertComposerMessageInRooms(previousRooms, completedRecord.roomId, {
              ...sentMessage,
              deliveryMode: 'scheduled',
              schedule: completedRecord.schedule,
            })
          );
        } catch (error) {
          await scheduleApi.updateScheduledMessageStatus(sendingRecord.id, {
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : '예약 발송에 실패했습니다.',
          });
        }
      }
    };

    void processDueSchedules();

    const intervalId = window.setInterval(() => {
      void processDueSchedules();
    }, POLLING_INTERVAL_MS);

    const focusHandler = () => {
      void processDueSchedules();
    };

    window.addEventListener('focus', focusHandler);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', focusHandler);
    };
  }, [scheduleApi, setAllRooms]);
}
