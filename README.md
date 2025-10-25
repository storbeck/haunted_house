# Haunted House Adventure MVP

This repository contains a self-contained playable prototype for a point-and-click haunted house escape adventure inspired by Myst and Resident Evil. It runs entirely in the browser using PixiJS for rendering and minimal Web Audio synthesis for ambience.

## Features

- **Eight interconnected scenes** with backtracking between the Foyer, Gallery, Library, Conservatory, Attic, Servants' Hall, Basement, and Garden Gate.
- **Six narrative puzzles** delivered through modal interactions, each unlocking items or flags required to progress toward the escape.
- **Diegetic inventory bar** that supports item selection, contextual messaging, and consumable keys.
- **Dynamic ambience**: synthetic drone layers per scene and triggered stinger cues routed through Web Audio, with subtitle callouts.
- **Accessibility tools** including reduce-motion toggle (disables parallax), high-contrast subtitle mode, persistent subtitles toggle, and quick progress reset.
- **Autosave** via `localStorage` capturing current scene, inventory, solved puzzles, and accessibility preferences.

## Getting Started

```bash
pnpm install
pnpm dev
```

The development server runs at `http://localhost:5173`. Because the project relies on Web Audio, the first pointer interaction unlocks the audio context.

If the default registry blocks installing `@types/howler`, configure `pnpm` with a standard npm registry token or switch to `npm install` as needed.

## Controls

- Move the pointer to explore; hotspots highlight on hover and show contextual hints in the status bar.
- Click to interact. If a hotspot requires an item, ensure it is in the inventory (consumed automatically when needed).
- Inventory items can be toggled active for reference; consumable items are removed on use.
- Accessibility toggles live in the upper-right panel.

## Building

```bash
pnpm build
```

The production build is emitted to `dist/`.
