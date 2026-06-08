import * as THREE from "three";

/** Predator profile — x = radius, y = length along body (snout + tail) */
const BODY_PROFILE: [number, number][] = [
  [0.0, -2.6],
  [0.05, -2.35],
  [0.12, -2.0],
  [0.22, -1.45],
  [0.36, -0.75],
  [0.48, -0.05],
  [0.54, 0.55],
  [0.52, 1.1],
  [0.44, 1.55],
  [0.3, 1.9],
  [0.14, 2.15],
  [0.05, 2.28],
  [0.0, 2.35],
];

export function createSharkBodyGeometry() {
  const points = BODY_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(points, 64);
  geo.computeVertexNormals();
  return geo;
}

export function createBellyGeometry() {
  const points: THREE.Vector2[] = [];
  for (const [x, y] of BODY_PROFILE) {
    if (y > -2.0 && y < 2.0) {
      points.push(new THREE.Vector2(x * 0.68, y));
    }
  }
  const geo = new THREE.LatheGeometry(points, 40, 0, Math.PI);
  geo.computeVertexNormals();
  return geo;
}

export function createPectoralFinGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.55, -0.08, 0.95, -0.55);
  shape.quadraticCurveTo(0.45, -0.35, 0, -0.15);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    steps: 1,
  });
  geo.center();
  return geo;
}

export function createDorsalFinGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.18, 0.72);
  shape.lineTo(0.38, 0.05);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    steps: 1,
  });
  geo.center();
  return geo;
}

export function createTailLobeGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.7, 0.2, 1.05, 0.65);
  shape.quadraticCurveTo(0.4, 0.28, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04,
    bevelEnabled: false,
    steps: 1,
  });
  geo.center();
  return geo;
}

export function createSharkMaterials() {
  const skin = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#0c1e28"),
    emissive: new THREE.Color("#0a3040"),
    emissiveIntensity: 0.08,
    metalness: 0.55,
    roughness: 0.32,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
  });

  const belly = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a3540"),
    metalness: 0.2,
    roughness: 0.48,
    clearcoat: 0.4,
  });

  const fin = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#081820"),
    metalness: 0.4,
    roughness: 0.38,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });

  const eye = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#020608"),
    emissive: new THREE.Color("#00c8b0"),
    emissiveIntensity: 0.25,
    metalness: 0.8,
    roughness: 0.15,
  });

  const pupil = new THREE.MeshBasicMaterial({ color: "#000000" });

  return { skin, belly, fin, eye, pupil };
}
