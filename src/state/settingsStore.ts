import { create } from 'zustand';

type SettingsState = {
  motionSafe: boolean;
  photosensitivitySafe: boolean;
  toggleMotionSafe: () => void;
  togglePhotosensitivitySafe: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  motionSafe: false,
  photosensitivitySafe: false,
  toggleMotionSafe: () => set((state) => ({ motionSafe: !state.motionSafe })),
  togglePhotosensitivitySafe: () =>
    set((state) => ({ photosensitivitySafe: !state.photosensitivitySafe }))
}));
