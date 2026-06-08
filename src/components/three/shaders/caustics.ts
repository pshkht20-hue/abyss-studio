export const causticsVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const causticsFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float caustic(vec2 p, float t) {
    float c = 0.0;
    c += sin(p.x * 3.1 + t * 0.4) * sin(p.y * 2.7 - t * 0.35);
    c += sin(p.x * 5.3 - t * 0.55) * sin(p.y * 4.1 + t * 0.42) * 0.5;
    c += sin(p.x * 8.7 + t * 0.28) * sin(p.y * 7.2 - t * 0.31) * 0.25;
    return smoothstep(0.1, 1.0, c * 0.5 + 0.5);
  }

  void main() {
    vec2 uv = vUv * 6.0;
    float pattern = caustic(uv, uTime);
    float depth = smoothstep(-30.0, 5.0, vWorldPosition.y);
    vec3 col = mix(uColorA, uColorB, pattern);
    float alpha = pattern * depth * 0.35;
    gl_FragColor = vec4(col, alpha);
  }
`;
