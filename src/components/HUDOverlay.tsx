import { useEffect, useMemo, useState } from 'react';

import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { ITEMS, SCENE_MAP } from '../scenes/sceneData';

import styles from './HUDOverlay.module.css';

export function HUDOverlay() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const motionSafe = useSettingsStore((state) => state.motionSafe);
  const toggleMotionSafe = useSettingsStore((state) => state.toggleMotionSafe);
  const photosensitivitySafe = useSettingsStore((state) => state.photosensitivitySafe);
  const togglePhotosensitivitySafe = useSettingsStore((state) => state.togglePhotosensitivitySafe);
  const showHotspotHints = useSettingsStore((state) => state.showHotspotHints);
  const toggleHotspotHints = useSettingsStore((state) => state.toggleHotspotHints);

  const currentSceneId = useGameStore((state) => state.currentSceneId);
  const visitedSceneIds = useGameStore((state) => state.visitedSceneIds);
  const inventory = useGameStore((state) => state.inventory);
  const lastAcquiredItemId = useGameStore((state) => state.lastAcquiredItemId);
  const clearLastAcquiredItem = useGameStore((state) => state.clearLastAcquiredItem);

  const currentScene = SCENE_MAP[currentSceneId];
  const visitedScenes = useMemo(
    () => visitedSceneIds.map((id) => SCENE_MAP[id]?.name ?? id),
    [visitedSceneIds]
  );
  const inventoryItems = useMemo(() => inventory.map((itemId) => ITEMS[itemId]), [inventory]);

  useEffect(() => {
    if (!lastAcquiredItemId) return;

    const timeoutId = window.setTimeout(() => {
      clearLastAcquiredItem();
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [clearLastAcquiredItem, lastAcquiredItemId]);

  return (
    <div className={styles.wrapper} aria-live="polite">
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <p className={styles.subtitle}>The Wraithmoor Estate</p>
          <h1 className={styles.title}>Myst-Style Prototype</h1>
        </div>
        <div className={styles.location}>
          <span className={styles.locationLabel}>Current View</span>
          <strong className={styles.locationName}>{currentScene?.name ?? 'Unknown'}</strong>
        </div>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="hud-accessibility"
        >
          {isMenuOpen ? 'Close Accessibility' : 'Accessibility'}
        </button>
      </header>
      <section className={styles.instructions}>
        <p>
          Click the shimmering markers to investigate or travel. Items you recover unlock new paths—check the inventory panel
          for clues. Use Tab to cycle hotspots and Enter or Space to interact.
        </p>
      </section>
      <section
        id="hud-accessibility"
        className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <h2>Accessibility</h2>
        <label className={styles.toggle}>
          <input type="checkbox" checked={motionSafe} onChange={toggleMotionSafe} />
          <span>Motion Safe Parallax</span>
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={photosensitivitySafe}
            onChange={togglePhotosensitivitySafe}
          />
          <span>Photosensitivity Safe Palette</span>
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={showHotspotHints} onChange={toggleHotspotHints} />
          <span>Show Hotspot Labels</span>
        </label>
        <p className={styles.note}>Adjust these settings anytime—changes apply instantly.</p>
      </section>
      <section className={styles.inventory} aria-label="Inventory">
        <h2>Inventory</h2>
        {inventoryItems.length === 0 ? (
          <p className={styles.empty}>No items recovered yet. Investigate glowing hotspots to uncover tools.</p>
        ) : (
          <ul>
            {inventoryItems.map((item) => (
              <li
                key={item.id}
                data-new={item.id === lastAcquiredItemId}
              >
                <strong>{item.name}</strong>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className={styles.visited} aria-label="Visited rooms">
        <h2>Visited Rooms</h2>
        <ul>
          {visitedScenes.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
