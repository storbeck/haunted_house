import type { SceneDefinition, SceneId } from '../types';

export const scenes: SceneDefinition[] = [
  {
    id: 'foyer',
    title: 'Foyer',
    description:
      'A grand foyer washed in moonlight. Dust dances as a cold draft creeps from unseen cracks.',
    ambiance: 'Low organ drones with distant thunder.',
    layers: [
      { color: 0x0b0f1d, alpha: 1, depth: 0 },
      { color: 0x16202f, alpha: 0.9, depth: 20 },
      { color: 0x2b3547, alpha: 0.5, depth: 40, vignette: true }
    ],
    exits: ['gallery', 'servantsHall'],
    hotspots: [
      {
        id: 'portrait_shift',
        name: 'Tilting Portrait',
        rect: { x: 180, y: 160, width: 200, height: 160 },
        cursor: 'puzzle',
        hint: 'A portrait hanging askew reveals scratch marks on the wall.',
        action: { type: 'startPuzzle', puzzleId: 'portrait_shift' }
      },
      {
        id: 'gallery_door',
        name: 'Gallery Door',
        rect: { x: 620, y: 220, width: 180, height: 220 },
        cursor: 'move',
        hint: 'An ornate handle awaits a fitting key.',
        requires: ['item:brass_key'],
        consumeItem: true,
        action: {
          type: 'move',
          target: 'gallery',
          text: 'The brass key grinds, unlocking the way into the gallery.'
        }
      },
      {
        id: 'servants_hall_door',
        name: 'Servants\' Hall Passage',
        rect: { x: 20, y: 240, width: 160, height: 200 },
        cursor: 'move',
        hint: 'A narrow passage smells of coal and soap.',
        action: {
          type: 'move',
          target: 'servantsHall',
          text: 'You slip into the servants\' passage, walls close and damp.'
        }
      }
    ]
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description:
      'Moonlit paintings whisper. A phonograph clicks next to a locked display case.',
    ambiance: 'Soft vinyl crackle and distant whispers.',
    layers: [
      { color: 0x11131f, alpha: 1, depth: 0 },
      { color: 0x1d2032, alpha: 0.8, depth: 15 },
      { color: 0x302d3f, alpha: 0.5, depth: 35 }
    ],
    exits: ['foyer', 'library', 'attic'],
    hotspots: [
      {
        id: 'music_box',
        name: 'Mechanical Music Box',
        rect: { x: 360, y: 260, width: 160, height: 140 },
        cursor: 'puzzle',
        hint: 'Three sigil dials are misaligned.',
        action: { type: 'startPuzzle', puzzleId: 'music_box' }
      },
      {
        id: 'library_portal',
        name: 'Library Door',
        rect: { x: 620, y: 220, width: 180, height: 210 },
        cursor: 'move',
        hint: 'Shelves of books lie beyond.',
        requires: ['flag:display_case_open'],
        action: {
          type: 'move',
          target: 'library',
          text: 'Hidden gears whirl as the display case slides aside.'
        }
      },
      {
        id: 'attic_stairs',
        name: 'Attic Stairwell',
        rect: { x: 80, y: 60, width: 120, height: 200 },
        cursor: 'move',
        hint: 'A narrow stair climbs into darkness.',
        requires: ['item:silver_gear'],
        consumeItem: true,
        action: {
          type: 'move',
          target: 'attic',
          text: 'The stairs unlock with a grinding click as the gear slots in.'
        }
      }
    ]
  },
  {
    id: 'library',
    title: 'Library',
    description:
      'Towering shelves circle a brass astrolabe. Books smell of dust and ozone.',
    ambiance: 'Rustling pages and faint chimes.',
    layers: [
      { color: 0x151923, alpha: 1, depth: 0 },
      { color: 0x1f2734, alpha: 0.85, depth: 18 },
      { color: 0x2f3a49, alpha: 0.45, depth: 34 }
    ],
    exits: ['gallery', 'conservatory', 'basement'],
    hotspots: [
      {
        id: 'bookcase_secret',
        name: 'Astrolabe Bookcase',
        rect: { x: 520, y: 180, width: 210, height: 220 },
        cursor: 'puzzle',
        hint: 'Constellation dials spin loosely.',
        action: { type: 'startPuzzle', puzzleId: 'bookcase_glide' }
      },
      {
        id: 'study_desk',
        name: 'Scholar\'s Desk',
        rect: { x: 120, y: 280, width: 180, height: 140 },
        cursor: 'inspect',
        hint: 'Loose papers mention a conservatory lock.',
        action: {
          type: 'showText',
          text: 'You sketch the gardener\'s sigils, noting an ivy pattern: North-East-South-West.'
        }
      },
      {
        id: 'conservatory_door',
        name: 'Conservatory Arch',
        rect: { x: 620, y: 220, width: 180, height: 210 },
        cursor: 'move',
        hint: 'Glassed corridors glimmer beyond.',
        requires: ['item:cipher_tablet'],
        consumeItem: false,
        action: {
          type: 'move',
          target: 'conservatory',
          text: 'Glyphs glow as the cipher tablet illuminates the locking sigils.'
        }
      },
      {
        id: 'hidden_hatch',
        name: 'Floor Hatch',
        rect: { x: 320, y: 420, width: 160, height: 100 },
        cursor: 'move',
        hint: 'Scratches arc around a heavy floor hatch.',
        requires: ['flag:basement_hatch_unsealed'],
        action: {
          type: 'move',
          target: 'basement',
          text: 'The hatch groans open, stairs spiraling into chill air.'
        }
      }
    ]
  },
  {
    id: 'conservatory',
    title: 'Conservatory',
    description:
      'Broken glass and overgrown ivy. Moonbeams cut through misty air.',
    ambiance: 'Rain against glass with distant nightbirds.',
    layers: [
      { color: 0x0f1a1d, alpha: 1, depth: 0 },
      { color: 0x1a2d2a, alpha: 0.85, depth: 20 },
      { color: 0x27413a, alpha: 0.4, depth: 42, vignette: true }
    ],
    exits: ['library', 'gardenGate'],
    hotspots: [
      {
        id: 'planter_stars',
        name: 'Star Dial Planter',
        rect: { x: 240, y: 240, width: 200, height: 180 },
        cursor: 'puzzle',
        hint: 'Celestial tiles align around a withered bloom.',
        action: { type: 'startPuzzle', puzzleId: 'planter_stars' }
      },
      {
        id: 'garden_gate',
        name: 'Garden Gate',
        rect: { x: 640, y: 240, width: 200, height: 200 },
        cursor: 'move',
        hint: 'Iron bars coil with thorned vines.',
        requires: ['flag:garden_seal_weakened'],
        action: {
          type: 'move',
          target: 'gardenGate',
          text: 'The vines recoil as lunar light seeps through the sigil cutouts.'
        }
      }
    ]
  },
  {
    id: 'attic',
    title: 'Attic',
    description:
      'Cobweb rafters cradle a ritual lantern and scattered relics.',
    ambiance: 'Wind rattles shingles above a dull heart-beat drum.',
    layers: [
      { color: 0x1b1523, alpha: 1, depth: 0 },
      { color: 0x2d1f34, alpha: 0.75, depth: 22 },
      { color: 0x3c2a40, alpha: 0.45, depth: 40 }
    ],
    exits: ['gallery', 'basement'],
    hotspots: [
      {
        id: 'lantern_sequence',
        name: 'Ritual Lantern',
        rect: { x: 420, y: 220, width: 180, height: 200 },
        cursor: 'puzzle',
        hint: 'Four lenses glow with intermittent pulses.',
        action: { type: 'startPuzzle', puzzleId: 'lantern_sequence' }
      },
      {
        id: 'attic_trapdoor',
        name: 'Trapdoor Winch',
        rect: { x: 200, y: 420, width: 200, height: 120 },
        cursor: 'move',
        hint: 'A rope descends into darkness.',
        requires: ['flag:lantern_lit'],
        action: {
          type: 'move',
          target: 'basement',
          text: 'Lantern light cuts the dark as you descend the rope ladder.'
        }
      }
    ]
  },
  {
    id: 'servantsHall',
    title: "Servants' Hall",
    description:
      'Stone floors meet long tables. A dumbwaiter rattles occasionally.',
    ambiance: 'Distant clanks and hushed murmurs.',
    layers: [
      { color: 0x111820, alpha: 1, depth: 0 },
      { color: 0x1c262e, alpha: 0.8, depth: 18 },
      { color: 0x28333d, alpha: 0.5, depth: 36 }
    ],
    exits: ['foyer', 'basement'],
    hotspots: [
      {
        id: 'coal_scoop',
        name: 'Coal Furnace',
        rect: { x: 480, y: 300, width: 200, height: 160 },
        cursor: 'inspect',
        hint: 'Heatless embers hide something metallic.',
        action: {
          type: 'collectItem',
          item: 'iron_winch',
          text: 'You recover an iron winch hook, its teeth still sharp.'
        }
      },
      {
        id: 'basement_dumbwaiter',
        name: 'Dumbwaiter Shaft',
        rect: { x: 80, y: 200, width: 160, height: 220 },
        cursor: 'move',
        hint: 'The shaft descends into the depths.',
        requires: ['item:iron_winch'],
        consumeItem: true,
        action: {
          type: 'move',
          target: 'basement',
          text: 'Using the winch hook, you lower yourself carefully into the basement.'
        }
      }
    ]
  },
  {
    id: 'basement',
    title: 'Basement',
    description:
      'A ritual chamber carved from stone. An arcane door pulses with wan light.',
    ambiance: 'Deep drones and dripping water.',
    layers: [
      { color: 0x07090f, alpha: 1, depth: 0 },
      { color: 0x111722, alpha: 0.75, depth: 24 },
      { color: 0x1f2733, alpha: 0.4, depth: 44, vignette: true }
    ],
    exits: ['library', 'attic', 'servantsHall'],
    hotspots: [
      {
        id: 'sigil_door',
        name: 'Arcane Door',
        rect: { x: 520, y: 220, width: 220, height: 240 },
        cursor: 'puzzle',
        hint: 'Sigils rotate around a glowing lock.',
        requires: ['flag:garden_seal_weakened', 'flag:lantern_lit'],
        action: { type: 'startPuzzle', puzzleId: 'ritual_alignment' }
      },
      {
        id: 'hatch_lever',
        name: 'Pressure Lever',
        rect: { x: 200, y: 360, width: 160, height: 160 },
        cursor: 'use',
        hint: 'A rusted lever binds the library hatch.',
        action: {
          type: 'toggleFlag',
          flag: 'basement_hatch_unsealed',
          value: true,
          text: 'You throw the lever. Chains recoil somewhere above.'
        }
      }
    ]
  },
  {
    id: 'gardenGate',
    title: 'Garden Gate',
    description:
      'Night air rushes in. The outer gate shimmers with lunar wards.',
    ambiance: 'Crickets swell with a hopeful swell of strings.',
    layers: [
      { color: 0x040b10, alpha: 1, depth: 0 },
      { color: 0x0d1f28, alpha: 0.75, depth: 20 },
      { color: 0x123540, alpha: 0.45, depth: 36 }
    ],
    exits: ['conservatory', 'basement'],
    hotspots: [
      {
        id: 'escape_gate',
        name: 'Outer Gate',
        rect: { x: 360, y: 200, width: 260, height: 260 },
        cursor: 'puzzle',
        hint: 'The sigil lock demands lunar alignment.',
        requires: ['flag:ritual_circle_bound'],
        action: { type: 'startPuzzle', puzzleId: 'final_escape' }
      }
    ]
  }
];

export const sceneMap = new Map<SceneId, SceneDefinition>(
  scenes.map((scene) => [scene.id, scene])
);
