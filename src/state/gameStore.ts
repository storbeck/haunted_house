import { create } from 'zustand';

import type { ItemId } from '../scenes/sceneData';

export type GameState = {
  currentSceneId: string;
  activeHotspotId: string | null;
  visitedSceneIds: string[];
  resolvedHotspotIds: string[];
  inventory: ItemId[];
  lastAcquiredItemId: ItemId | null;
  setScene: (sceneId: string) => void;
  inspectHotspot: (hotspotId: string | null) => void;
  markHotspotResolved: (hotspotId: string) => void;
  grantItems: (itemIds: ItemId[]) => void;
  clearLastAcquiredItem: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  currentSceneId: 'foyer',
  activeHotspotId: null,
  visitedSceneIds: ['foyer'],
  resolvedHotspotIds: [],
  inventory: [],
  lastAcquiredItemId: null,
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
  inspectHotspot: (hotspotId) => set({ activeHotspotId: hotspotId }),
  markHotspotResolved: (hotspotId) =>
    set((state) =>
      state.resolvedHotspotIds.includes(hotspotId)
        ? {}
        : { resolvedHotspotIds: [...state.resolvedHotspotIds, hotspotId] }
    ),
  grantItems: (itemIds) =>
    set((state) => {
      const newItems = itemIds.filter((itemId) => !state.inventory.includes(itemId));
      if (newItems.length === 0) {
        return {};
      }

      return {
        inventory: [...state.inventory, ...newItems],
        lastAcquiredItemId: newItems[newItems.length - 1]
      };
    }),
  clearLastAcquiredItem: () => set({ lastAcquiredItemId: null })
}));
