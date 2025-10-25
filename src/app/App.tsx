import { useEffect } from 'react';

import { Experience } from '../scenes/Experience';
import { HUDOverlay } from '../components/HUDOverlay';
import { requestPointerLock } from '../utils/pointerLock';

import styles from './App.module.css';

function usePointerLockShortcut() {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'm') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        } else {
          requestPointerLock();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

function usePointerLockClass() {
  useEffect(() => {
    function syncClass() {
      document.body.classList.toggle('pointer-locked', Boolean(document.pointerLockElement));
    }

    document.addEventListener('pointerlockchange', syncClass);
    syncClass();
    return () => document.removeEventListener('pointerlockchange', syncClass);
  }, []);
}

export default function App() {
  usePointerLockShortcut();
  usePointerLockClass();

  return (
    <div className={styles.shell}>
      <Experience />
      <HUDOverlay />
    </div>
  );
}
