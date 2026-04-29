import { useEffect } from 'react';

const CHANNEL_NAME = 'deskit-detach';

/**
 * 디테치 윈도우에서 사용: beforeunload 시 메인 윈도우에 닫힘 알림 전송
 */
export function useDetachedWindowCloseNotifier(roomId: number | null) {
  useEffect(() => {
    if (roomId == null) return;

    const channel = new BroadcastChannel(CHANNEL_NAME);

    const handleBeforeUnload = () => {
      channel.postMessage({ type: 'detach-closed', roomId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      channel.close();
    };
  }, [roomId]);
}
