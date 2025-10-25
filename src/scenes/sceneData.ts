import type { CSSProperties } from 'react';

export const ITEMS = {
  'winding-key': {
    id: 'winding-key',
    name: 'Brass Winding Key',
    description:
      'A weighty brass key etched with the Wraithmoor crest. It hums faintly when held near clockwork mechanisms.'
  },
  'cipher-disc': {
    id: 'cipher-disc',
    name: 'Cipher Disc',
    description:
      'Bone-white rings nest together with careful tolerances. Rotating the layers reveals a repeating pattern of moon phases.'
  },
  'amber-lantern': {
    id: 'amber-lantern',
    name: 'Amber Lantern',
    description:
      'A warded lantern whose glow refuses to sputter. The wick blooms warm amber light that repels the basement mist.'
  },
  'pressure-manual': {
    id: 'pressure-manual',
    name: 'Pressure Manual',
    description:
      'An oilskin-bound manual explaining how to bleed the manor’s steam network without triggering the safety shriek.'
  },
  'ashen-token': {
    id: 'ashen-token',
    name: 'Ashen Token',
    description:
      'A palm-sized token pressed from soot and bone meal. Its surface is embossed with the outline of a locked sigil.'
  },
  'basement-sigil': {
    id: 'basement-sigil',
    name: 'Sigil of Release',
    description:
      'A sigil engraved in quicksilver glass. It pulses with residual heat, promising the boiler will obey if properly invoked.'
  }
} as const;

export type ItemId = keyof typeof ITEMS;
export type ItemDefinition = (typeof ITEMS)[ItemId];

export type HotspotReward = {
  itemId: ItemId;
  note?: string;
};

export type HotspotAction = 'examine' | 'travel';

export type HotspotDefinition = {
  id: string;
  label: string;
  action: HotspotAction;
  description: string;
  optionalScare?: string;
  targetSceneId?: string;
  position: { x: number; y: number };
  requiresItems?: ItemId[];
  lockedDescription?: string;
  rewards?: HotspotReward[];
};

export type SceneDefinition = {
  id: string;
  name: string;
  tagline: string;
  ambient: string;
  background: {
    default: string;
    safe: string;
  };
  vignette: string;
  layers: Array<{
    id: string;
    style: CSSProperties;
  }>;
  hotspots: HotspotDefinition[];
};

