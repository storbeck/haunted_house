import { Experience } from '../scenes/Experience';
import { HUDOverlay } from '../components/HUDOverlay';

import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.shell}>
      <Experience />
      <HUDOverlay />
    </div>
  );
}
