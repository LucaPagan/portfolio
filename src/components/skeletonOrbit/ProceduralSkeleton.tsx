import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MeshStandardMaterial } from 'three'

export function ProceduralSkeleton() {
  const groupRef = useRef<Group>(null)

  // A premium dark metallic material for the skeleton
  const boneMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#080c16',
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1.5,
      }),
    [],
  )

  const jointMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#67e8f9',
        roughness: 0.1,
        metalness: 0.9,
        emissive: '#102a3a',
        emissiveIntensity: 0.5,
      }),
    [],
  )

  useFrame((state) => {
    if (!groupRef.current) return
    // Very subtle idle breathing/floating motion
    const time = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05
  })

  // Procedural geometry construction
  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Spine */}
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={`spine-${i}`} position={[0, i * 0.25, 0]}>
          <mesh material={boneMaterial}>
            <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          </mesh>
          <mesh material={jointMaterial} position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
        </group>
      ))}

      {/* Ribcage */}
      <group position={[0, 0.8, 0.05]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <group key={`rib-l-${i}`} position={[-0.1, i * 0.15, 0]} rotation={[0.2, 0, 0.8 - i * 0.1]}>
            <mesh material={boneMaterial} position={[-0.2, 0, 0.1]}>
              <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
            </mesh>
          </group>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <group key={`rib-r-${i}`} position={[0.1, i * 0.15, 0]} rotation={[0.2, 0, -0.8 + i * 0.1]}>
            <mesh material={boneMaterial} position={[0.2, 0, 0.1]}>
              <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
            </mesh>
          </group>
        ))}
        {/* Sternum */}
        <mesh material={boneMaterial} position={[0, 0.3, 0.3]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.02]} />
        </mesh>
      </group>

      {/* Skull minimal/cyber */}
      <group position={[0, 1.85, 0]}>
        <mesh material={boneMaterial}>
          <sphereGeometry args={[0.18, 32, 32]} />
        </mesh>
        <mesh material={jointMaterial} position={[0, -0.15, 0.1]}>
          <boxGeometry args={[0.12, 0.1, 0.15]} />
        </mesh>
      </group>

      {/* Shoulders & Arms */}
      <group position={[0, 1.5, 0]}>
        {/* Left Arm */}
        <group position={[-0.35, 0, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh material={boneMaterial} position={[-0.1, -0.35, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.03, 0.02, 0.7, 8]} />
          </mesh>
          {/* Elbow */}
          <mesh material={jointMaterial} position={[-0.2, -0.7, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
          </mesh>
          {/* Lower Arm */}
          <mesh material={boneMaterial} position={[-0.15, -1.05, 0.1]} rotation={[0.2, 0, 0.1]}>
            <cylinderGeometry args={[0.02, 0.015, 0.6, 8]} />
          </mesh>
        </group>
        {/* Right Arm */}
        <group position={[0.35, 0, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          {/* Upper Arm */}
          <mesh material={boneMaterial} position={[0.1, -0.35, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.03, 0.02, 0.7, 8]} />
          </mesh>
          {/* Elbow */}
          <mesh material={jointMaterial} position={[0.2, -0.7, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
          </mesh>
          {/* Lower Arm */}
          <mesh material={boneMaterial} position={[0.15, -1.05, 0.1]} rotation={[0.2, 0, -0.1]}>
            <cylinderGeometry args={[0.02, 0.015, 0.6, 8]} />
          </mesh>
        </group>
      </group>

      {/* Pelvis */}
      <group position={[0, -0.1, 0]}>
        <mesh material={boneMaterial} scale={[1, 0.6, 0.5]}>
          <sphereGeometry args={[0.25, 32, 16]} />
        </mesh>
        {/* Left Leg */}
        <group position={[-0.2, -0.1, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0, -0.45, 0]} rotation={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.04, 0.03, 0.9, 8]} />
          </mesh>
          <mesh material={jointMaterial} position={[-0.05, -0.9, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[-0.05, -1.35, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 0.8, 8]} />
          </mesh>
        </group>
        {/* Right Leg */}
        <group position={[0.2, -0.1, 0]}>
          <mesh material={jointMaterial}>
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0, -0.45, 0]} rotation={[0, 0, 0.05]}>
            <cylinderGeometry args={[0.04, 0.03, 0.9, 8]} />
          </mesh>
          <mesh material={jointMaterial} position={[0.05, -0.9, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
          <mesh material={boneMaterial} position={[0.05, -1.35, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 0.8, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
