export const cosmicParticleVertexShader = `
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute float aLife;
  attribute float aPhase;
  attribute float aSize;
  attribute float aTurbulence;

  uniform float uArrival;
  uniform float uOpacity;
  uniform float uTime;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 animatedPosition = position;
    float plasma = sin(uTime * (0.7 + aTurbulence * 2.1) + aPhase + position.y * 3.6);
    float crossFlow = cos(uTime * (0.52 + aTurbulence * 1.4) + aPhase * 1.7 + position.x * 5.2);

    animatedPosition.x += plasma * aTurbulence * (0.18 + aLife * 0.72);
    animatedPosition.z += crossFlow * aTurbulence * (0.12 + aLife * 0.44);
    animatedPosition.y += sin(uTime * 0.32 + aPhase) * aTurbulence * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    float depthScale = 280.0 / max(-mvPosition.z, 0.001);
    float shimmer = 0.78 + sin(uTime * (1.2 + aTurbulence * 4.0) + aPhase) * 0.22;
    float arrivalScale = 1.0 + uArrival * 0.3;

    gl_PointSize = aSize * depthScale * arrivalScale;
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = aAlpha * shimmer * uOpacity;
    vColor = aColor;
  }
`

export const cosmicParticleFragmentShader = `
  precision mediump float;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float radius = length(uv);
    float core = smoothstep(0.18, 0.0, radius);
    float aureole = smoothstep(0.5, 0.02, radius) * 0.36;
    float granularEdge = smoothstep(0.48, 0.22, radius) * smoothstep(0.0, 0.28, radius) * 0.12;
    float alpha = (core + aureole + granularEdge) * vAlpha;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(vColor, alpha);
  }
`
