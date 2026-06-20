import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import type { Group, LineBasicMaterial, MeshBasicMaterial, PointLight, PointsMaterial, Vector3 } from 'three'
import type { MutableRefObject } from 'react'
import type { VerticalStarChapter } from '../../data/verticalStarJourney'
import { getVerticalWaypointStrength, verticalStarAccentColors } from '../../data/verticalStarJourney'

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

function VerticalWaypointStar({
  chapter,
  chapterCount,
  index,
  position,
  progressRef,
  reducedMotion,
}: VerticalWaypointStarProps) {
  const groupRef = useRef<Group>(null)
  const coronaRef = useRef<Group>(null)
  const coreMaterialRef = useRef<MeshBasicMaterial>(null)
  const coreBloomMaterialRef = useRef<MeshBasicMaterial>(null)
  const glowMaterialRef = useRef<MeshBasicMaterial>(null)
  const outerGlowMaterialRef = useRef<MeshBasicMaterial>(null)
  const atmosphereMaterialRef = useRef<MeshBasicMaterial>(null)
  const ringMaterialRef = useRef<MeshBasicMaterial>(null)
  const outerRingMaterialRef = useRef<MeshBasicMaterial>(null)
  const flareMaterialRef = useRef<LineBasicMaterial>(null)
  const crossFlareMaterialRef = useRef<LineBasicMaterial>(null)
  const coronaMaterialRef = useRef<PointsMaterial>(null)
  const lightRef = useRef<PointLight>(null)
  const color = verticalStarAccentColors[chapter.accent]
  const starburst = useMemo(() => {
    const long = 0.46 + (index % 3) * 0.035
    const short = 0.18 + (index % 2) * 0.025

    return new Float32Array([
      -long, 0, 0.01, long, 0, 0.01,
      0, -short, 0.01, 0, short, 0.01,
      -short * 0.82, -short * 0.52, 0.01, short * 0.82, short * 0.52, 0.01,
      -short * 0.62, short * 0.72, 0.01, short * 0.62, -short * 0.72, 0.01,
    ])
  }, [index])
  const fineStarburst = useMemo(() => {
    const long = 0.28 + (index % 4) * 0.018
    const tilt = 0.1 + (index % 5) * 0.18

    return new Float32Array([
      -long, 0, 0.02, long, 0, 0.02,
      Math.cos(tilt) * -long * 0.62,
      Math.sin(tilt) * -long * 0.62,
      0.02,
      Math.cos(tilt) * long * 0.62,
      Math.sin(tilt) * long * 0.62,
      0.02,
    ])
  }, [index])
  const coronaParticles = useMemo(() => {
    const count = reducedMotion ? 14 : 30
    const values = new Float32Array(count * 3)

    for (let particleIndex = 0; particleIndex < count; particleIndex += 1) {
      const orbit = particleIndex * 2.399 + index * 0.58
      const radius = 0.13 + ((particleIndex * 17 + index * 5) % 19) * 0.007
      const verticalCompression = 0.52 + (particleIndex % 3) * 0.08

      values[particleIndex * 3] = Math.cos(orbit) * radius
      values[particleIndex * 3 + 1] = Math.sin(orbit) * radius * verticalCompression
      values[particleIndex * 3 + 2] = Math.sin(orbit * 1.7) * 0.035
    }

    return values
  }, [index, reducedMotion])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const scaledProgress = progressRef.current * Math.max(chapterCount - 1, 1)
    const completed = scaledProgress > index + 0.12
    const strength = getVerticalWaypointStrength(progressRef.current, index, chapterCount)
    const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 2.4 + index) * 0.055
    const scale = (0.78 + (completed ? 0.16 : 0) + strength * 0.58) * pulse

    groupRef.current.scale.setScalar(scale)

    if (!reducedMotion) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.34 + index * 0.7) * 0.055

      if (coronaRef.current) {
        coronaRef.current.rotation.z = state.clock.elapsedTime * (0.12 + index * 0.006)
        coronaRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22 + index) * 0.12
      }
    }

    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = 0.62 + strength * 0.38
      coreMaterialRef.current.color.set(strength > 0.42 ? '#fffdf1' : color)
    }

    if (coreBloomMaterialRef.current) {
      coreBloomMaterialRef.current.opacity = 0.14 + (completed ? 0.04 : 0) + strength * 0.36
    }

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = 0.14 + (completed ? 0.1 : 0) + strength * 0.36
    }

    if (outerGlowMaterialRef.current) {
      outerGlowMaterialRef.current.opacity = 0.04 + (completed ? 0.04 : 0) + strength * 0.18
    }

    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.opacity = 0.018 + (completed ? 0.018 : 0) + strength * 0.08
    }

    if (ringMaterialRef.current) {
      ringMaterialRef.current.opacity = 0.18 + (completed ? 0.14 : 0) + strength * 0.58
    }

    if (outerRingMaterialRef.current) {
      outerRingMaterialRef.current.opacity = 0.08 + (completed ? 0.08 : 0) + strength * 0.25
    }

    if (flareMaterialRef.current) {
      flareMaterialRef.current.opacity = 0.08 + (completed ? 0.05 : 0) + strength * 0.52
    }

    if (crossFlareMaterialRef.current) {
      crossFlareMaterialRef.current.opacity = 0.05 + (completed ? 0.04 : 0) + strength * 0.3
    }

    if (coronaMaterialRef.current) {
      coronaMaterialRef.current.opacity = 0.08 + (completed ? 0.06 : 0) + strength * 0.38
      coronaMaterialRef.current.size = 0.018 + strength * 0.016
    }

    if (lightRef.current) {
      lightRef.current.intensity = 0.08 + strength * 1.08
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.048, 24, 16]} />
        <meshBasicMaterial ref={coreMaterialRef} color={color} transparent opacity={0.72} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.082, 24, 16]} />
        <meshBasicMaterial
          ref={coreBloomMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.16}
          transparent
          toneMapped={false}
        />
      </mesh>
      <lineSegments rotation={[0, 0, Math.PI / 18]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starburst, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={flareMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.08}
          transparent
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments rotation={[0, 0, Math.PI / 2.8]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fineStarburst, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={crossFlareMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.05}
          transparent
          toneMapped={false}
        />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[0.18, 32, 18]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.1}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.31, 32, 18]} />
        <meshBasicMaterial
          ref={outerGlowMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.04}
          transparent
          toneMapped={false}
        />
      </mesh>
      <group ref={coronaRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[coronaParticles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={coronaMaterialRef}
            blending={AdditiveBlending}
            color="#fffdf1"
            depthWrite={false}
            opacity={0.08}
            size={0.018}
            sizeAttenuation
            transparent
          />
        </points>
      </group>
      <mesh>
        <sphereGeometry args={[0.48, 32, 18]} />
        <meshBasicMaterial
          ref={atmosphereMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.02}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.0035, 10, 64]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.16}
          transparent
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 8]}>
        <torusGeometry args={[0.28, 0.0025, 10, 72]} />
        <meshBasicMaterial
          ref={outerRingMaterialRef}
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={0.08}
          transparent
        />
      </mesh>
      <pointLight ref={lightRef} color={color} distance={2.35} intensity={0} />
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
