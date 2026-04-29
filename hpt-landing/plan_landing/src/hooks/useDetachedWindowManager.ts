import { useRef, useState, useEffect, useCallback } from 'react';

const CHANNEL_NAME = 'deskit-detach';
const POLL_INTERVAL = 3000;

export interface UseDetachedWindowManager {
  openDetached: (roomId: number) => void;
  focusDetached: (roomId: number) => void;
  isDetached: (roomId: number) => boolean;
  detachedRoomIds: Set<number>;
}

export function useDetachedWindowManager(): UseDetachedWindowManager {
  const windowMapRef = useRef<Map<number, Window>>(new Map());
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  // BroadcastChannel: 자식 윈도우 닫힘 감지
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (e) => {
      if (e.data?.type === 'detach-closed') {
        windowMapRef.current.delete(e.data.roomId);
        rerender();
      }
    };
    return () => channel.close();
  }, [rerender]);

  // 폴링: window.closed 정리 (브라우저 크래시 대비)
  useEffect(() => {
    const id = setInterval(() => {
      let changed = false;
      for (const [roomId, win] of windowMapRef.current) {
        if (win.closed) {
          windowMapRef.current.delete(roomId);
          changed = true;
        }
      }
      if (changed) rerender();
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [rerender]);

  const openDetached = useCallback((roomId: number) => {
    const existing = windowMapRef.current.get(roomId);
    if (existing && !existing.closed) {
      existing.focus();
      return;
    }

    const url = `${window.location.origin}${window.location.pathname}?roomId=${roomId}&detached=true`;
    const win = window.open(
      url,
      `_deskit_room_${roomId}`,
      'width=1000,height=750,menubar=no,toolbar=no'
    );
    if (win) {
      windowMapRef.current.set(roomId, win);
      rerender();
    }
  }, [rerender]);

  const focusDetached = useCallback((roomId: number) => {
    const win = windowMapRef.current.get(roomId);
    if (win && !win.closed) {
      win.focus();
    }
  }, []);

  const isDetached = useCallback((roomId: number) => {
    const win = windowMapRef.current.get(roomId);
    return !!win && !win.closed;
  }, []);

  const detachedRoomIds = new Set<number>();
  for (const [roomId, win] of windowMapRef.current) {
    if (!win.closed) detachedRoomIds.add(roomId);
  }

  return { openDetached, focusDetached, isDetached, detachedRoomIds };
}
