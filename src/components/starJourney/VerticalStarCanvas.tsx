import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, Color, ShaderMaterial, Vector3 } from 'three'
import type { MutableRefObject } from 'react'
import type { Group, LineBasicMaterial, MeshBasicMaterial, Points, PointsMaterial } from 'three'
import type { VerticalStarChapter } from '../../data/verticalStarJourney'
import { easeVerticalStarProgress, verticalStarAccentColors } from '../../data/verticalStarJourney'
import { VerticalComet } from './VerticalComet'
import { VerticalStarTrail } from './VerticalStarTrail'
import { VerticalStarWaypoints } from './VerticalStarWaypoints'
import { buildVerticalJourneyCurve } from './verticalJourneyCurve'
import type { VerticalJourneyCurve } from './verticalJourneyCurve'

type VerticalStarCanvasProps = {
  activeIndex: number
  chapters: VerticalStarChapter[]
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

type VerticalSceneProps = VerticalStarCanvasProps

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296

    return value / 4294967296
  }
}

type PremiumStarLayer = {
  alphas: Float32Array
  colors: Float32Array
  positions: Float32Array
  sizes: Float32Array
  twinkles: Float32Array
}

const starVertexShader = `
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aTwinkle;

  uniform float uTime;
  uniform float uOpacity;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depthScale = 300.0 / max(-mvPosition.z, 0.001);
    float shimmer = 0.84 + sin(uTime * aTwinkle + position.x * 6.17 + position.y * 2.73) * 0.16;

    vAlpha = aAlpha * shimmer * uOpacity;
    vColor = aColor;
    gl_PointSize = aSize * depthScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = `
  precision mediump float;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float radius = length(uv);
    float core = smoothstep(0.18, 0.0, radius);
    float halo = smoothstep(0.5, 0.05, radius) * 0.38;
    float horizontalSpike = smoothstep(0.032, 0.0, abs(uv.y)) * smoothstep(0.48, 0.03, abs(uv.x)) * 0.22;
    float verticalSpike = smoothstep(0.032, 0.0, abs(uv.x)) * smoothstep(0.48, 0.03, abs(uv.y)) * 0.16;
    float alpha = (core + halo + horizontalSpike + verticalSpike) * vAlpha;

    if (alpha < 0.012) {
      discard;
    }

    gl_FragColor = vec4(vColor, alpha);
  }
