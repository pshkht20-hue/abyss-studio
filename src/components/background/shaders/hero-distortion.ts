export const HERO_DISTORTION_VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const HERO_DISTORTION_FRAGMENT = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uMorph;
uniform float uScene;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t) {
  vec3 helix = vec3(0.91, 0.36, 0.13);
  vec3 arsenal = vec3(0.20, 0.62, 0.96);
  vec3 proof = vec3(0.56, 0.22, 0.86);
  vec3 timeline = vec3(0.16, 0.72, 0.80);
  vec3 vault = vec3(0.95, 0.78, 0.32);

  float s = clamp(uScene, 0.0, 4.0);
  if (s < 1.0) return mix(helix, arsenal, smoothstep(0.0, 1.0, s));
  if (s < 2.0) return mix(arsenal, proof, smoothstep(1.0, 2.0, s));
  if (s < 3.0) return mix(proof, timeline, smoothstep(2.0, 3.0, s));
  return mix(timeline, vault, smoothstep(3.0, 4.0, s));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  vec2 pull = (uMouse - 0.5) * 0.35;
  float freq = 2.2 + uMorph * 0.8;
  float t = uTime * (0.08 + uScroll * 0.10);
  vec2 q = p * freq + pull * (0.35 + uScroll * 0.4);
  float n1 = fbm(q + vec2(t * 0.4, -t * 0.25));
  float n2 = fbm(q * 1.8 + vec2(-t * 0.9, t * 0.5) + n1 * (1.0 + uMorph));
  float field = smoothstep(0.30 - uMorph * 0.10, 0.95, n2);

  vec3 accent = palette(uScene);
  vec3 col = mix(vec3(0.03, 0.04, 0.08), accent, field * 0.55);
  col += accent * field * 0.22;

  float vign = 1.0 - dot(p * 0.85, p * 0.85);
  float bottomFade = smoothstep(0.0, 0.35, uv.y);
  float alpha = field * vign * bottomFade * (0.42 + uScroll * 0.18);

  gl_FragColor = vec4(col, alpha);
}
`;
