# Haunted House Web Experience

This repository hosts a WebGL-first haunted house prototype built with React, Vite, and three.js. The project adheres to the
creative brief in `AGENTS.md`, aiming to deliver a full-viewport interactive experience that balances atmosphere, accessibility,
and performance.

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
  app/            # Application shell, styling
  components/     # Heads-up display and UI widgets
  scenes/         # three.js scene graphs
  state/          # Zustand stores and persistence
```

Additional directories are scaffolded for systems, assets, shaders, utils, and tests as development progresses.

## Accessibility Notes

The HUD overlay exposes toggles for motion-safe and photosensitivity-safe modes. Future iterations will persist these settings and
expand coverage across the wider experience.
