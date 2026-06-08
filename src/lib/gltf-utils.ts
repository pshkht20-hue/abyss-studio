import * as THREE from "three";
import { cloneSkinnedGraph } from "./clone-skinned";

type LengthAxis = "x" | "y" | "z" | "max";

export function normalizeToLength(
  root: THREE.Object3D,
  targetLength: number,
  axis: LengthAxis = "max",
) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);

  const length =
    axis === "x" ? size.x : axis === "y" ? size.y : axis === "z" ? size.z : Math.max(size.x, size.y, size.z);

  return targetLength / Math.max(length, 0.001);
}

export function prepareModel(
  scene: THREE.Object3D,
  targetLength?: number,
  axis: LengthAxis = "max",
) {
  const clone = cloneSkinnedGraph(scene);
  const scale = targetLength ? normalizeToLength(clone, targetLength, axis) : 1;
  return { model: clone, scale };
}

export function enhanceOceanMaterial(root: THREE.Object3D, tint?: string) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const upgrade = (mat: THREE.Material) => {
      const next = mat.clone();
      if (tint && "color" in next && next.color instanceof THREE.Color) {
        next.color.lerp(new THREE.Color(tint), 0.08);
      }
      if ("metalness" in next) {
        const std = next as THREE.MeshStandardMaterial;
        std.metalness = 0.25;
        std.roughness = 0.42;
        std.envMapIntensity = 1.4;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return next;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(upgrade)
      : upgrade(mesh.material);
  });
}

/** Shark hero — wet PBR skin with clearcoat + env reflections */
export function enhanceSharkMaterial(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const upgrade = (mat: THREE.Material) => {
      const next = mat.clone();
      if ("color" in next && next.color instanceof THREE.Color) {
        next.color.set("#4d7280");
      }
      if ("metalness" in next) {
        const std = next as THREE.MeshPhysicalMaterial;
        std.metalness = 0.42;
        std.roughness = 0.26;
        std.clearcoat = 0.92;
        std.clearcoatRoughness = 0.1;
        std.envMapIntensity = 2.2;
        std.emissive = new THREE.Color("#102830");
        std.emissiveIntensity = 0.06;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      return next;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(upgrade)
      : upgrade(mesh.material);
  });
}

export function pickAnimation(
  actions: Record<string, THREE.AnimationAction | null>,
  patterns: (string | RegExp)[],
) {
  const entries = Object.entries(actions).filter(([, a]) => a);
  for (const pattern of patterns) {
    const hit = entries.find(([name]) =>
      typeof pattern === "string"
        ? name.endsWith(pattern) || name.includes(pattern)
        : pattern.test(name),
    );
    if (hit) return hit[1];
  }
  return entries[0]?.[1] ?? null;
}

export function findBone(root: THREE.Object3D, names: string[]) {
  let bone: THREE.Bone | null = null;
  root.traverse((obj) => {
    if (bone) return;
    if ((obj as THREE.Bone).isBone && names.some((n) => obj.name.includes(n))) {
      bone = obj as THREE.Bone;
    }
  });
  return bone;
}
