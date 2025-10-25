import type { SaveData, SceneId, AccessibilitySettings } from '../types';

const SAVE_KEY = 'haunted-house-mvp';
const SAVE_VERSION = 1;

const defaultAccessibility: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  subtitles: true
};

export function createDefaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    currentScene: 'foyer',
    inventory: [],
    solvedPuzzles: [],
    flags: {},
    accessibility: { ...defaultAccessibility }
  };
}

export function loadSave(): SaveData {
  if (typeof window === 'undefined') {
    return createDefaultSave();
  }
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return createDefaultSave();
    }
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (!parsed || parsed.version !== SAVE_VERSION) {
      return createDefaultSave();
    }
    return {
      ...createDefaultSave(),
      ...parsed,
      accessibility: { ...defaultAccessibility, ...parsed.accessibility }
    };
  } catch (error) {
    console.warn('Failed to load save data', error);
    return createDefaultSave();
  }
}

export function persistSave(data: SaveData) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to persist save data', error);
  }
}

export function resetSave() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(SAVE_KEY);
}
