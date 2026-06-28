const KEYS = {
  PILLARS: 'grindos_pillars',
  ROUTINES: 'grindos_routines',
  LOGS: 'grindos_logs',
  PROFILE: 'grindos_profile',
  WEEK_SUMMARIES: 'grindos_week_summaries',
  INITIALIZED: 'grindos_initialized',
};

export function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  Object.entries(KEYS).forEach(([, value]) => {
    const raw = localStorage.getItem(value);
    if (raw !== null) {
      try {
        data[value] = JSON.parse(raw);
      } catch {
        data[value] = raw;
      }
    }
  });
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): void {
  try {
    const data = JSON.parse(json) as Record<string, unknown>;
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  } catch {
    throw new Error('Invalid data format. Import failed.');
  }
}

export function resetAllData(): void {
  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export { KEYS };
