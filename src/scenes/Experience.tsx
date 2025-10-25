import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

import { useSettingsStore } from '../state/settingsStore';
import { FirstPersonController } from '../systems/FirstPersonController';
import { requestPointerLock } from '../utils/pointerLock';

function ManorShell() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1b1e24" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 4, -15]}>
        <boxGeometry args={[30, 8, 0.5]} />
        <meshStandardMaterial color="#2b2f38" roughness={0.85} metalness={0.25} />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[12, 6, 12]} />
        <meshStandardMaterial color="#23252d" roughness={0.92} metalness={0.08} />
      </mesh>
    </group>
  );
}

function CandleCluster() {
  const positions = useMemo(
    () => [
      [-2, 0.75, -4],
      [2.2, 0.75, -6],
      [0.5, 0.75, -9]
    ],
    []
  );

  return (
    <group>
      {positions.map(([x, y, z], index) => (
        <group key={`candle-${index}`} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.6, 12]} />
            <meshStandardMaterial color="#f2e8cf" emissive="#f8d27d" emissiveIntensity={0.3} />
          </mesh>
          <pointLight
            intensity={2.1}
            distance={6}
            decay={2}
            color={index === 2 ? '#b13a3a' : '#f8d27d'}
          />
        </group>
      ))}
    </group>
  );
}

function Atmosphere() {
  const { photosensitivitySafe } = useSettingsStore();

  return (
    <group>
      <ambientLight intensity={photosensitivitySafe ? 0.25 : 0.12} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={photosensitivitySafe ? 0.55 : 0.85}
        color="#8ba3c7"
        castShadow
      />
      <spotLight
        position={[0, 6, 6]}
        angle={0.6}
        penumbra={0.4}
        intensity={photosensitivitySafe ? 1 : 1.5}
        color="#b13a3a"
        distance={18}
        decay={1.8}
        castShadow
      />
    </group>
  );
}

export function Experience() {
  const { motionSafe } = useSettingsStore();

  return (
    <Canvas
      shadows
      frameloop={motionSafe ? 'demand' : 'always'}
      camera={{ position: [0, 1.8, 6], fov: 60, near: 0.1, far: 200 }}
      onPointerDown={() => requestPointerLock()}
    >
      <color attach="background" args={[0.06, 0.07, 0.09]} />
      <fog attach="fog" args={[0x08090c, 8, 30]} />
      <Suspense fallback={null}>
        <Atmosphere />
        <ManorShell />
        <CandleCluster />
        {!motionSafe && <Stars radius={80} depth={40} count={1000} factor={4} fade />}
      </Suspense>
      <FirstPersonController />
    </Canvas>
  );
}
