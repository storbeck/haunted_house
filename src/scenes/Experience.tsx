import { useCallback, useEffect, useMemo, useState, type PointerEvent } from 'react';

import { useGameStore } from '../state/gameStore';
import { useSettingsStore } from '../state/settingsStore';
import { ITEMS, SCENE_MAP, type HotspotDefinition, type ItemId } from './sceneData';

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
  const resolvedHotspotIds = useGameStore((state) => state.resolvedHotspotIds);
  const grantItems = useGameStore((state) => state.grantItems);
  const markHotspotResolved = useGameStore((state) => state.markHotspotResolved);
  const inventory = useGameStore((state) => state.inventory);

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [lockedHotspotId, setLockedHotspotId] = useState<string | null>(null);
  const [recentRewardHotspotId, setRecentRewardHotspotId] = useState<string | null>(null);
  const [isSceneEntering, setIsSceneEntering] = useState(true);

  const closePrompt = useCallback(() => {
    inspectHotspot(null);
    setLockedHotspotId(null);
    setRecentRewardHotspotId(null);
  }, [inspectHotspot]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePrompt();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePrompt]);

  useEffect(() => {
    setParallax({ x: 0, y: 0 });
    setLockedHotspotId(null);
    setRecentRewardHotspotId(null);
    setIsSceneEntering(true);

    const timeoutId = window.setTimeout(() => setIsSceneEntering(false), 420);
    return () => window.clearTimeout(timeoutId);
  }, [currentSceneId]);

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

  function formatItemList(itemIds: ItemId[]) {
    const names = itemIds
      .map((itemId) => ITEMS[itemId]?.name ?? itemId)
      .filter((name) => Boolean(name));

    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;

    return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
  }

  function hasRequiredItems(hotspot: HotspotDefinition) {
    return (
      !hotspot.requiresItems || hotspot.requiresItems.every((itemId) => inventory.includes(itemId))
    );
  }

  function handleHotspotInteraction(hotspot: HotspotDefinition) {
    const canActivate = hasRequiredItems(hotspot);

    if (!canActivate) {
      setLockedHotspotId(hotspot.id);
      setRecentRewardHotspotId(null);
      inspectHotspot(hotspot.id);
      return;
    }

    setLockedHotspotId(null);

    if (hotspot.action === 'travel' && hotspot.targetSceneId) {
      closePrompt();
      setScene(hotspot.targetSceneId);
      return;
    }

    if (!resolvedHotspotIds.includes(hotspot.id)) {
      markHotspotResolved(hotspot.id);

      const rewards = hotspot.rewards?.map((reward) => reward.itemId) ?? [];
      if (rewards.length > 0) {
        grantItems(rewards);
        setRecentRewardHotspotId(hotspot.id);
      } else {
        setRecentRewardHotspotId(null);
      }
    } else {
      setRecentRewardHotspotId(null);
    }

    inspectHotspot(hotspot.id);
  }

  const backgroundImage = photosensitivitySafe ? scene.background.safe : scene.background.default;
  const sceneTransform = motionSafe ? undefined : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`;

  const stageClassNames = [styles.stage];
  if (motionSafe) stageClassNames.push(styles.motionSafe);
  if (!showHotspotHints) stageClassNames.push(styles.hintsHidden);

  const sceneClassNames = [styles.scene];
  if (isSceneEntering) sceneClassNames.push(styles.sceneEntering);

  const isLockedPrompt = activeHotspot && lockedHotspotId === activeHotspot.id;
  const promptChipLabel = isLockedPrompt
    ? 'Locked'
    : activeHotspot?.action === 'travel'
      ? 'Travel'
      : 'Inspect';

  const activeRewards = activeHotspot?.rewards ?? [];
  const rewardsShouldCelebrate = activeHotspot?.id === recentRewardHotspotId;
  const missingItemsForPrompt =
    activeHotspot?.requiresItems?.filter((itemId) => !inventory.includes(itemId)) ?? [];
  const lockedMessage = isLockedPrompt
    ? activeHotspot?.lockedDescription ??
      `You need ${formatItemList(missingItemsForPrompt)} before this interaction responds.`
    : null;

  return (
    <div
      className={stageClassNames.join(' ')}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        key={scene.id}
        className={sceneClassNames.join(' ')}
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
            const isResolved = resolvedHotspotIds.includes(hotspot.id);
            const missingItems =
              hotspot.requiresItems?.filter((itemId) => !inventory.includes(itemId)) ?? [];
            const requirementLabel =
              missingItems.length > 0
                ? ` Requires ${formatItemList(missingItems)}.`
                : '';
            return (
              <button
                key={hotspot.id}
                type="button"
                className={`${styles.hotspot} ${isActive ? styles.hotspotActive : ''}`}
                style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
                onClick={() => handleHotspotInteraction(hotspot)}
                onFocus={() => hotspot.action === 'examine' && inspectHotspot(hotspot.id)}
                aria-label={`${hotspot.label}. ${actionLabel}: ${hotspot.description}${requirementLabel}`}
                title={`${hotspot.label} · ${actionLabel}`}
                data-action={hotspot.action}
                data-resolved={isResolved}
                data-locked={missingItems.length > 0}
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
              <span className={styles.promptChip} data-locked={isLockedPrompt}>
                {promptChipLabel}
              </span>
              <h3>{activeHotspot.label}</h3>
            </header>
            <p className={styles.promptBody}>
              {lockedMessage ?? activeHotspot.description}
            </p>
            {!isLockedPrompt && activeRewards.length > 0 && (
              <ul className={styles.promptRewards}>
                {activeRewards.map((reward) => {
                  const item = ITEMS[reward.itemId];
                  if (!item) return null;

                  const baseMessage = reward.note ?? `You recover the ${item.name}.`;
                  const alreadyCollectedMessage = `Already collected: ${item.name}.`;
                  const message = rewardsShouldCelebrate
                    ? baseMessage
                    : alreadyCollectedMessage;

                  return (
                    <li key={reward.itemId} data-celebrate={rewardsShouldCelebrate}>
                      <strong>{item.name}</strong>
                      <span>{message}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            {!isLockedPrompt && activeHotspot.optionalScare && (
              <p className={styles.promptAside}>{activeHotspot.optionalScare}</p>
            )}
            <div className={styles.promptActions}>
              <button
                type="button"
                className={styles.promptButton}
                onClick={closePrompt}
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
