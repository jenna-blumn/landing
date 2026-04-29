// Utility functions for time formatting

export const isAlarmActive = (alarmTimestamp: number | null): boolean => {
  if (alarmTimestamp == null) return false;
  return alarmTimestamp > Date.now();
};