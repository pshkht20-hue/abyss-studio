export const underwaterEnvVertex = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const underwaterEnvFragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  float caustic(vec3 p, float t) {
    float c = 0.0;
    c += sin(p.x * 1.4 + t * 0.32) * sin(p.z * 1.2 - t * 0.26);
    c += sin(p.x * 2.8 - t * 0.38) * sin(p.z * 2.4 + t * 0.3) * 0.4;
    return smoothstep(0.06, 0.88, c * 0.5 + 0.5);
  }

  void main() {
    float depth = smoothstep(-1.0, 16.0, -vWorldPosition.y);
    float dive = smoothstep(0.0, 1.0, uProgress);

    vec3 surface = vec3(0.48, 0.8, 0.94);
    vec3 mid     = vec3(0.18, 0.48, 0.64);
    vec3 abyss   = vec3(0.04, 0.14, 0.26);

    vec3 col = mix(surface, mix(mid, abyss, depth), dive * 0.6 + depth * 0.18);

    float c = caustic(vWorldPosition, uTime);
    col += vec3(0.4, 0.68, 0.82) * c * (1.0 - dive * 0.65) * (1.0 - depth * 0.3) * 0.22;

    float sun = pow(max(dot(normalize(vNormal), vec3(0.08, 1.0, 0.22)), 0.0), 2.8);
    col += vec3(0.65, 0.82, 0.92) * sun * (1.0 - dive * 0.45) * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`;
