import { create } from 'zustand';

export type GameState = {
  currentSceneId: string;
  activeHotspotId: string | null;
  visitedSceneIds: string[];
  setScene: (sceneId: string) => void;
  inspectHotspot: (hotspotId: string | null) => void;
};

export const useGameStore = create<GameState>((set) => ({
  currentSceneId: 'foyer',
  activeHotspotId: null,
  visitedSceneIds: ['foyer'],
  setScene: (sceneId) =>
    set((state) => {
      const alreadyVisited = state.visitedSceneIds.includes(sceneId);
      return {
        currentSceneId: sceneId,
        activeHotspotId: null,
        visitedSceneIds: alreadyVisited
          ? state.visitedSceneIds
          : [...state.visitedSceneIds, sceneId]
      };
    }),
  inspectHotspot: (hotspotId) => set({ activeHotspotId: hotspotId })
}));
