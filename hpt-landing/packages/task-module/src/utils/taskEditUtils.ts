export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

/**
 * Extract date part from a date or datetime string.
 * "2025-01-15" -> "2025-01-15"
 * "2025-01-15T14:30" -> "2025-01-15"
 */
export const getDatePart = (dateStr: string): string => {
  return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
};

/**
 * Check if a date/datetime string contains time info.
 */
export const hasTime = (dateStr: string): boolean => {
  return dateStr.includes('T');
};

/**
 * Parse time from a datetime string. Returns null if no time.
 */
const parseTime = (dateStr: string): { hour: number; minute: number } | null => {
  if (!dateStr.includes('T')) return null;
  const timePart = dateStr.split('T')[1];
  const [h, m] = timePart.split(':').map(Number);
  return { hour: h, minute: m };
};

/**
 * Format time in Korean (오전/오후 N시 MM분)
 */
const formatKoreanTime = (hour: number, minute: number): string => {
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  if (minute === 0) {
    return `${period} ${displayHour}시`;
  }
  return `${period} ${displayHour}시 ${String(minute).padStart(2, '0')}분`;
};

/**
 * Format remaining time relative label.
 * Shows "N시간 M분 후" or "N시간 M분 전" style.
 */
const formatRelativeTime = (targetDate: Date): string => {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const suffix = diffMs >= 0 ? '후' : '전';

  const totalMinutes = Math.floor(absDiffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) {
    return '지금';
  }
  if (hours === 0) {
    return `${minutes}분 ${suffix}`;
  }
  if (minutes === 0) {
    return `${hours}시간 ${suffix}`;
  }
  return `${hours}시간 ${minutes}분 ${suffix}`;
};

/**
 * Build a Date object from a datetime string like "2025-01-15T14:30"
 */
const buildDateObj = (dateStr: string): Date => {
  const datePart = getDatePart(dateStr);
  const time = parseTime(dateStr);
  const [y, mo, d] = datePart.split('-').map(Number);
  if (time) {
    return new Date(y, mo - 1, d, time.hour, time.minute);
  }
  return new Date(y, mo - 1, d);
};

export const formatDateLabel = (date: string): string => {
  const datePart = getDatePart(date);
  const today = getTodayString();
  const tomorrowStr = getTomorrowString();
  const time = parseTime(date);

  const dateObj = new Date(datePart);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = weekDays[dateObj.getDay()];
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  // Today
  if (datePart === today) {
    if (time) {
      return formatRelativeTime(buildDateObj(date));
    }
    return '오늘';
  }

  // Tomorrow
  if (datePart === tomorrowStr) {
    if (time) {
      return `내일 ${formatKoreanTime(time.hour, time.minute)}`;
    }
    return '내일';
  }

  // Other dates: check if within 24 hours (for dates with time)
  if (time) {
    const targetDate = buildDateObj(date);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Within 24 hours in the future -> show relative time
    if (diffHours > 0 && diffHours <= 24) {
      return formatRelativeTime(targetDate);
    }

    // Yesterday with time (already passed, within -24h)
    const yesterdayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      .toISOString().split('T')[0];
    if (datePart === yesterdayStr) {
      return formatRelativeTime(targetDate);
    }

    // More than 1 day away: show date only
    return `${month}월 ${day}일(${dayOfWeek})`;
  }

  return `${month}월 ${day}일(${dayOfWeek})`;
};

export const formatDeadlineLabel = (date: string): string => {
  const datePart = getDatePart(date);
  const dateObj = new Date(datePart);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = weekDays[dateObj.getDay()];
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  return `기한: ${month}월 ${day}일(${dayOfWeek})`;
};

