const STORAGE_KEY = 'channelComposer_roomLink_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function loadRoomLinkEnabled(): boolean {
  if (!isBrowser()) return false;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved) === true;
    }
  } catch (error) {
    console.error('Failed to load room link setting:', error);
  }

  return false;
}

export function saveRoomLinkEnabled(enabled: boolean): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error('Failed to save room link setting:', error);
  }
}
