import { useCallback, useEffect, useRef } from "react";

import { getAiAgentStatus$ } from "@/api/aiAgent";
import { isDemoMode } from "@/lib/demoMode";
import { AI_MESSAGE_TYPE, AiAgentResponse } from "@/models/aiAgent";
import { useChatStore } from "@/stores/chatStore";

export default function useAiAgent() {
  const { aiRequests, setAIRequests } = useChatStore();
  const aiRequestsRef = useRef(aiRequests);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processAiAgentResponse = useCallback(
    (response: { result: boolean; message: string; data: AiAgentResponse }) => {
      const { data } = response;
      const pendingRequests: {
        request_id: string;
        message_type: AI_MESSAGE_TYPE;
      }[] = [];

      if (!data.aiSession.activation) {
        return { isAiSession: false, pendingRequests };
      }

      data.eventChunk.forEach((chunk) => {
        const { requestId, eventList } = chunk;

        const hasResponse = eventList.some(
          (event) => event.messageType === AI_MESSAGE_TYPE.RESPONSE
        );

        if (hasResponse) {
          setAIRequests(requestId, AI_MESSAGE_TYPE.RESPONSE);
        } else if (eventList.length > 0) {
          const lastEvent = eventList[eventList.length - 1];
          setAIRequests(requestId, lastEvent.messageType);

          pendingRequests.push({
            request_id: requestId,
            message_type: lastEvent.messageType,
          });
        }
      });

      return { pendingRequests };
    },
    []
  );

  const fetchAiAgentStatus = useCallback(
    async ({
      roomId,
      siteId,
      isRetry = false,
    }: {
      roomId: string;
      siteId: string;
      isRetry?: boolean;
    }) => {
      if (isDemoMode()) return;
      try {
        const response = await getAiAgentStatus$({ roomId, siteId });
        const result = processAiAgentResponse(response.data);

        // 재시도가 아니고, AI 세션이 활성화되어 있고, pending 이벤트가 있는 경우
        if (
          !isRetry &&
          result?.isAiSession &&
          result.pendingRequests.length > 0
        ) {
          // 기존 타이머 정리
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
          }

          // 3초 뒤에 상태 확인 후 재호출
          retryTimerRef.current = setTimeout(() => {
            const currentAiRequests = aiRequestsRef.current;

            // 모든 pending 이벤트의 상태가 변경되지 않았는지 확인
            const allUnchanged = result.pendingRequests.every(
              (pending) =>
                pending.request_id in currentAiRequests &&
                currentAiRequests[pending.request_id] === pending.message_type
            );

            // 모든 이벤트의 상태 변경이 없으면 한번만 재호출
            if (allUnchanged) {
              fetchAiAgentStatus({ roomId, siteId, isRetry: true });
            }
          }, 3000);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch AI agent status:", error);
      }
    },
    [processAiAgentResponse]
  );

  useEffect(() => {
    aiRequestsRef.current = aiRequests;
  }, [aiRequests]);

  return {
    fetchAiAgentStatus,
  };
}
