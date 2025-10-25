import type { PuzzleDefinition } from '../types';

export const puzzles: PuzzleDefinition[] = [
  {
    id: 'portrait_shift',
    name: 'Shifting Portrait',
    description:
      'Align the portrait to match the hidden claw marks etched beneath the frame.',
    mechanic: 'Rotate segments until the scratch marks connect.',
    options: [
      { id: 'rotate_left', label: 'Rotate left (30°)' },
      { id: 'rotate_right', label: 'Rotate right (30°)' },
      { id: 'press', label: 'Press frame inward' },
      { id: 'tilt', label: 'Tilt portrait upward' }
    ],
    solution: 'press',
    reward: {
      item: 'brass_key',
      text: 'Behind the portrait, a brass key glitters within a hidden niche.'
    },
    successText: 'A hidden latch clicks; the portrait settles perfectly level.',
    failureText: 'The portrait swings back, the scratching intensifies ominously.'
  },
  {
    id: 'music_box',
    name: 'Sigil Melody',
    description:
      'Set the dials to recreate the haunting motif from the gallery phonograph.',
    mechanic: 'Match three rotating sigils to complete the melody.',
    options: [
      { id: 'raven', label: 'Raven Sigil', hint: 'Matches the bass hum.' },
      { id: 'eye', label: 'All-Seeing Eye', hint: 'Glows faintly when tones align.' },
      { id: 'rose', label: 'Withered Rose' },
      { id: 'moon', label: 'Crescent Moon' }
    ],
    solution: 'eye',
    reward: {
      item: 'silver_gear',
      flag: 'display_case_open',
      value: true,
      text: 'A hidden compartment reveals a silver gear and the display case unlocks.'
    },
    successText: 'The melody harmonizes, gears within the case spring to life.',
    failureText: 'A sour note echoes as the sigils reset.'
  },
  {
    id: 'bookcase_glide',
    name: 'Astrolabe Alignment',
    description:
      'Spin the astrolabe rings to recreate the manor owner\'s nightly ritual.',
    mechanic: 'Arrange constellations in the correct sequence.',
    options: [
      { id: 'ursa', label: 'Ursa Major' },
      { id: 'lyra', label: 'Lyra' },
      { id: 'draco', label: 'Draco' },
      { id: 'corvus', label: 'Corvus' }
    ],
    solution: 'draco',
    reward: {
      item: 'cipher_tablet',
      text: 'A cipher tablet slides free, etched with luminous glyphs.'
    },
    successText: 'The astrolabe locks into place; the bookcase shudders aside briefly.',
    failureText: 'Stars fade as the mechanism resists your attempt.'
  },
  {
    id: 'planter_stars',
    name: 'Ivy Sigils',
    description:
      'Rotate the tiles to channel moonlight through the overgrown planter.',
    mechanic: 'Symbol rotation puzzle with four glyphs.',
    options: [
      { id: 'north', label: 'North Glyph' },
      { id: 'east', label: 'East Glyph' },
      { id: 'south', label: 'South Glyph' },
      { id: 'west', label: 'West Glyph' }
    ],
    solution: 'north',
    reward: {
      flag: 'garden_seal_weakened',
      value: true,
      text: 'Moonlight pours through the planter, burning away thorny wards.'
    },
    successText: 'The vines recoil as light concentrates on the sigil gate.',
    failureText: 'Mist thickens, hiding the sigils once more.'
  },
  {
    id: 'lantern_sequence',
    name: 'Lantern Resonance',
    description:
      'Tune the ritual lantern lenses to produce harmonic resonance.',
    mechanic: 'Memory pattern: click the glowing sequence in order.',
    options: [
      { id: 'amber', label: 'Amber Lens' },
      { id: 'violet', label: 'Violet Lens' },
      { id: 'indigo', label: 'Indigo Lens' },
      { id: 'crimson', label: 'Crimson Lens' }
    ],
    solution: 'violet',
    reward: {
      flag: 'lantern_lit',
      value: true,
      text: 'The lantern erupts in cold fire, bathing the attic in steady light.'
    },
    successText: 'A harmonic pulse thrums through the beams as the lantern stabilizes.',
    failureText: 'The lantern flickers out, forcing you to restart the sequence.'
  },
  {
    id: 'ritual_alignment',
    name: 'Circle Binding',
    description:
      'Align the ritual sigils to bind the circle before it erupts.',
    mechanic: 'Pattern rotation with a timed cadence (no countdown in MVP).',
    options: [
      { id: 'triangle', label: 'Triad Sigil' },
      { id: 'hex', label: 'Hexagram Sigil' },
      { id: 'spiral', label: 'Spiral Sigil' },
      { id: 'eye', label: 'Watcher Sigil' }
    ],
    solution: 'hex',
    reward: {
      flag: 'ritual_circle_bound',
      value: true,
      text: 'Chains of moonlight bind the door, priming the outer gate release.'
    },
    successText: 'Energy crackles along the circle, sealing the ritual breach.',
    failureText: 'The sigils desynchronize; the chamber rumbles threateningly.',
    requires: ['flag:lantern_lit', 'flag:garden_seal_weakened']
  },
  {
    id: 'final_escape',
    name: 'Lunar Alignment',
    description:
      'Channel the bound energy through the lunar dial to unseal the gate.',
    mechanic: 'Select the matching lunar phase based on gathered clues.',
    options: [
      { id: 'new', label: 'New Moon', hint: 'Too dark to cut through the wards.' },
      { id: 'waxing', label: 'Waxing Crescent' },
      { id: 'full', label: 'Full Moon', hint: 'Matches the ritual notes.' },
      { id: 'waning', label: 'Waning Crescent' }
    ],
    solution: 'full',
    reward: {
      flag: 'escaped',
      value: true,
      text: 'The gate unlocks with a triumphant swell; freedom lies beyond the hedges.'
    },
    successText: 'Wards evaporate as moonlight floods the courtyard.',
    failureText: 'The wards flare, demanding the correct phase.',
    requires: ['flag:ritual_circle_bound']
  }
];

export const puzzleMap = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
