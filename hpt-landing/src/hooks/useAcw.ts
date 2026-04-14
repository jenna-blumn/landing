import { useState, useRef, useCallback, useEffect } from 'react';

const DEFAULT_ACW_DURATION = 30; // seconds

export interface UseAcwReturn {
  isAcwActive: boolean;
  remainingSeconds: number;
  isPaused: boolean;
  durationSeconds: number;
  startAcw: () => void;
  stopAcw: () => void;
  pauseAcw: () => void;
  resumeAcw: () => void;
  setDuration: (seconds: number) => void;
}

export function useAcw(initialDuration = DEFAULT_ACW_DURATION): UseAcwReturn {
  const [isAcwActive, setIsAcwActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(initialDuration);

  const endTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((durationMs: number) => {
    clearTimer();
    endTimeRef.current = Date.now() + durationMs;

    intervalRef.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearTimer();
        setIsAcwActive(false);
        setIsPaused(false);
      }
    }, 200);
  }, [clearTimer]);

  const startAcw = useCallback(() => {
    setIsAcwActive(true);
    setIsPaused(false);
    setRemainingSeconds(durationSeconds);
    startTimer(durationSeconds * 1000);
  }, [durationSeconds, startTimer]);

  const stopAcw = useCallback(() => {
    clearTimer();
    setIsAcwActive(false);
    setIsPaused(false);
    setRemainingSeconds(0);
  }, [clearTimer]);

  const pauseAcw = useCallback(() => {
    if (!isAcwActive || isPaused) return;
    clearTimer();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    pausedRemainingRef.current = remaining;
    setRemainingSeconds(remaining);
    setIsPaused(true);
  }, [isAcwActive, isPaused, clearTimer]);

  const resumeAcw = useCallback(() => {
    if (!isAcwActive || !isPaused) return;
    setIsPaused(false);
    startTimer(pausedRemainingRef.current * 1000);
  }, [isAcwActive, isPaused, startTimer]);

  const setDuration = useCallback((seconds: number) => {
    setDurationSeconds(seconds);
    if (isAcwActive && isPaused) {
      pausedRemainingRef.current = seconds;
      setRemainingSeconds(seconds);
    }
  }, [isAcwActive, isPaused]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    isAcwActive,
    remainingSeconds,
    isPaused,
    durationSeconds,
    startAcw,
    stopAcw,
    pauseAcw,
    resumeAcw,
    setDuration,
  };
}
