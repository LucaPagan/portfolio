import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'
import type { BufferGeometry } from 'three'
import type { MutableRefObject } from 'react'
import { easeVerticalStarProgress } from '../../data/verticalStarJourney'
import { cosmicParticleFragmentShader, cosmicParticleVertexShader } from './particleShaders'
import type { VerticalJourneyCurve } from './verticalJourneyCurve'

type CosmicTrailProps = {
  accentColor: string
  chapterCount: number
  compact: boolean
  curve: VerticalJourneyCurve
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

type TrailCloud = {
  alphas: Float32Array
  colors: Float32Array
  life: Float32Array
  phases: Float32Array
  positions: Float32Array
  samples: number
  sizes: Float32Array
  stride: number
  turbulence: Float32Array
}

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296

    return value / 4294967296
  }
}

function createTrailMaterial(opacity: number) {
  const material = new ShaderMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    fragmentShader: cosmicParticleFragmentShader,
    transparent: true,
    uniforms: {
      uArrival: { value: 0 },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
    },
    vertexShader: cosmicParticleVertexShader,
  })

  material.toneMapped = false

  return material
}

function createTrailCloud({
  accentColor,
  compact,
  density,
  mode,
  reducedMotion,
  samples,
  seed,
  curve,
}: {
  accentColor: string
  compact: boolean
  curve: VerticalJourneyCurve
  density: number
  mode: 'route' | 'plasma' | 'spark'
  reducedMotion: boolean
  samples: number
  seed: number
}): TrailCloud {
  const random = createSeededRandom(seed)
  const stride = reducedMotion ? Math.max(1, density - 1) : density
  const count = samples * stride
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const alphas = new Float32Array(count)
  const life = new Float32Array(count)
  const phases = new Float32Array(count)
  const sizes = new Float32Array(count)
  const turbulence = new Float32Array(count)
  const accent = new Color(accentColor)
  const warm = new Color('#ffe8a3')
  const cyan = new Color('#9af5ff')
  const white = new Color('#fffdf1')
  const points = curve.getPoints(samples - 1)

  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex += 1) {
    const point = points[sampleIndex] ?? points[0]
    const t = sampleIndex / Math.max(samples - 1, 1)

    for (let lane = 0; lane < stride; lane += 1) {
      const index = sampleIndex * stride + lane
      const lanePhase = random() * Math.PI * 2
      const pathNoise = Math.sin(t * Math.PI * 10.8 + lanePhase) * (compact ? 0.018 : 0.028)
      const scatterBase =
        mode === 'route'
          ? compact
            ? 0.014
            : 0.02
          : mode === 'plasma'
            ? compact
              ? 0.04
              : 0.055
            : compact
              ? 0.075
              : 0.11
      const scatter = scatterBase * (0.45 + random() * 1.25)
      const angle = lanePhase + t * Math.PI * 3.4
      const color = accent
        .clone()
        .lerp(cyan, random() * (mode === 'route' ? 0.16 : 0.34))
        .lerp(warm, Math.max(0, 0.36 - Math.abs(0.5 - t)) * (mode === 'spark' ? 0.24 : 0.12))
        .lerp(white, mode === 'spark' ? 0.28 + random() * 0.24 : 0.1 + random() * 0.18)

      positions[index * 3] = point.x + Math.cos(angle) * scatter + pathNoise
      positions[index * 3 + 1] = point.y + Math.sin(angle * 1.37) * scatter * 0.58 + Math.cos(t * 16 + lane) * 0.008
      positions[index * 3 + 2] = point.z + Math.sin(angle) * scatter * 0.68 + (random() - 0.5) * 0.04

      colors[index * 3] = color.r
      colors[index * 3 + 1] = color.g
      colors[index * 3 + 2] = color.b
      life[index] = t
      phases[index] = lanePhase
      turbulence[index] =
        mode === 'route'
          ? 0.002 + random() * 0.006
          : mode === 'plasma'
            ? 0.006 + random() * 0.018
            : 0.014 + random() * 0.034
      alphas[index] =
        mode === 'route'
          ? 0.14 + random() * 0.14
          : mode === 'plasma'
            ? 0.26 + random() * 0.42
            : 0.18 + random() * 0.5
      sizes[index] =
        mode === 'route'
          ? (compact ? 0.016 : 0.02) + random() * 0.012
          : mode === 'plasma'
            ? (compact ? 0.026 : 0.034) + random() * 0.038
            : (compact ? 0.028 : 0.04) + random() * 0.052
    }
  }

  return { alphas, colors, life, phases, positions, samples, sizes, stride, turbulence }
}

