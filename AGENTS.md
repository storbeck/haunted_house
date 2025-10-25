# AGENTS.md — Haunted House Web Experience

Design a **full‑screen, no‑scroll, fully interactive** haunted house running in a modern browser. This document defines goals, constraints, architecture, assets, and a set of AI agents (with prompts) to help you build, test, and ship the experience.

---

## Experience Pillars

* **Presence:** Always full viewport (no scroll); camera‑driven navigation that feels like walking.
* **Tension Curve:** Ambient unease → small stingers → mid scares → payoff → cool‑down. Never constant jump‑scares.
* **Interactivity:** Every room has 2–4 meaningful interactions (open, examine, solve, listen, light, move).
* **Readability in Darkness:** Cinematic darkness with guided composition (diegetic lights, silhouettes, specular cues).
* **Performance:** 60 FPS target desktop; 40+ on mid mobile. Progressive degradation.

## Hard Requirements

* **Canvas-first** app (WebGL) in a single page; **no page scroll**.
* **Input:** Mouse/trackpad & WASD (desktop), touch joystick & tap (mobile).
* **Audio:** Binaural ambience, spatial SFX, dynamic music layers.
* **Save state:** Local persistence (slot autosave + reset).
* **Accessibility:** Motion toggle, color contrast for UI, content warning, photosensitivity safe mode.

## Suggested Stack

* **Core:** React + Vite + TypeScript
* **3D:** three.js or @react-three/fiber + drei; post‑processing via postprocessing
* **Animation:** GSAP or three-spring; state via Zustand or Jotai
* **Audio:** WebAudio API + standardized HRTF IRs; Howler.js optional
* **FX:** GLSL shaders for fog/volumetrics, film grain, chromatic aberration (subtle)
* **Navigation:** First‑person or on‑rails spline path with hotspots
* **Content:** glTF 2.0 (draco + KTX2), 2K base textures, 1K mobiles

## Repository Layout

```
haunted-house/
  ├─ public/               # static, favicons, share images
  ├─ src/
  │   ├─ app/              # App shell, routing, boot
  │   ├─ systems/          # camera, controls, collisions, audio, fx
  │   ├─ scenes/           # room graphs & triggers
  │   ├─ components/       # UI HUD, prompts, tooltips, menus
  │   ├─ assets/           # manifest.json, loaders, preloads
  │   ├─ state/            # Zustand stores, save/load
  │   ├─ shaders/          # GLSL
  │   ├─ utils/            # helpers
  │   └─ test/             # e2e + perf + accessibility
  ├─ assets_src/           # raw (blend/psd/wav) not shipped
  ├─ scripts/              # build, compress, bake
  ├─ vite.config.ts
  ├─ package.json
  └─ README.md
```

## Run & Build

```bash
# dev
pnpm i
pnpm dev   # http://localhost:5173 (full‑screen canvas)

# production build
pnpm build
pnpm preview
```

---

# Agent Roster

> Use these with your LLM toolchain (Claude/ChatGPT/Flow/MCP). Each agent includes a **system brief**, **inputs/outputs**, **tools**, and a **Done** definition.

## 1) Creative Director (Mood & References)

**System brief:** Curate the tone: late‑Victorian manor + survival horror. Deliver a style bible.