`

const starPalette = ['#f8fafc', '#dbeafe', '#cffafe', '#d9f99d', '#ffe7b1', '#ddd6fe']

function createPremiumStarLayer({
  compact,
  count,
  seed,
  sizeRange,
  width,
  yDepth,
  zRange,
}: {
  compact: boolean
  count: number
  seed: number
  sizeRange: [number, number]
  width: number
  yDepth: number
  zRange: [number, number]
}) {
  const random = createSeededRandom(seed)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const alphas = new Float32Array(count)
  const twinkles = new Float32Array(count)
  const colors = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const yTravel = random()
    const localCluster = Math.sin(yTravel * Math.PI * 6.2 + random() * Math.PI * 2) * (compact ? 0.2 : 0.46)
    const drift = Math.sin(yTravel * Math.PI * 2.4 + seed * 0.01) * (compact ? 0.26 : 0.62)
    const color = new Color(starPalette[Math.floor(random() * starPalette.length)] ?? '#f8fafc')
    const sizeBias = random() * random()

    positions[index * 3] = (random() - 0.5) * width + localCluster + drift
    positions[index * 3 + 1] = 2.15 - yTravel * yDepth + (random() - 0.5) * 0.42
    positions[index * 3 + 2] = zRange[0] + random() * (zRange[1] - zRange[0])

    sizes[index] = sizeRange[0] + sizeBias * (sizeRange[1] - sizeRange[0])
    alphas[index] = 0.22 + random() * 0.58
    twinkles[index] = 0.42 + random() * 1.7
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  return { alphas, colors, positions, sizes, twinkles }
}

function PremiumStarPoints({
  layer,
  parallax,
  progressRef,
  reducedMotion,
  rotationDrift,
}: {
  layer: PremiumStarLayer
  parallax: number
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
  rotationDrift: number
}) {
  const pointsRef = useRef<Points>(null)
  const material = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      blending: AdditiveBlending,
      depthWrite: false,
      fragmentShader: starFragmentShader,
      transparent: true,
      uniforms: {
        uOpacity: { value: 1 },
        uTime: { value: 0 },
      },
      vertexShader: starVertexShader,
    })

    shaderMaterial.toneMapped = false

    return shaderMaterial
  }, [])

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    const progress = progressRef.current

    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime

    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.position.y = progress * parallax - parallax * 0.34
      pointsRef.current.position.x = Math.sin(progress * Math.PI * 2 + parallax) * parallax * 0.12
      pointsRef.current.rotation.z = Math.sin(progress * Math.PI * 1.2) * rotationDrift
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[layer.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[layer.sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[layer.alphas, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[layer.twinkles, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[layer.colors, 3]} />
      </bufferGeometry>
      <primitive attach="material" object={material} />
    </points>
  )
}

function DecorativeStarField({
  compact,
  progressRef,
  reducedMotion,
}: {
  compact: boolean
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  const farStars = useMemo(
    () =>
      createPremiumStarLayer({
        compact,
        count: compact ? 420 : 1040,
        seed: 304,
        sizeRange: compact ? [0.018, 0.054] : [0.016, 0.062],
        width: compact ? 8.8 : 16.8,
        yDepth: 21.2,
        zRange: [-7.2, -4.2],
      }),
    [compact],
  )
  const midStars = useMemo(
    () =>
      createPremiumStarLayer({
        compact,
        count: compact ? 230 : 560,
        seed: 814,
        sizeRange: compact ? [0.024, 0.074] : [0.024, 0.09],
        width: compact ? 7.4 : 13.2,
        yDepth: 20,
        zRange: [-4.6, -2.4],
      }),
    [compact],
  )
  const brightStars = useMemo(
    () =>
      createPremiumStarLayer({
        compact,
        count: compact ? 76 : 168,
        seed: 1208,
        sizeRange: compact ? [0.042, 0.11] : [0.048, 0.14],
        width: compact ? 6.4 : 10.8,
        yDepth: 18.6,
        zRange: [-2.55, -1.04],
      }),
    [compact],
  )

  return (
    <group>
      <PremiumStarPoints
        layer={farStars}
        parallax={0.24}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        rotationDrift={0.012}
      />
      <PremiumStarPoints
        layer={midStars}
        parallax={0.42}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        rotationDrift={0.022}
      />
      <PremiumStarPoints
        layer={brightStars}
        parallax={0.58}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        rotationDrift={0.032}
      />
    </group>
  )
}

function createDustRibbon(seed: number, count: number, compact: boolean, phase: number) {
  const random = createSeededRandom(seed)
  const values = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const t = random()
    const flow = Math.sin(t * Math.PI * 2.1 + phase) * (compact ? 0.58 : 1.04)
    const counterFlow = Math.sin(t * Math.PI * 5.8 + phase * 0.7) * (compact ? 0.16 : 0.26)
    const spread = (0.18 + random() * 0.92) * (compact ? 0.82 : 1)

    values[index * 3] = flow + counterFlow + (random() - 0.5) * spread
    values[index * 3 + 1] = 1.4 - t * 17.8 + (random() - 0.5) * 0.55
    values[index * 3 + 2] = -4.4 + random() * 2.4
  }

  return values
}

function CosmicDustField({
  compact,
  progressRef,
  reducedMotion,
}: {
  compact: boolean
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<Group>(null)
  const violetRef = useRef<PointsMaterial>(null)
  const amberRef = useRef<PointsMaterial>(null)
  const aquaRibbon = useMemo(
    () => createDustRibbon(1936, compact ? 90 : 180, compact, 0.2),
    [compact],
  )
  const violetRibbon = useMemo(
    () => createDustRibbon(2417, compact ? 70 : 145, compact, 1.72),
    [compact],
  )
  const amberRibbon = useMemo(
    () => createDustRibbon(3608, compact ? 52 : 112, compact, 3.04),
    [compact],
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = progressRef.current

    if (!reducedMotion) {
      groupRef.current.position.x = Math.sin(progress * Math.PI * 1.7) * 0.12
      groupRef.current.position.y = progress * 0.42 - 0.18
      groupRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.028

      if (violetRef.current) {
        violetRef.current.opacity = 0.17 + Math.sin(state.clock.elapsedTime * 0.45) * 0.032
      }

      if (amberRef.current) {
        amberRef.current.opacity = 0.12 + Math.cos(state.clock.elapsedTime * 0.38) * 0.024
      }
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[aquaRibbon, 3]} />
        </bufferGeometry>
        <pointsMaterial
          blending={AdditiveBlending}
          color="#67e8f9"
          depthWrite={false}
          opacity={compact ? 0.16 : 0.21}
          size={compact ? 0.04 : 0.048}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[violetRibbon, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={violetRef}
          blending={AdditiveBlending}
          color="#b27fff"
          depthWrite={false}
          opacity={compact ? 0.13 : 0.17}
          size={compact ? 0.034 : 0.042}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[amberRibbon, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={amberRef}
          blending={AdditiveBlending}
          color="#ffb84d"
          depthWrite={false}
          opacity={compact ? 0.095 : 0.12}
          size={compact ? 0.029 : 0.036}
          sizeAttenuation
          transparent
        />
      </points>
    </group>
  )
}

function createNebulaCluster(seed: number, compact: boolean, count: number, centers: SpacePoint[]) {
  const random = createSeededRandom(seed)
  const values = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const center = centers[Math.floor(random() * centers.length)] ?? [0, 0, -3]
    const softX = (random() + random() + random() - 1.5) * (compact ? 0.72 : 1.06)
    const softY = (random() + random() + random() - 1.5) * (compact ? 0.55 : 0.78)
    const orbit = random() * Math.PI * 2
    const ring = random() * random() * (compact ? 0.46 : 0.72)

    values[index * 3] = center[0] + softX + Math.cos(orbit) * ring
    values[index * 3 + 1] = center[1] + softY + Math.sin(orbit) * ring * 0.42
    values[index * 3 + 2] = center[2] + (random() - 0.5) * 1.5
  }

  return values
}

function NebulaClusterField({
  compact,
  progressRef,
  reducedMotion,
}: {
  compact: boolean
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<Group>(null)
  const aquaRef = useRef<PointsMaterial>(null)
  const violetRef = useRef<PointsMaterial>(null)
  const amberRef = useRef<PointsMaterial>(null)
  const aquaCloud = useMemo(
    () =>
      createNebulaCluster(7001, compact, compact ? 92 : 190, [
        [-1.72, -1.1, -3.4],
        [1.48, -6.76, -3.2],
        [-0.74, -12.62, -3.5],
      ]),
    [compact],
  )
  const violetCloud = useMemo(
    () =>
      createNebulaCluster(8144, compact, compact ? 86 : 176, [
        [1.32, -3.06, -3.1],
        [-1.62, -8.86, -3.4],
        [1.26, -14.2, -3.2],
      ]),
    [compact],
  )
  const amberCloud = useMemo(
    () =>
      createNebulaCluster(9281, compact, compact ? 58 : 124, [
        [0.2, -4.7, -3.05],
        [1.86, -10.98, -3.35],
      ]),
    [compact],
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = progressRef.current

    if (!reducedMotion) {
      groupRef.current.position.x = Math.sin(progress * Math.PI * 1.2) * 0.09
      groupRef.current.position.y = progress * 0.34 - 0.16
      groupRef.current.rotation.z = Math.sin(progress * Math.PI * 0.7) * 0.018

      if (aquaRef.current) {
        aquaRef.current.opacity = 0.14 + Math.sin(state.clock.elapsedTime * 0.32) * 0.018
      }

      if (violetRef.current) {
        violetRef.current.opacity = 0.12 + Math.cos(state.clock.elapsedTime * 0.28) * 0.016
      }

      if (amberRef.current) {
        amberRef.current.opacity = 0.085 + Math.sin(state.clock.elapsedTime * 0.24) * 0.012
      }
    }
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[aquaCloud, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={aquaRef}
          blending={AdditiveBlending}
          color="#67e8f9"
          depthWrite={false}
          opacity={compact ? 0.11 : 0.14}
          size={compact ? 0.05 : 0.062}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[violetCloud, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={violetRef}
          blending={AdditiveBlending}
          color="#b27fff"
          depthWrite={false}
          opacity={compact ? 0.095 : 0.12}
          size={compact ? 0.047 : 0.06}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[amberCloud, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={amberRef}
          blending={AdditiveBlending}
          color="#ffb84d"
          depthWrite={false}
          opacity={compact ? 0.07 : 0.085}
          size={compact ? 0.042 : 0.054}
          sizeAttenuation
          transparent
        />
      </points>
    </group>
  )
}

function getProgressWindowStrength(progress: number, start: number, end: number) {
  if (progress < start || progress > end) {
    return 0
  }

  const localProgress = (progress - start) / Math.max(end - start, 0.001)

  return Math.sin(localProgress * Math.PI)
}

function lerpNumber(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

type SpacePoint = [number, number, number]

type SpaceMeteorProps = {
  color: string
  compact: boolean
  end: number
  from: SpacePoint
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
  start: number
  to: SpacePoint
}

function SpaceMeteor({
  color,
  compact,
  end,
  from,
  progressRef,
  reducedMotion,
  start,
  to,
}: SpaceMeteorProps) {
  const groupRef = useRef<Group>(null)
  const coreRef = useRef<MeshBasicMaterial>(null)
  const tailRef = useRef<LineBasicMaterial>(null)
  const sparkRef = useRef<PointsMaterial>(null)
  const angle = useMemo(() => Math.atan2(to[1] - from[1], to[0] - from[0]), [from, to])
  const meteorTrail = useMemo(
    () =>
      new Float32Array([
        -0.86, 0, 0, 0.04, 0, 0,
        -0.7, 0.045, 0.01, -0.12, 0.012, 0.01,
        -0.62, -0.045, -0.01, -0.08, -0.012, -0.01,
      ]),
    [],
  )
  const meteorSparks = useMemo(() => {
    const values = new Float32Array((compact ? 9 : 16) * 3)

    for (let index = 0; index < values.length / 3; index += 1) {
      const drift = index / Math.max(values.length / 3 - 1, 1)

      values[index * 3] = -0.16 - drift * 0.62 + Math.sin(index * 1.6) * 0.035
      values[index * 3 + 1] = Math.cos(index * 1.3) * 0.035
      values[index * 3 + 2] = Math.sin(index * 2.1) * 0.024
    }

    return values
  }, [compact])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = progressRef.current
    const strength = reducedMotion ? 0 : getProgressWindowStrength(progress, start, end)

    groupRef.current.visible = strength > 0.02

    if (strength <= 0.02) {
      return
    }

    const localProgress = (progress - start) / Math.max(end - start, 0.001)
    const shimmer = Math.sin(state.clock.elapsedTime * 2.8) * 0.04

    groupRef.current.position.set(
      lerpNumber(from[0], to[0], localProgress),
      lerpNumber(from[1], to[1], localProgress),
      lerpNumber(from[2], to[2], localProgress),
    )
    groupRef.current.rotation.z = angle
    groupRef.current.scale.setScalar((compact ? 0.72 : 1) * (0.58 + strength * 0.5))

    if (coreRef.current) {
      coreRef.current.opacity = 0.18 + strength * 0.62
    }

    if (tailRef.current) {
      tailRef.current.opacity = 0.08 + strength * (0.34 + shimmer)
    }

    if (sparkRef.current) {
      sparkRef.current.opacity = 0.12 + strength * 0.42
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh>
        <sphereGeometry args={[0.035, 16, 10]} />
        <meshBasicMaterial
          ref={coreRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0}
          transparent
          toneMapped={false}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[meteorTrail, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={tailRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0}
          transparent
          toneMapped={false}
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[meteorSparks, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={sparkRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0}
          size={compact ? 0.024 : 0.032}
          sizeAttenuation
          transparent
        />
      </points>
    </group>
  )
}

function DistantSpacecraft({
  compact,
  progressRef,
  reducedMotion,
}: {
  compact: boolean
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  const groupRef = useRef<Group>(null)
  const bodyRef = useRef<MeshBasicMaterial>(null)
  const wingRef = useRef<MeshBasicMaterial>(null)
  const secondWingRef = useRef<MeshBasicMaterial>(null)
  const lightRef = useRef<MeshBasicMaterial>(null)

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = progressRef.current
    const strength = reducedMotion ? 0 : getProgressWindowStrength(progress, 0.52, 0.68)

    groupRef.current.visible = strength > 0.025

    if (strength <= 0.025) {
      return
    }

    const localProgress = (progress - 0.52) / 0.16
    const float = Math.sin(state.clock.elapsedTime * 0.9) * 0.055

    groupRef.current.position.set(
      lerpNumber(2.75, 1.15, localProgress),
      lerpNumber(-8.28, -9.08, localProgress) + float,
      -0.82,
    )
    groupRef.current.rotation.z = -0.34 + Math.sin(state.clock.elapsedTime * 0.5) * 0.035
    groupRef.current.scale.setScalar((compact ? 0.76 : 1.05) * (0.72 + strength * 0.22))

    if (bodyRef.current) {
      bodyRef.current.opacity = 0.16 + strength * 0.42
    }

    if (wingRef.current) {
      wingRef.current.opacity = 0.1 + strength * 0.3
    }

    if (secondWingRef.current) {
      secondWingRef.current.opacity = 0.075 + strength * 0.22
    }

    if (lightRef.current) {
      lightRef.current.opacity = 0.28 + strength * 0.58
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[0, 0, -0.34]} scale={[0.16, 0.052, 0.028]}>
        <sphereGeometry args={[1, 18, 10]} />
        <meshBasicMaterial
          ref={bodyRef}
          blending={AdditiveBlending}
          color="#dbeafe"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh position={[-0.07, -0.034, 0]} rotation={[0, 0, -0.58]} scale={[0.12, 0.022, 0.012]}>
        <sphereGeometry args={[1, 14, 8]} />
        <meshBasicMaterial
          ref={wingRef}
          blending={AdditiveBlending}
          color="#b27fff"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh position={[-0.06, 0.034, 0]} rotation={[0, 0, 0.46]} scale={[0.1, 0.018, 0.012]}>
        <sphereGeometry args={[1, 14, 8]} />
        <meshBasicMaterial
          ref={secondWingRef}
          blending={AdditiveBlending}
          color="#67e8f9"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh position={[0.11, 0, 0.01]}>
        <sphereGeometry args={[0.016, 10, 8]} />
        <meshBasicMaterial
          ref={lightRef}
          blending={AdditiveBlending}
          color="#67e8f9"
          depthWrite={false}
          opacity={0}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function SpaceDetails({
  compact,
  progressRef,
  reducedMotion,
}: {
  compact: boolean
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  return (
    <group>
      <SpaceMeteor
        color="#67e8f9"
        compact={compact}
        end={0.36}
        from={[-3.25, -3.46, -0.06]}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        start={0.2}
        to={[0.92, -5.08, 0.04]}
      />
      <DistantSpacecraft compact={compact} progressRef={progressRef} reducedMotion={reducedMotion} />
      <SpaceMeteor
        color="#ffb84d"
        compact={compact}
        end={0.86}
        from={[3.28, -11.42, -0.08]}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        start={0.72}
        to={[-2.68, -13.22, 0.08]}
      />
    </group>
  )
}

function VerticalCameraRig({
  chapterCount,
  curve,
  progressRef,
  reducedMotion,
}: {
  chapterCount: number
  curve: VerticalJourneyCurve
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}) {
  const { camera } = useThree()
  const cometPosition = useMemo(() => new Vector3(), [])
  const targetPosition = useMemo(() => new Vector3(0, 0, 8.2), [])
  const lookTarget = useMemo(() => new Vector3(), [])

  useFrame(() => {
    const rawProgress = progressRef.current
    const journeyProgress = reducedMotion
      ? rawProgress
      : easeVerticalStarProgress(rawProgress, chapterCount)

    curve.getPoint(journeyProgress, cometPosition)

    if (reducedMotion) {
      targetPosition.set(cometPosition.x * 0.08, cometPosition.y + 0.02, 8.55)
      lookTarget.set(cometPosition.x * 0.3, cometPosition.y + 0.04, 0)
      camera.position.lerp(targetPosition, 0.08)
      camera.lookAt(lookTarget)
      return
    }

    targetPosition.set(
      cometPosition.x * 0.18,
      cometPosition.y + 0.02,
      8.1 + Math.sin(rawProgress * Math.PI) * 0.18,
    )
    lookTarget.set(cometPosition.x * 0.46, cometPosition.y - 0.02, cometPosition.z * 0.16)

    camera.position.lerp(targetPosition, 0.045)
    camera.lookAt(lookTarget)
  })

  return null
}

function VerticalScene({
  activeIndex,
  chapters,
  progressRef,
  reducedMotion,
}: VerticalSceneProps) {
  const { size } = useThree()
  const compact = size.width < 860
  const sceneScale = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1)

    return {
      x: aspect < 0.72 ? 0.92 : aspect < 1.08 ? 1.38 : 1.95,
      y: 1,
      z: 0.82,
    }
  }, [size.height, size.width])
  const waypointPoints = useMemo(
    () =>
      chapters.map(
        (chapter) =>
          new Vector3(
            chapter.position[0] * sceneScale.x,
            chapter.position[1] * sceneScale.y,
            chapter.position[2] * sceneScale.z,
          ),
      ),
    [chapters, sceneScale.x, sceneScale.y, sceneScale.z],
  )
  const curve = useMemo(() => buildVerticalJourneyCurve(waypointPoints), [waypointPoints])
  const activeChapter = chapters[activeIndex] ?? chapters[0]
  const accentColor = verticalStarAccentColors[activeChapter.accent]

  return (
    <>
      <VerticalCameraRig
        chapterCount={chapters.length}
        curve={curve}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
      <DecorativeStarField compact={compact} progressRef={progressRef} reducedMotion={reducedMotion} />
      <CosmicDustField compact={compact} progressRef={progressRef} reducedMotion={reducedMotion} />
      <NebulaClusterField compact={compact} progressRef={progressRef} reducedMotion={reducedMotion} />
      <SpaceDetails compact={compact} progressRef={progressRef} reducedMotion={reducedMotion} />
      <VerticalStarTrail
        accentColor={accentColor}
        chapterCount={chapters.length}
        curve={curve}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
      <VerticalStarWaypoints
        chapterCount={chapters.length}
        chapters={chapters}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
        waypointPoints={waypointPoints}
      />
      <VerticalComet
        accentColor={accentColor}
        chapterCount={chapters.length}
        curve={curve}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </>
  )
}

export function VerticalStarCanvas({
  activeIndex,
  chapters,
  progressRef,
  reducedMotion,
}: VerticalStarCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.25], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#02040a', 8, 15]} />
      <ambientLight intensity={0.3} />
      <pointLight color="#67e8f9" intensity={0.48} position={[-1.8, 2.4, 2.8]} />
      <pointLight color="#b27fff" intensity={0.38} position={[2.2, -2.2, 2.5]} />
      <VerticalScene
        activeIndex={activeIndex}
        chapters={chapters}
        progressRef={progressRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  )
}
