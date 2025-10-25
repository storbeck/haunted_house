# Haunted House Web Experience

This repository hosts a Myst-inspired, point-and-click haunted house prototype built with React, Vite, and TypeScript. The
experience adheres to the creative brief in `AGENTS.md`, focusing on full-viewport presentation, accessible interaction, and a
rich atmospheric tone without requiring a 3D renderer.

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

## Project Structure

```
src/
  app/            # Application shell, global styles
  components/     # Heads-up display and UI widgets
  scenes/         # Scene data definitions and 2D renderer
  state/          # Zustand stores that manage settings and scene flow
```

## Accessibility Notes

The HUD overlay exposes toggles for parallax motion safety, photosensitivity-safe palettes, and hotspot labels. Future iterations
will persist these settings and expand coverage across the wider experience.
