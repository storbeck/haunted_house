import { useEffect, useMemo, useState, type PointerEvent } from 'react';

import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { SCENE_MAP, type HotspotDefinition } from './sceneData';

import styles from './Experience.module.css';

const PARALLAX_RANGE = { x: 8, y: 6 };

export function Experience() {
  const motionSafe = useSettingsStore((state) => state.motionSafe);
  const photosensitivitySafe = useSettingsStore((state) => state.photosensitivitySafe);
  const showHotspotHints = useSettingsStore((state) => state.showHotspotHints);

  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const activeHotspotId = useGameStore((state) => state.activeHotspotId);
  const setScene = useGameStore((state) => state.setScene);
  const inspectHotspot = useGameStore((state) => state.inspectHotspot);

  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        inspectHotspot(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectHotspot]);

  const scene = SCENE_MAP[currentSceneId];
  const activeHotspot = useMemo(() => {
    if (!scene || !activeHotspotId) return null;
    return scene.hotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? null;
  }, [scene, activeHotspotId]);

  if (!scene) {
    return null;
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (motionSafe) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * PARALLAX_RANGE.x;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * PARALLAX_RANGE.y;
    setParallax({ x, y });
  }

  function handlePointerLeave() {
    setParallax({ x: 0, y: 0 });
  }

  function handleHotspotInteraction(hotspot: HotspotDefinition) {
    if (hotspot.action === 'travel' && hotspot.targetSceneId) {
      setScene(hotspot.targetSceneId);
      return;
    }

    inspectHotspot(hotspot.id);
  }

  const backgroundImage = photosensitivitySafe ? scene.background.safe : scene.background.default;
  const sceneTransform = motionSafe ? undefined : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`;

  const stageClassNames = [styles.stage];
  if (motionSafe) stageClassNames.push(styles.motionSafe);
  if (!showHotspotHints) stageClassNames.push(styles.hintsHidden);

  return (
    <div
      className={stageClassNames.join(' ')}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        key={scene.id}
        className={styles.scene}
        style={{ backgroundImage, transform: sceneTransform }}
        aria-label={`${scene.name} view`}
      >
        <div className={styles.layers} aria-hidden>
          {scene.layers.map((layer) => (
            <div key={layer.id} className={styles.layer} style={layer.style} />
          ))}
        </div>
        <div className={styles.vignette} style={{ backgroundImage: scene.vignette }} aria-hidden />
        <div className={styles.hotspots}>
          {scene.hotspots.map((hotspot) => {
            const isActive = activeHotspot?.id === hotspot.id;
            const actionLabel = hotspot.action === 'travel' ? 'Travel' : 'Examine';
            return (
              <button
                key={hotspot.id}
                type="button"
                className={`${styles.hotspot} ${isActive ? styles.hotspotActive : ''}`}
                style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
                onClick={() => handleHotspotInteraction(hotspot)}
                onFocus={() => hotspot.action === 'examine' && inspectHotspot(hotspot.id)}
                aria-label={`${hotspot.label}. ${actionLabel}: ${hotspot.description}`}
                title={`${hotspot.label} · ${actionLabel}`}
                data-action={hotspot.action}
              >
                <span className={styles.marker} />
                <span className={styles.hotspotLabel}>{hotspot.label}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.sceneHeader} aria-hidden>
          <h2>{scene.name}</h2>
          <p>{scene.tagline}</p>
        </div>
        <div className={styles.sceneAmbient}>
          <p>{scene.ambient}</p>
        </div>
      </div>
      <div
        className={`${styles.prompt} ${activeHotspot ? styles.promptVisible : ''}`}
        role="dialog"
        aria-modal="false"
        aria-live="polite"
      >
        {activeHotspot && (
          <>
            <header className={styles.promptHeader}>
              <span className={styles.promptChip}>Inspect</span>
              <h3>{activeHotspot.label}</h3>
            </header>
            <p className={styles.promptBody}>{activeHotspot.description}</p>
            {activeHotspot.optionalScare && (
              <p className={styles.promptAside}>{activeHotspot.optionalScare}</p>
            )}
            <div className={styles.promptActions}>
              <button
                type="button"
                className={styles.promptButton}
                onClick={() => inspectHotspot(null)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