function TrailPoints({
  cloud,
  geometryRef,
  material,
}: {
  cloud: TrailCloud
  geometryRef?: MutableRefObject<BufferGeometry | null>
  material: ShaderMaterial
}) {
  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[cloud.positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[cloud.colors, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[cloud.alphas, 1]} />
        <bufferAttribute attach="attributes-aLife" args={[cloud.life, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[cloud.phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[cloud.sizes, 1]} />
        <bufferAttribute attach="attributes-aTurbulence" args={[cloud.turbulence, 1]} />
      </bufferGeometry>
      <primitive attach="material" object={material} />
    </points>
  )
}

export function CosmicTrail({
  accentColor,
  chapterCount,
  compact,
  curve,
  progressRef,
  reducedMotion,
}: CosmicTrailProps) {
  const plasmaGeometryRef = useRef<BufferGeometry>(null)
  const sparkGeometryRef = useRef<BufferGeometry>(null)
  const wakeGeometryRef = useRef<BufferGeometry>(null)
  const samples = reducedMotion ? 170 : compact ? 230 : 340
  const routeCloud = useMemo(
    () =>
      createTrailCloud({
        accentColor,
        compact,
        curve,
        density: 1,
        mode: 'route',
        reducedMotion,
        samples,
        seed: 1801,
      }),
    [accentColor, compact, curve, reducedMotion, samples],
  )
  const plasmaCloud = useMemo(
    () =>
      createTrailCloud({
        accentColor,
        compact,
        curve,
        density: compact ? 2 : 3,
        mode: 'plasma',
        reducedMotion,
        samples,
        seed: 2718,
      }),
    [accentColor, compact, curve, reducedMotion, samples],
  )
  const sparkCloud = useMemo(
    () =>
      createTrailCloud({
        accentColor,
        compact,
        curve,
        density: compact ? 1 : 2,
        mode: 'spark',
        reducedMotion,
        samples,
        seed: 3203,
      }),
    [accentColor, compact, curve, reducedMotion, samples],
  )
  const wakeCloud = useMemo(
    () =>
      createTrailCloud({
        accentColor,
        compact,
        curve,
        density: compact ? 2 : 3,
        mode: 'spark',
        reducedMotion,
        samples,
        seed: 4242,
      }),
    [accentColor, compact, curve, reducedMotion, samples],
  )
  const routeMaterial = useMemo(() => createTrailMaterial(0.22), [])
  const plasmaMaterial = useMemo(() => createTrailMaterial(0.74), [])
  const sparkMaterial = useMemo(() => createTrailMaterial(0.54), [])
  const wakeMaterial = useMemo(() => createTrailMaterial(0.66), [])

  useEffect(() => {
    plasmaGeometryRef.current?.setDrawRange(0, 2)
    sparkGeometryRef.current?.setDrawRange(0, 2)
    wakeGeometryRef.current?.setDrawRange(0, 2)

    return () => {
      routeMaterial.dispose()
      plasmaMaterial.dispose()
      sparkMaterial.dispose()
      wakeMaterial.dispose()
    }
  }, [plasmaMaterial, routeMaterial, sparkMaterial, wakeMaterial])

  useFrame((state) => {
    const easedProgress = reducedMotion
      ? progressRef.current
      : easeVerticalStarProgress(progressRef.current, chapterCount)
    const visibleSamples = Math.max(2, Math.ceil(easedProgress * (samples - 1)) + 1)
    const plasmaVisible = visibleSamples * plasmaCloud.stride
    const sparkVisible = visibleSamples * sparkCloud.stride
    const wakeSpan = reducedMotion ? 16 : compact ? 28 : 42
    const wakeStartSample = Math.max(0, visibleSamples - wakeSpan)

    plasmaGeometryRef.current?.setDrawRange(0, plasmaVisible)
    sparkGeometryRef.current?.setDrawRange(0, sparkVisible)
    wakeGeometryRef.current?.setDrawRange(
      wakeStartSample * wakeCloud.stride,
      Math.max(2, (visibleSamples - wakeStartSample) * wakeCloud.stride),
    )

    const time = reducedMotion ? 0 : state.clock.elapsedTime

    for (const material of [routeMaterial, plasmaMaterial, sparkMaterial, wakeMaterial]) {
      material.uniforms.uTime.value = time
      material.uniforms.uArrival.value = 0
    }

    routeMaterial.uniforms.uOpacity.value = compact ? 0.15 : 0.2
    plasmaMaterial.uniforms.uOpacity.value = 0.5 + Math.sin(time * 0.72) * 0.045
    sparkMaterial.uniforms.uOpacity.value = 0.36 + Math.cos(time * 1.18) * 0.055
    wakeMaterial.uniforms.uOpacity.value = 0.58 + Math.sin(time * 1.7) * 0.08
  })

  return (
    <group>
      <TrailPoints cloud={routeCloud} material={routeMaterial} />
      <TrailPoints cloud={plasmaCloud} geometryRef={plasmaGeometryRef} material={plasmaMaterial} />
      <TrailPoints cloud={sparkCloud} geometryRef={sparkGeometryRef} material={sparkMaterial} />
      <TrailPoints cloud={wakeCloud} geometryRef={wakeGeometryRef} material={wakeMaterial} />
    </group>
  )
}
