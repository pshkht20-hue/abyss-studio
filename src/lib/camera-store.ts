import * as THREE from "three";

const cameraPos = new THREE.Vector3(1.6, 0.2, 2.6);
const cameraLook = new THREE.Vector3(0, 0, 0);

export const cameraStore = {
  position: cameraPos,
  lookAt: cameraLook,
  setPosition(x: number, y: number, z: number) {
    cameraPos.set(x, y, z);
  },
  setLookAt(x: number, y: number, z: number) {
    cameraLook.set(x, y, z);
  },
};