export const SCENES: SceneDefinition[] = [
  {
    id: 'foyer',
    name: 'Foyer Vestibule',
    tagline: 'Candles struggle against the draught seeping beneath the manor door.',
    ambient:
      'A damp chill coils around the stairwell. Chains sway, sounding distant chimes within the hall.',
    background: {
      default: `radial-gradient(circle at 50% 12%, rgba(166, 120, 86, 0.38), transparent 58%),
        radial-gradient(circle at 10% 80%, rgba(90, 116, 133, 0.22), transparent 52%),
        linear-gradient(180deg, #12141a 0%, #161a23 46%, #090b10 100%)`,
      safe: `radial-gradient(circle at 52% 18%, rgba(178, 146, 118, 0.3), transparent 60%),
        radial-gradient(circle at 12% 82%, rgba(108, 128, 144, 0.2), transparent 58%),
        linear-gradient(180deg, #171a22 0%, #1a1f29 52%, #0d1016 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 55%, rgba(3, 4, 6, 0.65) 100%)',
    layers: [
      {
        id: 'grand-arch',
        style: {
          backgroundImage: `radial-gradient(circle at 50% 24%, rgba(201, 163, 129, 0.32), transparent 55%),
             linear-gradient(180deg, rgba(40, 38, 46, 0.75) 0%, rgba(18, 19, 24, 0.9) 60%, rgba(12, 13, 17, 0.95) 100%)`,
          mixBlendMode: 'screen',
          opacity: 0.65
        }
      },
      {
        id: 'floor',
        style: {
          backgroundImage: `linear-gradient(180deg, rgba(22, 15, 12, 0) 0%, rgba(35, 22, 18, 0.76) 55%, rgba(11, 8, 8, 0.95) 100%)`,
          opacity: 0.9
        }
      }
    ],
    hotspots: [
      {
        id: 'foyer-chandelier',
        label: 'Chandelier',
        action: 'examine',
        description:
          'Wax-dripped crystals sway in a rhythm far slower than the air currents. Within their facets a tall silhouette ripples, never quite aligning with your reflection.',
        optionalScare: 'A whisper of metal on metal clangs from above when the sway peaks.',
        position: { x: 50, y: 28 }
      },
      {
        id: 'foyer-ledger',
        label: 'Brass Ledger',
        action: 'examine',
        description:
          'Guest names are etched into tarnished brass plates. The final entry—left unfinished—scratches your surname before trailing into a gouge.',
        rewards: [
          {
            itemId: 'winding-key',
            note: 'A hidden drawer releases a warm brass winding key wrapped in velvet.'
          }
        ],
        position: { x: 30, y: 68 }
      },
      {
        id: 'foyer-to-portrait',
        label: 'Portrait Hall',
        action: 'travel',
        description: 'Slip beneath the archway lined with ancestral eyes.',
        targetSceneId: 'portrait-hall',
        position: { x: 70, y: 58 }
      }
    ]
  },
  {
    id: 'portrait-hall',
    name: 'Portrait Hall',
    tagline: 'Oil eyes follow every breath, catching the glint of your lantern.',
    ambient:
      'Muted organ drones leak from hidden speakers while frames creak softly in their mounts.',
    background: {
      default: `radial-gradient(circle at 85% 18%, rgba(177, 58, 58, 0.22), transparent 40%),
        radial-gradient(circle at 15% 35%, rgba(64, 68, 94, 0.32), transparent 58%),
        linear-gradient(180deg, #181c24 0%, #141720 48%, #090a10 100%)`,
      safe: `radial-gradient(circle at 83% 20%, rgba(196, 86, 86, 0.18), transparent 42%),
        radial-gradient(circle at 14% 38%, rgba(82, 92, 116, 0.26), transparent 60%),
        linear-gradient(180deg, #1b1f28 0%, #151924 50%, #0a0c12 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 46%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(4, 5, 7, 0.7) 100%)',
    layers: [
      {
        id: 'frames',
        style: {
          backgroundImage: `repeating-linear-gradient(90deg, rgba(52, 43, 40, 0.4) 0px, rgba(52, 43, 40, 0.4) 6px, transparent 6px, transparent 36px)`,
          opacity: 0.35
        }
      },
      {
        id: 'floor',
        style: {
          backgroundImage: `linear-gradient(180deg, rgba(10, 11, 15, 0) 0%, rgba(27, 18, 18, 0.78) 62%, rgba(12, 8, 8, 0.96) 100%)`,
          opacity: 0.95
        }
      }
    ],
    hotspots: [
      {
        id: 'portrait-ancestor',
        label: 'Ancestor Portrait',
        action: 'examine',
        description:
          "The painting's varnish is cracked, yet the pupils glisten wet. When you lean close, the lacquer clouds as if the figure fogged the glass from inside.",
        optionalScare: 'A frame knocks against the wall once as though jostled by unseen hands.',
        position: { x: 58, y: 38 }
      },
      {
        id: 'portrait-sconce',
        label: 'Moth-Eaten Sconce',
        action: 'examine',
        description:
          'Dozens of dust-heavy moths cling to the lamp. When you cover the flame, their wings beat in sync with a far-off heartbeat echo.',
        position: { x: 34, y: 56 }
      },
      {
        id: 'portrait-to-foyer',
        label: 'Return to Foyer',
        action: 'travel',
        description: 'Retrace your steps to the foyer vestibule.',
        targetSceneId: 'foyer',
        position: { x: 18, y: 72 }
      },
      {
        id: 'portrait-to-conservatory',
        label: 'Conservatory',
        action: 'travel',
        description: 'A glass door breathes with condensation, inviting you onward.',
        targetSceneId: 'conservatory',
        position: { x: 78, y: 64 }
      },
      {
        id: 'portrait-to-library',
        label: 'Library Door',
        action: 'travel',
        description: 'A gilded crank waits beside the oak door.',
        requiresItems: ['winding-key'],
        lockedDescription: 'The door refuses to budge; a recessed mechanism shaped like a winding key stares back at you.',
        targetSceneId: 'library',
        position: { x: 50, y: 62 }
      }
    ]
  },
  {
    id: 'library',
    name: 'Moonlit Library',
    tagline: 'Shelves of cracked vellum lean inward as if eavesdropping on your heartbeat.',
    ambient:
      'Pages rustle though no breeze flows. Somewhere high above, a pendulum clock ticks out-of-time.',
    background: {
      default: `radial-gradient(circle at 70% 18%, rgba(92, 126, 177, 0.32), transparent 48%),
        radial-gradient(circle at 22% 70%, rgba(177, 115, 58, 0.24), transparent 60%),
        linear-gradient(180deg, #171923 0%, #131622 52%, #090b12 100%)`,
      safe: `radial-gradient(circle at 72% 20%, rgba(116, 148, 198, 0.28), transparent 52%),
        radial-gradient(circle at 24% 72%, rgba(200, 144, 90, 0.2), transparent 62%),
        linear-gradient(180deg, #1a1d27 0%, #151826 54%, #0b0d14 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 48%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 58%, rgba(3, 4, 8, 0.72) 100%)',
    layers: [
      {
        id: 'moonbeam',
        style: {
          backgroundImage: `linear-gradient(122deg, rgba(164, 200, 255, 0.2) 12%, rgba(0, 0, 0, 0) 46%)`,
          mixBlendMode: 'screen',
          opacity: 0.55
        }
      },
      {
        id: 'dust',
        style: {
          backgroundImage: `radial-gradient(circle at 40% 60%, rgba(210, 210, 210, 0.12), transparent 60%)`,
          opacity: 0.45
        }
      }
    ],
    hotspots: [
      {
        id: 'library-music-box',
        label: 'Music Box',
        action: 'examine',
        description:
          'A velvet-lined box sits on the reading table. Its cylinder is stalled mid-measure, teeth locked in anticipation.',
        requiresItems: ['winding-key'],
        lockedDescription: 'You need a key capable of turning the winding column before the melody will resume.',
        rewards: [
          {
            itemId: 'cipher-disc',
            note: 'The melody finishes and ejects a bone-white cipher disc from a hidden compartment.'
          }
        ],
        position: { x: 46, y: 54 }
      },
      {
        id: 'library-tome',
        label: 'Ciphered Tome',
        action: 'examine',
        description:
          'Letters shift on the page like ink caught in a tide. The cipher disc in your pack tingles, eager to align.',
        optionalScare: 'The shelves exhale in unison, bowing toward you.',
        position: { x: 62, y: 34 }
      },
      {
        id: 'library-ladder',
        label: 'Caged Ladder',
        action: 'examine',
        description:
          'The ladder’s wheels are shackled. Scratched notes warn: “Do not roll north unless the boiler sleeps.”',
        position: { x: 28, y: 68 }
      },
      {
        id: 'library-to-portrait',
        label: 'Return to Portrait Hall',
        action: 'travel',
        description: 'Slip through the door while the portraits avert their gaze.',
        targetSceneId: 'portrait-hall',
        position: { x: 82, y: 74 }
      }
    ]
  },
  {
    id: 'conservatory',
    name: 'Night Conservatory',
    tagline: 'Moonlight filters through cracked panes, painting the air with silver pollen.',
    ambient:
      'Distant thunder rolls under the hiss of misting pipes. Wet leaves brush against the glass ceiling in restless waves.',
    background: {
      default: `radial-gradient(circle at 30% 18%, rgba(102, 156, 132, 0.38), transparent 52%),
        radial-gradient(circle at 78% 16%, rgba(119, 87, 130, 0.26), transparent 60%),
        linear-gradient(180deg, #121a17 0%, #151e21 48%, #09100f 100%)`,
      safe: `radial-gradient(circle at 32% 20%, rgba(126, 172, 148, 0.3), transparent 58%),
        radial-gradient(circle at 76% 18%, rgba(146, 112, 156, 0.22), transparent 64%),
        linear-gradient(180deg, #15201c 0%, #192327 52%, #0c1413 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 55%, rgba(3, 6, 6, 0.6) 100%)',
    layers: [
      {
        id: 'glass',
        style: {
          backgroundImage: `linear-gradient(130deg, rgba(185, 229, 255, 0.12) 15%, rgba(0, 0, 0, 0) 45%),
             linear-gradient(48deg, rgba(134, 186, 162, 0.18) 12%, rgba(0, 0, 0, 0) 46%)`,
          mixBlendMode: 'screen',
          opacity: 0.55
        }
      },
      {
        id: 'foliage',
        style: {
          backgroundImage: `radial-gradient(circle at 26% 62%, rgba(46, 94, 64, 0.5), transparent 45%),
             radial-gradient(circle at 72% 68%, rgba(60, 110, 72, 0.6), transparent 50%)`,
          opacity: 0.75
        }
      }
    ],
    hotspots: [
      {
        id: 'conservatory-fountain',
        label: 'Dry Fountain',
        action: 'examine',
        description:
          'Stone cherubs stain the floor with mineral tears. The basin hums as if water vibrates just beneath the surface, waiting for a cue.',
        optionalScare: 'Mist briefly billows upward, shaping a face before dissolving.',
        position: { x: 48, y: 54 }
      },
      {
        id: 'conservatory-lantern',
        label: 'Ward Lantern',
        action: 'examine',
        description:
          'A caretaker’s lantern hangs among the vines. The flame glows amber despite the lack of fuel.',
        rewards: [
          {
            itemId: 'amber-lantern',
            note: 'When lifted, the lantern brightens and pledges to chase shadows from the servant corridor.'
          }
        ],
        position: { x: 62, y: 30 }
      },
      {
        id: 'conservatory-to-corridor',
        label: 'Servant Corridor',
        action: 'travel',
        description: 'A rusted service door exhales warm, damp air.',
        targetSceneId: 'servant-corridor',
        position: { x: 16, y: 70 }
      },
      {
        id: 'conservatory-to-portrait',
        label: 'Return to Hall',
        action: 'travel',
        description: 'Slip back through the portrait hall door.',
        targetSceneId: 'portrait-hall',
        position: { x: 84, y: 74 }
      }
    ]
  },
  {
    id: 'servant-corridor',
    name: 'Servant Corridor',
    tagline: 'Narrow walls funnel stale warmth from the boiler below.',
    ambient: 'Footsteps patter overhead in loops, offset by the drip of unseen condensation.',
    background: {
      default: `radial-gradient(circle at 82% 30%, rgba(177, 58, 58, 0.18), transparent 50%),
        linear-gradient(180deg, #161920 0%, #12151c 45%, #07080c 100%)`,
      safe: `radial-gradient(circle at 80% 32%, rgba(194, 96, 96, 0.16), transparent 55%),
        linear-gradient(180deg, #191c24 0%, #14171f 48%, #090b11 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.18) 58%, rgba(3, 4, 6, 0.72) 100%)',
    layers: [
      {
        id: 'pipes',
        style: {
          backgroundImage: `linear-gradient(90deg, rgba(84, 88, 104, 0.35) 10%, rgba(0, 0, 0, 0) 16%),
             linear-gradient(270deg, rgba(62, 42, 38, 0.4) 12%, rgba(0, 0, 0, 0) 28%)`,
          opacity: 0.5
        }
      }
    ],
    hotspots: [
      {
        id: 'corridor-service-bell',
        label: 'Service Bell',
        action: 'examine',
        description:
          'The bell cord is frayed, yet when tugged the manor answers with a polite chime from every room at once.',
        position: { x: 54, y: 32 }
      },
      {
        id: 'corridor-hidden-panel',
        label: 'Hidden Panel',
        action: 'examine',
        description:
          'Faint warmth bleeds through the panel gap. Scratched into the paint is a plea: “Do not feed the boiler.”',
        rewards: [
          {
            itemId: 'pressure-manual',
            note: 'You pry the panel loose and recover a sealed pressure manual wrapped in oilskin.'
          }
        ],
        position: { x: 42, y: 58 }
      },
      {
        id: 'corridor-to-boiler',
        label: 'Boiler Room',
        action: 'travel',
        description: 'Descend the iron steps toward the boiler heart.',
        targetSceneId: 'boiler-room',
        position: { x: 74, y: 70 }
      },
      {
        id: 'corridor-to-basement',
        label: 'Basement Stairs',
        action: 'travel',
        description: 'Chains rattle from the darkness below, awaiting the lantern’s glow.',
        requiresItems: ['amber-lantern'],
        lockedDescription: 'Without a steadfast lantern, the darkness below seizes your breath and forces you back.',
        targetSceneId: 'basement-stairs',
        position: { x: 54, y: 74 }
      },
      {
        id: 'corridor-to-conservatory',
        label: 'Return to Conservatory',
        action: 'travel',
        description: 'Slip back through the service door to the glasshouse.',
        targetSceneId: 'conservatory',
        position: { x: 24, y: 74 }
      }
    ]
  },
  {
    id: 'boiler-room',
    name: 'Boiler Room',
    tagline: 'A brass leviathan groans, stoking the manor’s artificial lungs.',
    ambient:
      'Low rumbles collide with rhythmic hisses. A metronome of chains ratchets somewhere behind the tanks.',
    background: {
      default: `radial-gradient(circle at 40% 20%, rgba(177, 91, 58, 0.28), transparent 52%),
        radial-gradient(circle at 76% 70%, rgba(120, 58, 90, 0.24), transparent 60%),
        linear-gradient(180deg, #1a1915 0%, #15110f 50%, #090705 100%)`,
      safe: `radial-gradient(circle at 42% 22%, rgba(196, 122, 90, 0.24), transparent 56%),
        radial-gradient(circle at 74% 72%, rgba(144, 88, 120, 0.22), transparent 62%),
        linear-gradient(180deg, #1d1b17 0%, #181411 52%, #0b0907 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 44%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.24) 58%, rgba(4, 3, 2, 0.78) 100%)',
    layers: [
      {
        id: 'steam',
        style: {
          backgroundImage: `radial-gradient(circle at 38% 38%, rgba(220, 213, 192, 0.28), transparent 55%),
             radial-gradient(circle at 68% 46%, rgba(230, 176, 176, 0.22), transparent 60%)`,
          mixBlendMode: 'screen',
          opacity: 0.6
        }
      }
    ],
    hotspots: [
      {
        id: 'boiler-gauge',
        label: 'Pressure Gauge',
        action: 'examine',
        description:
          'The needle dances erratically. Each time it slams the red zone, footsteps scrape behind you before halting mid-stride.',
        optionalScare: 'Steam jets hiss to spell a warning across the glass before fading.',
        position: { x: 58, y: 42 }
      },
      {
        id: 'boiler-furnace',
        label: 'Furnace Hatch',
        action: 'examine',
        description:
          'Heat roars behind the hatch. The manual diagrams show a specific sequence to bleed the furnace safely.',
        requiresItems: ['pressure-manual'],
        lockedDescription: 'Your fingers blister as the hatch sears shut. A proper manual might reveal how to vent the heat first.',
        rewards: [
          {
            itemId: 'ashen-token',
            note: 'Following the manual’s steps, you scoop an ashen token from the cooled embers.'
          }
        ],
        position: { x: 46, y: 64 }
      },
      {
        id: 'boiler-to-corridor',
        label: 'Ascend to Corridor',
        action: 'travel',
        description: 'Climb back toward the servant corridor.',
        targetSceneId: 'servant-corridor',
        position: { x: 26, y: 78 }
      }
    ]
  },
  {
    id: 'basement-stairs',
    name: 'Basement Stairs',
    tagline: 'Cold breath funnels upward as the manor waits for tribute.',
    ambient:
      'Water drips in irregular rhythms. Between drips you hear a distant choir humming a single, unwavering note.',
    background: {
      default: `radial-gradient(circle at 30% 30%, rgba(92, 120, 140, 0.26), transparent 52%),
        radial-gradient(circle at 70% 70%, rgba(177, 58, 98, 0.28), transparent 58%),
        linear-gradient(180deg, #0f1316 0%, #090b10 50%, #050507 100%)`,
      safe: `radial-gradient(circle at 32% 32%, rgba(114, 144, 162, 0.22), transparent 56%),
        radial-gradient(circle at 68% 72%, rgba(198, 90, 122, 0.24), transparent 60%),
        linear-gradient(180deg, #12171a 0%, #0c0e12 52%, #060609 100%)`
    },
    vignette:
      'radial-gradient(circle at 50% 46%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.22) 60%, rgba(2, 3, 5, 0.82) 100%)',
    layers: [
      {
        id: 'mist',
        style: {
          backgroundImage: `radial-gradient(circle at 48% 62%, rgba(208, 220, 230, 0.18), transparent 60%)`,
          opacity: 0.55
        }
      }
    ],
    hotspots: [
      {
        id: 'basement-landing',
        label: 'Landing Runes',
        action: 'examine',
        description:
          'Runes carved into the stairs glow when the lantern sweeps across them. They outline a sigil missing its core.',
        position: { x: 44, y: 48 }
      },
      {
        id: 'basement-altar',
        label: 'Ash Altar',
        action: 'examine',
        description:
          'An altar of obsidian collects the manor’s breath. A recess at its center mirrors the shape of your ashen token.',
        requiresItems: ['ashen-token'],
        lockedDescription: 'The altar rejects your empty hands. Something forged in the furnace must complete the design.',
        rewards: [
          {
            itemId: 'basement-sigil',
            note: 'When you place the token, silver light etches a sigil of release into a glass disc.'
          }
        ],
        position: { x: 58, y: 62 }
      },
      {
        id: 'basement-to-corridor',
        label: 'Back to Corridor',
        action: 'travel',
        description: 'Climb the stairs, lantern held high.',
        targetSceneId: 'servant-corridor',
        position: { x: 28, y: 74 }
      }
    ]
  }
];

export const SCENE_MAP: Record<string, SceneDefinition> = SCENES.reduce(
  (accumulator, scene) => {
    accumulator[scene.id] = scene;
    return accumulator;
  },
  {} as Record<string, SceneDefinition>
);
