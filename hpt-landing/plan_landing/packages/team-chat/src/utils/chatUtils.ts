export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function toIsoNow(): string {
  return new Date().toISOString();
}

export function coerceStringId(value: string | number): string {
  return String(value);
}

export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}
