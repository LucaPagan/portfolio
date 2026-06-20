import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import type { BufferGeometry, LineBasicMaterial, PointsMaterial } from 'three'
import type { MutableRefObject } from 'react'
import { easeVerticalStarProgress } from '../../data/verticalStarJourney'
import type { VerticalJourneyCurve } from './verticalJourneyCurve'

type VerticalStarTrailProps = {
  accentColor: string
  chapterCount: number
  curve: VerticalJourneyCurve
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

export function VerticalStarTrail({
  accentColor,
  chapterCount,
  curve,
  progressRef,
  reducedMotion,
}: VerticalStarTrailProps) {
  const trailCoreGeometryRef = useRef<BufferGeometry>(null)
  const trailGlowGeometryRef = useRef<BufferGeometry>(null)
  const trailHaloGeometryRef = useRef<BufferGeometry>(null)
  const trailPrismGeometryRef = useRef<BufferGeometry>(null)
  const wakeGeometryRef = useRef<BufferGeometry>(null)
  const trailCoreMaterialRef = useRef<LineBasicMaterial>(null)
  const trailGlowMaterialRef = useRef<LineBasicMaterial>(null)
  const trailHaloMaterialRef = useRef<LineBasicMaterial>(null)
  const sparkGeometryRef = useRef<BufferGeometry>(null)
  const routeDustGeometryRef = useRef<BufferGeometry>(null)
  const sparkMaterialRef = useRef<PointsMaterial>(null)
  const routeDustMaterialRef = useRef<PointsMaterial>(null)
  const wakeMaterialRef = useRef<PointsMaterial>(null)
  const sampleCount = reducedMotion ? 140 : 340
  const curvePoints = useMemo(() => curve.getPoints(sampleCount), [curve, sampleCount])
  const routePositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      values[index * 3] = point.x
      values[index * 3 + 1] = point.y
      values[index * 3 + 2] = point.z
    })

    return values
  }, [curvePoints])
  const haloPositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      const drift = index / Math.max(curvePoints.length - 1, 1)
      const breathingOffset = 0.018 + Math.sin(index * 0.43) * 0.012

      values[index * 3] = point.x + Math.sin(index * 0.81) * (0.038 + drift * 0.012)
      values[index * 3 + 1] = point.y + Math.cos(index * 0.67) * breathingOffset
      values[index * 3 + 2] = point.z - 0.035
    })

    return values
  }, [curvePoints])
  const prismPositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      const wave = Math.cos(index * 0.58) * 0.032

      values[index * 3] = point.x - wave
      values[index * 3 + 1] = point.y + Math.sin(index * 0.73) * 0.024
      values[index * 3 + 2] = point.z + 0.035
    })

    return values
  }, [curvePoints])
  const sparkPositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      const wave = Math.sin(index * 1.91) * 0.035
      const shimmer = Math.cos(index * 2.37) * 0.024

      values[index * 3] = point.x + wave
      values[index * 3 + 1] = point.y + shimmer
      values[index * 3 + 2] = point.z + 0.04 + Math.sin(index * 0.73) * 0.025
    })

    return values
  }, [curvePoints])
  const wakePositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      const drift = index / Math.max(curvePoints.length - 1, 1)
      const turbulence = 0.04 + Math.sin(drift * Math.PI * 8) * 0.018

      values[index * 3] = point.x + Math.sin(index * 3.41) * turbulence
      values[index * 3 + 1] = point.y + Math.cos(index * 2.63) * turbulence * 0.56
      values[index * 3 + 2] = point.z + Math.sin(index * 1.71) * 0.052
    })

    return values
  }, [curvePoints])
  const routeDustPositions = useMemo(() => {
    const values = new Float32Array(curvePoints.length * 3)

    curvePoints.forEach((point, index) => {
      const drift = index / Math.max(curvePoints.length - 1, 1)
      const wave = Math.sin(index * 2.41) * (0.026 + drift * 0.018)
      const shimmer = Math.cos(index * 3.17) * 0.018

      values[index * 3] = point.x + wave
      values[index * 3 + 1] = point.y + shimmer
      values[index * 3 + 2] = point.z - 0.015 + Math.sin(index * 1.03) * 0.02
    })

    return values
  }, [curvePoints])

  useEffect(() => {
    trailCoreGeometryRef.current?.setDrawRange(0, 2)
    trailGlowGeometryRef.current?.setDrawRange(0, 2)
    trailHaloGeometryRef.current?.setDrawRange(0, 2)
    trailPrismGeometryRef.current?.setDrawRange(0, 2)
    sparkGeometryRef.current?.setDrawRange(0, 2)
    routeDustGeometryRef.current?.setDrawRange(0, 2)
    wakeGeometryRef.current?.setDrawRange(0, 2)
  }, [])

  useFrame((state) => {
    if (!trailCoreGeometryRef.current || !trailGlowGeometryRef.current) {
      return
    }

    const easedProgress = reducedMotion
      ? progressRef.current
      : easeVerticalStarProgress(progressRef.current, chapterCount)
    const visibleCount = Math.max(2, Math.ceil(easedProgress * (curvePoints.length - 1)) + 1)

    trailCoreGeometryRef.current.setDrawRange(0, visibleCount)
    trailGlowGeometryRef.current.setDrawRange(0, visibleCount)
    trailHaloGeometryRef.current?.setDrawRange(0, visibleCount)
    trailPrismGeometryRef.current?.setDrawRange(0, visibleCount)
    sparkGeometryRef.current?.setDrawRange(0, visibleCount)
    routeDustGeometryRef.current?.setDrawRange(0, visibleCount)
    const wakeSpan = reducedMotion ? 12 : 34
    const wakeStart = Math.max(0, visibleCount - wakeSpan)
    wakeGeometryRef.current?.setDrawRange(wakeStart, visibleCount - wakeStart)

    if (trailCoreMaterialRef.current) {
      trailCoreMaterialRef.current.opacity = 0.78 + Math.sin(state.clock.elapsedTime * 0.78) * 0.04
    }

    if (trailGlowMaterialRef.current) {
      trailGlowMaterialRef.current.opacity = 0.24 + Math.cos(state.clock.elapsedTime * 0.64) * 0.04
    }

    if (trailHaloMaterialRef.current) {
      trailHaloMaterialRef.current.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.42) * 0.025
    }

    if (!reducedMotion && sparkMaterialRef.current) {
      sparkMaterialRef.current.opacity = 0.42 + Math.sin(state.clock.elapsedTime * 1.5) * 0.065
    }

    if (!reducedMotion && routeDustMaterialRef.current) {
      routeDustMaterialRef.current.opacity = 0.18 + Math.cos(state.clock.elapsedTime * 0.82) * 0.025
    }

    if (!reducedMotion && wakeMaterialRef.current) {
      wakeMaterialRef.current.opacity = 0.46 + Math.sin(state.clock.elapsedTime * 2.1) * 0.08
    }
  })

  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[routePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#f8fafc" transparent opacity={0.052} />
      </line>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[routeDustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.11}
          size={0.015}
          sizeAttenuation
          transparent
        />
      </points>

      <line>
        <bufferGeometry ref={trailHaloGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[haloPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={trailHaloMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.1}
          transparent
        />
      </line>

      <line>
        <bufferGeometry ref={trailPrismGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[prismPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.1}
          transparent
        />
      </line>

      <line>
        <bufferGeometry ref={trailCoreGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[routePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={trailCoreMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={0.82}
          transparent
        />
      </line>

      <line>
        <bufferGeometry ref={trailGlowGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[routePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={trailGlowMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={0.24}
          transparent
        />
      </line>

      <points>
        <bufferGeometry ref={routeDustGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[routeDustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={routeDustMaterialRef}
          blending={AdditiveBlending}
          color="#fffdf1"
          depthWrite={false}
          opacity={reducedMotion ? 0.12 : 0.18}
          size={reducedMotion ? 0.018 : 0.024}
          sizeAttenuation
          transparent
        />
      </points>

      <points>
        <bufferGeometry ref={wakeGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[wakePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={wakeMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={reducedMotion ? 0.24 : 0.46}
          size={reducedMotion ? 0.04 : 0.065}
          sizeAttenuation
          transparent
        />
      </points>

      <points>
        <bufferGeometry ref={sparkGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={sparkMaterialRef}
          blending={AdditiveBlending}
          color={accentColor}
          depthWrite={false}
          opacity={reducedMotion ? 0.22 : 0.36}
          size={reducedMotion ? 0.028 : 0.04}
          sizeAttenuation
          transparent
        />
      </points>
    </group>
  )
}
