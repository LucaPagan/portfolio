import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, Quaternion, ShaderMaterial, Vector3 } from 'three'
import type { MutableRefObject } from 'react'
import type { Group, Points } from 'three'
import { easeVerticalStarProgress, getVerticalWaypointStrength } from '../../data/verticalStarJourney'
import { cosmicParticleFragmentShader, cosmicParticleVertexShader } from './particleShaders'
import type { VerticalJourneyCurve } from './verticalJourneyCurve'

type ParticleCometProps = {
  accentColor: string
  chapterCount: number
  compact: boolean
  curve: VerticalJourneyCurve
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

type ParticleCloud = {
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

function createParticleMaterial(opacity = 1) {
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

function writeParticle({
  alpha,
  color,
  cloud,
  index,
  life,
  phase,
  position,
  size,
  turbulence,
}: {
  alpha: number
  cloud: ParticleCloud
  color: Color
  index: number
  life: number
  phase: number
  position: [number, number, number]
  size: number
  turbulence: number
}) {
  cloud.positions[index * 3] = position[0]
  cloud.positions[index * 3 + 1] = position[1]
  cloud.positions[index * 3 + 2] = position[2]
  cloud.colors[index * 3] = color.r
  cloud.colors[index * 3 + 1] = color.g
  cloud.colors[index * 3 + 2] = color.b
  cloud.alphas[index] = alpha
  cloud.life[index] = life
  cloud.phases[index] = phase
  cloud.sizes[index] = size
  cloud.turbulence[index] = turbulence
}

function createParticleCloud(count: number): ParticleCloud {
  return {
    alphas: new Float32Array(count),
    colors: new Float32Array(count * 3),
    life: new Float32Array(count),
    phases: new Float32Array(count),
    positions: new Float32Array(count * 3),
    sizes: new Float32Array(count),
    turbulence: new Float32Array(count),
  }
}

function createCometCore(compact: boolean, accentColor: string, reducedMotion: boolean) {
  const random = createSeededRandom(4419)
  const count = reducedMotion ? 34 : compact ? 58 : 96
  const cloud = createParticleCloud(count)
  const accent = new Color(accentColor)
  const warm = new Color('#fff2bd')
  const white = new Color('#fffdf1')

  for (let index = 0; index < count; index += 1) {
    const orbit = random() * Math.PI * 2
    const radius = Math.pow(random(), 1.85) * (compact ? 0.145 : 0.18)
    const life = radius / (compact ? 0.145 : 0.18)
    const color = white.clone().lerp(warm, random() * 0.44).lerp(accent, Math.pow(life, 1.6) * 0.34)

    writeParticle({
      alpha: 0.4 + random() * 0.54,
      cloud,
      color,
      index,
      life,
      phase: random() * Math.PI * 2,
      position: [
        Math.cos(orbit) * radius,
        Math.sin(orbit * 1.21) * radius * 0.62,
        Math.sin(orbit) * radius * 0.48,
      ],
      size: 0.055 + Math.pow(1 - life, 1.8) * (compact ? 0.34 : 0.46) + random() * 0.045,
      turbulence: 0.002 + random() * 0.009,
    })
  }

  return cloud
}

function createCometTail(compact: boolean, accentColor: string, reducedMotion: boolean) {
  const random = createSeededRandom(9058)
  const count = reducedMotion ? 70 : compact ? 150 : 280
  const cloud = createParticleCloud(count)
  const accent = new Color(accentColor)
  const cyan = new Color('#91f4ff')
  const ember = new Color('#ffd166')
  const white = new Color('#fffdf1')
  const tailLength = compact ? 1.58 : 2.05

  for (let index = 0; index < count; index += 1) {
    const life = Math.pow(index / Math.max(count - 1, 1), 0.72)
    const spiral = index * 2.399 + random() * 0.8
    const width = 0.018 + life * life * (compact ? 0.24 : 0.34)
    const turbulence = 0.004 + random() * (compact ? 0.018 : 0.028) + life * 0.012
    const colorMix = random()
    const color = accent
      .clone()
      .lerp(cyan, colorMix * 0.24)
      .lerp(ember, Math.max(0, 0.42 - life) * 0.22)
      .lerp(white, (1 - life) * 0.2)

    writeParticle({
      alpha: (0.58 + random() * 0.34) * Math.pow(1 - life, 1.16),
      cloud,
      color,
      index,
      life,
      phase: random() * Math.PI * 2,
      position: [
        Math.cos(spiral) * width * (0.42 + random() * 0.78),
        0.045 + life * tailLength + (random() - 0.5) * 0.09,
        Math.sin(spiral) * width * (0.28 + random() * 0.58),
      ],
      size: (compact ? 0.035 : 0.042) + Math.pow(1 - life, 1.3) * 0.076 + random() * 0.035,
      turbulence,
    })
  }

  return cloud
}

function createCometFragments(compact: boolean, accentColor: string, reducedMotion: boolean) {
  const random = createSeededRandom(1221)
  const count = reducedMotion ? 16 : compact ? 32 : 56
  const cloud = createParticleCloud(count)
  const accent = new Color(accentColor)
  const white = new Color('#fffdf1')
  const amber = new Color('#ffdf8a')

  for (let index = 0; index < count; index += 1) {
    const life = random()
    const angle = random() * Math.PI * 2
    const radius = 0.05 + life * (compact ? 0.36 : 0.5)
    const color = accent.clone().lerp(white, 0.36 + random() * 0.42).lerp(amber, random() * 0.18)

    writeParticle({
      alpha: (0.18 + random() * 0.38) * Math.pow(1 - life * 0.72, 1.4),
      cloud,
      color,
      index,
      life,
      phase: random() * Math.PI * 2,
      position: [
        Math.cos(angle) * radius * 0.28,
        0.04 + life * (compact ? 1.2 : 1.58) + random() * 0.22,
        Math.sin(angle) * radius * 0.24,
      ],
      size: 0.026 + random() * 0.038,
      turbulence: 0.018 + random() * 0.036,
    })
  }

  return cloud
}

function ParticleCloudPoints({
  cloud,
  material,
}: {
  cloud: ParticleCloud
  material: ShaderMaterial
}) {
  return (
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
  )
}

export function ParticleComet({
  accentColor,
  chapterCount,
  compact,
  curve,
  progressRef,
  reducedMotion,
}: ParticleCometProps) {
  const groupRef = useRef<Group>(null)
  const corePointsRef = useRef<Points>(null)
  const targetPosition = useMemo(() => new Vector3(), [])
  const tangent = useMemo(() => new Vector3(0, -1, 0), [])
  const baseAxis = useMemo(() => new Vector3(0, -1, 0), [])
  const targetQuaternion = useMemo(() => new Quaternion(), [])
  const coreCloud = useMemo(
    () => createCometCore(compact, accentColor, reducedMotion),
    [accentColor, compact, reducedMotion],
  )
  const tailCloud = useMemo(
    () => createCometTail(compact, accentColor, reducedMotion),
    [accentColor, compact, reducedMotion],
  )
  const fragmentCloud = useMemo(
    () => createCometFragments(compact, accentColor, reducedMotion),
    [accentColor, compact, reducedMotion],
  )
  const coreMaterial = useMemo(() => createParticleMaterial(1), [])
  const tailMaterial = useMemo(() => createParticleMaterial(0.78), [])
  const fragmentMaterial = useMemo(() => createParticleMaterial(0.66), [])

  useEffect(
    () => () => {
      coreMaterial.dispose()
      tailMaterial.dispose()
      fragmentMaterial.dispose()
    },
    [coreMaterial, fragmentMaterial, tailMaterial],
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const rawProgress = progressRef.current
    const easedProgress = reducedMotion
      ? rawProgress
      : easeVerticalStarProgress(rawProgress, chapterCount)
    const nearestWaypoint = Math.round(rawProgress * Math.max(chapterCount - 1, 0))
    const arrivalStrength = getVerticalWaypointStrength(rawProgress, nearestWaypoint, chapterCount)

    curve.getPoint(easedProgress, targetPosition)
    curve.getTangent(easedProgress, tangent).normalize()
    targetQuaternion.setFromUnitVectors(baseAxis, tangent)

    groupRef.current.position.lerp(targetPosition, reducedMotion ? 0.5 : 0.22)
    groupRef.current.quaternion.slerp(targetQuaternion, reducedMotion ? 0.42 : 0.2)

    const breathing = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 3.2) * 0.018
    groupRef.current.scale.setScalar(0.94 + arrivalStrength * 0.14 + breathing)

    if (corePointsRef.current && !reducedMotion) {
      corePointsRef.current.rotation.y = state.clock.elapsedTime * 0.18
      corePointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.44) * 0.18
    }

    for (const material of [coreMaterial, tailMaterial, fragmentMaterial]) {
      material.uniforms.uArrival.value = arrivalStrength
      material.uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime
    }

    coreMaterial.uniforms.uOpacity.value = 0.9 + arrivalStrength * 0.38
    tailMaterial.uniforms.uOpacity.value = 0.58 + arrivalStrength * 0.2
    fragmentMaterial.uniforms.uOpacity.value = 0.42 + arrivalStrength * 0.22
  })

  return (
    <group ref={groupRef}>
      <group ref={corePointsRef}>
        <ParticleCloudPoints cloud={coreCloud} material={coreMaterial} />
      </group>
      <ParticleCloudPoints cloud={tailCloud} material={tailMaterial} />
      <ParticleCloudPoints cloud={fragmentCloud} material={fragmentMaterial} />
      <pointLight color={accentColor} distance={compact ? 1.55 : 2.1} intensity={compact ? 0.72 : 0.96} />
    </group>
  )
}
