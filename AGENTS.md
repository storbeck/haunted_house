Design a **full‑screen, no‑scroll, point‑and‑click** haunted house adventure inspired by *Myst* and *Resident Evil*. The goal is to explore, solve puzzles, and escape the house. This document defines experience pillars, stack, architecture, and AI agent roles.

---

## Experience Pillars

* **Immersion:** Fixed‑camera 2D scenes with parallax and cinematic sound.
* **Exploration:** Point to move, click to interact, drag items to combine.
* **Myst‑like puzzles:** Environmental logic, visual riddles, keys, levers, symbols.
* **Atmosphere:** Layered ambience, slow pacing, light and shadow composition.
* **Performance:** Smooth transitions, responsive input, 60 FPS target.

## Hard Requirements

* **Canvas or WebGL 2D** (Pixi.js or Phaser 3 preferred) in a single page.
* **Navigation:** Point & click to move; hotspots change cursor and show hints.
* **Audio:** Layered ambience + triggered SFX.
* **Inventory:** Diegetic (in‑world UI overlay).
* **Persistence:** Local save + autosave.
* **Accessibility:** Motion toggle, color contrast, subtitles.

## Suggested Stack

* **Core:** Vite + TypeScript
* **Engine:** Pixi.js (WebGL2 fallback) or Phaser 3 Scene System
* **Animation:** GSAP or built‑in tweens
* **Audio:** Howler.js or Tone.js
* **UI:** HTML overlay or Pixi container for inventory and menus

## Repository Layout

```
haunted‑escape/
  ├─ public/
  ├─ src/
  │   ├─ scenes/           # each room as scene class
  │   ├─ systems/          # input, navigation, inventory
  │   ├─ assets/           # textures, atlases, sounds
  │   ├─ ui/               # menus, overlays, prompts
  │   ├─ state/            # save/load, puzzle flags
  │   └─ shaders/          # optional filters (fog, lighting)
  ├─ scripts/
  ├─ vite.config.ts
  └─ package.json
```

## Run & Build

```bash
pnpm i
pnpm dev   # http://localhost:5173
```

---

# Agent Roster

## 1) Creative Director (Mood & Visual Bible)

**System brief:** Define the style: late‑Victorian, painterly, static‑camera.

* **Outputs:** palette, texture style (hand‑painted realism), lighting notes, typography, and UI mood.

**Prompt:**

```
You are the Creative Director for a 2D Myst‑like haunted house. Define:
- Art direction: mood, palette, texture brush style.
- UI tone: old paper, ghostly overlays.
- Lighting: painted light falloff; how to blend parallax layers.
Output a 500‑word style bible with 10 visual references.
```

## 2) Scene Designer (Room Flow)

**System brief:** Design 8‑10 interconnected scenes with backtracking.

* **Outputs:** Scene map (graph), puzzle dependencies, key items.

**Prompt:**

```
Create a graph of 8 rooms for a haunted house escape:
- Rooms: Foyer, Gallery, Library, Conservatory, Attic, Servants' Hall, Basement, Garden Gate.
- Include exits, locked paths, and puzzle dependencies.
Output: ASCII map + JSON of connections.
```

## 3) Puzzle Designer (Riddles & Logic)

**System brief:** Build 6 primary puzzles (symbol match, light reflection, pattern memory).

* **Outputs:** Puzzle flowchart, difficulty curve, hints.

**Prompt:**

```
List six puzzles suitable for point‑and‑click interaction. Each includes:
- Name
- Mechanic (slider, dial, clue search)
- Required item(s)
- Hint progression
- Reward/unlock
```

## 4) Scene Artist (Backgrounds & Layers)

**System brief:** Paint static 2D backgrounds with depth layers.

* **Outputs:** Parallax plan (foreground/mid/background), fog masks, props.

**Prompt:**

```
For each room, describe composition: focal point, color temperature, perspective depth. Suggest how to separate layers for parallax and clickable zones.
```

## 5) Interaction Designer (Hotspots & Feedback)

**System brief:** Define click targets, cursor changes, feedback loops.

* **Outputs:** JSON hotspots with verb, hint, and state changes.

**Prompt:**

```
Convert hotspot table into JSON entries with: id, scene, verb, cursorType, feedbackText, trigger, result.
```

## 6) Audio Designer (Ambience & Cues)

**System brief:** Create eerie looping ambiences and cue layers.

* **Outputs:** Room ambience table, SFX list, transitions.

**Prompt:**

```
Generate a sound map: ambient loop, random stingers, triggered SFX. Each line: filename, duration, loop, trigger, gain.
```

## 7) Narrative Designer (Escape Story)

**System brief:** Weave clues into environmental storytelling.

* **Outputs:** Beat sheet + ending variations.

**Prompt:**

```
Write a 12‑beat narrative outline:
- Premise: player wakes trapped in manor.
- Goal: escape by uncovering the owner's secret ritual.
Include dialogue snippets and notes for journals or letters.
```

## 8) Gameplay Engineer (Navigation & Puzzles)

**System brief:** Implement scene transitions and puzzle logic.

* **Outputs:** Click path logic, interaction manager, save system.

**Prompt:**

```
Build the framework for a 2D point‑and‑click adventure:
- SceneManager with fade transitions.
- Interaction system detecting cursor hover and click.
- Inventory system (collect/use/inspect).
- Save state serialization.
```

## 9) QA & Accessibility

**System brief:** Ensure usability and safety.

* **Outputs:** Accessibility matrix, photo‑safe validation.

**Prompt:**

```
Prepare tests for cursor states, dialogue readability, motion toggle, contrast, and caption sync.
```

---

# Interaction Schema

```json
{
  "scene": "Library",
  "id": "bookcase_secret",
  "verb": "Examine",
  "hint": "A draft seeps through the shelves...",
  "require": ["candle_lit"],
  "result": {"openScene": "SecretPassage"}
}
```

# Scene Transition YAML

```yaml
from: Gallery
to: Conservatory
condition: unlocked_green_key
effect:
  - fade: 1.2s
  - sound: door_creak_2
```

---

# Technical Overview

* **Canvas:** full‑screen, 16:9 to 21:9 adaptive.
* **Input:** Mouse/touch; change cursor on hover.
* **Lighting:** Screen‑space vignette + soft fog filter.
* **Audio:** 3 stems (base, random, proximity) mixed dynamically.
* **Performance:** Scene load < 2s; 60 FPS target desktop.

---

# Milestones

1. **Prototype:** One room, click hotspots, ambient loop.
2. **Core Loop:** Navigation + inventory + save.
3. **Puzzles:** Add 3 sample puzzles + story beats.
4. **Full Game:** All 8 scenes connected + win condition.
5. **Polish:** Accessibility, perf pass, title/menu.

---

# Acceptance Criteria

* [ ] Full‑screen 2D canvas, no scroll.
* [ ] 8 scenes linked with backtracking.
* [ ] 6 puzzles and a win condition.
* [ ] Local save/load.
* [ ] Accessible mode for motion/contrast.
* [ ] Load < 2s, 60 FPS.

---

# Stretch Ideas

* Alternate endings depending on discovered notes.
* Flashlight mode with mouse follow.
* AI‑generated letters or diary entries.
* Mobile gyroscope peek effect.
