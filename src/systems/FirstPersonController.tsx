import { useEffect, useRef } from 'react';
import { Vector3, Euler, Quaternion } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

import { useSettingsStore } from '../state/settingsStore';

const direction = new Vector3();
const forward = new Vector3();
const side = new Vector3();
const up = new Vector3(0, 1, 0);

const euler = new Euler(0, 0, 0, 'YXZ');
const quaternion = new Quaternion();

export function FirstPersonController() {
  const { camera } = useThree();
  const motionSafe = useSettingsStore((state) => state.motionSafe);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const velocity = useRef(new Vector3());
  const move = useRef({ forward: false, backward: false, left: false, right: false });

  useEffect(() => {
    camera.position.set(0, 1.8, 6);
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          move.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          move.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          move.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          move.current.right = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          move.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          move.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          move.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          move.current.right = false;
          break;
        default:
          break;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (document.pointerLockElement) {
        const sensitivity = motionSafe ? 0.0015 : 0.0025;
        yaw.current -= event.movementX * sensitivity;
        pitch.current -= event.movementY * sensitivity;
        pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current));
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [motionSafe]);

  useFrame((_, delta) => {
    const moveSpeed = motionSafe ? 1.2 : 2.4;
    const damping = motionSafe ? 8 : 12;

    direction.set(0, 0, 0);
    if (move.current.forward) direction.z -= 1;
    if (move.current.backward) direction.z += 1;
    if (move.current.left) direction.x -= 1;
    if (move.current.right) direction.x += 1;
    direction.normalize();

    forward.set(0, 0, -1).applyAxisAngle(up, yaw.current);
    side.set(1, 0, 0).applyAxisAngle(up, yaw.current);

    velocity.current.x += (direction.x * moveSpeed - velocity.current.x) * Math.min(delta * damping, 1);
    velocity.current.z += (direction.z * moveSpeed - velocity.current.z) * Math.min(delta * damping, 1);

    camera.position.addScaledVector(forward, velocity.current.z * delta);
    camera.position.addScaledVector(side, velocity.current.x * delta);
    camera.position.y = 1.8;

    euler.set(pitch.current, yaw.current, 0);
    quaternion.setFromEuler(euler);
    camera.quaternion.copy(quaternion);
  });

  return null;
}
