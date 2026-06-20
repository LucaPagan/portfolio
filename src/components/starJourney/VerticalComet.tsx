import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Quaternion, Vector3 } from 'three'
import type { Group, LineBasicMaterial, MeshBasicMaterial, PointsMaterial } from 'three'
import type { MutableRefObject } from 'react'
import { easeVerticalStarProgress, getVerticalWaypointStrength } from '../../data/verticalStarJourney'
import type { VerticalJourneyCurve } from './verticalJourneyCurve'

type VerticalCometProps = {
  accentColor: string
  chapterCount: number
  curve: VerticalJourneyCurve
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

export function VerticalComet({
  accentColor,
  chapterCount,
  curve,
  progressRef,
  reducedMotion,
}: VerticalCometProps) {
  const groupRef = useRef<Group>(null)
  const glowMaterialRef = useRef<MeshBasicMaterial>(null)
  const outerGlowMaterialRef = useRef<MeshBasicMaterial>(null)
  const tailMaterialRef = useRef<MeshBasicMaterial>(null)
  const tailBloomMaterialRef = useRef<MeshBasicMaterial>(null)
  const particleMaterialRef = useRef<PointsMaterial>(null)
  const mistParticleMaterialRef = useRef<PointsMaterial>(null)
  const comaMaterialRef = useRef<PointsMaterial>(null)
  const flareMaterialRef = useRef<LineBasicMaterial>(null)
  const secondaryFlareMaterialRef = useRef<LineBasicMaterial>(null)
  const targetPosition = useMemo(() => new Vector3(), [])
  const tangent = useMemo(() => new Vector3(0, -1, 0), [])
  const baseAxis = useMemo(() => new Vector3(0, -1, 0), [])
  const targetQuaternion = useMemo(() => new Quaternion(), [])
  const tailParticles = useMemo(() => {
    const count = reducedMotion ? 16 : 58
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const drift = index / Math.max(count - 1, 1)
      const wave = Math.sin(index * 1.77) * (0.018 + drift * 0.064)

      values[index * 3] = wave
      values[index * 3 + 1] = 0.08 + drift * 1.4
      values[index * 3 + 2] = Math.cos(index * 2.09) * (0.02 + drift * 0.058)
    }

    return values
  }, [reducedMotion])
  const mistParticles = useMemo(() => {
    const count = reducedMotion ? 18 : 54
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const drift = index / Math.max(count - 1, 1)
      const spiral = index * 1.42
      const radius = 0.04 + drift * 0.22

      values[index * 3] = Math.cos(spiral) * radius * 0.52
      values[index * 3 + 1] = 0.16 + drift * 1.08
      values[index * 3 + 2] = Math.sin(spiral) * radius * 0.42
    }

    return values
  }, [reducedMotion])
  const comaParticles = useMemo(() => {
    const count = reducedMotion ? 10 : 28
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399
      const radius = 0.045 + (index % 7) * 0.009

      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(angle * 0.73) * radius * 0.62
      values[index * 3 + 2] = Math.sin(angle) * radius * 0.42
    }

    return values
  }, [reducedMotion])
  const headFlare = useMemo(
    () =>
      new Float32Array([
        -0.42, 0, 0.012, 0.42, 0, 0.012,
        0, -0.24, 0.012, 0, 0.24, 0.012,
        -0.2, -0.1, 0.012, 0.2, 0.1, 0.012,
        -0.15, 0.13, 0.012, 0.15, -0.13, 0.012,
      ]),
    [],
  )
  const tailShells = useMemo(
    () => [
      { opacity: 0.13, position: 0.26, scale: [0.12, 0.32, 0.12] as const },
      { opacity: 0.09, position: 0.52, scale: [0.16, 0.48, 0.14] as const },
      { opacity: 0.055, position: 0.84, scale: [0.2, 0.62, 0.16] as const },
    ],
    [],
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

    groupRef.current.position.lerp(targetPosition, reducedMotion ? 0.45 : 0.2)
    groupRef.current.quaternion.slerp(targetQuaternion, reducedMotion ? 0.35 : 0.18)

    const pulse = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 4.4) * 0.025
    groupRef.current.scale.setScalar(0.92 + arrivalStrength * 0.18 + pulse)

    if (glowMaterialRef.current) {
      glowMaterialRef.current.opacity = 0.3 + arrivalStrength * 0.16
    }

    if (outerGlowMaterialRef.current) {
      outerGlowMaterialRef.current.opacity = 0.08 + arrivalStrength * 0.1
    }

    if (tailMaterialRef.current) {
      tailMaterialRef.current.opacity = 0.16 + arrivalStrength * 0.16
    }

    if (tailBloomMaterialRef.current) {
      tailBloomMaterialRef.current.opacity = 0.07 + arrivalStrength * 0.12
    }

    if (particleMaterialRef.current) {
      particleMaterialRef.current.opacity = 0.5 + arrivalStrength * 0.24
    }

    if (mistParticleMaterialRef.current) {
      mistParticleMaterialRef.current.opacity = 0.16 + arrivalStrength * 0.2
    }

    if (comaMaterialRef.current) {
      comaMaterialRef.current.opacity = 0.34 + arrivalStrength * 0.28
    }

    if (flareMaterialRef.current) {
      flareMaterialRef.current.opacity = 0.12 + arrivalStrength * 0.32
    }

    if (secondaryFlareMaterialRef.current) {
      secondaryFlareMaterialRef.current.opacity = 0.08 + arrivalStrength * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <lineSegments rotation={[0, 0, Math.PI / 16]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[headFlare, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={flareMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.12}
          transparent
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments rotation={[0, 0, Math.PI / 2.7]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[headFlare, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={secondaryFlareMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.08}
          transparent
          toneMapped={false}
        />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[0.052, 28, 18]} />
        <meshBasicMaterial color="#fffdf1" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 32, 18]} />
        <meshBasicMaterial
          ref={glowMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.32}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 18]} />
        <meshBasicMaterial
          ref={outerGlowMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.1}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.48, 0]} scale={[0.18, 0.78, 0.18]}>
        <sphereGeometry args={[1, 32, 18]} />
        <meshBasicMaterial
          ref={tailMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.18}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.82, 0]} scale={[0.28, 1.08, 0.2]}>
        <sphereGeometry args={[1, 32, 18]} />
        <meshBasicMaterial
          ref={tailBloomMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.08}
          transparent
          toneMapped={false}
        />
      </mesh>
      {tailShells.map((shell) => (
        <mesh key={shell.position} position={[0, shell.position, 0]} scale={shell.scale}>
          <sphereGeometry args={[1, 24, 14]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={accentColor}
            depthWrite={false}
            opacity={shell.opacity}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[comaParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={comaMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.34}
          size={0.026}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tailParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={particleMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.52}
          size={0.039}
          sizeAttenuation
          transparent
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[mistParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={mistParticleMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.16}
          size={0.022}
          sizeAttenuation
          transparent
        />
      </points>
      <pointLight color={accentColor} distance={1.9} intensity={0.9} />
    </group>
  )
}
