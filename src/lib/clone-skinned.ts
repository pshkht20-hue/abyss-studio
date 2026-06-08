import * as THREE from "three";

/** Proper clone for rigged GLTF — scene.clone(true) breaks skinned meshes */
export function cloneSkinnedGraph(root: THREE.Object3D): THREE.Object3D {
  const clone = root.clone(true);

  clone.traverse((node) => {
    const skinned = node as THREE.SkinnedMesh;
    if (!skinned.isSkinnedMesh) return;

    const skeleton = skinned.skeleton.clone();
    const bindMatrix = skinned.bindMatrix.clone();
    skinned.bind(skeleton, bindMatrix);
  });

  return clone;
}
