import { Application } from 'pixi.js';
import { SceneView, DESIGN_SIZE } from './scenes/SceneView';
import { sceneMap } from './data/scenes';
import { puzzleMap } from './data/puzzles';
import { GameState } from './state/gameState';
import type { HotspotDefinition, SceneId } from './types';
import { UIRoot } from './ui/UIRoot';
import { audioManager } from './audio/AudioManager';

const gameContainer = document.getElementById('game');
const uiContainer = document.getElementById('ui-root');

if (!gameContainer || !uiContainer) {
  throw new Error('Game container missing');
}

const app = new Application();
await app.init({
  resizeTo: window,
  background: '#05060a',
  antialias: true
});

gameContainer.appendChild(app.canvas);

const gameState = new GameState();
const sceneView = new SceneView();
app.stage.addChild(sceneView);

const ui = new UIRoot(uiContainer, gameState);
audioManager.attachSubtitleCallback((text) => ui.showSubtitle(text));

function updateScene(sceneId: SceneId) {
  const scene = sceneMap.get(sceneId);
  if (!scene) return;
  ui.setStatusText(`${scene.title} — ${scene.description}`);
  sceneView.render(
    scene,
    {
      onHover: (hotspot: HotspotDefinition | null) => {
        if (hotspot) {
          ui.setStatusText(`${hotspot.name}: ${hotspot.hint}`);
        } else {
          ui.setStatusText(`${scene.title} — ${scene.description}`);
        }
      },
      onClick: (hotspot) => handleHotspot(scene.id, hotspot)
    }
  );
  resize();
  audioManager.playAmbient(scene.title);
}

async function handleHotspot(sceneId: SceneId, hotspot: HotspotDefinition) {
  const scene = sceneMap.get(sceneId);
  if (!scene) return;
  if (hotspot.requires) {
    const unmet = hotspot.requires.find((requirement) => !gameState.hasRequirement(requirement));
    if (unmet) {
      ui.showToast('You lack what is needed.');
      audioManager.trigger('Requirement missing', 0.05);
      return;
    }
  }

  switch (hotspot.action.type) {
    case 'showText':
      ui.showToast(hotspot.action.text);
      audioManager.trigger('Note rustle', 0.06);
      break;
    case 'collectItem':
      gameState.addItem(hotspot.action.item, hotspot.action.text);
      break;
    case 'move':
      if (hotspot.consumeItem && hotspot.requires) {
        hotspot.requires
          .filter((req) => req.startsWith('item:'))
          .forEach((req) => gameState.removeItem(req.split(':')[1]));
      }
      if (hotspot.action.text) {
        ui.showToast(hotspot.action.text);
      }
      audioManager.trigger('Footsteps', 0.08);
      gameState.setScene(hotspot.action.target);
      break;
    case 'toggleFlag':
      gameState.setFlag(hotspot.action.flag, hotspot.action.value, hotspot.action.text);
      audioManager.trigger('Lever thunk', 0.08);
      break;
    case 'startPuzzle':
      await handlePuzzle(hotspot.action.puzzleId);
      break;
  }
}

async function handlePuzzle(puzzleId: string) {
  const puzzle = puzzleMap.get(puzzleId);
  if (!puzzle) return;
  if (puzzle.requires) {
    const unmet = puzzle.requires.find((requirement) => !gameState.hasRequirement(requirement));
    if (unmet) {
      ui.showToast('Something is missing.');
      return;
    }
  }
  const choice = await ui.openPuzzle(puzzle);
  if (!choice) {
    return;
  }
  if (choice === puzzle.solution) {
    gameState.markPuzzleSolved(puzzle.id);
    if (puzzle.reward?.item) {
      gameState.addItem(puzzle.reward.item, puzzle.reward.text);
    }
    if (puzzle.reward?.flag) {
      gameState.setFlag(puzzle.reward.flag, puzzle.reward.value ?? true, puzzle.reward.text);
    } else if (puzzle.reward?.text) {
      ui.showToast(puzzle.reward.text);
    }
    if (puzzle.successText) {
      ui.showToast(puzzle.successText);
    }
    audioManager.trigger('Puzzle solved', 0.12);
  } else {
    if (puzzle.failureText) {
      ui.showToast(puzzle.failureText);
    }
    audioManager.trigger('Puzzle failed', 0.08);
  }
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.min(width / DESIGN_SIZE.width, height / DESIGN_SIZE.height);
  sceneView.scale.set(scale);
  sceneView.position.set(
    (width - DESIGN_SIZE.width * scale) / 2,
    (height - DESIGN_SIZE.height * scale) / 2
  );
}

window.addEventListener('resize', resize);
app.canvas.addEventListener('pointermove', (event) => {
  const ratio = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight };
  sceneView.updateParallax(ratio, gameState.accessibility.reduceMotion);
});

app.canvas.addEventListener('pointerdown', () => {
  audioManager.requestStart();
});

gameState.addListener((event) => {
  if (event.type === 'sceneChanged') {
    updateScene(event.scene);
  }
  if (event.type === 'accessibilityChanged') {
    updateScene(gameState.scene);
  }
});

updateScene(gameState.scene);
resize();
