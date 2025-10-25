import { useState } from 'react';

import { useSettingsStore } from '../state/settingsStore';
import { requestPointerLock } from '../utils/pointerLock';

import styles from './HUDOverlay.module.css';

export function HUDOverlay() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const motionSafe = useSettingsStore((state) => state.motionSafe);
  const toggleMotionSafe = useSettingsStore((state) => state.toggleMotionSafe);
  const photosensitivitySafe = useSettingsStore((state) => state.photosensitivitySafe);
  const togglePhotosensitivitySafe = useSettingsStore((state) => state.togglePhotosensitivitySafe);

  return (
    <div className={styles.wrapper} aria-live="polite">
      <header className={styles.header}>
        <div>
          <p className={styles.subtitle}>The Wraithmoor Estate</p>
          <h1 className={styles.title}>Haunted House Prototype</h1>
        </div>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? 'Close Menu' : 'Options'}
        </button>
      </header>
      <section className={styles.instructions}>
        <p>
          Click to lock cursor • WASD to move • Move mouse to look • Press M to toggle pointer lock
        </p>
        <button type="button" className={styles.captureButton} onClick={() => requestPointerLock()}>
          Engage Pointer Lock
        </button>
      </section>
      <section className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <h2>Accessibility</h2>
        <label className={styles.toggle}>
          <input type="checkbox" checked={motionSafe} onChange={toggleMotionSafe} />
          <span>Motion Safe Mode</span>
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={photosensitivitySafe} onChange={togglePhotosensitivitySafe} />
          <span>Photosensitivity Safe Lighting</span>
        </label>
        <p className={styles.note}>
          Changes update immediately and will persist in future milestones.
        </p>
      </section>
    </div>
  );
}
