# Haunted House Web Experience

This repository hosts a Myst-inspired, point-and-click haunted house prototype built with React, Vite, and TypeScript. The experience adheres to the creative brief in `AGENTS.md`, focusing on full-viewport presentation, accessible interaction, and a rich atmospheric tone without requiring a 3D renderer. The latest iteration adds a seven-room loop with gated progression, an inventory system, and richer prompt feedback to evoke a classic Myst slide-show adventure.

## Getting Started

```bash
pnpm install
pnpm dev
```

The development server runs at http://localhost:5173 with hot module reload enabled.

## Scripts

- `pnpm dev` – Start the Vite development server.
- `pnpm build` – Type-check and create a production build.
- `pnpm preview` – Preview the production build locally.

## Gameplay Overview

- **Rooms:** Foyer, Portrait Hall, Library, Conservatory, Servant Corridor, Boiler Room, and Basement Stairs.
- **Navigation:** Hotspot-driven travel between scenes with parallax depth (respecting the motion-safe toggle).
- **Gating:** Recovering items such as the brass winding key or amber lantern unlocks blocked routes (e.g., the library door and basement descent).
- **Inventory:** Newly discovered items surface in the HUD inventory panel and highlight briefly; tooltips recap their lore for puzzle hints.
- **Prompting:** Each investigation opens a diegetic prompt with optional scares, item reward callouts, and lock messaging when requirements are missing.

## Project Structure

```
src/
  app/            # Application shell, global styles
  components/     # Heads-up display and UI widgets
  scenes/         # Scene data definitions and 2D renderer
  state/          # Zustand stores that manage settings and scene flow
```

## Accessibility Notes

- HUD toggles support motion-safe parallax, a photosensitivity-safe palette, and optional hotspot labels.
- Keyboard users can tab between hotspots and activate them via **Enter** or **Space**; press **Esc** to dismiss prompts.
- Reduced motion preferences collapse animated transitions to keep the interface comfortable.
