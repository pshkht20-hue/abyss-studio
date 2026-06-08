import * as THREE from "three";

const _head = new THREE.Vector3(1.8, 0.1, 0.4);
const _jaw = new THREE.Vector3(2.0, -0.05, 0.5);
const _body = new THREE.Vector3(0.5, 0.1, 0);

export const sharkStore = {
  head: _head,
  jaw: _jaw,
  body: _body,

  setHead(x: number, y: number, z: number) {
    _head.set(x, y, z);
  },

  setJaw(x: number, y: number, z: number) {
    _jaw.set(x, y, z);
  },

  setBody(x: number, y: number, z: number) {
    _body.set(x, y, z);
  },
};
