export const sharkSkinVertex = /* glsl */ `

  varying vec3 vNormal;

  varying vec3 vViewPosition;

  varying vec2 vUv;

  varying vec3 vWorldNormal;

  void main() {

    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vViewPosition = -mvPosition.xyz;

    vNormal = normalize(normalMatrix * normal);

    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    gl_Position = projectionMatrix * mvPosition;

  }

`;



export const sharkSkinFragment = /* glsl */ `

  uniform vec3 uColor;

  uniform vec3 uRimColor;

  uniform float uTime;

  varying vec3 vNormal;

  varying vec3 vViewPosition;

  varying vec2 vUv;

  varying vec3 vWorldNormal;



  float hash(vec2 p) {

    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);

  }



  float denticles(vec2 uv) {

    vec2 grid = fract(uv * vec2(28.0, 14.0)) - 0.5;

    float d = length(grid);

    return smoothstep(0.42, 0.18, d);

  }



  void main() {

    vec3 viewDir = normalize(vViewPosition);

    float NdotV = max(dot(viewDir, vNormal), 0.0);

    float fresnel = pow(1.0 - NdotV, 2.4);



    float grain = hash(vUv * 80.0 + uTime * 0.03) * 0.05;

    float scales = denticles(vUv + uTime * 0.008) * 0.08;



    vec3 base = uColor * (0.92 + scales) + grain;

    vec3 col = mix(base, uRimColor, fresnel * 0.82);



    vec3 lightDir = normalize(vec3(0.4, 0.9, 0.35));

    float spec = pow(max(dot(reflect(-viewDir, vNormal), lightDir), 0.0), 48.0);

    col += vec3(0.7, 0.9, 1.0) * spec * 0.35;



    col += uRimColor * fresnel * 0.12;

    gl_FragColor = vec4(col, 1.0);

  }

`;

