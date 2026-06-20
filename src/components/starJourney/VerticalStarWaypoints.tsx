import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'
import type { Group, PointLight, Vector3 } from 'three'
import type { MutableRefObject } from 'react'
import type { VerticalStarChapter } from '../../data/verticalStarJourney'
import { getVerticalWaypointStrength, verticalStarAccentColors } from '../../data/verticalStarJourney'
import { cosmicParticleFragmentShader, cosmicParticleVertexShader } from './particleShaders'

type VerticalStarWaypointsProps = {
  chapterCount: number
  chapters: VerticalStarChapter[]
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
  waypointPoints: Vector3[]
}

type VerticalWaypointStarProps = {
  chapter: VerticalStarChapter
  chapterCount: number
  index: number
  position: Vector3
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

type WaypointParticleCloud = {
  alphas: Float32Array
  colors: Float32Array
  life: Float32Array
  phases: Float32Array
  positions: Float32Array
  sizes: Float32Array
  turbulence: Float32Array
}

function createSeededRandom(seed: number) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296

    return value / 4294967296
  }
}

function createWaypointMaterial() {
  const material = new ShaderMaterial({
    blending: AdditiveBlending,
    depthWrite: false,
    fragmentShader: cosmicParticleFragmentShader,
    transparent: true,
    uniforms: {
      uArrival: { value: 0 },
      uOpacity: { value: 0.65 },
      uTime: { value: 0 },
    },
    vertexShader: cosmicParticleVertexShader,
  })

  material.toneMapped = false

  return material
}

function createWaypointCloud({
  accentColor,
  index,
  reducedMotion,
}: {
  accentColor: string
  index: number
  reducedMotion: boolean
}): WaypointParticleCloud {
  const random = createSeededRandom(7100 + index * 97)
  const count = reducedMotion ? 48 : 96
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const alphas = new Float32Array(count)
  const life = new Float32Array(count)
  const phases = new Float32Array(count)
  const sizes = new Float32Array(count)
  const turbulence = new Float32Array(count)
  const accent = new Color(accentColor)
  const white = new Color('#fffdf1')
  const warm = new Color('#ffe8a3')

  for (let particleIndex = 0; particleIndex < count; particleIndex += 1) {
    const normalized = particleIndex / Math.max(count - 1, 1)
    const coreParticle = particleIndex < count * 0.26
    const rayParticle = !coreParticle && particleIndex % 5 === 0
    const orbit = random() * Math.PI * 2
    const radius = coreParticle
      ? Math.pow(random(), 1.9) * 0.07
      : rayParticle
        ? 0.12 + random() * (0.26 + (index % 3) * 0.025)
        : 0.075 + Math.pow(random(), 1.5) * 0.16
    const rayStretch = rayParticle ? 1.35 + random() * 0.78 : 1
    const verticalCompression = rayParticle ? 0.38 + random() * 0.28 : 0.72
    const color = accent
      .clone()
      .lerp(white, coreParticle ? 0.64 + random() * 0.22 : 0.2 + random() * 0.2)
      .lerp(warm, coreParticle ? random() * 0.18 : random() * 0.08)

    positions[particleIndex * 3] = Math.cos(orbit) * radius * rayStretch
    positions[particleIndex * 3 + 1] = Math.sin(orbit) * radius * verticalCompression
    positions[particleIndex * 3 + 2] = Math.sin(orbit * 1.7 + normalized * 3.1) * (coreParticle ? 0.018 : 0.045)
    colors[particleIndex * 3] = color.r
    colors[particleIndex * 3 + 1] = color.g
    colors[particleIndex * 3 + 2] = color.b
    alphas[particleIndex] = coreParticle ? 0.58 + random() * 0.36 : 0.16 + random() * 0.42
    life[particleIndex] = radius / 0.36
    phases[particleIndex] = random() * Math.PI * 2
    sizes[particleIndex] = coreParticle
      ? 0.08 + random() * 0.16
      : rayParticle
        ? 0.018 + random() * 0.038
        : 0.025 + random() * 0.058
    turbulence[particleIndex] = coreParticle ? 0.002 + random() * 0.006 : 0.006 + random() * 0.018
  }

  return { alphas, colors, life, phases, positions, sizes, turbulence }
}

function VerticalWaypointStar({
  chapter,
  chapterCount,
  index,
  position,
  progressRef,
  reducedMotion,
}: VerticalWaypointStarProps) {
  const groupRef = useRef<Group>(null)
  const particleGroupRef = useRef<Group>(null)
  const lightRef = useRef<PointLight>(null)
  const color = verticalStarAccentColors[chapter.accent]
  const cloud = useMemo(
    () => createWaypointCloud({ accentColor: color, index, reducedMotion }),
    [color, index, reducedMotion],
  )
  const material = useMemo(() => createWaypointMaterial(), [])

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const scaledProgress = progressRef.current * Math.max(chapterCount - 1, 1)
    const completed = scaledProgress > index + 0.12
    const strength = getVerticalWaypointStrength(progressRef.current, index, chapterCount)
    const pulse = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 2.1 + index * 0.8) * 0.055
    const scale = 0.82 + (completed ? 0.11 : 0) + strength * 0.58 + pulse

    groupRef.current.scale.setScalar(scale)

    if (particleGroupRef.current && !reducedMotion) {
      particleGroupRef.current.rotation.z = state.clock.elapsedTime * (0.08 + index * 0.004)
      particleGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.26 + index) * 0.16
    }

    material.uniforms.uArrival.value = strength
    material.uniforms.uOpacity.value = 0.46 + (completed ? 0.16 : 0) + strength * 0.64
    material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime

    if (lightRef.current) {
      lightRef.current.intensity = 0.08 + strength * 0.95
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <group ref={particleGroupRef}>
        <points>
          <bufferGeometry>
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
      </group>
      <pointLight ref={lightRef} color={color} distance={2.15} intensity={0} />
    </group>
  )
}

export function VerticalStarWaypoints({
  chapterCount,
  chapters,
  progressRef,
  reducedMotion,
  waypointPoints,
}: VerticalStarWaypointsProps) {
  return (
    <group>
      {chapters.map((chapter, index) => (
        <VerticalWaypointStar
          chapter={chapter}
          chapterCount={chapterCount}
          index={index}
          key={chapter.id}
          position={waypointPoints[index]}
          progressRef={progressRef}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}
