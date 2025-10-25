import { create } from 'zustand';

type SettingsState = {
  motionSafe: boolean;
  photosensitivitySafe: boolean;
  showHotspotHints: boolean;
  toggleMotionSafe: () => void;
  togglePhotosensitivitySafe: () => void;
  toggleHotspotHints: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  motionSafe: false,
  photosensitivitySafe: false,
  showHotspotHints: true,
  toggleMotionSafe: () => set((state) => ({ motionSafe: !state.motionSafe })),
  togglePhotosensitivitySafe: () =>
    set((state) => ({ photosensitivitySafe: !state.photosensitivitySafe })),
  toggleHotspotHints: () => set((state) => ({ showHotspotHints: !state.showHotspotHints }))
}));
