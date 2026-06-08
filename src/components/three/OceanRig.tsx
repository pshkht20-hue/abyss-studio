"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { inHeroPhase, jawFocus } from "@/lib/cinematic-beats";
import { scrollStore } from "@/lib/scroll-store";
import {
  DIVE_CAMERA_KEYS,
  HERO_CAMERA_KEYS,
  lerpCamera,
  siteProgress,
} from "@/lib/scroll-timeline";
import { sharkStore } from "@/lib/shark-store";

const _camPos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _lookMatrix = new THREE.Matrix4();
const _jawOffset = new THREE.Vector3();

export function OceanRig() {
  const { camera } = useThree();
  const smoothedPos = useRef(new THREE.Vector3(-1.2, 0.42, 9.5));
  const smoothedQuat = useRef(new THREE.Quaternion());
  const initialized = useRef(false);

  useFrame((_, delta) => {
    const heroT = scrollStore.heroLocal;
    const damp = 1 - Math.exp(-10 * delta);

    if (inHeroPhase()) {
      const { pos, look, fov } = lerpCamera(HERO_CAMERA_KEYS, heroT);
      _camPos.set(pos[0], pos[1], pos[2]);
      _targetLook.set(look[0], look[1], look[2]);

      const focus = jawFocus();
      if (focus > 0.5 && sharkStore.jaw.lengthSq() > 0.01) {
        _jawOffset.copy(sharkStore.jaw);
        _look.lerpVectors(_targetLook, _jawOffset, (focus - 0.5) * 0.35);
      } else {
        _look.copy(_targetLook);
      }

      if (camera instanceof THREE.PerspectiveCamera) {
        const jawFov = THREE.MathUtils.lerp(fov, fov - 2, focus);
        camera.fov = THREE.MathUtils.lerp(camera.fov, jawFov, damp);
        camera.updateProjectionMatrix();
      }
    } else {
      const { pos, look, fov } = lerpCamera(DIVE_CAMERA_KEYS, siteProgress());
      _camPos.set(pos[0], pos[1], pos[2]);
      _look.set(look[0], look[1], look[2]);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, fov, damp);
        camera.updateProjectionMatrix();
      }
    }

    if (!initialized.current) {
      smoothedPos.current.copy(_camPos);
      _lookMatrix.lookAt(_camPos, _look, _up);
      smoothedQuat.current.setFromRotationMatrix(_lookMatrix);
      initialized.current = true;
    }

    smoothedPos.current.lerp(_camPos, damp);

    _lookMatrix.lookAt(smoothedPos.current, _look, _up);
    _quat.setFromRotationMatrix(_lookMatrix);
    smoothedQuat.current.slerp(_quat, damp);

    camera.position.copy(smoothedPos.current);
    camera.quaternion.copy(smoothedQuat.current);
  }, 2);

  return null;
}
