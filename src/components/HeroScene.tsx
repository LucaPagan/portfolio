import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group, Mesh, Points } from 'three'

type HeroSceneProps = {
  reducedMotion: boolean
}

function SignalCore({ reducedMotion }: HeroSceneProps) {
  const groupRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const outerRingRef = useRef<Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.06
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.06
    }

    if (reducedMotion) {
      return
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.025
      coreRef.current.rotation.x += delta * 0.15
      coreRef.current.rotation.y += delta * 0.22
      coreRef.current.scale.setScalar(pulse)
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.18
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.12
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.12
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerMove={(event) => {
        if (reducedMotion) {
          return
        }

        targetRotation.current = {
          x: event.pointer.y * 0.18,
          y: event.pointer.x * 0.2,
        }
      }}
      onPointerLeave={() => {
        targetRotation.current = { x: 0, y: 0 }
      }}
    >
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 3]} />
        <meshStandardMaterial
          color="#b7ff6a"
          emissive="#18ffd2"
          emissiveIntensity={0.3}
          metalness={0.54}
          roughness={0.24}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[1.12, 0.2, 0.3]}>
        <torusGeometry args={[1.82, 0.012, 10, 160]} />
        <meshBasicMaterial color="#ffb84d" transparent opacity={0.62} />
      </mesh>

      <mesh ref={outerRingRef} rotation={[1.3, 0.55, -0.4]}>
        <torusGeometry args={[2.22, 0.009, 10, 160]} />
        <meshBasicMaterial color="#33d6ff" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}

function CinematicBackdrop({ reducedMotion }: HeroSceneProps) {
  const groupRef = useRef<Group>(null)
  const satelliteRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (reducedMotion) {
      return
    }

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.16) * 0.08
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.12
    }

    if (satelliteRef.current) {
      satelliteRef.current.rotation.z += delta * 0.28
      satelliteRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.34) * 0.22
    }
  })

  return (
    <group ref={groupRef} position={[0.18, -0.04, -0.85]} rotation={[0.14, -0.26, -0.12]}>
      <mesh position={[0.1, -0.02, -0.65]}>
        <planeGeometry args={[5.8, 3.3, 18, 10]} />
        <meshBasicMaterial color="#33d6ff" wireframe transparent opacity={0.045} />
      </mesh>

      <mesh rotation={[1.35, 0.2, 0.16]}>
        <torusGeometry args={[2.9, 0.006, 8, 180]} />
        <meshBasicMaterial color="#b7ff6a" transparent opacity={0.2} />
      </mesh>

      <mesh rotation={[1.16, 0.72, -0.28]}>
        <torusGeometry args={[3.28, 0.004, 8, 180]} />
        <meshBasicMaterial color="#ff654f" transparent opacity={0.12} />
      </mesh>

      <group ref={satelliteRef} rotation={[1.22, 0.4, 0.12]}>
        {[0, 1, 2].map((item) => {
          const angle = item * 2.094
          return (
            <mesh
              key={item}
              position={[Math.cos(angle) * 2.35, Math.sin(angle) * 2.35, 0]}
              scale={item === 1 ? 0.78 : 1}
            >
              <octahedronGeometry args={[0.045, 0]} />
              <meshBasicMaterial color={item === 2 ? '#ffb84d' : '#f9f7e8'} transparent opacity={0.8} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function StarField({ reducedMotion }: HeroSceneProps) {
  const pointsRef = useRef<Points>(null)
  const positions = useMemo(() => {
    const count = reducedMotion ? 22 : 68
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 1.7 + (index % 13) * 0.16
      const angle = index * 2.399963229728653
      const depth = ((index % 9) - 4) * 0.18

      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.72
      values[index * 3 + 2] = depth
    }

    return values
  }, [reducedMotion])

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) {
      return
    }

    pointsRef.current.rotation.z += delta * 0.025
    pointsRef.current.rotation.y += delta * 0.018
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f9f7e8" size={0.026} transparent opacity={0.54} sizeAttenuation />
    </points>
  )
}

export function HeroScene({ reducedMotion }: HeroSceneProps) {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.25], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={1.5} color="#b7ff6a" />
        <pointLight position={[-3, -1.8, 2]} intensity={1.1} color="#33d6ff" />
        <CinematicBackdrop reducedMotion={reducedMotion} />
        <SignalCore reducedMotion={reducedMotion} />
        <StarField reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