* **Inputs:** Theme keywords, target devices
* **Outputs:** Moodboard URLs, color keys (#0E0F12, #1B1E24, #3C3F46; accent #B13A3A), lighting references, camera rules
* **Tools:** Web search, image boards
* **Done when:** 1‑page style bible + 10 image refs + 3 music refs ready.

### Prompt

```
You are the Creative Director for a web‑based haunted mansion (Resident‑Evil vibes). Produce a concise style bible:
1) Visual tone, color keys, material cues (wet stone, aged wood, tarnished brass)
2) Lighting: motivated sources (candles, moonlight), exposure ranges, contrast targets
3) Camera: focal lengths, movement rules, how to reveal scares without cheap shots
4) Ten image references (titles + links), three music/ambience refs
5) Accessibility notes (photosensitivity safe mode), UI/HUD minimalism
6) Performance guardrails for web
Output: Markdown, 500–700 words.
```

## 2) Level Designer (Room Graph)

**System brief:** Lay out a compact loop of 5–7 rooms with gating and backtracking.

* **Inputs:** Style bible
* **Outputs:** Graph (nodes/edges), room briefs, hotspot list, keys/locks
* **Done when:** Graph fits above‑the‑fold diagram + CSV of hotspots.

### Prompt

```
Design a 7‑room looped layout for a haunted manor optimized for web performance:
- Rooms: Foyer, Portrait Hall, Library, Conservatory, Servant Corridor, Basement Stairs, Boiler Room
- Provide: node list, edges, one‑line purpose, primary/secondary interactions, one gating mechanic, one optional scare per room.
- Export: 1) ASCII graph 2) A CSV of hotspots: room,id,type,interaction,condition,reward
```

## 3) 3D/FX Engineer (Scene & Shaders)

**System brief:** Implement scenes with three.js/R3F; subtle post‑FX.

* **Inputs:** Room briefs, asset list
* **Outputs:** Scene composition plans, shader snippets, post‑FX settings
* **Tools:** three.js, @react-three/fiber, glTF
* **Done when:** Each room has a composition diagram + shader specs.

### Prompt

```
Given the room briefs and performance budget (2M tris desktop / 800k mobile), output:
1) For each room: hero props, silhouette plan, light rigs (key/fill/kickers) with intensities
2) Post: film grain (very low), vignette, SSAO tuned for readability, fog equation
3) Shaders: candle flame (vertex wobble + additive sprite), volumetric light shafts (raymarch approx)
4) LOD + draw distance rules; occlusion hints; batch/instancing notes
```

## 4) Audio Designer (Ambience & SFX)

**System brief:** Author layered ambiences and spatial SFX.

* **Inputs:** Room list, interaction CSV
* **Outputs:** Audio map (per room stems), SFX cues
* **Tools:** WebAudio graph plan, file naming scheme
* **Done when:** Soundpack spec + mixing rules are defined.

### Prompt

```
Create a sound design plan:
- For each room: base ambience, intermittent stem (wind, pipe knocks), proximity stem
- SFX: UI (hover, confirm), interactions (door, drawer, book), scares (breath behind, whisper pan)
- Provide: loudness targets (‑18 LUFS ambiences, ‑14 SFX peaks), HRTF plan, mobile mixing constraints.
- Export: table with filename, length, loop pts, tags, room, gain, spatial params
```

## 5) Interaction Designer (Hotspots & Microcopy)

**System brief:** Make interactions discoverable and purposeful.

* **Inputs:** Hotspot CSV
* **Outputs:** Verb taxonomy (Examine/Open/Use/Listen/Light), prompts, tooltips
* **Done when:** All hotspots have verbs + feedback states.

### Prompt

```
Turn this hotspot CSV into a UX spec.
- Map each to a verb from: Examine, Open, Use, Listen, Light, Move
- Write microcopy (<=40 chars), success/fail states, cooldown or repeat rules
- Accessibility: focus rings, ARIA labels, controller affordances
- Export: JSON ready for import by the UI layer
```

## 6) Performance Engineer (Budgets & Telemetry)

**System brief:** Hold the line on performance.

* **Inputs:** Scenes, assets, target devices
* **Outputs:** Budgets, metrics, profiling checklist
* **Done when:** CI perf budget & automated checks exist.

### Prompt

```
Define performance budgets and a test plan for a WebGL haunted house.
- Budgets: tris/materials/draw calls, texture sizes, shader complexity
- Device tiers: high/medium/low with caps
- Telemetry: FID, TTI, FPS percentile targets, dropped frame budget
- CI: Lighthouse + WebGL frame probe thresholds; fail conditions
```

## 7) QA & Accessibility (Scare Safety)

**System brief:** Verify usability and safety.

* **Inputs:** Build preview
* **Outputs:** Test matrix, photosensitivity checklist, keyboard nav plan
* **Done when:** All P0s closed; motion‑safe mode verified.

### Prompt

```
Create a QA plan covering: input devices, viewport sizes, reduced motion, color contrast, photosensitive effects, audio ducking, save/load integrity. Provide a test matrix table with scenarios and pass criteria.
```

## 8) Narrative Designer (Events & Timing)

**System brief:** Pacing and event scripting.

* **Inputs:** Room graph
* **Outputs:** Event timeline, trigger conditions, failover beats
* **Done when:** A 12–15 minute loop is paced and replayable.

### Prompt

```
Write a beat sheet with 15 story events across 7 rooms. Include: trigger, minimum conditions, audio/visual cues, player agency notes, and a fallback scare if the player misses the main trigger.
```

## 9) Build Orchestrator (Pipelines)

**System brief:** Asset import and compression scripts.

* **Inputs:** Asset drops
* **Outputs:** KTX2, DRACO, audio encodes, sprite sheets
* **Done when:** `pnpm assets:prepare` yields optimized bundles.

### Prompt

```
Output a reproducible pipeline: glTF (DRACO), textures (Basis/KTX2 with UASTC for normals), audio (OGG+AAC), sprites (WebP). Provide CLI scripts, recommended thresholds, and verification commands.
```

---

# World & Interaction Spec

## Room Set (example)

1. **Foyer:** Moonlit doorway; coat rack; locked inner door.
2. **Portrait Hall:** Eyes track player; hidden latch behind a skewed frame.
3. **Library:** Sliding ladder; puzzle book with cipher; whisper source.
4. **Conservatory:** Fogged glass; lightning silhouette; music box.
5. **Servant Corridor:** Narrow pass; clattering dish cart; breaker box.
6. **Basement Stairs:** Cold air; chain drag below; candle mechanics.
7. **Boiler Room:** Steam valves; pressure puzzle; escape latch.

## Interaction Types

* **Examine:** tooltips + subtle highlight + whisper hint
* **Open/Close:** physics‑light doors/drawers; hinge constraints
* **Use:** keys, fuses, valves; inventory minimal, diegetic UI
* **Listen:** hold to isolate stem; reveals clue
* **Light:** limited matches or candle mechanic; soft checkpoint
* **Move:** on‑rails step or free WASD with colliders

---

# Technical Blueprints

## Camera & Controls

* **Desktop:** Pointer‑lock FPS or guided spline; WASD; E/Space interact; Esc menu
* **Mobile:** Virtual stick; tap interact; two‑finger pause; gyro look optional
* **Cinemachine‑like rules:** ease in/out, head bob (toggle), collision pushback

## Rendering & FX

* **PostFX:** subtle grain, vignette, light bloom (threshold high), SSAO low
* **Fog:** height fog + exponential; use for depth cues and culling
* **Lighting:** baked + a few dynamic candles; lightmaps for rooms

## Asset Budgets (desktop / mobile)

* Triangles: 2.0M / 0.8M
* Draw calls: ≤ 350 / 180
* Materials: ≤ 60 / 30
* Texture total: ≤ 256 MB / 96 MB (VRAM)

## Telemetry Targets

* FPS p95 ≥ 60 desktop, ≥ 40 mobile
* FID ≤ 100 ms; TTI ≤ 4 s on mid‑tier mobile

---

# Data Schemas

## Hotspot JSON

```json
{
  "room": "Library",
  "id": "book_034",
  "verb": "Examine",
  "prompt": "A dusty tome with a loose spine",
  "conditions": ["have_match_lit"],
  "onSuccess": {"event": "reveal_cipher"},
  "onFail": {"hint": "The letters shift in the dim light."}
}
```

## Event Script (YAML)

```yaml
id: hall_eyes_track
room: PortraitHall
trigger: enter_room
conditions: [lights_low]
actions:
  - fx: eyes_track_player duration: 6s strength: 0.6
  - sfx: whisper_pan gain: -10db
fallback:
  after: 12s
  actions:
    - fx: frame_skew_creak
    - sfx: creak_long
```

---

# Accessibility & Safety

* **Motion Safe Mode:** disable head‑bob, reduce camera acceleration, soften FX
* **Photosensitivity:** limit full‑screen flashes; frequency < 3 Hz; brightness delta < 0.5
* **Audio Safety:** master limiter; duck music on SFX spikes; subtitles option for key diegetic lines
* **Input:** Full keyboard remap; focus outlines; large touch targets ≥ 44 px

---

# CI & Budgets

* **Lighthouse:** PWA installable; perf ≥ 90 desktop, ≥ 70 mobile
* **Bundle size:** < 3.5 MB initial JS, lazy‑load rooms
* **WebGL frame probe:** fail build if p95 FPS under target in scripted flythrough

---

# Milestones

1. **M0 Prototype (Week 1):** One room; pointer‑lock camera; one hotspot; ambience
2. **M1 Vertical Slice (Week 2):** 3 rooms linked; inventory; pause menu; save/load
3. **M2 Content Fill (Week 3):** All 7 rooms; audio pass; puzzle; first‑run telemetry
4. **M3 Polish (Week 4):** Accessibility, perf pass, mobile input, content warnings

---

# Acceptance Checklist

* [ ] Full‑screen canvas, no scroll, responsive to aspect (16:9→21:9→9:16)
* [ ] 2–4 interactions per room; one optional scare per room
* [ ] Save/resume; motion‑safe; photosensitive‑safe
* [ ] p95 FPS within targets on reference devices
* [ ] All assets compressed (KTX2/DRACO) and lazy‑loaded by room

---

# Agent Handoffs (Who talks to whom?)

* Creative Director → Level + 3D/FX + Audio
* Level Designer → Interaction + Narrative
* Performance Engineer ↔ 3D/FX + Build Orchestrator
* QA/Accessibility ↔ Everyone near ship

---

# Stretch Ideas

* **Ray‑traced audio (simulated):** precomputed convolution tails
* **Photo mode:** long‑exposure ghost trails
* **Alt Route:** Pacifist exploration vs. thrill‑seeker path with extra stingers

---

# Quick Start Prompts (Copy/Paste)

### "Make me a three‑room vertical slice"

```
Goal: three linked rooms (Foyer → Library → Boiler) in R3F, full‑screen, no scroll.
Deliver: scene code skeletons, camera + controls, one hotspot per room, ambience map, perf budgets.
Constraints: desktop first; lazy‑load rooms; 2K textures; SSAO low.
```

### "Convert hotspot CSV to JSON"

```
Transform the hotspot CSV into the Hotspot JSON schema above and validate verbs & prompts.
```

### "Write an audio import script"

```
Generate a Node script that scans assets_src/audio, encodes OGG/AAC, normalizes loudness, writes a manifest for WebAudio routing.
```

