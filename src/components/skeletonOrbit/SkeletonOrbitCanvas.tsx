import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three'
import type { MutableRefObject } from 'react'
import { OrbitCameraRig } from './OrbitCameraRig'
import { ProceduralSkeleton } from './ProceduralSkeleton'

function createDustGeometry() {
  const particleCount = 400
  const geo = new BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  return geo
}

function AmbientDust({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<Points>(null)

  const geometry = useMemo(() => createDustGeometry(), [])

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: '#67e8f9',
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  useFrame((state) => {
    if (!pointsRef.current || reducedMotion) return
    const time = state.clock.elapsedTime
    pointsRef.current.rotation.y = time * 0.02
    pointsRef.current.position.y = Math.sin(time * 0.1) * 0.2
  })

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}

type SkeletonOrbitCanvasProps = {
  activeIndex: number
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

export function SkeletonOrbitCanvas({ progressRef, reducedMotion }: SkeletonOrbitCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 100 }}
    >
      <color attach="background" args={['#02040a']} />
      
      <ambientLight intensity={0.5} />
      {/* Rim lights to highlight the skeleton silhouette */}
      <directionalLight position={[5, 5, -5]} intensity={2} color="#67e8f9" />
      <directionalLight position={[-5, 3, -5]} intensity={1.5} color="#b27fff" />
      <directionalLight position={[0, -5, 5]} intensity={1} color="#ffb84d" />

      <ProceduralSkeleton />
      <AmbientDust reducedMotion={reducedMotion} />
      
      <OrbitCameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
