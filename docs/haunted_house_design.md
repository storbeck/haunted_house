# Haunted House Escape Adventure Design Document

## Overview
The project is a full-screen, no-scroll, point-and-click haunted house adventure inspired by *Myst* and *Resident Evil*. Players traverse painterly, fixed-camera scenes to uncover the manor's secrets, solve interconnected puzzles, and ultimately escape. The experience emphasizes atmospheric storytelling, deliberate exploration, and tactile interactions while maintaining modern accessibility standards and responsive performance.

## Experience Pillars
1. **Immersive Atmosphere** – Static 2D compositions with parallax layers, cinematic lighting, and layered ambience capture the sensation of exploring a haunted estate at night. Fog, flickering candles, and subtle camera vibrations heighten tension without inducing motion sickness.
2. **Intentional Exploration** – Point-to-move navigation, contextual hotspots, and discoverable lore entries encourage slow, thoughtful progression. Each room invites inspection with visual cues, audio hints, and in-world UI prompts.
3. **Myst-like Puzzle Logic** – Symbol decoders, mechanical contraptions, light-routing mirrors, and narrative riddles require observation, note taking, and item experimentation. Solutions rely on environmental storytelling rather than guesswork.
4. **Diegetic Interaction** – Inventory and menus manifest as objects within the world (e.g., an antique satchel overlay). Cursor states, haptic-like audio cues, and animation feedback reinforce immersion.
5. **Performance & Comfort** – Scenes load in under two seconds, maintain a 60 FPS target, and include toggles for motion effects, color contrast, and subtitle customization to support diverse players.

## Technology Stack
- **Runtime:** Vite + TypeScript SPA.
- **Rendering Engine:** Pixi.js (WebGL 2 preferred with Canvas fallback).
- **Animation:** GSAP timelines for parallax easing, cursor hints, and puzzle feedback.
- **Audio:** Howler.js for layered ambience, random stingers, and positional SFX mixing.
- **UI Layer:** Pixi containers for in-world inventory combined with lightweight HTML overlays for accessibility settings and subtitles.
- **State Management:** Zustand or custom TypeScript store for scene state, inventory, and puzzle flags with serialization hooks.
- **Persistence:** LocalStorage-backed autosave with manual save slots.
- **Tooling:** ESLint + Prettier, Vitest for unit tests, Playwright for interaction regression, pnpm as the package manager.

## High-Level Architecture
### Scene System
- `SceneManager` orchestrates room transitions using fade/timed dissolves and handles preloading textures, audio stems, and interaction data per room.
- Each room (Foyer, Gallery, Library, Conservatory, Attic, Servants' Hall, Basement, Garden Gate) is defined as a `Scene` class with parallax layer descriptors, hotspot JSON, and ambient audio configuration.
- Scene definitions include outgoing connections, lock conditions, and transition effects loaded from structured YAML/JSON resources.

### Interaction & Navigation
- `InputSystem` normalizes mouse/touch events, raycasts against hotspot hit areas, and updates cursor states (`explore`, `interact`, `locked`, `combine`).
- `InteractionManager` resolves verbs based on hotspot metadata, dispatches results (dialogue, item pickup, puzzle UI), and records history for hint delivery.
- `NavigationController` animates character movement proxies or focus shifts, ensuring point-to-move within each static scene.

### Inventory & Puzzle Logic
- `InventorySystem` tracks collectible items, supports inspect/combine actions, and exposes diegetic UI toggled via hotspot or keyboard shortcut.
- Puzzle modules encapsulate logic for sliders, symbol dials, light routing, and pattern memory. Each module publishes state changes to the global store and triggers audio/visual feedback.
- Hint progression ties into observation flags (e.g., reading a journal unlocks new clue overlays) and throttled tooltips.

### Audio & Presentation
- `AudioMixer` layers ambient bed, random stingers, and proximity cues with volume ducking during narrative beats.
- Screen-space shaders add vignette, film grain, and adjustable fog. Motion toggle disables camera sway and reduces parallax intensity.
- Subtitle manager synchronizes dialogue snippets and triggered narration with accessible typography and contrast options.

### Persistence & Accessibility
- `SaveSystem` serializes scene, inventory, puzzle progress, and accessibility preferences into encrypted JSON stored in LocalStorage.
- Autosave triggers on scene exit and puzzle completion; manual saves offered via a typewriter save desk hotspot.
- Accessibility matrix ensures adjustable text size, colorblind-friendly glyphs, subtitle background plates, remappable input, and motion reduction.

## AI Agent Roles & Responsibilities
1. **Creative Director** – Authors the visual style bible covering palette, texture treatment, lighting methodology, and UI mood boards to guide art asset creation.
2. **Scene Designer** – Crafts the room graph, flow of traversal, locked pathways, and spatial narrative hints ensuring meaningful backtracking.
3. **Puzzle Designer** – Designs six core puzzles with mechanics, required items, hint ladders, and rewards aligned with narrative beats.
4. **Scene Artist** – Produces layered background paintings, parallax separation plans, fog masks, and defines clickable zones for each room.
5. **Interaction Designer** – Specifies hotspot metadata (verbs, cursor states, feedback text), interaction responses, and user feedback loops.
6. **Audio Designer** – Maps ambient loops, random stingers, triggered SFX, and transition cues with mixing notes for dynamic layering.
7. **Narrative Designer** – Writes the 12-beat story outline, dialogue snippets, letters, and environmental storytelling elements that thread through puzzles.
8. **Gameplay Engineer** – Implements scene transitions, interaction and inventory systems, puzzle logic, and save/load infrastructure per technical spec.
9. **QA & Accessibility Lead** – Builds test suites for cursor states, motion toggles, contrast compliance, caption sync, and overall user experience validation.

## Deliverables & Milestones
1. **Prototype:** Implement a single room (Foyer) with interactive hotspots, core navigation, and ambient loop.
2. **Core Loop:** Connect multiple scenes, enable inventory management, item usage, and save/load functionality.
3. **Puzzle Suite:** Add three representative puzzles, integrate narrative notes, and refine hint delivery.
4. **Full Game:** Populate all eight scenes, implement six puzzles, enable final escape sequence with branching ending hooks.
5. **Polish Pass:** Optimize performance, finalize accessibility options, conduct regression testing, and prepare release build.

## Success Metrics
- Stable 60 FPS with GPU utilization under 60% on target hardware.
- Scene transition times under two seconds with prefetching.
- 100% completion of accessibility checklist (motion toggle, subtitles, color contrast, input cues).
- Player completion rate above 70% in usability tests with average session length of 45–60 minutes.
