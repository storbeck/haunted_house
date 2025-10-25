import type {
  AccessibilitySettings,
  SceneId,
  SaveData
} from '../types';
import { createDefaultSave, loadSave, persistSave } from './save';

export type GameEvent =
  | { type: 'sceneChanged'; scene: SceneId }
  | { type: 'inventoryChanged'; inventory: string[] }
  | { type: 'itemSelected'; item: string | null }
  | { type: 'puzzleSolved'; puzzleId: string }
  | { type: 'flagChanged'; flag: string; value: boolean }
  | { type: 'toast'; message: string }
  | { type: 'save'; data: SaveData }
  | { type: 'accessibilityChanged'; settings: AccessibilitySettings };

export type Listener = (event: GameEvent) => void;

export class GameState {
  private data: SaveData;
  private selectedItem: string | null = null;
  private listeners = new Set<Listener>();

  constructor() {
    this.data = loadSave();
  }

  get scene(): SceneId {
    return this.data.currentScene;
  }

  get inventory(): string[] {
    return [...this.data.inventory];
  }

  get flags(): Record<string, boolean> {
    return { ...this.data.flags };
  }

  get solved(): string[] {
    return [...this.data.solvedPuzzles];
  }

  get accessibility(): AccessibilitySettings {
    return { ...this.data.accessibility };
  }

  get activeItem(): string | null {
    return this.selectedItem;
  }

  setScene(scene: SceneId) {
    this.data.currentScene = scene;
    this.emit({ type: 'sceneChanged', scene });
    this.persist();
  }

  addItem(item: string, message?: string) {
    if (!this.data.inventory.includes(item)) {
      this.data.inventory.push(item);
      this.emit({ type: 'inventoryChanged', inventory: this.inventory });
      if (message) {
        this.emit({ type: 'toast', message });
      }
      this.persist();
    } else if (message) {
      this.emit({ type: 'toast', message });
    }
  }

  removeItem(item: string) {
    const index = this.data.inventory.indexOf(item);
    if (index >= 0) {
      this.data.inventory.splice(index, 1);
      if (this.selectedItem === item) {
        this.selectedItem = null;
        this.emit({ type: 'itemSelected', item: null });
      }
      this.emit({ type: 'inventoryChanged', inventory: this.inventory });
      this.persist();
    }
  }

  toggleItemSelection(item: string) {
    this.selectedItem = this.selectedItem === item ? null : item;
    this.emit({ type: 'itemSelected', item: this.selectedItem });
  }

  setFlag(flag: string, value: boolean, message?: string) {
    this.data.flags[flag] = value;
    this.emit({ type: 'flagChanged', flag, value });
    if (message) {
      this.emit({ type: 'toast', message });
    }
    this.persist();
  }

  hasFlag(flag: string): boolean {
    return Boolean(this.data.flags[flag]);
  }

  markPuzzleSolved(puzzleId: string) {
    if (!this.data.solvedPuzzles.includes(puzzleId)) {
      this.data.solvedPuzzles.push(puzzleId);
      this.emit({ type: 'puzzleSolved', puzzleId });
      this.persist();
    }
  }

  setAccessibility(settings: Partial<AccessibilitySettings>) {
    this.data.accessibility = { ...this.data.accessibility, ...settings };
    this.emit({
      type: 'accessibilityChanged',
      settings: this.accessibility
    });
    this.persist();
  }

  reset() {
    this.data = createDefaultSave();
    this.selectedItem = null;
    this.emit({ type: 'sceneChanged', scene: this.data.currentScene });
    this.emit({ type: 'inventoryChanged', inventory: this.inventory });
    this.emit({ type: 'itemSelected', item: null });
    this.emit({ type: 'flagChanged', flag: '*', value: false });
    this.persist();
  }

  hasRequirement(requirement: string): boolean {
    if (requirement.startsWith('item:')) {
      const item = requirement.split(':')[1];
      return this.data.inventory.includes(item);
    }
    if (requirement.startsWith('flag:')) {
      const flag = requirement.split(':')[1];
      return Boolean(this.data.flags[flag]);
    }
    if (requirement === 'escaped') {
      return Boolean(this.data.flags['escaped']);
    }
    return false;
  }

  addListener(listener: Listener) {
    this.listeners.add(listener);
  }

  removeListener(listener: Listener) {
    this.listeners.delete(listener);
  }

  private emit(event: GameEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  private persist() {
    persistSave(this.data);
    this.emit({ type: 'save', data: { ...this.data } });
  }
}
