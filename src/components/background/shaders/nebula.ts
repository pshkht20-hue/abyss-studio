export const NEBULA_VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const NEBULA_FRAGMENT = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uVelocity;
uniform vec3 uPrimary;
uniform vec3 uSecondary;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.45), sin(0.45), -sin(0.45), cos(0.45));
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p = rot * p * 2.02 + vec2(17.0, 9.0);
    a *= 0.5;
  }
  return v;
}

float hexDist(vec2 p) {
  p = abs(p);
  float c = dot(p, normalize(vec2(1.0, 1.7320508)));
  return max(c, p.x);
}

float hexGrid(vec2 uv, float scale) {
  vec2 grid = uv * scale;
  vec2 hex = vec2(grid.x + grid.y * 0.5, grid.y * 0.8660254);
  vec2 id = floor(hex);
  vec2 f = fract(hex);
  float d = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = f - neighbor - vec2(0.5 * mod(id.y + float(y), 2.0), 0.0);
      d = min(d, hexDist(point));
    }
  }
  return smoothstep(0.0, 0.04, d) - smoothstep(0.04, 0.07, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  vec2 pointer = (uPointer - 0.5) * vec2(1.6, 1.2);
  float t = uTime * 0.14;

  vec2 warp = vec2(
    fbm(p * 1.4 + vec2(t, uScroll * 2.0)),
    fbm(p * 1.4 + vec2(5.2, t * 0.8) + uScroll)
  );
  vec2 q = p + warp * 0.38 + pointer * 0.12;

  float field = fbm(q * 2.1 + vec2(t * 0.6, -t * 0.4));
  float field2 = fbm(q * 3.2 + vec2(-t * 0.3, t * 0.5) + uScroll * 1.5);
  float plasma = smoothstep(-0.15, 0.85, field) * smoothstep(-0.1, 0.7, field2);

  float hex = hexGrid(p + warp * 0.15, 9.0 + uScroll * 2.0);
  float hexPulse = hex * (0.35 + 0.25 * sin(t * 2.0 + field * 6.0));

  float beam = smoothstep(0.48, 0.5, abs(sin(p.y * 3.0 + t * 1.8 + field * 2.0))) * 0.12;
  float scan = smoothstep(0.0, 0.02, abs(fract(p.y * 0.5 - t * 0.15 + uScroll) - 0.5)) * 0.08;

  vec3 col = mix(uSecondary * 0.15, uPrimary * 0.22, plasma);
  col += uPrimary * hexPulse * 0.45;
  col += uSecondary * beam * (1.0 + uVelocity * 2.0);
  col += mix(uPrimary, uSecondary, 0.5) * scan;

  float vignette = smoothstep(1.15, 0.25, length(p));
  col *= vignette;

  float alpha = (plasma * 0.38 + hexPulse * 0.22 + beam * 0.6 + scan * 0.5) * 0.55;
  alpha = clamp(alpha, 0.0, 0.62);

  gl_FragColor = vec4(col, alpha);
}
`;
