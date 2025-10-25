export type SceneId =
  | 'foyer'
  | 'gallery'
  | 'library'
  | 'conservatory'
  | 'attic'
  | 'servantsHall'
  | 'basement'
  | 'gardenGate';

export type CursorType = 'inspect' | 'use' | 'move' | 'puzzle';

export interface HotspotActionShowText {
  type: 'showText';
  text: string;
}

export interface HotspotActionCollectItem {
  type: 'collectItem';
  item: string;
  text?: string;
}

export interface HotspotActionMove {
  type: 'move';
  target: SceneId;
  text?: string;
}

export interface HotspotActionStartPuzzle {
  type: 'startPuzzle';
  puzzleId: string;
}

export interface HotspotActionToggleFlag {
  type: 'toggleFlag';
  flag: string;
  value: boolean;
  text?: string;
}

export type HotspotAction =
  | HotspotActionShowText
  | HotspotActionCollectItem
  | HotspotActionMove
  | HotspotActionStartPuzzle
  | HotspotActionToggleFlag;

export interface HotspotDefinition {
  id: string;
  name: string;
  rect: { x: number; y: number; width: number; height: number };
  cursor: CursorType;
  hint: string;
  requires?: string[];
  consumeItem?: boolean;
  action: HotspotAction;
}

export interface LayerDefinition {
  color: number;
  alpha: number;
  depth: number;
  vignette?: boolean;
}

export interface SceneDefinition {
  id: SceneId;
  title: string;
  description: string;
  ambiance: string;
  layers: LayerDefinition[];
  hotspots: HotspotDefinition[];
  exits: SceneId[];
}

export interface PuzzleOption {
  id: string;
  label: string;
  hint?: string;
}

export interface PuzzleDefinition {
  id: string;
  name: string;
  description: string;
  mechanic: string;
  options: PuzzleOption[];
  solution: string;
  reward?: { item?: string; flag?: string; value?: boolean; text?: string };
  failureText?: string;
  successText?: string;
  requires?: string[];
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  subtitles: boolean;
}

export interface SaveData {
  version: number;
  currentScene: SceneId;
  inventory: string[];
  solvedPuzzles: string[];
  flags: Record<string, boolean>;
  accessibility: AccessibilitySettings;
}
