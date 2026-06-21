import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { MutableRefObject } from 'react'

type OrbitCameraRigProps = {
  progressRef: MutableRefObject<number>
  reducedMotion: boolean
}

export function OrbitCameraRig({ progressRef, reducedMotion }: OrbitCameraRigProps) {
  const { camera, size } = useThree()
  const targetPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3(0, 0.7, 0))
  const currentLookAt = useRef(new Vector3(0, 0.7, 0))
  const isMobile = size.width < 860

  useEffect(() => {
    // Initial camera setup
    camera.position.set(0, 0.5, isMobile ? 8 : 6)
    camera.lookAt(currentLookAt.current)
  }, [camera, isMobile])

  useFrame(() => {
    const progress = progressRef.current

    // Calculate orbit angle (0 to ~2.2 PI)
    // 2.2 PI gives a bit more than a full rotation over the whole scroll
    const maxAngle = Math.PI * 2.2
    const angle = reducedMotion ? 0 : progress * maxAngle

    // Radius changes slightly to feel dynamic
    const baseRadius = isMobile ? 7.5 : 5.8
    const radiusVariation = Math.sin(progress * Math.PI) * 1.5
    const radius = baseRadius + (reducedMotion ? 0 : radiusVariation)

    // Calculate Y position (helix-like motion)
    // Starts front, goes up slightly, then down, then back to center
    const yOffset = Math.sin(progress * Math.PI * 2) * 1.2 + 0.5

    targetPosition.current.set(
      Math.sin(angle) * radius,
      reducedMotion ? 0.5 : yOffset,
      Math.cos(angle) * radius,
    )

    // Look slightly up or down depending on height
    targetLookAt.current.set(0, 0.7 - yOffset * 0.1, 0)

    // Smoothly interpolate camera position and lookAt target
    // We use a high lerp factor for responsiveness but still smooth
    camera.position.lerp(targetPosition.current, 0.08)
    currentLookAt.current.lerp(targetLookAt.current, 0.08)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
